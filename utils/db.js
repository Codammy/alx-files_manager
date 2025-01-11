import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    let { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
    DB_HOST = DB_HOST || 'localhost';
    DB_PORT = DB_PORT || '27017';
    DB_DATABASE = DB_DATABASE || 'files_manager';
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

  async create(clt, doc) {
    const collection = this.db.collection(clt);
    return collection.insertOne(doc);
  }

  async findOne(clt, qry) {
    const collection = this.db.collection(clt);
    return collection.findOne(qry);
  }

  async find(clt, { query = {}, paginate = [{ $limit: 20 }, { $skip: 0 }] }) {
    const collection = this.db.collection(clt);
    console.log(query, paginate);
    return collection.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [...paginate],
        },
      },
    ]).toArray();
  }
}

const dbClient = new DBClient();

export default dbClient;
