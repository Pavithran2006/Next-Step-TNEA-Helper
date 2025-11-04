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

    // Get count of documents with cutoffs before clearing
    const beforeCount = await col.countDocuments({ cutoffs: { $exists: true, $ne: [] } })
    console.log(`Found ${beforeCount} institutions with cutoff data`)

    // Get total cutoff entries before clearing
    const beforeAggregation = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, totalCutoffs: { $sum: 1 } } }
    ]).toArray()
    const totalCutoffsBefore = beforeAggregation[0]?.totalCutoffs || 0
    console.log(`Total cutoff entries before clearing: ${totalCutoffsBefore}`)

    // Clear all cutoff data by setting cutoffs field to empty array
    const result = await col.updateMany(
      { cutoffs: { $exists: true } },
      { $set: { cutoffs: [] } }
    )

    console.log(`Modified ${result.modifiedCount} documents (matched ${result.matchedCount})`)

    // Verify the clearing worked
    const afterCount = await col.countDocuments({ cutoffs: { $exists: true, $ne: [] } })
    console.log(`Institutions with cutoff data after clearing: ${afterCount}`)

    const afterAggregation = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, totalCutoffs: { $sum: 1 } } }
    ]).toArray()
    const totalCutoffsAfter = afterAggregation[0]?.totalCutoffs || 0
    console.log(`Total cutoff entries after clearing: ${totalCutoffsAfter}`)

    if (totalCutoffsAfter === 0) {
      console.log('✅ Successfully cleared all cutoff data from MongoDB')
    } else {
      console.log('⚠️  Warning: Some cutoff data may still remain')
    }

  } catch (error) {
    console.error('Error clearing cutoff data:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error('Script failed:', e)
  process.exit(1)
})
