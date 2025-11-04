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

    const totalInstitutions = await col.countDocuments({})
    const institutionsWithCutoffs = await col.countDocuments({ 
      cutoffs: { $exists: true, $ne: [] } 
    })
    
    console.log(`Total institutions: ${totalInstitutions}`)
    console.log(`Institutions with cutoffs: ${institutionsWithCutoffs}`)
    
    if (institutionsWithCutoffs === 0) {
      console.log('✅ All cutoff data has been successfully removed!')
    } else {
      console.log('⚠️  Some cutoff data still remains')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

main()
