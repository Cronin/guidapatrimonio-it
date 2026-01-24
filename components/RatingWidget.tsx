'use client'

import { useState, useEffect } from 'react'

interface RatingWidgetProps {
  toolSlug: string
  toolName: string
}

export default function RatingWidget({ toolSlug, toolName }: RatingWidgetProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
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

  const handleSubmit = async (selectedRating: number) => {
    if (loading || submitted) return

    setLoading(true)
    setRating(selectedRating)

    try {
      // Generate simple fingerprint
      const fingerprint = btoa(navigator.userAgent + screen.width + screen.height).slice(0, 16)

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: selectedRating,
          tool: toolSlug,
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

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="text-center">
        {submitted ? (
          <div className="text-green-600">
            <p className="font-medium">Grazie per la valutazione!</p>
            {aggregate && (
              <p className="text-sm text-gray-500 mt-1">
                Media: {aggregate.ratingValue}/5 ({aggregate.ratingCount} voti)
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Ti e stato utile questo strumento?
            </p>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleSubmit(star)}
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
          </>
        )}
      </div>
    </div>
  )
}
