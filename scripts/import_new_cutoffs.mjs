#!/usr/bin/env node
import 'dotenv/config'
import { MongoClient } from 'mongodb'

// New cutoff data provided by user
const cutoffData = [
  // Anna University - CEG
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "OC", "cutoff": 195 },
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "BC", "cutoff": 192 },
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "BCM", "cutoff": 190 },
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "MBC", "cutoff": 193.5 },
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "SC", "cutoff": 186 },
  { "college": "Anna University - CEG", "course": "Civil Engineering", "community": "ST", "cutoff": null },

  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 200 },
  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 199.5 },
  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 198.5 },
  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 199.5 },
  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 197.5 },
  { "college": "Anna University - CEG", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": 191.5 },

  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "OC", "cutoff": 197.5 },
  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "BC", "cutoff": 196.5 },
  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 196.5 },
  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 196 },
  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "SC", "cutoff": 192.5 },
  { "college": "Anna University - CEG", "course": "Computer Science Engineering", "community": "ST", "cutoff": 190 },

  { "college": "Anna University - CEG", "course": "Information Technology", "community": "OC", "cutoff": 198.5 },
  { "college": "Anna University - CEG", "course": "Information Technology", "community": "BC", "cutoff": 198 },
  { "college": "Anna University - CEG", "course": "Information Technology", "community": "BCM", "cutoff": 197.5 },
  { "college": "Anna University - CEG", "course": "Information Technology", "community": "MBC", "cutoff": 197.5 },
  { "college": "Anna University - CEG", "course": "Information Technology", "community": "SC", "cutoff": 193.5 },
  { "college": "Anna University - CEG", "course": "Information Technology", "community": "ST", "cutoff": 193 },

  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "OC", "cutoff": 194.5 },
  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "BC", "cutoff": 192.5 },
  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 193.5 },
  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 192.5 },
  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "SC", "cutoff": 187 },
  { "college": "Anna University - CEG", "course": "Mechanical Engineering", "community": "ST", "cutoff": 184.5 },

  // PSG College of Technology
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "OC", "cutoff": 198.5 },
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "BC", "cutoff": 198 },
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "BCM", "cutoff": 196.5 },
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "MBC", "cutoff": 196 },
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "SC", "cutoff": 190 },
  { "college": "PSG College of Technology", "course": "Civil Engineering", "community": "ST", "cutoff": 181.5 },

  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 191.5 },
  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 190 },
  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 186.5 },
  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 187.5 },
  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 177 },
  { "college": "PSG College of Technology", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": null },

  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "OC", "cutoff": 198.5 },
  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "BC", "cutoff": 198 },
  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 196.5 },
  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 196.5 },
  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "SC", "cutoff": 188.5 },
  { "college": "PSG College of Technology", "course": "Computer Science Engineering", "community": "ST", "cutoff": null },

  { "college": "PSG College of Technology", "course": "Information Technology", "community": "OC", "cutoff": 196 },
  { "college": "PSG College of Technology", "course": "Information Technology", "community": "BC", "cutoff": 195.5 },
  { "college": "PSG College of Technology", "course": "Information Technology", "community": "BCM", "cutoff": 194 },
  { "college": "PSG College of Technology", "course": "Information Technology", "community": "MBC", "cutoff": 194.5 },
  { "college": "PSG College of Technology", "course": "Information Technology", "community": "SC", "cutoff": 186.5 },
  { "college": "PSG College of Technology", "course": "Information Technology", "community": "ST", "cutoff": 168 },

  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "OC", "cutoff": 197.5 },
  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "BC", "cutoff": 196.5 },
  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 195 },
  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 195 },
  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "SC", "cutoff": 188.5 },
  { "college": "PSG College of Technology", "course": "Mechanical Engineering", "community": "ST", "cutoff": 184 },

  { "college": "PSG College of Technology", "course": "EEE", "community": "OC", "cutoff": 193 },
  { "college": "PSG College of Technology", "course": "EEE", "community": "BC", "cutoff": 191 },
  { "college": "PSG College of Technology", "course": "EEE", "community": "BCM", "cutoff": 192 },
  { "college": "PSG College of Technology", "course": "EEE", "community": "MBC", "cutoff": 190 },
  { "college": "PSG College of Technology", "course": "EEE", "community": "SC", "cutoff": 179.5 },
  { "college": "PSG College of Technology", "course": "EEE", "community": "ST", "cutoff": 181 },

  // Thiagarajar College of Engineering
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "OC", "cutoff": 187 },
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "BC", "cutoff": 183 },
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "BCM", "cutoff": 184 },
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "MBC", "cutoff": 184 },
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "SC", "cutoff": 173.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Civil Engineering", "community": "ST", "cutoff": 151 },

  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 196.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 195.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 193.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 195 },
  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 188 },
  { "college": "Thiagarajar College of Engineering", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": null },

  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "OC", "cutoff": 195.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "BC", "cutoff": 195 },
  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 194.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 193 },
  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "SC", "cutoff": 187.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Computer Science Engineering", "community": "ST", "cutoff": 175.5 },

  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "OC", "cutoff": 192.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "BC", "cutoff": 191 },
  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "BCM", "cutoff": 189 },
  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "MBC", "cutoff": 190.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "SC", "cutoff": 179.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Information Technology", "community": "ST", "cutoff": null },

  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "OC", "cutoff": 193.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "BC", "cutoff": 191.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 191 },
  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 189.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "SC", "cutoff": 179.5 },
  { "college": "Thiagarajar College of Engineering", "course": "Mechanical Engineering", "community": "ST", "cutoff": 157.5 },

  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "OC", "cutoff": 188 },
  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "BC", "cutoff": 186 },
  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "BCM", "cutoff": 182.5 },
  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "MBC", "cutoff": 184 },
  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "SC", "cutoff": 169 },
  { "college": "Thiagarajar College of Engineering", "course": "EEE", "community": "ST", "cutoff": null },

  // Government College of Technology
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "OC", "cutoff": 182.5 },
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "BC", "cutoff": 175 },
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "BCM", "cutoff": 170.5 },
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "MBC", "cutoff": 174.5 },
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "SC", "cutoff": 173 },
  { "college": "Government College of Technology", "course": "Civil Engineering", "community": "ST", "cutoff": 157 },

  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 195.5 },
  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 194 },
  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 194 },
  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 193.5 },
  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 187 },
  { "college": "Government College of Technology", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": 189.5 },

  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "OC", "cutoff": 192.5 },
  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "BC", "cutoff": 191 },
  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 191.5 },
  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 191 },
  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "SC", "cutoff": 180.57 },
  { "college": "Government College of Technology", "course": "Computer Science Engineering", "community": "ST", "cutoff": null },

  { "college": "Government College of Technology", "course": "Information Technology", "community": "OC", "cutoff": 195 },
  { "college": "Government College of Technology", "course": "Information Technology", "community": "BC", "cutoff": 193.5 },
  { "college": "Government College of Technology", "course": "Information Technology", "community": "BCM", "cutoff": 193 },
  { "college": "Government College of Technology", "course": "Information Technology", "community": "MBC", "cutoff": 193 },
  { "college": "Government College of Technology", "course": "Information Technology", "community": "SC", "cutoff": 186.5 },
  { "college": "Government College of Technology", "course": "Information Technology", "community": "ST", "cutoff": 190.5 },

  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "OC", "cutoff": 186 },
  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "BC", "cutoff": 182 },
  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 179 },
  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 179 },
  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "SC", "cutoff": 168.5 },
  { "college": "Government College of Technology", "course": "Mechanical Engineering", "community": "ST", "cutoff": null },

  // MIT Campus - Anna University
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "OC", "cutoff": 196 },
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "BC", "cutoff": 193.5 },
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "BCM", "cutoff": 190.5 },
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "MBC", "cutoff": 194 },
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "SC", "cutoff": 191.5 },
  { "college": "MIT Campus - Anna University", "course": "Civil Engineering", "community": "ST", "cutoff": 168 },

  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "OC", "cutoff": 199 },
  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "BC", "cutoff": 198.5 },
  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "BCM", "cutoff": 198 },
  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "MBC", "cutoff": 197.5 },
  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "SC", "cutoff": 195.5 },
  { "college": "MIT Campus - Anna University", "course": "Electronics and Communication Engineering", "community": "ST", "cutoff": 194 },

  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "OC", "cutoff": 198 },
  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "BC", "cutoff": 197.5 },
  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "BCM", "cutoff": 197 },
  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "MBC", "cutoff": 197 },
  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "SC", "cutoff": 193.5 },
  { "college": "MIT Campus - Anna University", "course": "Computer Science Engineering", "community": "ST", "cutoff": 193.5 },

  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "OC", "cutoff": 198 },
  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "BC", "cutoff": 197.5 },
  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "BCM", "cutoff": 197 },
  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "MBC", "cutoff": 197 },
  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "SC", "cutoff": 193.5 },
  { "college": "MIT Campus - Anna University", "course": "Information Technology", "community": "ST", "cutoff": 193.5 },

  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "OC", "cutoff": 181.33 },
  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "BC", "cutoff": 173.5 },
  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "BCM", "cutoff": 172.5 },
  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "MBC", "cutoff": 171.5 },
  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "SC", "cutoff": 165 },
  { "college": "MIT Campus - Anna University", "course": "Mechanical Engineering", "community": "ST", "cutoff": null },

  // SSN College of Engineering
  { "college": "SSN College of Engineering", "course": "CSE", "community": "OC", "cutoff": 191 },
  { "college": "SSN College of Engineering", "course": "CSE", "community": "BC", "cutoff": 189 },
  { "college": "SSN College of Engineering", "course": "CSE", "community": "BCM", "cutoff": 190.5 },
  { "college": "SSN College of Engineering", "course": "CSE", "community": "MBC", "cutoff": 187 },
  { "college": "SSN College of Engineering", "course": "CSE", "community": "SC", "cutoff": 167 },
  { "college": "SSN College of Engineering", "course": "CSE", "community": "ST", "cutoff": null },

  { "college": "SSN College of Engineering", "course": "ECE", "community": "OC", "cutoff": 188.5 },
  { "college": "SSN College of Engineering", "course": "ECE", "community": "BC", "cutoff": 185 },
  { "college": "SSN College of Engineering", "course": "ECE", "community": "BCM", "cutoff": 188 },
  { "college": "SSN College of Engineering", "course": "ECE", "community": "MBC", "cutoff": 183 },
  { "college": "SSN College of Engineering", "course": "ECE", "community": "SC", "cutoff": 166.5 },
  { "college": "SSN College of Engineering", "course": "ECE", "community": "ST", "cutoff": null },

  { "college": "SSN College of Engineering", "course": "EEE", "community": "OC", "cutoff": 198.5 },
  { "college": "SSN College of Engineering", "course": "EEE", "community": "BC", "cutoff": 197.5 },
  { "college": "SSN College of Engineering", "course": "EEE", "community": "BCM", "cutoff": 197 },
  { "college": "SSN College of Engineering", "course": "EEE", "community": "MBC", "cutoff": 196.5 },
  { "college": "SSN College of Engineering", "course": "EEE", "community": "SC", "cutoff": 191.5 },
  { "college": "SSN College of Engineering", "course": "EEE", "community": "ST", "cutoff": 178 },

  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "OC", "cutoff": 197 },
  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "BC", "cutoff": 196 },
  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "BCM", "cutoff": 196.5 },
  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "MBC", "cutoff": 195 },
  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "SC", "cutoff": 189 },
  { "college": "SSN College of Engineering", "course": "Mechanical", "community": "ST", "cutoff": 170.5 },

  { "college": "SSN College of Engineering", "course": "Civil", "community": "OC", "cutoff": 195 },
  { "college": "SSN College of Engineering", "course": "Civil", "community": "BC", "cutoff": 194.5 },
  { "college": "SSN College of Engineering", "course": "Civil", "community": "BCM", "cutoff": 193.5 },
  { "college": "SSN College of Engineering", "course": "Civil", "community": "MBC", "cutoff": 192.5 },
  { "college": "SSN College of Engineering", "course": "Civil", "community": "SC", "cutoff": 182 },
  { "college": "SSN College of Engineering", "course": "Civil", "community": "ST", "cutoff": 168.5 },

  { "college": "SSN College of Engineering", "course": "IT", "community": "OC", "cutoff": 192 },
  { "college": "SSN College of Engineering", "course": "IT", "community": "BC", "cutoff": 190.5 },
  { "college": "SSN College of Engineering", "course": "IT", "community": "BCM", "cutoff": 190 },
  { "college": "SSN College of Engineering", "course": "IT", "community": "MBC", "cutoff": 189.5 },
  { "college": "SSN College of Engineering", "course": "IT", "community": "SC", "cutoff": 175.5 },
  { "college": "SSN College of Engineering", "course": "IT", "community": "ST", "cutoff": 159.5 }
]

function normalizeName(name) {
  return name.toLowerCase().trim()
}

function normalizeCourseName(course) {
  if (!course || typeof course !== 'string') return course
  const normalized = course.trim()
  
  // Normalize common course name variations
  const courseMappings = {
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
    'civil engineering': 'Civil Engineering'
  }
  
  return courseMappings[normalized.toLowerCase()] || normalized
}

async function findInstitutionByAlias(institutions, alias) {
  const normalizedAlias = normalizeName(alias)
  return institutions.find(inst => {
    const normalizedName = normalizeName(inst.name)
    // More flexible matching for common variations
    if (normalizedAlias.includes('psg') && normalizedName.includes('psg')) return true
    if (normalizedAlias.includes('thiagarajar') && normalizedName.includes('thiagarajar')) return true
    if (normalizedAlias.includes('anna university') && normalizedName.includes('anna university')) return true
    if (normalizedAlias.includes('government college') && normalizedName.includes('government college')) return true
    if (normalizedAlias.includes('mit campus') && normalizedName.includes('mit campus')) return true
    if (normalizedAlias.includes('ssn') && normalizedName.includes('ssn')) return true
    
    return normalizedName.includes(normalizedAlias) || normalizedAlias.includes(normalizedName)
  })
}

async function upsertCutoffs(db, institution, entries, year = 2024) {
  const col = db.collection('institutions')
  const existing = Array.isArray(institution.cutoffs) ? institution.cutoffs : []
  const makeKey = (o) => `${o.year}|${o.course}|${o.category}`

  const transformed = entries.map(entry => ({
    year,
    course: normalizeCourseName(entry.course),
    category: entry.community,
    cutoff: entry.cutoff == null ? null : Number(entry.cutoff)
  }))

  const mergedMap = new Map(existing.map(x => [makeKey(x), x]))
  for (const t of transformed) {
    mergedMap.set(makeKey(t), t)
  }
  const merged = Array.from(mergedMap.values())

  await col.updateOne({ id: institution.id }, { $set: { cutoffs: merged } })
  return { added: transformed.length, total: merged.length }
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGODB_DB || 'nextstep'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const db = client.db(dbName)
    const col = db.collection('institutions')

    console.log('Starting cutoff data import...')
    console.log(`Total cutoff entries to import: ${cutoffData.length}`)

    // Get all institutions
    const institutions = await col.find({}).toArray()
    console.log(`Found ${institutions.length} institutions in database`)

    // Group cutoff data by college
    const cutoffByCollege = {}
    for (const entry of cutoffData) {
      if (!cutoffByCollege[entry.college]) {
        cutoffByCollege[entry.college] = []
      }
      cutoffByCollege[entry.college].push(entry)
    }

    console.log(`Processing ${Object.keys(cutoffByCollege).length} colleges...`)

    let totalProcessed = 0
    let totalAdded = 0

    for (const [collegeName, entries] of Object.entries(cutoffByCollege)) {
      const institution = await findInstitutionByAlias(institutions, collegeName)
      
      if (!institution) {
        console.log(`⚠️  Institution not found: ${collegeName}`)
        continue
      }

      console.log(`Processing ${institution.name} (${entries.length} entries)...`)
      
      const result = await upsertCutoffs(db, institution, entries)
      totalProcessed++
      totalAdded += result.added
      
      console.log(`  ✅ Added ${result.added} cutoffs, total now: ${result.total}`)
    }

    console.log('\n📊 Import Summary:')
    console.log(`- Colleges processed: ${totalProcessed}`)
    console.log(`- Total cutoff entries added: ${totalAdded}`)
    console.log(`- Total cutoff entries in data: ${cutoffData.length}`)

    // Verify the import
    const totalCutoffsInDb = await col.aggregate([
      { $unwind: { path: '$cutoffs', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]).toArray()

    const totalCutoffs = totalCutoffsInDb[0]?.total || 0
    console.log(`- Total cutoff entries in database: ${totalCutoffs}`)

    if (totalAdded > 0) {
      console.log('\n✅ Cutoff data import completed successfully!')
      console.log('The new data should now be visible in the frontend.')
    } else {
      console.log('\n⚠️  No new cutoff data was added. Please check the college names.')
    }

  } catch (error) {
    console.error('Error importing cutoff data:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error('Script failed:', e)
  process.exit(1)
})
