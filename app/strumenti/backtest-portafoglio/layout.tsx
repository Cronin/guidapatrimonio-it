import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Backtest Portafoglio - Test Storico | Guida Patrimonio',
  description: 'Testa il tuo portafoglio sui dati storici: performance passata, drawdown, volatilita. Strumento di backtesting per HNWI e consulenti.',
  keywords: ['backtest portafoglio', 'test storico', 'performance portafoglio', 'drawdown', 'volatilita', 'HNWI', 'wealth management', 'simulazione investimenti'],
  openGraph: {
    title: 'Backtest Portafoglio - Performance Storica',
    description: 'Testa la strategia di investimento sui dati storici. Analizza performance, rischio e drawdown.',
    type: 'website',
  },
}

export default function BacktestPortafoglioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
