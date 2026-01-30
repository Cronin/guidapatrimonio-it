import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  strumenti: [
    { label: 'Simulatore Holding', href: '/strumenti/holding' },
    { label: 'Trust vs Donazione', href: '/strumenti/trust-donazione' },
    { label: 'Family Office', href: '/strumenti/family-office' },
    { label: 'Exit Strategy', href: '/strumenti/exit-strategy' },
    { label: 'Tutti gli strumenti', href: '/strumenti' },
  ],
  calcolatori: [
    { label: 'Successione', href: '/strumenti/successione' },
    { label: 'Patrimonio Netto', href: '/strumenti/patrimonio-netto' },
    { label: 'FIRE Calculator', href: '/strumenti/fire' },
    { label: 'Dashboard Macro', href: '/strumenti/dashboard-macro' },
    { label: 'Confronto ETF', href: '/strumenti/confronto-etf' },
  ],
  azienda: [
    { label: 'Partner', href: '/#chi-siamo' },
    { label: 'Contatti', href: '/#contatti' },
    { label: 'Blog', href: '/blog' },
    { label: 'Notizie', href: '/notizie' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      {/* Main Footer */}
      <div className="section-sm">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <Image
                  src="/logo-white.png"
                  alt="Guida Patrimonio"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-white text-2xl">
                  <span className="font-heading font-medium">Guida</span>
                  <span className="font-heading font-semibold">Patrimonio</span>
                  <span className="font-heading font-light opacity-70">.it</span>
                </span>
              </Link>
              <p className="text-body-md text-white/70 mb-6 max-w-sm">
                Strumenti professionali per la gestione patrimoniale e accesso
                a soluzioni di wealth management svizzero per patrimoni oltre 150K.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-green-300 transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-green-300 transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-body font-semibold text-body mb-4 text-green-300">Strumenti</h4>
              <ul className="space-y-3">
                {footerLinks.strumenti.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-body mb-4 text-green-300">Calcolatori</h4>
              <ul className="space-y-3">
                {footerLinks.calcolatori.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-body mb-4 text-green-300">Info</h4>
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
              <a href="tel:+393756448324" className="hover:text-white/70 transition-colors">+39 375 644 8324</a> | <a href="mailto:info@guidapatrimonio.it" className="hover:text-white/70 transition-colors">info@guidapatrimonio.it</a> | Partner: Ginevra, Svizzera
            </p>
          </div>
        </div>
      </div>

      {/* GDPR Notice */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4">
          <p className="text-xs text-white/40 text-center leading-relaxed">
            Questo sito utilizza cookie tecnici e di analisi (Google Analytics, Microsoft Clarity) per migliorare l&apos;esperienza utente.
            Continuando la navigazione accetti l&apos;utilizzo dei cookie. I tuoi dati sono trattati nel rispetto della nLPD (Svizzera) e del GDPR (UE).
            Non vendiamo ne condividiamo i tuoi dati con terze parti per fini commerciali.
            Per informazioni: <a href="mailto:info@guidapatrimonio.it" className="underline hover:text-white/60">info@guidapatrimonio.it</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
