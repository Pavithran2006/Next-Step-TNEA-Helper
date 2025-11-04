import 'dotenv/config'
import { MongoClient } from 'mongodb'

const YEAR = 2023

const kct = [
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'OC', cutoff: 189.5 },
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'BC', cutoff: 184 },
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'BCM', cutoff: 179 },
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'MBC', cutoff: 183.5 },
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'SC', cutoff: 172 },
  { college: 'Kumaraguru College of Technology', course: 'Computer Science Engineering', community: 'ST', cutoff: 140 },

  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'OC', cutoff: 189.5 },
  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'BC', cutoff: 184 },
  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'BCM', cutoff: 179 },
  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'MBC', cutoff: 183.5 },
  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'SC', cutoff: 172 },
  { college: 'Kumaraguru College of Technology', course: 'Artificial Intelligence and Data Science', community: 'ST', cutoff: 140 },

  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'OC', cutoff: 189.5 },
  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'BC', cutoff: 184 },
  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'BCM', cutoff: 179 },
  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'MBC', cutoff: 183.5 },
  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'SC', cutoff: 172 },
  { college: 'Kumaraguru College of Technology', course: 'Electronics and Communication Engineering', community: 'ST', cutoff: 140 },

  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'OC', cutoff: 189.5 },
  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'BC', cutoff: 184 },
  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'BCM', cutoff: 179 },
  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'MBC', cutoff: 183.5 },
  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'SC', cutoff: 172 },
  { college: 'Kumaraguru College of Technology', course: 'Electrical and Electronics Engineering', community: 'ST', cutoff: 140 },

  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'OC', cutoff: 187 },
  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'BC', cutoff: 188.5 },
  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'BCM', cutoff: 179 },
  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'MBC', cutoff: 180.5 },
  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'SC', cutoff: 169.5 },
  { college: 'Kumaraguru College of Technology', course: 'Mechanical Engineering', community: 'ST', cutoff: 134.5 },

  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'OC', cutoff: 195 },
  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'BC', cutoff: 192 },
  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'BCM', cutoff: 192 },
  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'MBC', cutoff: 191.5 },
  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'SC', cutoff: 182 },
  { college: 'Kumaraguru College of Technology', course: 'Information Technology', community: 'ST', cutoff: 168.5 },

  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'OC', cutoff: 185 },
  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'BC', cutoff: 177 },
  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'BCM', cutoff: 169.5 },
  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'MBC', cutoff: 176 },
  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'SC', cutoff: 169.5 },
  { college: 'Kumaraguru College of Technology', course: 'Civil Engineering', community: 'ST', cutoff: 154.5 },
]

const bit = [
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'OC', cutoff: 183.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'BC', cutoff: 181 },
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'BCM', cutoff: 173 },
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'MBC', cutoff: 175.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'SC', cutoff: 132 },
  { college: 'Bannari Amman Institute of Technology', course: 'Artificial Intelligence and Data Science', community: 'ST', cutoff: 118 },

  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'OC', cutoff: 184 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'BC', cutoff: 181.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'BCM', cutoff: 173.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'MBC', cutoff: 176 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'SC', cutoff: 136 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Communication Engineering', community: 'ST', cutoff: 119 },

  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'OC', cutoff: 179 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'BC', cutoff: 176.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'BCM', cutoff: 167 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'MBC', cutoff: 167 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'SC', cutoff: 128 },
  { college: 'Bannari Amman Institute of Technology', course: 'Electrical and Electronics Engineering', community: 'ST', cutoff: 125 },

  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'OC', cutoff: 184 },
  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'BC', cutoff: 182 },
  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'BCM', cutoff: 174.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'MBC', cutoff: 176 },
  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'SC', cutoff: 135.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Information Technology', community: 'ST', cutoff: 134 },

  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'OC', cutoff: 171 },
  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'BC', cutoff: 167.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'BCM', cutoff: 161.5 },
  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'MBC', cutoff: 160 },
  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'SC', cutoff: 122 },
  { college: 'Bannari Amman Institute of Technology', course: 'Mechanical Engineering', community: 'ST', cutoff: null },
]

const nec = [
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'OC', cutoff: 181.5 },
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'BC', cutoff: 177 },
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'BCM', cutoff: 180 },
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'MBC', cutoff: 168 },
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'SC', cutoff: 137 },
  { college: 'Nation Engineering College', course: 'Electrical and Communication Engineering', community: 'ST', cutoff: null },

  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'OC', cutoff: 173 },
  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'BC', cutoff: 165.5 },
  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'BCM', cutoff: 168 },
  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'MBC', cutoff: 166 },
  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'SC', cutoff: 118 },
  { college: 'Nation Engineering College', course: 'Electrical and Electronics Engineering', community: 'ST', cutoff: null },

  { college: 'Nation Engineering College', course: 'Information Technology', community: 'OC', cutoff: 179.5 },
  { college: 'Nation Engineering College', course: 'Information Technology', community: 'BC', cutoff: 177 },
  { college: 'Nation Engineering College', course: 'Information Technology', community: 'BCM', cutoff: 176 },
  { college: 'Nation Engineering College', course: 'Information Technology', community: 'MBC', cutoff: 170 },
  { college: 'Nation Engineering College', course: 'Information Technology', community: 'SC', cutoff: 126.5 },
  { college: 'Nation Engineering College', course: 'Information Technology', community: 'ST', cutoff: null },

  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'OC', cutoff: 158 },
  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'BC', cutoff: 145 },
  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'BCM', cutoff: null },
  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'MBC', cutoff: 142 },
  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'SC', cutoff: 127.5 },
  { college: 'Nation Engineering College', course: 'Mechanical Engineering', community: 'ST', cutoff: null },
]

const srec = [
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'OC', cutoff: 158 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'BC', cutoff: 145 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'BCM', cutoff: null },
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'MBC', cutoff: 142 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'SC', cutoff: 127.5 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Computer Science and Engineering', community: 'ST', cutoff: null },

  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'OC', cutoff: 158 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'BC', cutoff: 145 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'BCM', cutoff: null },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'MBC', cutoff: 142 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'SC', cutoff: 127.5 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Communication Engineering', community: 'ST', cutoff: null },

  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'OC', cutoff: 158 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'BC', cutoff: 145 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'BCM', cutoff: null },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'MBC', cutoff: 142 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'SC', cutoff: 127.5 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Electrical and Electronics Engineering', community: 'ST', cutoff: null },

  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'OC', cutoff: 158 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'BC', cutoff: 145 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'BCM', cutoff: null },
  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'MBC', cutoff: 142 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'SC', cutoff: 127.5 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Information Technology', community: 'ST', cutoff: null },

  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'OC', cutoff: 158 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'BC', cutoff: 145 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'BCM', cutoff: null },
  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'MBC', cutoff: 142 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'SC', cutoff: 127.5 },
  { college: 'Sri Ramakrishna Engineering College', course: 'Mechanical Engineering', community: 'ST', cutoff: null },
]

function normalize(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findInstitutionByAlias(institutions, alias) {
  const a = normalize(alias)
  return institutions.find((i) => normalize(i.name).includes(a))
}

async function upsert(db, inst, rows) {
  const col = db.collection('institutions')
  const existing = Array.isArray(inst.cutoffs) ? inst.cutoffs : []
  const makeKey = (o) => `${o.year}|${o.course}|${o.category}`
  const transformed = rows.map((r) => ({ year: YEAR, course: r.course, category: r.community, cutoff: r.cutoff == null ? null : Number(r.cutoff) }))
  const merged = new Map(existing.map((x) => [makeKey(x), x]))
  transformed.forEach((t) => merged.set(makeKey(t), t))
  const list = Array.from(merged.values())
  await col.updateOne({ id: inst.id }, { $set: { cutoffs: list } })
  return list.length
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  const institutions = await db.collection('institutions').find({}).toArray()

  const kctInst = findInstitutionByAlias(institutions, 'Kumaraguru College of Technology')
  if (!kctInst) throw new Error('Kumaraguru College of Technology not found')
  const bitInst = findInstitutionByAlias(institutions, 'Bannari Amman Institute of Technology')
  if (!bitInst) throw new Error('Bannari Amman Institute of Technology not found')
  const necInst = findInstitutionByAlias(institutions, 'National Engineering College') || findInstitutionByAlias(institutions, 'Nation Engineering College')
  if (!necInst) throw new Error('National Engineering College not found')
  const srecInst = findInstitutionByAlias(institutions, 'Sri Ramakrishna Engineering College')
  if (!srecInst) throw new Error('Sri Ramakrishna Engineering College not found')

  await upsert(db, kctInst, kct)
  console.log('Upserted KCT cutoffs')
  await upsert(db, bitInst, bit)
  console.log('Upserted BIT cutoffs')
  await upsert(db, necInst, nec)
  console.log('Upserted NEC cutoffs')
  await upsert(db, srecInst, srec)
  console.log('Upserted SREC cutoffs')

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
