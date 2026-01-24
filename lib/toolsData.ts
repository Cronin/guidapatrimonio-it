// Tool metadata with FAQs for schema.org
export interface ToolData {
  slug: string
  name: string
  description: string
  faqs: { question: string; answer: string }[]
}

export const toolsData: Record<string, ToolData> = {
  'interesse-composto': {
    slug: 'interesse-composto',
    name: 'Calcolatore Interesse Composto',
    description: 'Calcola la crescita del tuo capitale con l\'interesse composto. Simula investimenti con versamenti periodici e visualizza la crescita nel tempo.',
    faqs: [
      { question: 'Come si calcola l\'interesse composto?', answer: 'L\'interesse composto si calcola con la formula: Capitale finale = Capitale iniziale × (1 + tasso)^anni. Il calcolatore tiene conto anche dei versamenti periodici.' },
      { question: 'Qual e la differenza tra interesse semplice e composto?', answer: 'Nell\'interesse semplice gli interessi si calcolano solo sul capitale iniziale. Nell\'interesse composto, gli interessi maturati vengono reinvestiti e generano a loro volta interessi.' },
      { question: 'Quanto posso guadagnare con l\'interesse composto?', answer: 'Dipende dal capitale, dal tasso di rendimento e dall\'orizzonte temporale. Con 10.000 EUR al 7% annuo per 30 anni, otterresti circa 76.000 EUR.' },
    ],
  },
  'simulatore-monte-carlo': {
    slug: 'simulatore-monte-carlo',
    name: 'Simulatore Monte Carlo',
    description: 'Simula migliaia di scenari di investimento per calcolare la probabilita di raggiungere i tuoi obiettivi finanziari.',
    faqs: [
      { question: 'Cos\'e una simulazione Monte Carlo?', answer: 'E una tecnica statistica che genera migliaia di scenari casuali per stimare la probabilita di diversi risultati finanziari, considerando la volatilita dei mercati.' },
      { question: 'A cosa serve il simulatore Monte Carlo per investimenti?', answer: 'Serve a capire la probabilita di raggiungere i tuoi obiettivi finanziari considerando l\'incertezza dei mercati, invece di usare un unico rendimento medio.' },
      { question: 'Quante simulazioni servono per risultati affidabili?', answer: 'Generalmente 1.000-10.000 simulazioni sono sufficienti. Il nostro strumento usa fino a 10.000 simulazioni per risultati statisticamente robusti.' },
    ],
  },
  'successione': {
    slug: 'successione',
    name: 'Calcolatore Imposte Successione',
    description: 'Calcola le imposte di successione in Italia. Simula eredita con piu eredi e confronta con donazioni in vita.',
    faqs: [
      { question: 'Come si calcolano le imposte di successione in Italia?', answer: 'Le imposte dipendono dal grado di parentela: coniuge e figli hanno franchigia di 1 milione EUR e aliquota 4%, fratelli 100.000 EUR e 6%, altri parenti 6-8% senza franchigia.' },
      { question: 'Le polizze vita sono esenti da imposta di successione?', answer: 'Si, i capitali delle polizze vita sono completamente esenti dall\'imposta di successione, rendendole uno strumento utile per la pianificazione successoria.' },
      { question: 'Conviene fare una donazione in vita o lasciare in eredita?', answer: 'Dipende dalla situazione. Le donazioni permettono di trasferire patrimonio con le stesse aliquote della successione, ma offrono vantaggi di pianificazione anticipata.' },
    ],
  },
  'fire': {
    slug: 'fire',
    name: 'Calcolatore FIRE',
    description: 'Calcola quando potrai raggiungere l\'indipendenza finanziaria (FIRE). Simula diversi scenari di risparmio e investimento.',
    faqs: [
      { question: 'Cos\'e il movimento FIRE?', answer: 'FIRE (Financial Independence, Retire Early) e un movimento che punta all\'indipendenza finanziaria e al pensionamento anticipato attraverso un alto tasso di risparmio e investimenti.' },
      { question: 'Quanto devo avere per andare in FIRE?', answer: 'La regola generale e avere 25 volte le spese annuali (regola del 4%). Con spese di 40.000 EUR/anno servirebbero circa 1 milione EUR.' },
      { question: 'Il 4% di prelievo e sicuro?', answer: 'Lo studio Trinity suggerisce che un prelievo del 4% ha circa il 95% di probabilita di durare 30 anni. Per orizzonti piu lunghi, considera il 3-3.5%.' },
    ],
  },
  'patrimonio-netto': {
    slug: 'patrimonio-netto',
    name: 'Calcolatore Patrimonio Netto',
    description: 'Calcola il tuo patrimonio netto totale. Somma attivita e sottrai passivita per conoscere la tua situazione finanziaria.',
    faqs: [
      { question: 'Come si calcola il patrimonio netto?', answer: 'Patrimonio netto = Totale attivita - Totale passivita. Include immobili, investimenti, conti correnti meno mutui, prestiti e debiti.' },
      { question: 'Qual e un buon patrimonio netto per eta?', answer: 'Una formula comune e: (Eta x Reddito annuo) / 10. A 40 anni con reddito di 50.000 EUR, un buon target sarebbe 200.000 EUR di patrimonio netto.' },
      { question: 'Cosa includere nel calcolo del patrimonio netto?', answer: 'Includi: immobili (valore di mercato), investimenti, conti correnti, auto, preziosi. Sottrai: mutui, prestiti personali, debiti carte di credito.' },
    ],
  },
  'pac': {
    slug: 'pac',
    name: 'Simulatore PAC',
    description: 'Simula un Piano di Accumulo Capitale. Calcola quanto puoi accumulare con versamenti periodici nel tempo.',
    faqs: [
      { question: 'Cos\'e un PAC (Piano di Accumulo)?', answer: 'E una strategia di investimento che prevede versamenti periodici costanti, indipendentemente dall\'andamento del mercato, sfruttando il dollar cost averaging.' },
      { question: 'Quanto conviene investire in un PAC?', answer: 'La regola generale e investire almeno il 20% del reddito netto. L\'importo ideale dipende dai tuoi obiettivi e dalla capacita di risparmio.' },
      { question: 'E meglio investire tutto subito o con un PAC?', answer: 'Statisticamente, investire tutto subito (lump sum) batte il PAC nel 66% dei casi. Ma il PAC riduce il rischio di entrare al momento sbagliato.' },
    ],
  },
  'mutuo': {
    slug: 'mutuo',
    name: 'Calcolatore Mutuo',
    description: 'Calcola la rata del mutuo e il piano di ammortamento. Confronta tasso fisso e variabile.',
    faqs: [
      { question: 'Come si calcola la rata del mutuo?', answer: 'La rata si calcola con la formula dell\'ammortamento francese che considera capitale, tasso di interesse e durata. Il nostro calcolatore fa tutto automaticamente.' },
      { question: 'Meglio tasso fisso o variabile?', answer: 'Dipende dalla tua tolleranza al rischio. Il fisso offre certezza, il variabile puo costare meno ma e soggetto a oscillazioni dei tassi.' },
      { question: 'Quanto posso permettermi di mutuo?', answer: 'La regola e che la rata non superi il 30-35% del reddito netto mensile. Le banche valutano anche altri debiti esistenti.' },
    ],
  },
  'pensione': {
    slug: 'pensione',
    name: 'Calcolatore Pensione',
    description: 'Calcola la tua pensione futura e quanto devi risparmiare per integrare l\'assegno INPS.',
    faqs: [
      { question: 'Come si calcola la pensione INPS?', answer: 'La pensione si calcola con il sistema contributivo: montante contributivo x coefficiente di trasformazione. Il coefficiente dipende dall\'eta di pensionamento.' },
      { question: 'Quando posso andare in pensione?', answer: 'L\'eta pensionabile standard e 67 anni con 20 anni di contributi. Esistono opzioni di pensione anticipata con requisiti diversi.' },
      { question: 'Quanto sara la mia pensione rispetto allo stipendio?', answer: 'Il tasso di sostituzione medio e circa 60-70% dell\'ultimo stipendio, ma varia molto in base alla carriera contributiva.' },
    ],
  },
  'tfr': {
    slug: 'tfr',
    name: 'Calcolatore TFR',
    description: 'Calcola il TFR maturato e la rivalutazione annuale. Confronta lasciarlo in azienda o versarlo al fondo pensione.',
    faqs: [
      { question: 'Come si calcola il TFR?', answer: 'TFR annuo = Retribuzione annua / 13.5. Il montante viene rivalutato annualmente con 1.5% + 75% dell\'inflazione ISTAT.' },
      { question: 'Conviene lasciare il TFR in azienda o versarlo al fondo pensione?', answer: 'Il fondo pensione offre vantaggi fiscali (deducibilita fino a 5.164 EUR) e spesso rendimenti migliori, ma il TFR in azienda e piu liquido.' },
      { question: 'Quando posso ritirare il TFR?', answer: 'Il TFR in azienda si ritira alla cessazione del rapporto di lavoro. Dal fondo pensione puoi avere anticipi per casa, spese sanitarie o dopo 8 anni.' },
    ],
  },
  'inflazione': {
    slug: 'inflazione',
    name: 'Calcolatore Inflazione',
    description: 'Calcola l\'impatto dell\'inflazione sul tuo potere d\'acquisto nel tempo.',
    faqs: [
      { question: 'Come l\'inflazione erode il potere d\'acquisto?', answer: 'Con inflazione al 3%, 100.000 EUR oggi varranno circa 74.000 EUR tra 10 anni in termini reali. E fondamentale investire per battere l\'inflazione.' },
      { question: 'Qual e il tasso di inflazione storico in Italia?', answer: 'L\'inflazione media in Italia negli ultimi 20 anni e stata circa 2% annuo, ma con picchi significativi nel 2022-2023.' },
      { question: 'Come proteggersi dall\'inflazione?', answer: 'Investendo in asset reali (immobili, azioni, materie prime) o strumenti indicizzati all\'inflazione (BTP Italia, TIPS).' },
    ],
  },
  'budget': {
    slug: 'budget',
    name: 'Calcolatore Budget Personale',
    description: 'Crea un budget personale e traccia le tue spese. Ottimizza il risparmio mensile.',
    faqs: [
      { question: 'Come creare un budget efficace?', answer: 'Usa la regola 50/30/20: 50% per necessita, 30% per desideri, 20% per risparmi e investimenti. Adatta le percentuali alla tua situazione.' },
      { question: 'Quanto dovrei risparmiare al mese?', answer: 'L\'obiettivo minimo e il 20% del reddito netto. Per obiettivi ambiziosi come il FIRE, punta al 50% o piu.' },
      { question: 'Quali spese tagliare per primo?', answer: 'Inizia dalle spese ricorrenti non essenziali: abbonamenti inutilizzati, pranzi fuori frequenti, acquisti impulsivi. Piccoli risparmi mensili fanno grande differenza.' },
    ],
  },
  'dividendi': {
    slug: 'dividendi',
    name: 'Calcolatore Dividendi',
    description: 'Calcola il rendimento da dividendi e la crescita del portafoglio con reinvestimento.',
    faqs: [
      { question: 'Come funziona il dividend yield?', answer: 'Dividend yield = Dividendo annuo per azione / Prezzo azione x 100. Un yield del 4% significa 4 EUR di dividendi per ogni 100 EUR investiti.' },
      { question: 'Conviene reinvestire i dividendi?', answer: 'Si, il reinvestimento dei dividendi sfrutta l\'interesse composto e puo aumentare significativamente i rendimenti a lungo termine.' },
      { question: 'Come vengono tassati i dividendi in Italia?', answer: 'I dividendi da azioni italiane ed estere sono tassati al 26%. Per azioni estere potrebbe esserci anche ritenuta alla fonte nel paese di origine.' },
    ],
  },
  'prestito': {
    slug: 'prestito',
    name: 'Calcolatore Prestito',
    description: 'Calcola la rata del prestito personale e il costo totale degli interessi.',
    faqs: [
      { question: 'Come si calcola la rata di un prestito?', answer: 'La rata dipende da importo, durata e TAEG. Il nostro calcolatore usa la formula dell\'ammortamento francese per calcolare rata e piano completo.' },
      { question: 'Cos\'e il TAEG?', answer: 'Il TAEG (Tasso Annuo Effettivo Globale) include tutti i costi del prestito: interessi, commissioni, assicurazioni. E il vero costo del finanziamento.' },
      { question: 'Meglio prestito a breve o lunga durata?', answer: 'Durate brevi hanno rate piu alte ma costo totale minore. Durate lunghe hanno rate basse ma paghi piu interessi complessivamente.' },
    ],
  },
}

// Get tool data by slug, returns default if not found
export function getToolData(slug: string): ToolData {
  return toolsData[slug] || {
    slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Strumento finanziario gratuito per ${slug.replace(/-/g, ' ')}.`,
    faqs: [],
  }
}
