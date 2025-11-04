'use client'

import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { useAuth } from '../../components/AuthContext'
import { useRouter } from 'next/navigation'

export default function ChoicesPage() {
  const { user, addDownloadRecord, addChoiceList } = useAuth()
  const router = useRouter()
  const [selectedChoices, setSelectedChoices] = useState([])
  const [isLocked, setIsLocked] = useState(false)
  const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
  const [dragIndex, setDragIndex] = useState(null)
  

  useEffect(() => {
    if (!user) {
      try { alert('Please login to access your choices.'); } catch {}
      router.push('/login?redirect=/choices')
      return
    }
    if (!user.profile?.community) {
      try { alert('Please fill your profile (community) to continue.'); } catch {}
      router.push('/profile?require=community')
      return
    }

    // If coming from profile with a saved list, load it
    try {
      const payload = sessionStorage.getItem('ns-active-choice-list')
      if (payload) {
        const parsed = JSON.parse(payload)
        if (Array.isArray(parsed?.items)) {
          const normalized = parsed.items.map((c, idx) => ({ ...c, priority: idx + 1 }))
          setSelectedChoices(normalized)
          sessionStorage.removeItem('ns-active-choice-list')
          // Also clear lock to allow viewing/re-ordering until explicitly re-locked
          localStorage.removeItem(`${keyPrefix}mock-choices-locked`)
          setIsLocked(false)
          return
        }
      }
    } catch {}

    // Migrate legacy global keys to per-user keys (one-time)
    const legacyChoices = localStorage.getItem('tnea-mock-choices')
    const legacyLocked = localStorage.getItem('tnea-mock-choices-locked')
    const perUserChoicesKey = `${keyPrefix}mock-choices`
    const perUserLockedKey = `${keyPrefix}mock-choices-locked`
    if (legacyChoices && !localStorage.getItem(perUserChoicesKey)) {
      localStorage.setItem(perUserChoicesKey, legacyChoices)
    }
    if (legacyLocked && !localStorage.getItem(perUserLockedKey)) {
      localStorage.setItem(perUserLockedKey, legacyLocked)
    }
    // Clean up legacy to avoid cross-account leakage
    localStorage.removeItem('tnea-mock-choices')
    localStorage.removeItem('tnea-mock-choices-locked')

    const saved = localStorage.getItem(perUserChoicesKey)
    setSelectedChoices(saved ? JSON.parse(saved) : [])
    const locked = localStorage.getItem(perUserLockedKey)
    setIsLocked(locked === 'true')
  }, [user])

  const saveChoices = (choices) => {
    localStorage.setItem(`${keyPrefix}mock-choices`, JSON.stringify(choices))
    setSelectedChoices(choices)
  }

  const removeFromChoices = (choiceId) => {
    const updatedChoices = selectedChoices
      .filter(choice => choice.id !== choiceId)
      .map((choice, index) => ({ ...choice, priority: index + 1 }))
    saveChoices(updatedChoices)
  }

  const moveChoiceUp = (index) => {
    if (index === 0) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index - 1]
    newChoices[index - 1] = temp
    const updatedChoices = newChoices.map((choice, idx) => ({ ...choice, priority: idx + 1 }))
    saveChoices(updatedChoices)
  }

  const moveChoiceDown = (index) => {
    if (index === selectedChoices.length - 1) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index + 1]
    newChoices[index + 1] = temp
    const updatedChoices = newChoices.map((choice, idx) => ({ ...choice, priority: idx + 1 }))
    saveChoices(updatedChoices)
  }

  const handleDragStart = (index) => {
    if (isLocked) return
    setDragIndex(index)
  }

  const handleDragOver = (e) => {
    if (isLocked) return
    e.preventDefault()
  }

  const handleDrop = (index) => {
    if (isLocked) return
    if (dragIndex === null || dragIndex === index) return
    const reordered = Array.from(selectedChoices)
    const [removed] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, removed)
    const updatedChoices = reordered.map((choice, idx) => ({ ...choice, priority: idx + 1 }))
    saveChoices(updatedChoices)
    setDragIndex(null)
  }

  const lockChoices = () => {
    try {
      const ok = confirm('After locking, you cannot add, remove, reorder, or edit your choices. Proceed?')
      if (!ok) return
    } catch {}
    localStorage.setItem(`${keyPrefix}mock-choices-locked`, 'true')
    setIsLocked(true)
    // Save snapshot to profile choice lists
    try {
      const snapshot = {
        name: `Choices (${new Date().toLocaleDateString()})`,
        items: selectedChoices,
        lockedAt: new Date().toISOString(),
      }
      addChoiceList(snapshot)
      try { alert('Choices locked and saved to your profile.'); } catch {}
    } catch {}
  }

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 36
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFillColor(37, 99, 235) // blue-600
    doc.rect(0, 0, pageWidth, 70, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('NextStep', margin, 42)
    doc.setFontSize(12)
    doc.text('My Choices List', margin, 60)

    // Sub header
    doc.setTextColor(75, 85, 99) // gray-600
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 90)

    // Table header
    const columns = [
      { key: 'order', title: 'Order', width: 50 },
      { key: 'code', title: 'Code', width: 70 },
      { key: 'college', title: 'College Name', width: pageWidth - margin * 2 - 50 - 70 - 120 },
      { key: 'branch', title: 'Branch', width: 120 },
    ]

    let y = 110
    doc.setFillColor(243, 244, 246) // gray-100
    doc.rect(margin, y, pageWidth - margin * 2, 28, 'F')
    doc.setTextColor(55, 65, 81) // gray-700
    doc.setFontSize(11)

    let x = margin
    columns.forEach((c) => {
      doc.text(c.title, x + 6, y + 18)
      x += c.width
    })

    // Rows
    y += 32
    doc.setFontSize(10)
    doc.setTextColor(17, 24, 39) // gray-900

    const rowHeight = 18
    const drawRow = (row) => {
      let rx = margin
      // Order
      doc.text(String(row.order), rx + 6, y + 12)
      rx += columns[0].width
      // Code
      doc.text(row.code, rx + 6, y + 12)
      rx += columns[1].width
      // College (wrap)
      const collegeLines = doc.splitTextToSize(row.college, columns[2].width - 12)
      // Branch (wrap)
      const branchLines = doc.splitTextToSize(row.branch, columns[3].width - 12)
      const lines = Math.max(collegeLines.length, branchLines.length)
      const h = Math.max(rowHeight, lines * 12 + 8)
      // Background stripe
      doc.setDrawColor(229, 231, 235)
      doc.rect(margin, y, pageWidth - margin * 2, h)

      // College
      doc.text(collegeLines, rx + 6, y + 12)
      rx += columns[2].width
      // Branch
      doc.text(branchLines, rx + 6, y + 12)

      y += h
    }

    selectedChoices.forEach((choice, index) => {
      if (y > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage()
        y = 60
      }
      drawRow({
        order: index + 1,
        code: String(choice.college.collegeCode),
        college: choice.college.name,
        branch: choice.course,
      })
    })

    // Also store the PDF as a data URL so it can be opened from profile
    const dataUrl = doc.output('datauristring')
    const filename = 'nextstep-choices.pdf'
    doc.save(filename)
    addDownloadRecord({ title: 'NextStep Choices PDF', type: 'choices_pdf', filename, data: dataUrl })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">My Choices List</h1>
            <span className="text-blue-500 text-lg">?</span>
          </div>
           <div className="flex items-center space-x-3">
            <span className="text-sm text-green-600 font-medium flex items-center space-x-1">
              <span>✓</span>
              <span>Changes are auto saved.</span>
            </span>
            <button
              onClick={() => router.push('/mock')}
              disabled={isLocked}
              className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 ${isLocked ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              + Add more choice.
            </button>
            <button
              onClick={() => {
                try {
                  if (!confirm('This will clear all your choices and unlock. Start fresh?')) return
                } catch {}
                // Clear per-user keys to reset
                localStorage.removeItem(`${keyPrefix}mock-choices`)
                localStorage.removeItem(`${keyPrefix}mock-choices-locked`)
                setSelectedChoices([])
                setIsLocked(false)
              }}
              className="text-sm px-3 py-2 rounded-md transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white"
            >
              Clear all choices
            </button>
            <button onClick={lockChoices} disabled={isLocked} className={`text-sm px-3 py-2 rounded-md transition-colors duration-200 ${isLocked ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              {isLocked ? 'Locked' : '🔒 Lock my choices.'}
            </button>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${isLocked ? 'opacity-80 select-none' : ''}`}>
          <div className="w-full">
            <div className="hidden md:grid grid-cols-12 bg-gray-50 border-b text-sm font-medium text-gray-700">
                <div className="col-span-2 px-4 py-3 text-left">Choice order</div>
                <div className="col-span-2 px-4 py-3 text-left">College Code</div>
                <div className="col-span-4 px-4 py-3 text-left">College Name</div>
                <div className="col-span-2 px-4 py-3 text-left">Branch Name</div>
                <div className="col-span-2 px-4 py-3 text-center">Action</div>
            </div>
            <div className="divide-y divide-gray-200">
              {selectedChoices.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">No choices added yet. Go to Mock page to add choices.</div>
              ) : (
                selectedChoices.map((choice, index) => (
                  <div
                    key={choice.id}
                    draggable={!isLocked}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={`grid grid-cols-12 items-center bg-white hover:bg-gray-50 ${isLocked ? '' : 'cursor-move'}`}
                  >
                    <div className="col-span-2 px-4 py-3 text-sm text-gray-900">{choice.priority}</div>
                    <div className="col-span-2 px-4 py-3 text-sm text-gray-900">{choice.college.collegeCode}</div>
                    <div className="col-span-4 px-4 py-3 text-sm text-gray-900 truncate" title={choice.college.name}>{choice.college.name}</div>
                    <div className="col-span-2 px-4 py-3 text-sm text-gray-900">{choice.course}</div>
                    <div className="col-span-2 px-4 py-3">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => moveChoiceUp(index)}
                          disabled={isLocked || index === 0}
                          title={isLocked ? 'Locked' : ''}
                          className={`p-1 rounded ${isLocked || index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveChoiceDown(index)}
                          disabled={isLocked || index === selectedChoices.length - 1}
                          title={isLocked ? 'Locked' : ''}
                          className={`p-1 rounded ${isLocked || index === selectedChoices.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeFromChoices(choice.id)}
                          disabled={isLocked}
                          title={isLocked ? 'Locked' : ''}
                          className={`p-1 rounded transition-colors duration-200 ${isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={exportToPDF} className="px-4 py-2 text-sm bg-gray-800 hover:bg-black text-white rounded-md transition-colors duration-200">Download PDF</button>
          <button
            onClick={() => router.push('/mock')}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Done
          </button>
        </div>

        
      </div>
    </div>
  )
}


