import 'dotenv/config'
import { MongoClient } from 'mongodb'

// Provided datasets
const mitSets = [
  [
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'OC', cutoff: 199.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'BC', cutoff: 199 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'BCM', cutoff: 198 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'MBC', cutoff: 199 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'SC', cutoff: 195.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'ST', cutoff: null },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'OC', cutoff: 198 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'BC', cutoff: 197.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'BCM', cutoff: 197 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'MBC', cutoff: 197 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'SC', cutoff: 193 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'ST', cutoff: 186.5 },
  ],
  [
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'OC', cutoff: 194 },
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'BC', cutoff: 192 },
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'BCM', cutoff: 190 },
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'MBC', cutoff: 191 },
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'SC', cutoff: 186 },
    { college: 'MIT', course: 'Civil Engineering', type: 'Regular', community: 'ST', cutoff: 183 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'OC', cutoff: 198 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'BC', cutoff: 197 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'BCM', cutoff: 196 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'MBC', cutoff: 197 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'SC', cutoff: 193 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'Regular', community: 'ST', cutoff: null },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'OC', cutoff: 199.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'BC', cutoff: 199 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'BCM', cutoff: 198 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'MBC', cutoff: 199 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'SC', cutoff: 195.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'Regular', community: 'ST', cutoff: null },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'OC', cutoff: 197 },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'BC', cutoff: 196 },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'BCM', cutoff: 195 },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'MBC', cutoff: 196 },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'SC', cutoff: 191 },
    { college: 'MIT', course: 'Information Technology', type: 'Regular', community: 'ST', cutoff: null },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'OC', cutoff: 196 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'BC', cutoff: 194 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'BCM', cutoff: 192 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'MBC', cutoff: 193 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'SC', cutoff: 188 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'Regular', community: 'ST', cutoff: null },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'OC', cutoff: 198 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'BC', cutoff: 197.5 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'BCM', cutoff: 197 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'MBC', cutoff: 197 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'SC', cutoff: 193 },
    { college: 'MIT', course: 'Computer Science Engineering', type: 'SS', community: 'ST', cutoff: 186.5 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'OC', cutoff: 196 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'BC', cutoff: 195.5 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'BCM', cutoff: 194.5 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'MBC', cutoff: 195 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'SC', cutoff: 190 },
    { college: 'MIT', course: 'Electronics and Communication Engineering', type: 'SS', community: 'ST', cutoff: 182.5 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'OC', cutoff: 195 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'BC', cutoff: 194 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'BCM', cutoff: 193 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'MBC', cutoff: 194 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'SC', cutoff: 188 },
    { college: 'MIT', course: 'Information Technology', type: 'SS', community: 'ST', cutoff: 181 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'OC', cutoff: 194 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'BC', cutoff: 193 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'BCM', cutoff: 192 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'MBC', cutoff: 192 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'SC', cutoff: 186 },
    { college: 'MIT', course: 'Mechanical Engineering', type: 'SS', community: 'ST', cutoff: 179 },
  ],
]

const ssnSet = [
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'OC', cutoff: 189 },
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'BC', cutoff: 187 },
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'BCM', cutoff: 186 },
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'MBC', cutoff: 187 },
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'SC', cutoff: 182 },
  { college: 'SSN', course: 'Civil Engineering', type: 'SS', community: 'ST', cutoff: null },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'OC', cutoff: 195 },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'BC', cutoff: 194 },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'BCM', cutoff: 193 },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'MBC', cutoff: 194 },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'SC', cutoff: 189 },
  { college: 'SSN', course: 'Electronics and Communication Engineering', type: 'SS', community: 'ST', cutoff: 181 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'OC', cutoff: 196 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'BC', cutoff: 195 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'BCM', cutoff: 194 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'MBC', cutoff: 195 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'SC', cutoff: 190 },
  { college: 'SSN', course: 'Computer Science Engineering', type: 'SS', community: 'ST', cutoff: 183 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'OC', cutoff: 194 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'BC', cutoff: 193 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'BCM', cutoff: 192 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'MBC', cutoff: 193 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'SC', cutoff: 187 },
  { college: 'SSN', course: 'Information Technology', type: 'SS', community: 'ST', cutoff: 180 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'OC', cutoff: 191 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'BC', cutoff: 190 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'BCM', cutoff: 189 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'MBC', cutoff: 190 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'SC', cutoff: 185 },
  { college: 'SSN', course: 'Mechanical Engineering', type: 'SS', community: 'ST', cutoff: 178 },
]

const tceSet = [
  { college: 'TCE', course: 'Civil Engineering', community: 'OC', cutoff: 194.5 },
  { college: 'TCE', course: 'Civil Engineering', community: 'BC', cutoff: 192.5 },
  { college: 'TCE', course: 'Civil Engineering', community: 'BCM', cutoff: 193.5 },
  { college: 'TCE', course: 'Civil Engineering', community: 'MBC', cutoff: 192.5 },
  { college: 'TCE', course: 'Civil Engineering', community: 'SC', cutoff: 187 },
  { college: 'TCE', course: 'Civil Engineering', community: 'ST', cutoff: 184.5 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'OC', cutoff: 197.5 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'BC', cutoff: 194.5 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'BCM', cutoff: 194 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'MBC', cutoff: 194.5 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'SC', cutoff: 193.5 },
  { college: 'TCE', course: 'Electronics and Communication Engineering', community: 'ST', cutoff: 184.5 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'OC', cutoff: 200 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'BC', cutoff: 199.5 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'BCM', cutoff: 198.5 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'MBC', cutoff: 199.5 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'SC', cutoff: 197.5 },
  { college: 'TCE', course: 'Computer Science Engineering', community: 'ST', cutoff: 191.5 },
  { college: 'TCE', course: 'Information Technology', community: 'OC', cutoff: 198.5 },
  { college: 'TCE', course: 'Information Technology', community: 'BC', cutoff: 198 },
  { college: 'TCE', course: 'Information Technology', community: 'BCM', cutoff: 197.5 },
  { college: 'TCE', course: 'Information Technology', community: 'MBC', cutoff: 197.5 },
  { college: 'TCE', course: 'Information Technology', community: 'SC', cutoff: 193.5 },
  { college: 'TCE', course: 'Information Technology', community: 'ST', cutoff: 193 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'OC', cutoff: 195 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'BC', cutoff: 192 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'BCM', cutoff: 190 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'MBC', cutoff: 193.5 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'SC', cutoff: 186 },
  { college: 'TCE', course: 'Mechanical Engineering', community: 'ST', cutoff: null },
]

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function findInstitutionByAlias(institutions, alias) {
  const a = normalize(alias)
  return institutions.find((i) => {
    const n = normalize(i.name)
    // Map common aliases
    if (a === 'mit') return n.includes('mit') && n.includes('anna')
    if (a === 'ssn') return n.includes('ssn')
    if (a === 'tce') return n.includes('thiagarajar')
    return n.includes(a)
  })
}

async function upsertCutoffs(db, inst, entries, year) {
  const col = db.collection('institutions')
  const existing = Array.isArray(inst.cutoffs) ? inst.cutoffs : []
  const makeKey = (o) => `${o.year}|${o.course}|${o.category}|${o.seatType || ''}`

  const transformed = entries.map((e) => ({
    year,
    course: e.course,
    category: e.community,
    cutoff: e.cutoff == null ? null : Number(e.cutoff),
    seatType: e.type || undefined,
  }))

  const mergedMap = new Map(existing.map((x) => [makeKey(x), x]))
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
  const db = client.db(dbName)
  const institutions = await db.collection('institutions').find({}).toArray()

  const YEAR = 2023

  // MIT
  const mit = findInstitutionByAlias(institutions, 'mit')
  if (!mit) throw new Error('MIT Campus - Anna University not found')
  const mitFlat = mitSets.flat()
  const mitRes = await upsertCutoffs(db, mit, mitFlat, YEAR)
  console.log(`MIT updated: +${mitRes.added} for ${YEAR}. Total: ${mitRes.total}`)

  // SSN
  const ssn = findInstitutionByAlias(institutions, 'ssn')
  if (!ssn) throw new Error('SSN College of Engineering not found')
  const ssnRes = await upsertCutoffs(db, ssn, ssnSet, YEAR)
  console.log(`SSN updated: +${ssnRes.added} for ${YEAR}. Total: ${ssnRes.total}`)

  // TCE (Thiagarajar College of Engineering)
  const tce = findInstitutionByAlias(institutions, 'tce')
  if (!tce) throw new Error('Thiagarajar College of Engineering (TCE) not found')
  const tceRes = await upsertCutoffs(db, tce, tceSet, YEAR)
  console.log(`TCE updated: +${tceRes.added} for ${YEAR}. Total: ${tceRes.total}`)

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


