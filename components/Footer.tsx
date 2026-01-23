import Link from 'next/link'

const footerLinks = {
  servizi: [
    { label: 'Pianificazione Patrimoniale', href: '#' },
    { label: 'Consulenza Investimenti', href: '#' },
    { label: 'Ottimizzazione Fiscale', href: '#' },
    { label: 'Passaggio Generazionale', href: '#' },
  ],
  risorse: [
    { label: 'Blog', href: '#' },
    { label: 'Guide Gratuite', href: '#' },
    { label: 'Calcolatori', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  azienda: [
    { label: 'Chi Siamo', href: '#chi-siamo' },
    { label: 'Il Nostro Metodo', href: '#come-lavoriamo' },
    { label: 'Contatti', href: '#contatti' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer id="contatti" className="bg-forest text-white">
      {/* Main Footer */}
      <div className="section-sm">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <span className="text-white text-xl">
                  <span className="font-heading italic font-normal">guida</span>
                  <span className="font-heading italic font-normal">PATRIMONIO</span>
                </span>
              </Link>
              <p className="text-body-md text-white/70 mb-6 max-w-sm">
                Consulenza patrimoniale indipendente per chi vuole costruire,
                proteggere e trasmettere il proprio patrimonio con serenità.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-body font-semibold text-body mb-4">Servizi</h4>
              <ul className="space-y-3">
                {footerLinks.servizi.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-body mb-4">Risorse</h4>
              <ul className="space-y-3">
                {footerLinks.risorse.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-body mb-4">Azienda</h4>
              <ul className="space-y-3">
                {footerLinks.azienda.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-white/50">
              © {new Date().getFullYear()} Guida Patrimonio. Tutti i diritti riservati.
            </p>
            <p className="text-body-sm text-white/50">
              Consulenza patrimoniale indipendente | P.IVA: 00000000000
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
