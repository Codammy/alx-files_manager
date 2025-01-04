import crypto from 'crypto';
import { v4 as uuid4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export async function getConnect(req, res) {
  const { authorization } = { ...req.headers };
  if (!authorization) return res.status(401).json({ error: 'Unauthorized' });

  const [authType, encodedCredentials] = authorization.trim().split(' ');

  if (authType !== 'Basic' || encodedCredentials.lenght === 0) return res.status(401).json({ error: 'Unauthorized' });
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
  const [decodedEmail, decodedPassword] = decodedCredentials.split(':');
  const user = await dbClient.findOne('users', { email: decodedEmail });

  if (!user) { return res.status(401).json({ error: 'Unauthorized' }); }
  const { password, _id } = user;
  const passwordHash = crypto.createHash('SHA1');

  if (passwordHash.update(decodedPassword).digest('hex') !== password) return res.status(401).json({ error: 'Unauthorized' });
  const token = uuid4();
  await redisClient.set(`auth_${token}`, _id.toString(), '3600');
  return res.json({ token });
}

export async function getDisConnect(req, res) {
  const token = req.headers['x-token'];
  if (!token || !await redisClient.get(`auth_${token}`)) return res.status(401).json({ error: 'Unauthorized' });
  await redisClient.del(`auth_${token}`);
  return res.status(204).json();
}

export async function getMe(req, res) {
  const token = req.headers['x-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const id = await redisClient.get(`auth_${token}`);
  if (!id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await dbClient.findOne('users', { _id: ObjectId(id) });

  return res.json({ id, email: user.email });
}
