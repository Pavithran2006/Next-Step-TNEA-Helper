'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../components/AuthContext'

export default function ProfilePage() {
  const { user, wishlist, removeFromWishlist, logout, updateProfile, cutoffHistory, removeCutoffRecord, downloadHistory, removeDownloadRecord } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ name: '', age: '', school: '', details: '', community: '' })
  const [saved, setSaved] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/profile')
    }
  }, [user])

  useEffect(() => {
    const requireField = searchParams?.get('require')
    if (requireField) {
      setIsEditing(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      setForm({
        name: user.profile?.name || user.name || '',
        age: user.profile?.age || '',
        school: user.profile?.school || '',
        details: user.profile?.details || '',
        community: user.profile?.community || '',
      })
    }
  }, [user])

  if (!user) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(form)
    setSaved('Saved!')
    setTimeout(() => setSaved(''), 1500)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form to current persisted values and exit edit mode
    if (user) {
      setForm({
        name: user.profile?.name || user.name || '',
        age: user.profile?.age || '',
        school: user.profile?.school || '',
        details: user.profile?.details || '',
        community: user.profile?.community || '',
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>
        <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              className={`px-3 py-2 rounded-lg border transition pointer-events-auto ${isEditing ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-200 hover:shadow'}`}
              title={isEditing ? 'Cancel' : 'Edit'}
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => {
                try { if (!confirm('Are you sure you want to logout?')) return } catch {}
                logout()
                try { window?.scrollTo?.(0, 0) } catch {}
                // Force navigation away from profile to avoid any stuck state
                try { router.push('/') } catch {}
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 pointer-events-auto"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="glass-effect rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
          {isEditing ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input name="age" value={form.age} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input name="school" value={form.school} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About / Details</label>
                <textarea name="details" value={form.details} onChange={handleChange} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                <select name="community" value={form.community} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Select your community</option>
                  <option value="OC">OC</option>
                  <option value="BC">BC</option>
                  <option value="MBC">MBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                {saved && <span className="text-green-700 text-sm">{saved}</span>}
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium text-gray-900">{form.name || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Age</div>
                <div className="font-medium text-gray-900">{form.age || '—'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">School</div>
                <div className="font-medium text-gray-900">{form.school || '—'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">About / Details</div>
                <div className="font-medium text-gray-900 whitespace-pre-wrap">{form.details || '—'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Community</div>
                <div className="font-medium text-gray-900">{form.community || '—'}</div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-effect rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="text-gray-600">
              Your wishlist is empty. Go to <Link href="/explorer" className="text-blue-600 hover:underline">College Explorer</Link> to add colleges.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.location} • {c.type}</div>
                  </div>
                  <button onClick={() => removeFromWishlist(c.id)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect rounded-2xl shadow-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Cutoffs</h2>
          {(!cutoffHistory || cutoffHistory.length === 0) ? (
            <div className="text-gray-600">No saved cutoffs yet. Calculate on the Cutoff page and click Save to Profile.</div>
          ) : (
            <div className="space-y-3">
              {cutoffHistory.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Saved on</div>
                    <div className="font-medium text-gray-900">{new Date(r.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-700 mt-1">Cutoff: <span className="font-semibold">{Number(r.value).toFixed(2)}</span></div>
                    {r.marks && (
                      <div className="text-xs text-gray-500 mt-1">M: {r.marks.maths || 0}, P: {r.marks.physics || 0}, C: {r.marks.chemistry || 0}</div>
                    )}
                  </div>
                  <button onClick={() => removeCutoffRecord(r.id)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect rounded-2xl shadow-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Downloads</h2>
          {(!downloadHistory || downloadHistory.length === 0) ? (
            <div className="text-gray-600">No downloads yet. Use Download PDF in Choices to save your list.</div>
          ) : (
            <div className="space-y-3">
              {downloadHistory.map((d) => (
                <div key={d.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{d.title || 'Document'}</div>
                    <div className="text-sm text-gray-600">{new Date(d.createdAt).toLocaleString()} • {d.type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {d.data && (
                      <a href={d.data} download={d.filename || 'document.pdf'} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md">Open</a>
                    )}
                    <button onClick={() => removeDownloadRecord(d.id)} className="text-red-600 hover:text-red-800">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


