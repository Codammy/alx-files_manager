import redisClient from '../utils/redis';

import dbClient from '../utils/db';

export function getStatus(req, res) {
  const [redisStatus, dbStatus] = [redisClient.isAlive(), dbClient.isAlive()];
  return res.json({ redis: redisStatus, db: dbStatus });
}

export async function getStats(req, res) {
  const [users, files] = [await dbClient.nbUsers(), await dbClient.nbFiles()];
  return res.json({ users, files });
}
