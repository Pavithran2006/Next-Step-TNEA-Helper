#!/usr/bin/env node
import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const db = client.db(dbName)
    const col = db.collection('institutions')

    const institutions = await col.find({}).toArray()
    console.log('Available institutions:')
    institutions.forEach(inst => {
      console.log(`- ${inst.name} (ID: ${inst.id})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

main()
