'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote: 'Finalmente ho trovato qualcuno che mi spiega le cose con chiarezza, senza conflitti di interesse. La mia situazione patrimoniale non è mai stata così chiara.',
    author: 'Marco R.',
    role: 'Imprenditore, Milano',
  },
  {
    quote: 'Dopo anni di consulenze bancarie deludenti, Guida Patrimonio mi ha aiutato a risparmiare migliaia di euro in commissioni nascoste.',
    author: 'Laura B.',
    role: 'Medico, Roma',
  },
  {
    quote: 'Il piano di successione che abbiamo costruito insieme mi dà serenità per il futuro della mia famiglia. Professionalità e umanità rare.',
    author: 'Giuseppe M.',
    role: 'Pensionato, Torino',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="section-lg bg-forest">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="label text-green-300 mb-4">Testimonianze</p>
          <h2 className="font-heading text-h3 text-white">
            La voce dei nostri clienti
          </h2>
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
