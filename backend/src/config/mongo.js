const { MongoClient } = require('mongodb');

const dbName = process.env.MONGODB_DB || 'AssetManagement2022';

let clientPromise;

function getClient() {
  if (!clientPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect();
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  return client.db(dbName);
}

module.exports = { getDb };
