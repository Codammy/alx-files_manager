import { ObjectId } from 'mongodb';
import fs from 'fs';
import { v4 as uuid4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// eslint-disable-next-line consistent-return
export default async function postUpload(req, res) {
  const token = req.headers['x-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const id = await redisClient.get(`auth_${token}`);
  if (!id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await dbClient.findOne('users', { _id: ObjectId(id) });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const {
    name,
    type,
    isPublic,
    parentId,
    data,
  } = { ...req.body };

  const acceptedTypes = ['folder', 'file', 'image'];
  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!type || !acceptedTypes.includes(type)) return res.status(400).json({ error: 'Missing type' });
  if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
  if (parentId) {
    const file = await dbClient.findOne('files', { name, parentId });
    if (!file) return res.status(400).json({ error: 'Parent not found' });
    if (file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
  }
  if (type === 'folder') {
    const savedFile = await dbClient.create('files', {
      name,
      type,
      parentId: parentId || 0,
      isPublic: isPublic || false,
      data,
      userId: user._id,
    });
    return res.status(201).json({
      id: savedFile.insertedId,
      name,
      type,
      parentId: savedFile.ops[0].parentId,
      isPublic: savedFile.ops[0].isPublic,
      userId: user._id,
    });
  }
  const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
  if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH, { recursive: true });
  }
  fs.writeFile(`${FOLDER_PATH}/${uuid4()}`, Buffer.from(data, 'base64'), async (err) => {
    if (!err) {
      const file = await dbClient.create('files', {
        userId: user._id,
        name,
        type,
        isPublic: isPublic || false,
        parentId: parentId || 0,
        localPath: `${FOLDER_PATH}/${uuid4()} `,
      });
      return res.status(201).json({
        id: file.insertedId,
        userId: user._id,
        name,
        type,
        isPublic: file.ops[0].isPublic,
        parentId: file.ops[0].parentId,
        localPath: `${FOLDER_PATH}/${uuid4()} `,
      });
    }
    throw new Error(err.message);
  });
}

export async function getShow(req, res) {
  console.log(req.params.id);
  const token = req.headers['x-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const id = await redisClient.get(`auth_${token}`);
  if (!id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await dbClient.findOne('users', { _id: ObjectId(id) });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const file = await dbClient.findOne('files', { userId: user._id, _id: req.params.id });
  if (!file) return res.status(404).json({ error: 'Not found' });
  return res.json(file);
}

export async function getIndex(req, res) {
  const { parentId, page } = { ...req.query };
  const pageSize = 20;
  const token = req.headers['x-token'];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const id = await redisClient.get(`auth_${token}`);
  if (!id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await dbClient.findOne('users', { _id: ObjectId(id) });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const file = await dbClient.find('files', { query: { type: 'file', parentId: parentId || 0 }, paginate: { $limit: pageSize, $skip: ((parseInt(page, 10) || 1) - 1) * pageSize } });
  console.log(file);
  return res.json(file);
}
