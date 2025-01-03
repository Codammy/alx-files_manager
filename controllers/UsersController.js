import { createHash } from 'crypto';
import dbClient from '../utils/db';

export default async function postNew(req, res) {
  const { email, password } = { ...req.body };
  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!password) return res.status(400).json({ error: 'Missing password' });
  if (await dbClient.findOne('users', { email })) return res.status(400).json({ error: 'Already exist' });
  const passwordHash = createHash('SHA1');
  const hashedPassword = passwordHash.update(password).digest('hex');
  const data = await dbClient.create('users', { email, password: hashedPassword });
  const ops = data.ops[0];
  return res.status(201).json({ id: ops._id, email: ops.email });
}
