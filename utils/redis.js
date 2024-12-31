/* eslint-disable linebreak-style */
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient().on('error', (err) => {
      console.log(err);
    });
    this.connect();
  }

  async connect() {
    await this.client.connect();
  }

  isAlive() {
    // console.log(this.client.isReady, this.client.isOpen);
    if (this.client.isOpen) {
      return true;
    }
    return false;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, tInSecs) {
    await this.client.set(key, value);
    this.client.expire(key, tInSecs);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
