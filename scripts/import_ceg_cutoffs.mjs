import 'dotenv/config'
import { MongoClient } from 'mongodb'

// Provided cutoff data (CEG)
const incoming = [
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "OC", "cutoff": 199.5 },
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "BC", "cutoff": 199 },
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "BCM", "cutoff": 197.5 },
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "MBC", "cutoff": 198.5 },
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "SC", "cutoff": 197 },
  { "college": "Anna University CEG", "course": "Civil Engineering", "community": "ST", "cutoff": null },

  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 195 },
  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 192 },
  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 190 },
  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 193.5 },
  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 186 },
  { "college": "Anna University CEG", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": null },

  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "OC", "cutoff": 200 },
  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "BC", "cutoff": 199.5 },
  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 198.5 },
  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 199.5 },
  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "SC", "cutoff": 197.5 },
  { "college": "Anna University CEG", "course": "Computer Science Engineering", "community": "ST", "cutoff": 191.5 },

  { "college": "Anna University CEG", "course": "Information Technology", "community": "OC", "cutoff": 198.5 },
  { "college": "Anna University CEG", "course": "Information Technology", "community": "BC", "cutoff": 198 },
  { "college": "Anna University CEG", "course": "Information Technology", "community": "BCM", "cutoff": 197.5 },
  { "college": "Anna University CEG", "course": "Information Technology", "community": "MBC", "cutoff": 197.5 },
  { "college": "Anna University CEG", "course": "Information Technology", "community": "SC", "cutoff": 193.5 },
  { "college": "Anna University CEG", "course": "Information Technology", "community": "ST", "cutoff": 193 },

  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "OC", "cutoff": 194.5 },
  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "BC", "cutoff": 192.5 },
  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 193.5 },
  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 192.5 },
  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "SC", "cutoff": 187 },
  { "college": "Anna University CEG", "course": "Mechanical Engineering", "community": "ST", "cutoff": 184.5 }
]

// Helper to normalize names
function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  const col = db.collection('institutions')

  // Find CEG institution (by common canonical name)
  const candidates = await col.find({}).toArray()
  const target = candidates.find((c) => {
    const n = normalizeName(c.name)
    return n.includes('anna university') && n.includes('ceg')
  }) || candidates.find((c)=> c.id === 1)

  if (!target) {
    throw new Error('Could not find Anna University - CEG in institutions collection')
  }

  const YEAR = 2023
  const existing = Array.isArray(target.cutoffs) ? target.cutoffs : []

  // Transform incoming to desired schema and merge by unique key: year+course+category
  const makeKey = (o) => `${o.year}|${o.course}|${o.category}`

  const transformed = incoming.map((row) => ({
    year: YEAR,
    course: row.course,
    category: row.community,
    cutoff: row.cutoff == null ? null : Number(row.cutoff),
  }))

  const mergedMap = new Map()
  // seed existing
  for (const e of existing) {
    mergedMap.set(makeKey(e), e)
  }
  // apply incoming (overwrites existing of same key)
  for (const t of transformed) {
    mergedMap.set(makeKey(t), t)
  }

  const merged = Array.from(mergedMap.values())

  await col.updateOne({ id: target.id }, { $set: { cutoffs: merged } })

  console.log(`Updated '${target.name}' with ${transformed.length} cutoffs for ${YEAR}. Total now: ${merged.length}`)

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


