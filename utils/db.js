import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
    const uri = `mongodb://${DB_HOST}/${DB_PORT}`;
    // const uri = mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(DB_DATABASE);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    return users.countDocuments();
  }

  async nbFiles() {
    const files = this.db.collection('files');
    return files.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
