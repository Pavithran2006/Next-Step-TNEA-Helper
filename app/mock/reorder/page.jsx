'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../components/AuthContext'

export default function ReorderChoices() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedChoices, setSelectedChoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/mock/reorder')
      return
    }
    loadSavedChoices()
  }, [])

  const loadSavedChoices = () => {
    const saved = localStorage.getItem('tnea-mock-choices')
    if (saved) {
      setSelectedChoices(JSON.parse(saved))
    }
    setLoading(false)
  }

  const saveChoices = (choices) => {
    localStorage.setItem('tnea-mock-choices', JSON.stringify(choices))
    setSelectedChoices(choices)
  }

  const moveChoiceUp = (index) => {
    if (index === 0) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index - 1]
    newChoices[index - 1] = temp

    const updatedChoices = newChoices.map((choice, idx) => ({
      ...choice,
      priority: idx + 1
    }))
    saveChoices(updatedChoices)
  }

  const moveChoiceDown = (index) => {
    if (index === selectedChoices.length - 1) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index + 1]
    newChoices[index + 1] = temp

    const updatedChoices = newChoices.map((choice, idx) => ({
      ...choice,
      priority: idx + 1
    }))
    saveChoices(updatedChoices)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'reorder-list' && destination.droppableId === 'reorder-list') {
      const reorderedChoices = Array.from(selectedChoices)
      const [removed] = reorderedChoices.splice(source.index, 1)
      reorderedChoices.splice(destination.index, 0, removed)

      const updatedChoices = reorderedChoices.map((choice, index) => ({
        ...choice,
        priority: index + 1
      }))

      saveChoices(updatedChoices)
    }
  }

  const removeFromChoices = (choiceId) => {
    const updatedChoices = selectedChoices
      .filter(choice => choice.id !== choiceId)
      .map((choice, index) => ({ ...choice, priority: index + 1 }))
    saveChoices(updatedChoices)
  }

  const goBack = () => {
    router.push('/mock')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading choices...</p>
        </div>
      </div>
    )
  }

  if (selectedChoices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Choices Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't selected any choices yet. Please go back and select some colleges first.
            </p>
            <button
              onClick={goBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Go Back to Mock Choice Filling
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Mock Choice Filling</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Reorder My Choices</h1>
              <p className="text-gray-600 mt-2">
                Drag and drop to reorder your choices or use the up/down arrows
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">✓</span>
              <span className="text-sm text-green-600 font-medium">Changes are auto saved.</span>
            </div>
          </div>
        </div>

        {/* Reorder Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="reorder-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-6"
                >
                  <div className="space-y-4">
                    {selectedChoices.map((choice, index) => (
                      <Draggable
                        key={choice.id}
                        draggableId={choice.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 transition-all duration-200 ${
                              snapshot.isDragging
                                ? 'border-blue-500 shadow-lg bg-blue-50 scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex items-center space-x-4 cursor-grab active:cursor-grabbing"
                            >
                              <div className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                              </div>
                              <span className="bg-blue-600 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[50px] text-center">
                                #{choice.priority}
                              </span>
                            </div>

                            {/* Choice Details */}
                            <div className="flex-1 mx-6">
                              <div className="font-semibold text-gray-900 text-lg">
                                {choice.college.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Course:</span> {choice.course}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Code:</span> {choice.college.collegeCode} •
                                <span className="font-medium ml-2">Location:</span> {choice.college.location}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              {/* Move Up Button */}
                              <button
                                onClick={() => moveChoiceUp(index)}
                                disabled={index === 0}
                                className={`p-2 rounded-md transition-colors duration-200 ${
                                  index === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                                title="Move Up"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>

                              {/* Move Down Button */}
                              <button
                                onClick={() => moveChoiceDown(index)}
                                disabled={index === selectedChoices.length - 1}
                                className={`p-2 rounded-md transition-colors duration-200 ${
                                  index === selectedChoices.length - 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                                title="Move Down"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => removeFromChoices(choice.id)}
                                className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                title="Remove Choice"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to reorder:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Drag and drop choices using the handle (≡) on the left</li>
                <li>• Use the up (↑) and down (↓) arrows to move choices</li>
                <li>• Click the delete (🗑️) button to remove a choice</li>
                <li>• Your changes are automatically saved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={goBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Back to Choice Filling
          </button>
          <button
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Done Reordering
          </button>
        </div>
      </div>
    </div>
  )
}
