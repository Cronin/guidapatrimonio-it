import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Wealth Advisor - Consulente Patrimoniale AI | Guida Patrimonio',
  description: 'Consulente patrimoniale virtuale basato su intelligenza artificiale. Risposte immediate su pianificazione patrimoniale, fiscalita, successioni, trust e holding.',
  keywords: 'AI wealth advisor, consulente patrimoniale AI, chatbot finanziario, consulenza fiscale AI, trust, holding, successioni, pianificazione patrimoniale',
  openGraph: {
    title: 'AI Wealth Advisor - Consulente Patrimoniale AI',
    description: 'Consulente patrimoniale virtuale basato su intelligenza artificiale. Risposte immediate su fiscalita, successioni, trust e holding.',
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
