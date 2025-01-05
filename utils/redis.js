/* eslint-disable linebreak-style */
import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    // Promisify Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
  }

  isAlive() {
    // Check the connection status
    return this.client.connected;
  }

  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (err) {
      console.error('Error in Redis GET:', err);
      return null;
    }
  }

  async set(key, value, tInSecs) {
    try {
      await this.setAsync(key, value);
      await this.expireAsync(key, tInSecs);
    } catch (err) {
      console.error('Error in Redis SET:', err);
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error('Error in Redis DEL:', err);
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
