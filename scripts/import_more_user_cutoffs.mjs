#!/usr/bin/env node
import 'dotenv/config'
import { MongoClient } from 'mongodb'

// Provided cutoff datasets
const cutoffData = [
  // Kumaraguru College of Technology
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "OC", "cutoff": 189.5 },
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "BC", "cutoff": 184 },
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 183.5 },
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "SC", "cutoff": 172 },
  { "college": "Kumaraguru College of Technology", "course": "Computer Science Engineering", "community": "ST", "cutoff": 140 },

  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "OC", "cutoff": 189.5 },
  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "BC", "cutoff": 184 },
  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "BCM", "cutoff": 179 },
  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "MBC", "cutoff": 183.5 },
  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "SC", "cutoff": 172 },
  { "college": "Kumaraguru College of Technology", "course": "Artificial Intelligence and Data Science", "community": "ST", "cutoff": 140 },

  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 189.5 },
  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 184 },
  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 183.5 },
  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 172 },
  { "college": "Kumaraguru College of Technology", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": 140 },

  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "OC", "cutoff": 189.5 },
  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "BC", "cutoff": 184 },
  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "MBC", "cutoff": 183.5 },
  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "SC", "cutoff": 172 },
  { "college": "Kumaraguru College of Technology", "course": "Electrical and Electronics Engineering", "community": "ST", "cutoff": 140 },

  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "OC", "cutoff": 187 },
  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "BC", "cutoff": 188.5 },
  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 180.5 },
  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "SC", "cutoff": 169.5 },
  { "college": "Kumaraguru College of Technology", "course": "Mechanical Engineering", "community": "ST", "cutoff": 134.5 },

  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "OC", "cutoff": 195 },
  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "BC", "cutoff": 192 },
  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "BCM", "cutoff": 192 },
  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "MBC", "cutoff": 191.5 },
  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "SC", "cutoff": 182 },
  { "college": "Kumaraguru College of Technology", "course": "Information Technology", "community": "ST", "cutoff": 168.5 },

  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "OC", "cutoff": 185 },
  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "BC", "cutoff": 177 },
  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "BCM", "cutoff": 169.5 },
  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "MBC", "cutoff": 176 },
  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "SC", "cutoff": 169.5 },
  { "college": "Kumaraguru College of Technology", "course": "Civil Engineering", "community": "ST", "cutoff": 154.5 },

  // Sri Sairam Engineering College
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "OC", "cutoff": 180.5 },
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "BC", "cutoff": 174.5 },
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "BCM", "cutoff": 169.5 },
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "MBC", "cutoff": 174 },
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "SC", "cutoff": 150.5 },
  { "college": "Sri Sairam Engineering College", "course": "Civil Engineering", "community": "ST", "cutoff": null },

  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "OC", "cutoff": 173 },
  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "BC", "cutoff": 171.5 },
  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 128.5 },
  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 154 },
  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "SC", "cutoff": 148 },
  { "college": "Sri Sairam Engineering College", "course": "Mechanical Engineering", "community": "ST", "cutoff": null },

  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "OC", "cutoff": 196 },
  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "BC", "cutoff": 187 },
  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 180.5 },
  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 182 },
  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "SC", "cutoff": 168.5 },
  { "college": "Sri Sairam Engineering College", "course": "Computer Science Engineering", "community": "ST", "cutoff": 116.5 },

  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 185.5 },
  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 172 },
  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 169 },
  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 171 },
  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 171 },
  { "college": "Sri Sairam Engineering College", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": null },

  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "OC", "cutoff": 193.5 },
  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "BC", "cutoff": 181 },
  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "BCM", "cutoff": 177 },
  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "MBC", "cutoff": 181 },
  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "SC", "cutoff": 166 },
  { "college": "Sri Sairam Engineering College", "course": "Information Technology", "community": "ST", "cutoff": null },

  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "OC", "cutoff": 184 },
  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "BC", "cutoff": 163.5 },
  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "BCM", "cutoff": 157 },
  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "MBC", "cutoff": 163 },
  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "SC", "cutoff": 153 },
  { "college": "Sri Sairam Engineering College", "course": "Electrical and Electronics Engineering", "community": "ST", "cutoff": null },

  // Institute of Road and Transport Technology - Erode
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "OC", "cutoff": 167 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "BC", "cutoff": 158.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "BCM", "cutoff": 158 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "MBC", "cutoff": 158.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "SC", "cutoff": 151 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Civil Engineering", "community": "ST", "cutoff": 137.5 },

  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "OC", "cutoff": 167 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "BC", "cutoff": 158.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 158 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 158.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "SC", "cutoff": 151 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Mechanical Engineering", "community": "ST", "cutoff": 137.5 },

  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 179.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 172.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 177 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 171.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 153 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": null },

  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "OC", "cutoff": 187.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "BC", "cutoff": 181 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "MBC", "cutoff": 182 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "SC", "cutoff": 176 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Computer Science and Engineering", "community": "ST", "cutoff": null },

  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "OC", "cutoff": 165.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "BC", "cutoff": 162.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "BCM", "cutoff": 163 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "MBC", "cutoff": 158 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "SC", "cutoff": 143.5 },
  { "college": "Institute of Road and Transport Technology - Erode", "course": "Information Technology", "community": "ST", "cutoff": 147 },

  // Bannari Amman Institute of Technology - Sathyamangalam, Erode
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "OC", "cutoff": 183.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "BC", "cutoff": 181 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "BCM", "cutoff": 173 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "MBC", "cutoff": 175.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "SC", "cutoff": 132 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "CSE", "community": "ST", "cutoff": 118 },

  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "OC", "cutoff": 181 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "BC", "cutoff": 179 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "BCM", "cutoff": null },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "MBC", "cutoff": 175.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "SC", "cutoff": 135.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "ECE", "community": "ST", "cutoff": 104 },

  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "OC", "cutoff": 184 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "BC", "cutoff": 181.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "BCM", "cutoff": 173.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "MBC", "cutoff": 176 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "SC", "cutoff": 136 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "IT", "community": "ST", "cutoff": 119 },

  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "OC", "cutoff": 179 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "BC", "cutoff": 176.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "BCM", "cutoff": 167 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "MBC", "cutoff": 167 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "SC", "cutoff": 128 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Mechanical", "community": "ST", "cutoff": 125 },

  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "OC", "cutoff": 184 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "BC", "cutoff": 182 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "BCM", "cutoff": 174.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "MBC", "cutoff": 176 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "SC", "cutoff": 135.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "EEE", "community": "ST", "cutoff": 134 },

  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "OC", "cutoff": 171 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "BC", "cutoff": 167.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "BCM", "cutoff": 161.5 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "MBC", "cutoff": 160 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "SC", "cutoff": 122 },
  { "college": "Bannari Amman Institute of Technology - Sathyamangalam, Erode", "course": "Civil Engineering", "community": "ST", "cutoff": null },
]

function normalizeName(name) {
  return (name || '').toLowerCase().trim()
}

function normalizeCourseName(course) {
  if (!course || typeof course !== 'string') return course
  const normalized = course.trim().toLowerCase()
  const mappings = {
    'cse': 'Computer Science Engineering',
    'computer science engineering': 'Computer Science Engineering',
    'computer science and engineering': 'Computer Science Engineering',
    'computer science & engineering': 'Computer Science Engineering',
    'ece': 'Electronics and Communication Engineering',
    'electronics and communication engineering': 'Electronics and Communication Engineering',
    'eee': 'Electrical and Electronics Engineering',
    'electrical and electronics engineering': 'Electrical and Electronics Engineering',
    'it': 'Information Technology',
    'information technology': 'Information Technology',
    'mechanical': 'Mechanical Engineering',
    'mechanical engineering': 'Mechanical Engineering',
    'civil': 'Civil Engineering',
    'civil engineering': 'Civil Engineering',
  }
  // Keep specific long names as-is
  if (normalized.includes('artificial intelligence and data science')) return 'Artificial Intelligence and Data Science'
  return mappings[normalized] || course.trim()
}

function findInstitutionByAlias(institutions, alias) {
  const a = normalizeName(alias)
  return institutions.find(inst => {
    const n = normalizeName(inst.name)
    return n.includes(a) || a.includes(n)
  })
}

async function upsertCutoffs(db, inst, entries, year = 2024) {
  const col = db.collection('institutions')
  const existing = Array.isArray(inst.cutoffs) ? inst.cutoffs : []
  const makeKey = (o) => `${o.year}|${o.course}|${o.category}`

  const transformed = entries.map(e => ({
    year,
    course: normalizeCourseName(e.course),
    category: e.community,
    cutoff: e.cutoff == null ? null : Number(e.cutoff),
  }))

  const mergedMap = new Map(existing.map(x => [makeKey(x), x]))
  for (const t of transformed) mergedMap.set(makeKey(t), t)
  const merged = Array.from(mergedMap.values())

  await col.updateOne({ id: inst.id }, { $set: { cutoffs: merged } })
  return { added: transformed.length, total: merged.length }
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

    // Group by college
    const grouped = cutoffData.reduce((acc, row) => {
      acc[row.college] = acc[row.college] || []
      acc[row.college].push(row)
      return acc
    }, {})

    let processed = 0
    let added = 0

    for (const [college, entries] of Object.entries(grouped)) {
      const inst = findInstitutionByAlias(institutions, college)
      if (!inst) {
        console.log(`⚠️  Institution not found: ${college}`)
        continue
      }
      const res = await upsertCutoffs(db, inst, entries)
      processed += 1
      added += res.added
      console.log(`✅ ${inst.name}: +${res.added} (total ${res.total})`)
    }

    console.log(`\nSummary: processed=${processed}, added=${added}, rows=${cutoffData.length}`)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error('Import failed:', e)
  process.exit(1)
})
