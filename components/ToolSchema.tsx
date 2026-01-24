// Server component for tool schema with ratings
import { JsonLd, createCalculatorSchema, createFAQSchema } from './JsonLd'

interface ToolSchemaProps {
  name: string
  description: string
  slug: string
  faqs?: { question: string; answer: string }[]
}

// Fetch aggregate rating from API (server-side)
async function getAggregateRating(toolSlug: string) {
  try {
    const res = await fetch(
      `https://guidapatrimonio.it/api/reviews?tool=${toolSlug}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.success && data.aggregate && data.aggregate.ratingCount > 0) {
      return data.aggregate
    }
    return null
  } catch {
    return null
  }
}

export default async function ToolSchema({ name, description, slug, faqs }: ToolSchemaProps) {
  const aggregate = await getAggregateRating(slug)

  const schemas = []

  // Calculator/Tool schema with rating
  schemas.push(createCalculatorSchema({
    name,
    description,
    url: `https://guidapatrimonio.it/strumenti/${slug}`,
    aggregateRating: aggregate || undefined,
  }))

  // FAQ schema if provided
  if (faqs && faqs.length > 0) {
    schemas.push(createFAQSchema(faqs))
  }

  return <JsonLd data={schemas} />
}

// Default FAQs for common financial tools
export const defaultToolFAQs: Record<string, { question: string; answer: string }[]> = {
  'interesse-composto': [
    { question: 'Come si calcola l\'interesse composto?', answer: 'L\'interesse composto si calcola con la formula: Capitale finale = Capitale iniziale × (1 + tasso)^anni. Il calcolatore tiene conto anche dei versamenti periodici.' },
    { question: 'Qual e la differenza tra interesse semplice e composto?', answer: 'Nell\'interesse semplice gli interessi si calcolano solo sul capitale iniziale. Nell\'interesse composto, gli interessi maturati vengono reinvestiti e generano a loro volta interessi.' },
    { question: 'Quanto posso guadagnare con l\'interesse composto?', answer: 'Dipende dal capitale, dal tasso di rendimento e dall\'orizzonte temporale. Con 10.000 EUR al 7% annuo per 30 anni, otterresti circa 76.000 EUR.' },
  ],
  'simulatore-monte-carlo': [
    { question: 'Cos\'e una simulazione Monte Carlo?', answer: 'E una tecnica statistica che genera migliaia di scenari casuali per stimare la probabilita di diversi risultati finanziari, considerando la volatilita dei mercati.' },
    { question: 'A cosa serve il simulatore Monte Carlo per investimenti?', answer: 'Serve a capire la probabilita di raggiungere i tuoi obiettivi finanziari considerando l\'incertezza dei mercati, invece di usare un unico rendimento medio.' },
    { question: 'Quante simulazioni servono per risultati affidabili?', answer: 'Generalmente 1.000-10.000 simulazioni sono sufficienti. Il nostro strumento usa fino a 10.000 simulazioni per risultati statisticamente robusti.' },
  ],
  'successione': [
    { question: 'Come si calcolano le imposte di successione in Italia?', answer: 'Le imposte dipendono dal grado di parentela: coniuge e figli hanno franchigia di 1 milione EUR e aliquota 4%, fratelli 100.000 EUR e 6%, altri parenti 6-8% senza franchigia.' },
    { question: 'Le polizze vita sono esenti da imposta di successione?', answer: 'Si, i capitali delle polizze vita sono completamente esenti dall\'imposta di successione, rendendole uno strumento utile per la pianificazione successoria.' },
    { question: 'Conviene fare una donazione in vita o lasciare in eredita?', answer: 'Dipende dalla situazione. Le donazioni permettono di trasferire patrimonio con le stesse aliquote della successione, ma offrono vantaggi di pianificazione anticipata.' },
  ],
  'fire': [
    { question: 'Cos\'e il movimento FIRE?', answer: 'FIRE (Financial Independence, Retire Early) e un movimento che punta all\'indipendenza finanziaria e al pensionamento anticipato attraverso un alto tasso di risparmio e investimenti.' },
    { question: 'Quanto devo avere per andare in FIRE?', answer: 'La regola generale e avere 25 volte le spese annuali (regola del 4%). Con spese di 40.000 EUR/anno servirebbero circa 1 milione EUR.' },
    { question: 'Il 4% di prelievo e sicuro?', answer: 'Lo studio Trinity suggerisce che un prelievo del 4% ha circa il 95% di probabilita di durare 30 anni. Per orizzonti piu lunghi, considera il 3-3.5%.' },
  ],
  'patrimonio-netto': [
    { question: 'Come si calcola il patrimonio netto?', answer: 'Patrimonio netto = Totale attivita - Totale passivita. Include immobili, investimenti, conti correnti meno mutui, prestiti e debiti.' },
    { question: 'Qual e un buon patrimonio netto per eta?', answer: 'Una formula comune e: (Eta x Reddito annuo) / 10. A 40 anni con reddito di 50.000 EUR, un buon target sarebbe 200.000 EUR di patrimonio netto.' },
    { question: 'Cosa includere nel calcolo del patrimonio netto?', answer: 'Includi: immobili (valore di mercato), investimenti, conti correnti, auto, preziosi. Sottrai: mutui, prestiti personali, debiti carte di credito.' },
  ],
  'pac': [
    { question: 'Cos\'e un PAC (Piano di Accumulo)?', answer: 'E una strategia di investimento che prevede versamenti periodici costanti, indipendentemente dall\'andamento del mercato, sfruttando il dollar cost averaging.' },
    { question: 'Quanto conviene investire in un PAC?', answer: 'La regola generale e investire almeno il 20% del reddito netto. L\'importo ideale dipende dai tuoi obiettivi e dalla capacita di risparmio.' },
    { question: 'E meglio investire tutto subito o con un PAC?', answer: 'Statisticamente, investire tutto subito (lump sum) batte il PAC nel 66% dei casi. Ma il PAC riduce il rischio di entrare al momento sbagliato.' },
  ],
  'mutuo': [
    { question: 'Come si calcola la rata del mutuo?', answer: 'La rata si calcola con la formula dell\'ammortamento francese che considera capitale, tasso di interesse e durata. Il nostro calcolatore fa tutto automaticamente.' },
    { question: 'Meglio tasso fisso o variabile?', answer: 'Dipende dalla tua tolleranza al rischio. Il fisso offre certezza, il variabile puo costare meno ma e soggetto a oscillazioni dei tassi.' },
    { question: 'Quanto posso permettermi di mutuo?', answer: 'La regola e che la rata non superi il 30-35% del reddito netto mensile. Le banche valutano anche altri debiti esistenti.' },
  ],
}
