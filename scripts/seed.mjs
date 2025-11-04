import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  const col = db.collection('institutions')

  const base = path.resolve(__dirname, '..')
  const collegesPath = path.join(base, 'public', 'data', 'colleges.json')
  const cutoffsPath = path.join(base, 'public', 'data', 'cutoffs.json')

  const [collegesRaw, cutoffsRaw] = await Promise.all([
    readFile(collegesPath, 'utf-8'),
    readFile(cutoffsPath, 'utf-8'),
  ])
  const colleges = JSON.parse(collegesRaw)
  const cutoffs = JSON.parse(cutoffsRaw)

  const merged = colleges.map((c) => ({
    ...c,
    cutoffs: cutoffs.filter((co) => co.collegeId === c.id),
  }))

  await col.deleteMany({})
  if (merged.length) {
    await col.insertMany(merged)
  }

  console.log(`Seeded ${merged.length} institutions into '${dbName}.institutions'`)
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
