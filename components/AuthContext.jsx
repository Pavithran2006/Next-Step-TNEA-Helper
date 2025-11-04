'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  user: 'ns-user',
  users: 'ns-users',
}

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [cutoffHistory, setCutoffHistory] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])
  const [choiceLists, setChoiceLists] = useState([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user)
      if (storedUser) {
        const session = JSON.parse(storedUser)
        if (session?.email) session.email = normalizeEmail(session.email)
        // Sync from users store to ensure we have latest persisted profile
        const usersRaw = localStorage.getItem(STORAGE_KEYS.users)
        const users = usersRaw ? JSON.parse(usersRaw) : []
        const persisted = users.find((u) => normalizeEmail(u.email) === normalizeEmail(session.email))
        const effective = persisted ? sanitizeUser(persisted) : session
        setUser(effective)
        setWishlist(effective.wishlist || [])
        setCutoffHistory(effective.cutoffHistory || [])
        setDownloadHistory(effective.downloadHistory || [])
        setChoiceLists(effective.choiceLists || [])
        if (!persisted && session?.email) {
          // Backfill users store if missing
          const backfill = sanitizePersistUser(session)
          localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([...users, backfill]))
        }
      }
    } catch (e) {
      console.error('Auth load failed', e)
    }
  }, [])

  const sanitizeUser = (stored) => ({
    email: normalizeEmail(stored.email),
    name: stored.name || stored.email?.split('@')[0] || 'User',
    wishlist: stored.wishlist || [],
    cutoffHistory: stored.cutoffHistory || [],
    downloadHistory: stored.downloadHistory || [],
    choiceLists: stored.choiceLists || [],
    profile: {
      name: stored.profile?.name ?? stored.name ?? '',
      age: stored.profile?.age ?? '',
      school: stored.profile?.school ?? '',
      details: stored.profile?.details ?? '',
      community: stored.profile?.community ?? '',
    }
  })

  const sanitizePersistUser = (sessionUser) => ({
    email: normalizeEmail(sessionUser.email),
    password: sessionUser.password || '',
    name: sessionUser.name || '',
    wishlist: sessionUser.wishlist || [],
    cutoffHistory: sessionUser.cutoffHistory || [],
    downloadHistory: sessionUser.downloadHistory || [],
    choiceLists: sessionUser.choiceLists || [],
    profile: sessionUser.profile || { name: sessionUser.name || '', age: '', school: '', details: '', community: '' },
  })

  const persistUser = (u) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u))
  }

  const writeUsersStore = (updater) => {
    const usersRaw = localStorage.getItem(STORAGE_KEYS.users)
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const next = updater(users)
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(next))
    return next
  }

  const addToWishlist = (college) => {
    if (!user) return false
    const exists = wishlist.some((c) => c.id === college.id)
    if (exists) return true
    const updated = [...wishlist, college]
    setWishlist(updated)
    const updatedUser = { ...user, wishlist: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    // persist to users store
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], wishlist: updated }
        return copy
      }
      return users
    })
    return true
  }

  const removeFromWishlist = (collegeId) => {
    if (!user) return
    const updated = wishlist.filter((c) => c.id !== collegeId)
    setWishlist(updated)
    const updatedUser = { ...user, wishlist: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => u.email === user.email)
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], wishlist: updated }
        return copy
      }
      return users
    })
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If backend fails, fall back to localStorage
        console.log('Backend login failed, falling back to localStorage')
        return loginLocalStorage(email, password)
      }

      // Merge with any locally stored user details to preserve profile across sessions
      const usersRaw = localStorage.getItem(STORAGE_KEYS.users)
      const usersArr = usersRaw ? JSON.parse(usersRaw) : []
      const persisted = usersArr.find((u) => normalizeEmail(u.email) === normalizeEmail(data.user?.email))
      const pickField = (apiVal, persistedVal) => {
        return apiVal != null && apiVal !== '' ? apiVal : (persistedVal != null ? persistedVal : '')
      }
      const pickArray = (apiArr, persistedArr) => {
        return Array.isArray(apiArr) && apiArr.length > 0 ? apiArr : (Array.isArray(persistedArr) ? persistedArr : [])
      }
      const merged = {
        ...data.user,
        // Prefer non-empty API arrays else keep local
        wishlist: pickArray(data.user?.wishlist, persisted?.wishlist),
        cutoffHistory: pickArray(data.user?.cutoffHistory, persisted?.cutoffHistory),
        downloadHistory: pickArray(data.user?.downloadHistory, persisted?.downloadHistory),
        profile: {
          name: pickField(data.user?.profile?.name, persisted?.profile?.name ?? data.user?.name),
          age: pickField(data.user?.profile?.age, persisted?.profile?.age),
          school: pickField(data.user?.profile?.school, persisted?.profile?.school),
          details: pickField(data.user?.profile?.details, persisted?.profile?.details),
          community: pickField(data.user?.profile?.community, persisted?.profile?.community),
        },
      }
      const sessionUser = sanitizeUser(merged)
      setUser(sessionUser)
      setWishlist(sessionUser.wishlist || [])
      setCutoffHistory(sessionUser.cutoffHistory || [])
      setDownloadHistory(sessionUser.downloadHistory || [])
      setChoiceLists(sessionUser.choiceLists || [])
      persistUser(sessionUser)

      // Persist merged user back to local users store
      writeUsersStore((arr) => {
        const idx = arr.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(sessionUser.email))
        const toStore = sanitizePersistUser({ ...persisted, ...merged })
        if (idx >= 0) {
          const copy = arr.slice()
          copy[idx] = toStore
          return copy
        }
        return [...arr, toStore]
      })
      
      // Store token for future API calls
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
      }
      
      // Clear legacy global mock choice keys to avoid cross-account leakage
      try {
        localStorage.removeItem('tnea-mock-choices')
        localStorage.removeItem('tnea-mock-choices-locked')
      } catch {}

      return true
    } catch (error) {
      // If network error, fall back to localStorage
      console.log('Network error, falling back to localStorage')
      return loginLocalStorage(email, password)
    }
  }

  const loginLocalStorage = (email, password) => {
    const usersRaw = localStorage.getItem(STORAGE_KEYS.users)
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const found = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email))
    if (!found || found.password !== password) throw new Error('Invalid credentials')
    const sessionUser = sanitizeUser(found)
    setUser(sessionUser)
    setWishlist(sessionUser.wishlist || [])
    setCutoffHistory(sessionUser.cutoffHistory || [])
    setDownloadHistory(sessionUser.downloadHistory || [])
    setWishlist(sessionUser.wishlist || [])
    setCutoffHistory(sessionUser.cutoffHistory || [])
    setDownloadHistory(sessionUser.downloadHistory || [])
    persistUser(sessionUser)
    return true
  }

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If backend fails, fall back to localStorage
        console.log('Backend signup failed, falling back to localStorage')
        return signupLocalStorage(name, email, password)
      }

      const sessionUser = sanitizeUser(data.user)
      setUser(sessionUser)
      setWishlist([])
      setCutoffHistory([])
      persistUser(sessionUser)
      
      // Store token for future API calls
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
      }
      
      return true
    } catch (error) {
      // If network error, fall back to localStorage
      console.log('Network error, falling back to localStorage')
      return signupLocalStorage(name, email, password)
    }
  }

  const signupLocalStorage = (name, email, password) => {
    const usersRaw = localStorage.getItem(STORAGE_KEYS.users)
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const exists = users.some((u) => normalizeEmail(u.email) === normalizeEmail(email))
    if (exists) throw new Error('User already exists')
    const newUser = {
      email,
      password,
      name,
      wishlist: [],
      profile: { name: name || '', age: '', school: '', details: '', community: '' },
    }
    const updated = [...users, newUser]
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(updated))
    // Auto login after signup with sanitized session
    const sessionUser = sanitizeUser(newUser)
    setUser(sessionUser)
    setWishlist([])
    setCutoffHistory([])
    setDownloadHistory([])
    persistUser(sessionUser)
    return true
  }

  const updateProfile = (profileUpdates) => {
    if (!user) return
    const nextProfile = {
      name: profileUpdates.name ?? user.profile?.name ?? '',
      age: profileUpdates.age ?? user.profile?.age ?? '',
      school: profileUpdates.school ?? user.profile?.school ?? '',
      details: profileUpdates.details ?? user.profile?.details ?? '',
      community: profileUpdates.community ?? user.profile?.community ?? '',
    }
    const updatedUser = { ...user, name: nextProfile.name || user.name, profile: nextProfile }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], name: nextProfile.name || copy[idx].name, profile: nextProfile }
        return copy
      }
      return users
    })
    return true
  }

  const addCutoffRecord = (record) => {
    if (!user) return false
    const newRecord = {
      id: `${Date.now()}`,
      value: typeof record.value === 'number' ? record.value : Number(record.value) || 0,
      marks: record.marks || null,
      createdAt: new Date().toISOString(),
    }
    const updated = [newRecord, ...(cutoffHistory || [])].slice(0, 20)
    setCutoffHistory(updated)
    const updatedUser = { ...user, cutoffHistory: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], cutoffHistory: updated }
        return copy
      }
      return users
    })
    return true
  }

  const removeCutoffRecord = (id) => {
    if (!user) return
    const updated = (cutoffHistory || []).filter((r) => r.id !== id)
    setCutoffHistory(updated)
    const updatedUser = { ...user, cutoffHistory: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], cutoffHistory: updated }
        return copy
      }
      return users
    })
  }

  const addDownloadRecord = (record) => {
    if (!user) return false
    const newRecord = {
      id: `${Date.now()}`,
      title: record.title || 'Document',
      type: record.type || 'document',
      filename: record.filename || null,
      data: record.data || null,
      createdAt: new Date().toISOString(),
    }
    const updated = [newRecord, ...(downloadHistory || [])].slice(0, 50)
    setDownloadHistory(updated)
    const updatedUser = { ...user, downloadHistory: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], downloadHistory: updated }
        return copy
      }
      return users
    })
    return true
  }

  const removeDownloadRecord = (id) => {
    if (!user) return
    const updated = (downloadHistory || []).filter((r) => r.id !== id)
    setDownloadHistory(updated)
    const updatedUser = { ...user, downloadHistory: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], downloadHistory: updated }
        return copy
      }
      return users
    })
  }

  const logout = () => {
    setUser(null)
    setWishlist([])
    setCutoffHistory([])
    setDownloadHistory([])
    setChoiceLists([])
    localStorage.removeItem(STORAGE_KEYS.user)
    localStorage.removeItem('auth-token')
    // Do not clear per-user namespaced data here; it stays isolated by key
    if (pathname && pathname.startsWith('/profile')) {
      router.push('/')
    }
  }

  const addChoiceList = (snapshot) => {
    if (!user) return false
    const id = snapshot.id || `${Date.now()}`
    const entry = {
      id,
      name: snapshot.name || `Choice List ${new Date().toLocaleString()}`,
      items: Array.isArray(snapshot.items) ? snapshot.items : [],
      lockedAt: snapshot.lockedAt || new Date().toISOString(),
      count: snapshot.items ? snapshot.items.length : 0,
    }
    const updated = [entry, ...(choiceLists || [])]
    setChoiceLists(updated)
    const updatedUser = { ...user, choiceLists: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], choiceLists: updated }
        return copy
      }
      return users
    })
    return id
  }

  const removeChoiceList = (id) => {
    if (!user) return
    const updated = (choiceLists || []).filter((l) => l.id !== id)
    setChoiceLists(updated)
    const updatedUser = { ...user, choiceLists: updated }
    setUser(updatedUser)
    persistUser(updatedUser)
    writeUsersStore((users) => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(user.email))
      if (idx >= 0) {
        const copy = users.slice()
        copy[idx] = { ...copy[idx], choiceLists: updated }
        return copy
      }
      return users
    })
  }

  const value = useMemo(() => ({
    user,
    wishlist,
    cutoffHistory,
    downloadHistory,
    choiceLists,
    setUser,
    addToWishlist,
    removeFromWishlist,
    login,
    signup,
    logout,
    updateProfile,
    addCutoffRecord,
    removeCutoffRecord,
    addDownloadRecord,
    removeDownloadRecord,
    addChoiceList,
    removeChoiceList,
  }), [user, wishlist, cutoffHistory, downloadHistory, choiceLists])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


