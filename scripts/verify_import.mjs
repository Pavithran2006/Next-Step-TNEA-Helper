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

    console.log('🔍 Verifying cutoff data import...\n')

    // Get institutions with cutoffs
    const institutionsWithCutoffs = await col.find({ 
      cutoffs: { $exists: true, $ne: [] } 
    }).toArray()

    console.log(`📊 Summary:`)
    console.log(`- Total institutions with cutoffs: ${institutionsWithCutoffs.length}`)

    // Count total cutoff entries
    const totalCutoffs = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]).toArray()

    console.log(`- Total cutoff entries: ${totalCutoffs[0]?.total || 0}`)

    // Show details for each institution
    console.log('\n📋 Institution Details:')
    for (const inst of institutionsWithCutoffs) {
      const cutoffCount = inst.cutoffs?.length || 0
      console.log(`- ${inst.name}: ${cutoffCount} cutoffs`)
      
      // Show sample cutoffs for verification
      if (inst.cutoffs && inst.cutoffs.length > 0) {
        const sample = inst.cutoffs.slice(0, 3)
        sample.forEach(cutoff => {
          console.log(`  • ${cutoff.course} - ${cutoff.category}: ${cutoff.cutoff || 'N/A'} (${cutoff.year})`)
        })
        if (inst.cutoffs.length > 3) {
          console.log(`  ... and ${inst.cutoffs.length - 3} more`)
        }
      }
      console.log('')
    }

    // Check for the specific colleges we imported
    const targetColleges = [
      'Anna University - CEG',
      'PSG College of Technology', 
      'Thiagarajar College of Engineering',
      'Government College of Technology',
      'MIT Campus - Anna University',
      'SSN College of Engineering'
    ]

    console.log('✅ Verification for target colleges:')
    for (const collegeName of targetColleges) {
      const found = institutionsWithCutoffs.find(inst => 
        inst.name.toLowerCase().includes(collegeName.toLowerCase().split(' ')[0])
      )
      if (found) {
        console.log(`✅ ${found.name}: ${found.cutoffs?.length || 0} cutoffs`)
      } else {
        console.log(`❌ ${collegeName}: Not found`)
      }
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

main()
