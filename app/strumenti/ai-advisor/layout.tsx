import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Wealth Advisor - Consulente AI | Guida Patrimonio',
  description: 'Consulente patrimoniale AI per HNWI: risposte su trust, holding, successioni, fiscalita internazionale. Assistente virtuale wealth management.',
  keywords: ['AI wealth advisor', 'consulente patrimoniale AI', 'HNWI', 'trust', 'holding familiare', 'pianificazione successoria', 'consulenza fiscale', 'wealth management'],
  openGraph: {
    title: 'AI Wealth Advisor - Consulente Patrimoniale AI',
    description: 'Assistente AI per domande su trust, holding, successioni, fiscalita. Per HNWI e family office.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/strumenti/ai-advisor',
    siteName: 'Guida Patrimonio',
  },
}

export default function AIAdvisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
