import { NextResponse } from 'next/server'
import { getDb } from '../db/mongodb'
 

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const include = searchParams.get('include') || 'both' // colleges | cutoffs | both
  try {
    const db = await getDb()
    const col = db.collection('institutions')
    // Data model: documents may contain college fields and/or cutoffs array
    // e.g., { id, name, location, type, nirfRank, autonomy, transportation, courses, website, cutoffs: [...] }
    const normalizeCourseName = (name) => {
      if (!name || typeof name !== 'string') return name
      const n = name.trim().toLowerCase()
      // Normalize common CSE variants to a single label
      if (
        n === 'computer science engineering' ||
        n === 'computer science enginnering' ||
        n === 'computer science & engineering' ||
        n === 'cse' ||
        n === 'computer science and engineering'
      ) {
        return 'Computer Science and Engineering'
      }
      return name
    }

    const docs = await col.find({}).toArray()
    let data = docs.map(d => {
      const { _id, courses, cutoffs, ...rest } = d
      const normalizedCourses = Array.isArray(courses)
        ? courses.map(normalizeCourseName)
        : courses
      const normalizedCutoffs = Array.isArray(cutoffs)
        ? cutoffs.map(c => ({ ...c, course: normalizeCourseName(c.course) }))
        : cutoffs
      return { ...rest, id: d.id, courses: normalizedCourses, cutoffs: normalizedCutoffs }
    })
    if (include === 'colleges') {
      data = data.map(({ cutoffs, ...rest }) => rest)
    } else if (include === 'cutoffs') {
      data = data.flatMap((d) => (d.cutoffs ? d.cutoffs.map((c) => ({ ...c, collegeId: d.id })) : []))
    }
    return NextResponse.json({ ok: true, data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 })
  }
}


