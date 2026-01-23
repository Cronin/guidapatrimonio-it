'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote: 'Finalmente ho trovato qualcuno che mi spiega le cose con chiarezza, senza conflitti di interesse. La mia situazione patrimoniale non è mai stata così chiara.',
    author: 'Marco R.',
    role: 'Imprenditore, Milano',
    rating: 5,
  },
  {
    quote: 'Dopo anni di consulenze bancarie deludenti, Guida Patrimonio mi ha aiutato a risparmiare migliaia di euro in commissioni nascoste.',
    author: 'Laura B.',
    role: 'Medico, Roma',
    rating: 5,
  },
  {
    quote: 'Il piano di successione che abbiamo costruito insieme mi dà serenità per il futuro della mia famiglia. Professionalità e umanità rare.',
    author: 'Giuseppe M.',
    role: 'Pensionato, Torino',
    rating: 5,
  },
]

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'text-amber-400' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  return (
    <section className="section-lg bg-forest">
      <div className="container-custom">
        {/* Header with aggregate rating */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="label text-green-300 mb-4">Testimonianze</p>
          <h2 className="font-heading text-h3 text-white mb-4">
            La voce dei nostri clienti
          </h2>
          {/* Aggregate Rating */}
          <div className="flex items-center justify-center gap-3">
            <StarRating rating={Math.round(averageRating)} size="lg" />
            <span className="text-white font-semibold text-lg">{averageRating.toFixed(1)}</span>
            <span className="text-white/60">su 5</span>
          </div>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ${
                  active === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <blockquote className="text-center">
                  {/* Stars for this testimonial */}
                  <div className="flex justify-center mb-6">
                    <StarRating rating={testimonial.rating} size="md" />
                  </div>
                  <p className="font-heading text-h3-sm md:text-h3 text-white mb-8 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer>
                    <p className="font-body font-semibold text-body-lg text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-body text-white/60">
                      {testimonial.role}
                    </p>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  active === index
                    ? 'bg-green-400 w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
