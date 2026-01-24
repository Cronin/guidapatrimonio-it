'use client'

import { useState, useEffect } from 'react'

interface RatingWidgetProps {
  toolSlug: string
  toolName: string
}

export default function RatingWidget({ toolSlug, toolName }: RatingWidgetProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aggregate, setAggregate] = useState<{ ratingValue: number; ratingCount: number } | null>(null)

  // Fetch existing rating on mount
  useEffect(() => {
    fetch(`/api/reviews?tool=${toolSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.aggregate) {
          setAggregate(data.aggregate)
        }
      })
      .catch(() => {})
  }, [toolSlug])

  const handleStarClick = (selectedRating: number) => {
    if (loading || submitted) return
    setRating(selectedRating)
    setShowForm(true)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading || submitted || rating === 0) return

    setLoading(true)

    try {
      const fingerprint = btoa(navigator.userAgent + screen.width + screen.height).slice(0, 16)

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          tool: toolSlug,
          name: name.trim() || undefined,
          comment: comment.trim() || undefined,
          fingerprint,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        if (data.aggregate) {
          setAggregate(data.aggregate)
        }
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    handleSubmit()
  }

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="max-w-md mx-auto">
        {submitted ? (
          <div className="text-center text-green-600">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-lg">Grazie per il feedback!</p>
            {aggregate && (
              <p className="text-sm text-gray-500 mt-1">
                Media: {aggregate.ratingValue}/5 ({aggregate.ratingCount} voti)
              </p>
            )}
          </div>
        ) : showForm ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-0.5"
                >
                  <svg
                    className={`w-6 h-6 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              Vuoi lasciare un commento? (opzionale)
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Il tuo nome (opzionale)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/50"
              />
              <textarea
                placeholder="Il tuo commento (opzionale)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Salta
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Invio...' : 'Invia'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Ti e stato utile questo strumento?
            </p>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={loading}
                  className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
                  aria-label={`${star} stelle`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {aggregate && aggregate.ratingCount > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {aggregate.ratingValue}/5 ({aggregate.ratingCount} voti)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
