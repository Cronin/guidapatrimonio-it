import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Costruttore Bond Ladder | Guida Patrimonio',
  description: 'Costruisci una scala obbligazionaria: BTP, bond corporate, diversificazione scadenze. Strategia reddito fisso per patrimoni HNWI.',
  keywords: ['bond ladder', 'scala obbligazionaria', 'BTP', 'obbligazioni', 'reddito fisso', 'HNWI', 'gestione patrimonio', 'investimenti sicuri'],
  openGraph: {
    title: 'Bond Ladder - Scala Obbligazionaria',
    description: 'Costruisci una scala di obbligazioni per flussi di cassa prevedibili. BTP e corporate bond.',
    type: 'website',
  },
}

export default function ScalaObbligazionariaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
