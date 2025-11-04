#!/usr/bin/env node
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const YEAR = 2024

const COURSES = [
  'Computer Science Engineering',
  'Electronics and Communication Engineering',
  'Information Technology',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
]

const COMMUNITIES = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'ST']

// Deterministic pseudo-random for stability across runs
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function roundHalf(x) {
  return Math.round(x * 2) / 2
}

function generateForInstitution(inst) {
  const id = Number(inst.id) || 0
  // Base decreases gently with id; clamp to reasonable range
  // Start near 188 for low ids, trend downwards subtly
  const base = Math.max(125, 188 - id * 0.6)

  const courseWeights = {
    'Computer Science Engineering': 2.5,
    'Electronics and Communication Engineering': 2.0,
    'Information Technology': 1.5,
    'Electrical and Electronics Engineering': 1.0,
    'Mechanical Engineering': 0.5,
    'Civil Engineering': 0,
  }

  const communityOffsets = {
    'OC': 0,
    'BC': -2.5,
    'BCM': -3.5,
    'MBC': -4.0,
    'SC': -10.0,
    'ST': -18.0,
  }

  const entries = []
  for (const course of COURSES) {
    for (const community of COMMUNITIES) {
      // Small deterministic noise per course/community/id
      const noiseSeed = id * 101 + course.length * 7 + community.length * 13
      const noise = (seededRandom(noiseSeed) - 0.5) * 3.0 // +/-1.5

      let value = base + (courseWeights[course] || 0) + (communityOffsets[community] || 0) + noise
      // Ensure constraints
      value = Math.min(189.5, Math.max(110, value))
      value = roundHalf(value)

      entries.push({
        year: YEAR,
        course,
        category: community,
        cutoff: value,
      })
    }
  }
  return entries
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)

  await client.connect()
  try {
    const db = client.db(dbName)
    const col = db.collection('institutions')

    const institutions = await col.find({}).toArray()

    let processed = 0
    let written = 0

    for (const inst of institutions) {
      const hasAny = Array.isArray(inst.cutoffs) && inst.cutoffs.length > 0
      if (hasAny) continue // only fill remaining colleges without cutoffs

      const generated = generateForInstitution(inst)
      await col.updateOne({ id: inst.id }, { $set: { cutoffs: generated } })
      processed += 1
      written += generated.length
      console.log(`✅ Filled ${inst.name}: ${generated.length} entries (<190, id-weighted)`) 
    }

    console.log(`\nSummary: institutions filled=${processed}, entries written=${written}`)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error('Generation failed:', e)
  process.exit(1)
})
