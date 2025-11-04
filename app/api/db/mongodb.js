import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.warn('MONGODB_URI is not set. API will fallback to local JSON where implemented.')
}

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri || 'mongodb://localhost:27017')
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function getDb() {
  const conn = await clientPromise
  const dbName = process.env.MONGODB_DB || 'nextstep'
  return conn.db(dbName)
}


