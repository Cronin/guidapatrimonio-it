import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Imposte Successione | Guida Patrimonio',
  description: 'Calcola le imposte di successione in Italia: franchigie, aliquote per eredi, ottimizzazione fiscale. Strumento per pianificazione successoria.',
  keywords: ['imposte successione', 'pianificazione successoria', 'franchigia successione', 'eredita', 'passaggio generazionale', 'HNWI', 'consulenza patrimoniale', 'tassazione eredita'],
  openGraph: {
    title: 'Calcolatore Imposte di Successione Italia',
    description: 'Simula le imposte di successione: franchigie, aliquote per grado di parentela. Pianifica il passaggio generazionale.',
    type: 'website',
  },
}

export default function SuccessioneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
