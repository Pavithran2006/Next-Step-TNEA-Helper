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

    // Get detailed count before clearing
    const beforeStats = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { 
          _id: null, 
          totalCutoffs: { $sum: 1 },
          institutionsWithCutoffs: { $addToSet: '$_id' }
        } 
      }
    ]).toArray()
    
    const totalCutoffsBefore = beforeStats[0]?.totalCutoffs || 0
    const institutionsWithCutoffs = beforeStats[0]?.institutionsWithCutoffs?.length || 0
    
    console.log(`Before clearing:`)
    console.log(`- Total cutoff entries: ${totalCutoffsBefore}`)
    console.log(`- Institutions with cutoffs: ${institutionsWithCutoffs}`)

    // Method 1: Set cutoffs to empty array for all documents
    const result1 = await col.updateMany(
      {},
      { $set: { cutoffs: [] } }
    )
    console.log(`Method 1 - Set cutoffs to []: Modified ${result1.modifiedCount} documents`)

    // Method 2: Remove the cutoffs field entirely
    const result2 = await col.updateMany(
      {},
      { $unset: { cutoffs: "" } }
    )
    console.log(`Method 2 - Remove cutoffs field: Modified ${result2.modifiedCount} documents`)

    // Verify the clearing worked
    const afterStats = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { 
          _id: null, 
          totalCutoffs: { $sum: 1 },
          institutionsWithCutoffs: { $addToSet: '$_id' }
        } 
      }
    ]).toArray()
    
    const totalCutoffsAfter = afterStats[0]?.totalCutoffs || 0
    const institutionsWithCutoffsAfter = afterStats[0]?.institutionsWithCutoffs?.length || 0

    console.log(`\nAfter clearing:`)
    console.log(`- Total cutoff entries: ${totalCutoffsAfter}`)
    console.log(`- Institutions with cutoffs: ${institutionsWithCutoffsAfter}`)

    // Check for any remaining cutoff data
    const remainingCutoffs = await col.find({ 
      $or: [
        { cutoffs: { $exists: true, $ne: [] } },
        { cutoffs: { $exists: true, $ne: null } }
      ]
    }).toArray()

    if (remainingCutoffs.length > 0) {
      console.log(`\n⚠️  Found ${remainingCutoffs.length} institutions still with cutoff data:`)
      remainingCutoffs.forEach(inst => {
        console.log(`- ${inst.name} (ID: ${inst.id}): ${inst.cutoffs?.length || 0} cutoffs`)
      })
    } else {
      console.log('\n✅ Successfully cleared ALL cutoff data from MongoDB')
    }

    // Show summary
    console.log(`\nSummary:`)
    console.log(`- Cutoff entries removed: ${totalCutoffsBefore - totalCutoffsAfter}`)
    console.log(`- Institutions processed: ${result1.modifiedCount}`)

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
