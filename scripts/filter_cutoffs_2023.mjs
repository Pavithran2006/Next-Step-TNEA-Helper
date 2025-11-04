#!/usr/bin/env node
import { MongoClient } from 'mongodb'

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextstep'

  let dbName
  try {
    const u = new URL(uri)
    dbName = (u.pathname || '').replace(/^\//, '') || undefined
  } catch {
    // ignore URL parse errors; let driver handle
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = dbName ? client.db(dbName) : client.db()
    const col = db.collection('institutions')

    // Before summary by year
    const before = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$cutoffs.year', n: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray()
    console.log('Before (year -> count):', before)

    // Filter to only 2023 in-place using pipeline update
    const res = await col.updateMany({}, [
      {
        $set: {
          cutoffs: {
            $filter: {
              input: { $ifNull: ['$cutoffs', []] },
              as: 'c',
              cond: { $eq: ['$$c.year', 2023] },
            },
          },
        },
      },
    ])
    console.log(`Modified ${res.modifiedCount} documents (matched ${res.matchedCount}).`)

    // After summary by year
    const after = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$cutoffs.year', n: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray()
    console.log('After (year -> count):', after)
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})


