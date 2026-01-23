export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: number
  category: string
  image?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'interesse-composto-guida-completa',
    title: 'Interesse Composto: La Guida Completa per Principianti',
    excerpt: 'Scopri perché Einstein definì l\'interesse composto "l\'ottava meraviglia del mondo" e come può trasformare i tuoi risparmi.',
    date: '2025-01-20',
    readTime: 8,
    category: 'Investimenti',
    content: `
## Cos'è l'interesse composto?

L'interesse composto è il meccanismo per cui gli interessi generati da un investimento vengono reinvestiti e generano a loro volta nuovi interessi. È la differenza fondamentale tra l'interesse semplice (che si calcola solo sul capitale iniziale) e quello composto.

## Perché Einstein lo chiamò "l'ottava meraviglia del mondo"?

La leggenda vuole che Albert Einstein abbia definito l'interesse composto "l'ottava meraviglia del mondo". Che sia vero o meno, il concetto è innegabile: **chi lo capisce, lo guadagna; chi non lo capisce, lo paga.**

## Un esempio concreto

Immagina di investire 10.000 EUR con un rendimento del 7% annuo:

- **Dopo 10 anni:** 19.672 EUR (quasi il doppio!)
- **Dopo 20 anni:** 38.697 EUR (quasi 4 volte)
- **Dopo 30 anni:** 76.123 EUR (più di 7 volte)

La magia sta nel fatto che la crescita non è lineare, ma esponenziale. I primi 10.000 EUR di guadagno richiedono circa 10 anni. I successivi 10.000 EUR ne richiedono solo 5.

## La regola del 72

Esiste una formula semplice per calcolare in quanto tempo il tuo capitale raddoppierà: **dividi 72 per il tasso di interesse**.

- Al 6%: 72/6 = 12 anni per raddoppiare
- Al 8%: 72/8 = 9 anni per raddoppiare
- Al 10%: 72/10 = 7.2 anni per raddoppiare

## Come sfruttare l'interesse composto

1. **Inizia presto:** Il tempo è il tuo alleato più potente
2. **Reinvesti sempre:** Non prelevare gli interessi
3. **Sii paziente:** I risultati più impressionanti arrivano dopo decenni
4. **Minimizza i costi:** Commissioni dell'1% possono costarti centinaia di migliaia di euro nel lungo termine

## Il lato oscuro

L'interesse composto funziona anche contro di te. Se hai debiti con interessi composti (carte di credito, prestiti), il meccanismo lavora a tuo sfavore. Ecco perché è fondamentale eliminare prima i debiti ad alto interesse.

## Conclusione

L'interesse composto è uno strumento potentissimo, ma richiede tempo e disciplina. Prima inizi, più ne beneficerai. Se hai 30 anni e inizi oggi, tra 30 anni ringrazierai te stesso.
    `,
  },
  {
    slug: 'consulente-finanziario-indipendente-cosa-fa',
    title: 'Consulente Finanziario Indipendente: Cosa Fa e Perché Ne Hai Bisogno',
    excerpt: 'La differenza tra un consulente indipendente e un promotore finanziario può costarti migliaia di euro. Scopri perché.',
    date: '2025-01-15',
    readTime: 6,
    category: 'Consulenza',
    content: `
## Chi è il consulente finanziario indipendente?

Un consulente finanziario indipendente è un professionista iscritto all'albo OCF (Organismo di vigilanza e tenuta dell'Albo unico dei Consulenti Finanziari) nella sezione dei consulenti autonomi. La differenza fondamentale? **Non vende prodotti finanziari e non è legato a nessuna banca o rete.**

## Consulente indipendente vs Promotore finanziario

| Aspetto | Consulente Indipendente | Promotore Finanziario |
|---------|------------------------|----------------------|
| Chi lo paga | Il cliente direttamente | La banca/rete (commissioni sui prodotti) |
| Prodotti | Consiglia qualsiasi prodotto sul mercato | Vende i prodotti della sua rete |
| Conflitto di interesse | Nessuno | Strutturale |
| Costo per il cliente | Parcella trasparente | Commissioni nascoste nei prodotti |

## Perché il conflitto di interesse è un problema?

Quando un promotore finanziario ti consiglia un prodotto, guadagna una commissione dalla banca. Più alto è il costo del prodotto, più guadagna lui. È umano: anche il professionista più onesto sarà influenzato da questo incentivo.

Un consulente indipendente guadagna lo stesso indipendentemente da cosa ti consiglia. Il suo unico interesse è che tu sia soddisfatto e che continui a rivolgerti a lui.

## Quanto costa un consulente indipendente?

La parcella di un consulente indipendente varia tipicamente dallo 0.5% all'1% annuo del patrimonio gestito, oppure una tariffa oraria (100-300 EUR/ora) per consulenze spot.

Sembra tanto? Considera che i prodotti bancari hanno spesso costi totali del 2-3% annuo. Pagando un consulente indipendente che ti indirizza verso prodotti a basso costo (ETF, fondi indicizzati), **risparmi l'1-2% all'anno**.

Su un patrimonio di 100.000 EUR per 20 anni, questo risparmio vale circa **40.000-80.000 EUR**.

## Quando rivolgersi a un consulente indipendente?

- Hai accumulato un patrimonio significativo (50.000+ EUR)
- Stai pianificando un grande cambiamento (pensione, vendita immobile, eredità)
- Vuoi ottimizzare la tua situazione fiscale
- Non ti fidi dei consigli della tua banca
- Vuoi un secondo parere sui tuoi investimenti attuali

## Come scegliere un buon consulente

1. **Verifica l'iscrizione all'albo:** Cerca su ocf.consob.it
2. **Chiedi la struttura dei costi:** Deve essere trasparente
3. **Valuta l'esperienza:** Chiedi referenze e casi simili al tuo
4. **Fai una prima consulenza:** Molti offrono un primo incontro gratuito

## Conclusione

Un consulente finanziario indipendente non è un lusso per ricchi: è un investimento che si ripaga da solo. La vera domanda non è "posso permettermelo?", ma "posso permettermi di non averlo?".
    `,
  },
  {
    slug: 'errori-investimento-evitare',
    title: '7 Errori di Investimento che Ti Costano Soldi (e Come Evitarli)',
    excerpt: 'Gli errori più comuni degli investitori italiani e le strategie per non ripeterli.',
    date: '2025-01-10',
    readTime: 7,
    category: 'Investimenti',
    content: `
## 1. Tenere troppi soldi sul conto corrente

L'errore più diffuso in Italia. Con un'inflazione del 3%, 100.000 EUR sul conto perdono 3.000 EUR di potere d'acquisto ogni anno. In 10 anni, avrai perso quasi il 30% del valore reale.

**Soluzione:** Mantieni sul conto solo la liquidità necessaria (3-6 mesi di spese). Il resto va investito.

## 2. Affidarsi ciecamente alla banca

La banca non è tua amica. È un'azienda che deve fare profitti, e li fa vendendo i propri prodotti - non quelli migliori per te.

**Soluzione:** Fai sempre una seconda verifica. Confronta i costi, cerca opinioni indipendenti, valuta alternative.

## 3. Comprare ai massimi, vendere ai minimi

È istintivo: quando i mercati salgono, tutti ne parlano e vuoi entrare. Quando crollano, il panico ti spinge a vendere. Risultato: compri caro e vendi a sconto.

**Soluzione:** Investi regolarmente con un PAC (Piano di Accumulo del Capitale), indipendentemente dall'andamento del mercato.

## 4. Non diversificare

Mettere tutti i soldi in un singolo titolo, settore o paese è come scommettere tutto su un cavallo. Può andare bene, ma se va male...

**Soluzione:** Diversifica per asset class (azioni, obbligazioni, immobili), area geografica e settore. Gli ETF globali sono ottimi strumenti per questo.

## 5. Ignorare i costi

L'1-2% di commissioni annue sembra poco, ma su 30 anni può erodere il 30-50% dei tuoi guadagni. È la differenza tra andare in pensione sereni o dover continuare a lavorare.

**Soluzione:** Preferisci strumenti a basso costo come ETF indicizzati. Controlla sempre il TER (Total Expense Ratio).

## 6. Cercare il "colpo grosso"

Trading giornaliero, criptovalute sconosciute, penny stock, forex... La maggior parte delle persone che cerca il colpo grosso finisce per perdere soldi.

**Soluzione:** Accetta che arricchirsi lentamente è l'unico modo affidabile di arricchirsi. L'investimento noioso è spesso il più redditizio.

## 7. Non avere un piano

Investire senza obiettivi chiari è come partire per un viaggio senza destinazione. Finirai per fare scelte emotive e incoerenti.

**Soluzione:** Definisci i tuoi obiettivi (pensione? casa? università dei figli?), il tuo orizzonte temporale e la tua tolleranza al rischio. Poi costruisci un piano e seguilo.

## Conclusione

Questi errori sono comuni perché sono umani. Ma riconoscerli è il primo passo per evitarli. Se non ti senti sicuro, un consulente indipendente può aiutarti a impostare una strategia solida e a mantenerla nel tempo.
    `,
  },
  {
    slug: 'etf-cosa-sono-come-funzionano',
    title: 'ETF: Cosa Sono e Perché Sono la Scelta Migliore per la Maggior Parte degli Investitori',
    excerpt: 'Una guida semplice agli ETF, gli strumenti che hanno democratizzato l\'investimento.',
    date: '2025-01-05',
    readTime: 9,
    category: 'Investimenti',
    content: `
## Cosa sono gli ETF?

ETF sta per Exchange Traded Fund, ovvero "fondo negoziato in borsa". È un fondo di investimento che:

1. **Replica un indice:** Invece di cercare di battere il mercato, lo copia
2. **Si compra in borsa:** Come un'azione qualsiasi
3. **Ha costi bassissimi:** Spesso sotto lo 0.2% annuo

## Perché gli ETF hanno rivoluzionato l'investimento

Prima degli ETF, per investire diversificato serviva:
- Comprare decine di azioni singole (costoso in commissioni)
- Affidarsi a fondi attivi (costosi in commissioni di gestione)
- Avere grandi capitali

Oggi, con 100 EUR puoi comprare un ETF che investe in 3.000 aziende di tutto il mondo, con costi annui dello 0.20%.

## ETF vs Fondi Attivi

| Aspetto | ETF | Fondo Attivo |
|---------|-----|--------------|
| Obiettivo | Replicare l'indice | Battere l'indice |
| Costi annui | 0.10% - 0.50% | 1.50% - 2.50% |
| Performance | Pari all'indice (meno costi) | 80% fa peggio dell'indice |
| Trasparenza | Totale (sai sempre cosa contiene) | Parziale |

Il dato più importante: **oltre l'80% dei fondi attivi non riesce a battere il proprio indice di riferimento su orizzonti di 10+ anni**. Paghi di più per ottenere di meno.

## Quali ETF scegliere?

Per un investitore italiano, alcuni ETF popolari sono:

**Azionario Globale:**
- VWCE (Vanguard FTSE All-World) - TER 0.22%
- SWDA (iShares Core MSCI World) - TER 0.20%

**Obbligazionario:**
- AGGH (iShares Core Global Aggregate Bond) - TER 0.10%

**Bilanciato:**
- VNGA80 (Vanguard LifeStrategy 80% Equity) - TER 0.25%

## Come iniziare

1. **Apri un conto titoli:** Directa, Fineco, Degiro sono opzioni popolari
2. **Scegli 1-3 ETF:** Non complicare le cose
3. **Imposta un PAC:** Versamenti automatici mensili
4. **Dimentica che esistono:** Il miglior investimento è quello che non guardi

## Rischi degli ETF

Gli ETF non sono privi di rischi:
- **Rischio di mercato:** Se il mercato scende, il tuo ETF scende
- **Rischio cambio:** Per ETF in valuta diversa dall'euro
- **Rischio liquidità:** Per ETF molto piccoli o di nicchia

Ma questi sono rischi dell'investimento in generale, non specifici degli ETF.

## Conclusione

Gli ETF non sono perfetti, ma per la maggior parte degli investitori sono la scelta migliore: semplici, economici, diversificati. Se hai dubbi su quali scegliere o come costruire un portafoglio, un consulente indipendente può aiutarti a fare le scelte giuste per la tua situazione.
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
