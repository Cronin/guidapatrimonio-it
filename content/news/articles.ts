export interface NewsArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: number
  category: 'Mercati' | 'Fiscalita' | 'Immobiliare' | 'Wealth' | 'Lifestyle'
  image?: string
  source?: string
  sourceUrl?: string
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'milano-capitale-milionari-mondo-2026',
    title: 'Milano prima al mondo per densita di milionari: uno ogni dodici residenti',
    excerpt: 'Il nuovo rapporto Henley & Partners incorona il capoluogo lombardo. Superata New York, staccata Londra. I dati che ridisegnano la mappa della ricchezza globale.',
    date: '2026-01-23',
    readTime: 6,
    category: 'Wealth',
    source: 'Henley & Partners',
    sourceUrl: 'https://www.henleyglobal.com/publications/henley-private-wealth-migration-report',
    image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=1200&h=630&fit=crop',
    content: `
Milano si conferma capitale mondiale della ricchezza. Non in termini assoluti, ma per concentrazione: **un milionario ogni dodici abitanti** iscritti all'anagrafe. E il dato piu alto mai registrato per una grande metropoli, secondo l'ultimo rapporto [Henley & Partners](https://www.henleyglobal.com) sulla migrazione dei patrimoni privati.

Il confronto con le altre capitali finanziarie e impietoso. New York si ferma a un milionario ogni ventidue residenti. Londra, un tempo regina indiscussa, scivola a uno ogni quarantuno. Roma, per dare una misura italiana, conta un high net worth individual ogni cinquantaquattro abitanti.

## La mappa della ricchezza globale

La classifica stilata dalla societa di consulenza londinese fotografa un cambiamento epocale. Le citta europee, e Milano in particolare, stanno attirando capitali che un tempo fluivano esclusivamente verso i centri finanziari anglosassoni.

![Skyline di Milano con le torri di Porta Nuova](https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?w=900&h=500&fit=crop)

A pesare su questa dinamica, secondo gli analisti, e un mix di fattori difficilmente replicabile: il regime fiscale per i neo-residenti, l'ecosistema del lusso e della moda, la posizione geografica nel cuore dell'Europa, un sistema bancario privato tra i piu sviluppati del continente.

## I numeri della ricchezza meneghina

La citta ospita oggi **182 centimilionari**, individui con un patrimonio liquido superiore ai cento milioni di dollari. Un numero che sfiora quello del Principato di Monaco (192) e supera l'intero cantone di Zurigo.

| Citta | Milionari ogni N abitanti |
|-------|--------------------------|
| Milano | 1 ogni 12 |
| New York | 1 ogni 22 |
| Singapore | 1 ogni 30 |
| Londra | 1 ogni 41 |
| Roma | 1 ogni 54 |

Questo posiziona Milano come hub finanziario di riferimento per l'Europa meridionale, una porta d'accesso al Mediterraneo con infrastrutture di primo livello.

## L'effetto Olimpiadi Invernali

L'appuntamento con i Giochi Invernali 2026 sta accelerando ulteriormente l'afflusso di capitali. Gli investitori stranieri guardano a Milano come hub per l'Europa meridionale, una citta con infrastrutture moderne e un mercato del lusso consolidato.

![CityLife Milano, il nuovo quartiere residenziale di lusso](https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&h=500&fit=crop)

Il mercato immobiliare di lusso ne e la cartina tornasole: nelle zone prime i prezzi hanno superato i **ventimila euro al metro quadro**, con punte nel Quadrilatero della Moda che toccano i venticinquemila. CityLife registra incrementi a doppia cifra anno su anno.

## Le sfide per il private banking

Per il private banking italiano, questi numeri rappresentano un'opportunita storica. Ma anche una sfida: trattenere e servire una clientela sempre piu sofisticata ed esigente.

Le banche specializzate stanno investendo in tecnologia, consulenza personalizzata e accesso a prodotti alternativi. Chi non si adeguera rischia di perdere quote di mercato a favore dei gestori internazionali.
`
  },
  {
    slug: 'italia-terza-meta-milionari-2026',
    title: 'Fuga dei ricchi verso l\'Italia: terzo approdo mondiale dopo Emirati e Stati Uniti',
    excerpt: 'Nel 2025 il Paese ha accolto 3.600 nuovi milionari. Un flusso che ridisegna gli equilibri del wealth management europeo e alimenta il mercato del lusso.',
    date: '2026-01-22',
    readTime: 7,
    category: 'Wealth',
    source: 'Henley Private Wealth Migration Report',
    sourceUrl: 'https://www.henleyglobal.com/publications/henley-private-wealth-migration-report',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=630&fit=crop',
    content: `
L'Italia si e trasformata in una calamita per i grandi patrimoni. Con un saldo positivo di **3.600 milionari** nel 2025, il Paese si posiziona al terzo posto mondiale nella classifica delle destinazioni preferite dagli high net worth individuals, preceduta solo dagli Emirati Arabi Uniti e dagli Stati Uniti.

Il dato emerge dal rapporto annuale di [Henley & Partners](https://www.henleyglobal.com) sulla migrazione dei patrimoni privati, documento di riferimento per chi analizza i flussi globali della ricchezza.

## La classifica delle destinazioni

Gli Emirati guidano la classifica con 9.800 nuovi arrivi, seguiti dagli Stati Uniti con 7.500. L'Italia, con i suoi 3.600, precede la Svizzera (2.900) e Singapore (2.500).

| Paese | Saldo milionari 2025 |
|-------|---------------------|
| Emirati Arabi | +9.800 |
| Stati Uniti | +7.500 |
| Italia | +3.600 |
| Svizzera | +2.900 |
| Singapore | +2.500 |

![Costa Amalfitana, una delle destinazioni preferite dai nuovi residenti](https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900&h=500&fit=crop)

## Chi sono i nuovi arrivati

La definizione di milionario adottata dal rapporto si basa sulla ricchezza liquida investibile: partecipazioni quotate, depositi bancari, obbligazioni, criptovalute. Sono esclusi gli immobili. La soglia minima e fissata a **un milione di dollari**.

I nuovi residenti provengono principalmente dal Regno Unito, in fase di diaspora post-Brexit, dalla Russia, dalla Cina e dal Medio Oriente. Cercano stabilita politica, qualita della vita, e un regime fiscale che resta competitivo rispetto alle alternative europee.

## I numeri della ricchezza italiana

L'Italia conta oggi **470mila individui** con patrimonio superiore al milione di euro. La piramide della ricchezza si articola cosi:

| Categoria | Soglia | Numero |
|-----------|--------|--------|
| HNWI | > €1M | 470.000 |
| Very-HNWI | > €5M | 94.000 |
| Ultra-HNWI | > €30M | 5.800 |
| Centimilionari | > €100M | 2.300 |
| Miliardari | > €1B | 71 |

Un patrimonio complessivo che si avvia a superare i quattromila miliardi di euro, di cui oltre un terzo affidato al private banking.

![Lago di Como, meta prediletta degli HNWI internazionali](https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=900&h=500&fit=crop)

## Il grande passaggio generazionale

L'aspetto che piu interessa gli operatori del settore e il trasferimento di ricchezza in arrivo. Entro il 2048, secondo le stime, **83,5 trilioni di dollari** passeranno alle nuove generazioni.

L'Italia, con la sua crescente attrattivita per gli HNWI, potrebbe intercettare una quota significativa di questo flusso storico. Per il sistema finanziario italiano, e il momento di prepararsi.
`
  },
  {
    slug: 'ferrari-250-gto-38-milioni-mecum-2026',
    title: 'La Ferrari 250 GTO bianca venduta a 38,5 milioni di dollari: record mondiale',
    excerpt: 'All\'asta Mecum di Kissimmee l\'unico esemplare in Bianco Speciale. David Lee, collezionista di Los Angeles, si aggiudica il pezzo. L\'Enzo triplica il suo record.',
    date: '2026-01-21',
    readTime: 6,
    category: 'Lifestyle',
    source: 'duPont Registry',
    sourceUrl: 'https://news.dupontregistry.com/blogs/events/ferrari-dominates-mecum-kissimmee-2026',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=630&fit=crop',
    content: `
Trentotto milioni e mezzo di dollari per un'automobile. E il nuovo record mondiale per una Ferrari venduta all'asta, stabilito a Kissimmee, Florida, durante l'edizione 2026 della [Mecum](https://www.mecum.com), la piu grande casa d'aste americana per auto da collezione.

Protagonista, una **250 GTO del 1962**, telaio 3729GT, l'unico esemplare mai prodotto nella livrea Bianco Speciale.

## L'acquirente e la battaglia in sala

Ad aggiudicarsela, dopo una battaglia che ha tenuto col fiato sospeso la sala, e stato **David Lee**, imprenditore e collezionista di Los Angeles gia proprietario di alcune delle Ferrari piu iconiche al mondo.

![Ferrari 250 GTO, considerata la piu bella automobile mai costruita](https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=500&fit=crop)

Lee, fondatore della catena di ristoranti Roscoe's House of Chicken and Waffles, possiede gia una collezione che include una LaFerrari Aperta, una F40 e diverse classiche degli anni Cinquanta. Ma la 250 GTO rappresenta il Santo Graal per ogni collezionista.

## Il fenomeno Enzo

Ma la 250 GTO non e stata l'unica sorpresa della serata. Una Ferrari Enzo in Giallo Modena, proveniente dalla prestigiosa collezione Bachman, ha raggiunto i **17,8 milioni di dollari**, triplicando il precedente record per il modello.

| Modello | Prezzo | Record precedente |
|---------|--------|-------------------|
| 250 GTO Bianco | $38.500.000 | $48.4M (privato) |
| Enzo Giallo | $17.875.000 | $6M |
| F50 Rosso | $12.210.000 | $5.1M |
| LaFerrari Aperta | $11.000.000 | $7M |

Un'altra Enzo, l'unica mai verniciata in Rosso Dino, e stata battuta a 11,1 milioni. La F50 ha toccato i 12,2 milioni, stabilendo a sua volta un nuovo record.

![Ferrari Enzo, l'hypercar che ha rivoluzionato il mercato del collezionismo](https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&h=500&fit=crop)

## I numeri dell'asta

Complessivamente, l'asta ha movimentato **441 milioni di dollari**, il doppio del precedente record per Mecum. Un risultato che testimonia la solidita del mercato delle auto da collezione, nonostante le incertezze macroeconomiche.

## Un mercato che cambia

I risultati di Kissimmee segnano un punto di svolta nel mercato delle auto da collezione. Le hypercar moderne degli anni Ottanta, Novanta e Duemila hanno ormai raggiunto, e in alcuni casi superato, le quotazioni delle classiche del dopoguerra.

L'Enzo, la F40, la F50, la LaFerrari non sono piu solo automobili: sono asset class. La provenienza, i chilometri percorsi, i colori speciali comandano premi che possono raddoppiare o triplicare il valore di base.

## Consigli per il collezionista

Per chi investe in questo settore, la lezione e chiara:

- La **documentazione impeccabile** vale quanto il modello stesso
- I **bassi chilometraggi** sono fondamentali
- I **colori unici** o le prime produzioni valgono multipli
- La **provenienza** deve essere tracciabile

E i colori unici, come quel Bianco Speciale, non hanno prezzo.
`
  },
  {
    slug: 'oro-record-5000-dollari-2026',
    title: 'Corsa all\'oro: Goldman e J.P. Morgan vedono quota 5.000 dollari',
    excerpt: 'Il metallo giallo ha chiuso il 2025 con un rialzo del 67%, il migliore dal 1979. Le banche centrali accumulano riserve. Il dollaro perde il suo ruolo di rifugio.',
    date: '2026-01-20',
    readTime: 6,
    category: 'Mercati',
    source: 'Milano Finanza',
    sourceUrl: 'https://www.milanofinanza.it/news/oro',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop',
    content: `
L'oro non smette di correre. Dopo aver chiuso il 2025 con un rialzo del **67 per cento**, il migliore risultato dal 1979, il metallo giallo si appresta a varcare la soglia psicologica dei cinquemila dollari l'oncia.

A crederci sono le principali banche d'investimento del pianeta.

## I target delle banche d'investimento

[Goldman Sachs](https://www.goldmansachs.com) ha fissato il target a 4.900 dollari per fine anno. [J.P. Morgan](https://www.jpmorgan.com) si spinge oltre, a 5.055. Citigroup, la piu aggressiva, vede i cinquemila dollari gia entro tre mesi. Vontobel resta piu cauta, con un obiettivo a 4.800.

| Banca | Target 2026 | Orizzonte |
|-------|-------------|-----------|
| Goldman Sachs | $4.900 | Dicembre |
| J.P. Morgan | $5.055 | Q4 |
| Citigroup | $5.000 | 3 mesi |
| Vontobel | $4.800 | Fine anno |

![Lingotti d'oro, il bene rifugio per eccellenza](https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=900&h=500&fit=crop)

## Le banche centrali cambiano strategia

A trainare il rally e un cambiamento strutturale nelle riserve delle banche centrali. Per la prima volta nella storia, gli istituti di emissione detengono **piu oro che titoli del Tesoro americano**.

E una rivoluzione silenziosa che sta ridisegnando gli equilibri finanziari globali. Ken Griffin, fondatore e CEO di Citadel, uno dei piu grandi hedge fund al mondo, ha sintetizzato il fenomeno:

*"Le persone cominciano a vedere l'oro come un porto sicuro nei confronti del dollaro. Stiamo assistendo a una sostanziale fuga di chi cerca un modo per de-dollarizzare."*

## I fattori del rialzo

A sostenere le quotazioni contribuiscono diversi fattori:

- **Tassi in calo**: La Fed accomodante riduce il costo opportunita di detenere oro
- **Geopolitica**: Tensioni in Medio Oriente e Europa dell'Est alimentano la domanda
- **Inflazione**: L'oro protegge il potere d'acquisto nel lungo periodo
- **De-dollarizzazione**: Crescente sfiducia verso il biglietto verde

![Trading floor, dove si decidono le quotazioni dell'oro](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=500&fit=crop)

## Come posizionarsi

Gli esperti suggeriscono un'allocazione tra il **3 e il 5 per cento** del portafoglio in oro fisico o strumenti equivalenti. Non come asset principale, ma come diversificatore e copertura contro l'inflazione e i rischi sistemici.

Le opzioni sono molteplici:

| Strumento | Pro | Contro | Costo annuo |
|-----------|-----|--------|-------------|
| Lingotti | Possesso diretto | Custodia | 0.5-1% |
| Monete | Liquidita | Premium | 0.5-1% |
| ETC | Semplicita | Controparte | 0.12-0.25% |

Per chi cerca liquidita, gli ETC come Invesco Physical Gold o iShares Physical Gold offrono un'alternativa pratica con costi contenuti.
`
  },
  {
    slug: 'private-banking-1400-miliardi-2026',
    title: 'Private banking, la corsa ai 1.400 miliardi: gestira un terzo della ricchezza italiana',
    excerpt: 'L\'Associazione italiana del settore prevede masse in crescita del 6,6% annuo. Nessun operatore si aspetta una contrazione. Gli alternativi pesano il 15% dei portafogli.',
    date: '2026-01-19',
    readTime: 5,
    category: 'Wealth',
    source: 'AIPB',
    sourceUrl: 'https://www.aipb.it/ricerche',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop',
    content: `
Il private banking italiano punta ai **1.400 miliardi di euro** di masse gestite entro la fine del 2026. Un traguardo che, se raggiunto, porterebbe il settore a controllare il 36 per cento della ricchezza investibile delle famiglie italiane.

Le previsioni arrivano dall'[Associazione Italiana Private Banking](https://www.aipb.it), che ha presentato l'outlook annuale del comparto.

## I numeri della crescita

La crescita attesa e del **6,6 per cento** medio annuo, trainata per il 4,2 per cento dai nuovi flussi e per il 2,4 per cento dalla performance dei mercati finanziari.

| Metrica | 2022 | 2026 (stima) |
|---------|------|--------------|
| Masse gestite | €1.100 mld | €1.400 mld |
| Quota ricchezza famiglie | 30% | 36% |
| Crescita media annua | - | 6,6% |

![Private banker in consulenza con un cliente](https://images.unsplash.com/photo-1560472355-536de3962603?w=900&h=500&fit=crop)

## Il consolidamento del settore

Il dato piu significativo riguarda la concentrazione del mercato. Le banche specializzate, da Intesa Sanpaolo Private Banking a UniCredit Private Banking, da Banca Aletti a Credem Euromobiliare, hanno incrementato la loro quota dal 19,1 al **22,8 per cento**, erodendo spazio alle reti tradizionali.

E un segnale di maturita del settore, che premia gli operatori capaci di offrire servizi dedicati e consulenza personalizzata.

## La svolta degli alternativi

Nei portafogli piu sofisticati, gli investimenti alternativi hanno raggiunto il **15 per cento** del totale:

- Private equity: 5-8%
- Private credit: 3-5%
- Infrastrutture: 2-4%
- Criptovalute: 1-3%

![Ufficio di private banking moderno](https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=500&fit=crop)

## Le prospettive del settore

Il 56 per cento dei leader intervistati prevede che l'industria continuera a crescere nei prossimi dodici-diciotto mesi. Il restante 44 per cento si aspetta stabilita.

**Nessuno prevede contrazione.**

Per i clienti con patrimoni superiori al milione di euro, il passaggio a un private banker dedicato offre vantaggi concreti: consulenza personalizzata, accesso a prodotti esclusivi, reporting consolidato e pianificazione successoria integrata.
`
  },
  {
    slug: 'riforma-successioni-doppia-franchigia-2026',
    title: 'Successioni, la rivoluzione silenziosa: arriva la doppia franchigia da due milioni',
    excerpt: 'Con l\'eliminazione del coacervo, donazioni ed eredita saranno tassate separatamente. Per le famiglie con grandi patrimoni un risparmio che puo valere decine di migliaia di euro.',
    date: '2026-01-18',
    readTime: 6,
    category: 'Fiscalita',
    source: 'Fiscomania',
    sourceUrl: 'https://fiscomania.com/riforma-successioni',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop',
    content: `
Dal primo gennaio 2026 cambia tutto, o quasi, nella tassazione dei passaggi generazionali. Il decreto legislativo 139/2024 elimina il **coacervo**, la regola che obbligava a sommare le donazioni effettuate in vita all'eredita per calcolare l'imposta di successione.

E una rivoluzione silenziosa, che passa quasi inosservata nel dibattito pubblico ma che puo valere decine di migliaia di euro per le famiglie con patrimoni significativi.

## Come funzionava prima

Fino al 2025, le donazioni e l'eredita facevano cumulo ai fini del calcolo della franchigia.

**Esempio pratico:**
Se un genitore aveva donato 800mila euro al figlio in vita, e poi lasciava 500mila euro in eredita:
- Base imponibile: €800.000 + €500.000 = €1.300.000
- Franchigia: €1.000.000
- Imponibile: €300.000
- Imposta (4%): **€12.000**

![Famiglia in consulenza con un notaio](https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=500&fit=crop)

## Come funziona dal 2026

Dal 2026, le due operazioni sono valutate **separatamente**:

**Donazione:**
- Valore: €800.000
- Franchigia: €1.000.000
- Imposta: **€0**

**Successione:**
- Valore: €500.000
- Franchigia: €1.000.000
- Imposta: **€0**

**Risparmio netto: €12.000**

## La doppia franchigia in pratica

In pratica, ogni figlio puo ricevere fino a **due milioni di euro** senza imposte:
- €1.000.000 via donazione
- €1.000.000 via successione

| Operazione | Franchigia | Aliquota oltre |
|------------|------------|----------------|
| Donazione a figli | €1.000.000 | 4% |
| Successione a figli | €1.000.000 | 4% |
| Totale esentasse | €2.000.000 | - |

![Documenti notarili per successione](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=500&fit=crop)

## Chi ne beneficia di piu

Le categorie che traggono maggior vantaggio dalla riforma:

- Famiglie con **patrimoni immobiliari** consistenti
- Genitori che vogliono trasferire **partecipazioni societarie**
- Nuclei con **piu figli** (ogni figlio ha la sua doppia franchigia)
- Imprenditori con **aziende di famiglia**

## L'autoliquidazione

Altra novita: l'imposta di successione si paga in **autoliquidazione**. L'erede calcola e versa quanto dovuto entro novanta giorni dalla dichiarazione. L'Agenzia delle Entrate ha due anni per i controlli.

Per le aziende di famiglia, restano confermate le agevolazioni: esenzione totale se l'attivita viene mantenuta per almeno cinque anni.
`
  },
  {
    slug: 'immobiliare-lusso-milano-outlook-2026',
    title: 'Immobiliare di lusso, Milano corre: prezzi su del 7 per cento, CityLife guida la carica',
    excerpt: 'Nel segmento prime le quotazioni toccano i 25mila euro al metro quadro. L\'effetto Olimpiadi attira investitori internazionali. Domanda superiore all\'offerta nelle zone centrali.',
    date: '2026-01-17',
    readTime: 6,
    category: 'Immobiliare',
    source: 'Nomisma',
    sourceUrl: 'https://www.nomisma.it/osservatorio-immobiliare',
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&h=630&fit=crop',
    content: `
Il mercato immobiliare di lusso milanese non conosce soste. Nel primo trimestre del 2026, i valori medi al metro quadro nel segmento prime hanno registrato un incremento del **5 per cento** rispetto allo stesso periodo dell'anno precedente.

Le previsioni parlano di un rialzo complessivo del **7 per cento** entro dicembre.

## CityLife guida la crescita

A trainare la corsa e CityLife, il quartiere nato sulle ceneri della vecchia Fiera. Qui i prezzi sono saliti del **10 per cento** in dodici mesi, con punte che sfiorano i 18mila euro al metro quadro per gli appartamenti nelle torri residenziali.

![Le torri di CityLife dominano lo skyline milanese](https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&h=500&fit=crop)

## La mappa dei prezzi

Il Quadrilatero della Moda resta il quartiere piu caro: tra i 18mila e i 25mila euro al metro quadro per gli immobili di rappresentanza.

| Zona | Prezzo €/mq | Variazione annua |
|------|-------------|------------------|
| Quadrilatero | 18.000-25.000 | +5% |
| Brera | 15.000-20.000 | +6% |
| CityLife | 12.000-18.000 | +10% |
| Porta Venezia | 10.000-15.000 | +4% |
| Isola | 8.000-12.000 | +7% |

## L'effetto Olimpiadi

I Giochi Invernali del 2026 stanno funzionando da acceleratore. L'esposizione mediatica internazionale ha attirato l'attenzione di investitori stranieri che vedono in Milano un hub per l'Europa meridionale.

![Appartamento di lusso con vista su Milano](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=500&fit=crop)

La domanda supera strutturalmente l'offerta, soprattutto nel centro storico dove le nuove costruzioni sono rare e gli immobili storici richiedono ristrutturazioni complete.

## Rendimenti e prospettive

Per gli investitori, il segmento lusso offre cap rate medi del **4-5 per cento**, competitivi rispetto ad altre asset class. Le ristrutturazioni di palazzi storici possono generare valorizzazioni del 20-30 per cento.

Le proiezioni per i prossimi tre-cinque anni indicano una crescita annua del 2-4 per cento, sostenuta dall'attrattivita internazionale della citta e dalla scarsita di offerta nelle zone prime.

## Consigli per l'investitore

Per chi vuole entrare nel mercato del lusso milanese:

- **Location**: Privilegiare centro storico, Brera, CityLife
- **Qualita**: Preferire nuove costruzioni o ristrutturazioni complete
- **Servizi**: Portineria, sicurezza, parcheggio sono must-have
- **Esposizione**: Terrazzo e vista comandano premi significativi
`
  },
  {
    slug: 'outlook-mercati-2026-jp-morgan-goldman',
    title: 'I mercati nel 2026 secondo J.P. Morgan e Goldman Sachs: le tre forze che definiranno il decennio',
    excerpt: 'Intelligenza artificiale, frammentazione geopolitica, inflazione persistente. Le grandi banche d\'investimento tracciano la rotta. Europa in ripresa, attenzione alla concentrazione.',
    date: '2026-01-16',
    readTime: 7,
    category: 'Mercati',
    source: 'J.P. Morgan Private Bank',
    sourceUrl: 'https://privatebank.jpmorgan.com/insights/outlook',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    content: `
Tre forze plasmeranno i mercati finanziari nel prossimo decennio. A individuarle e [J.P. Morgan Private Bank](https://privatebank.jpmorgan.com), nel suo outlook annuale riservato alla clientela di alto profilo.

Le stesse conclusioni emergono, con sfumature diverse, dall'analisi di [Goldman Sachs](https://www.goldmansachs.com) e delle principali case d'investimento globali.

## La prima forza: l'intelligenza artificiale

La prima forza e l'**intelligenza artificiale**. Non come moda passeggera, ma come trasformazione strutturale che ridisegnera produttivita, modelli di business e margini aziendali.

![Data center, il cuore dell'economia dell'AI](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop)

I benefici, avvertono gli analisti, non saranno immediati ne distribuiti uniformemente. Distinguere i vincitori dai perdenti sara la sfida dei prossimi anni.

## La seconda forza: frammentazione geopolitica

La seconda forza e la **frammentazione geopolitica**. Le catene di fornitura si accorciano, il reshoring accelera, le tensioni commerciali si intensificano.

Per le aziende significa costi piu alti e margini sotto pressione. Per gli investitori, la necessita di ripensare l'esposizione geografica.

## La terza forza: inflazione persistente

La terza forza e l'**inflazione persistente**. I livelli resteranno strutturalmente piu elevati rispetto al decennio 2010-2020.

| Metrica | Previsione 2026 |
|---------|-----------------|
| PIL Globale | +3,1% |
| PIL Italia | +0,7% |
| Inflazione Eurozona | 2,2-2,5% |
| Tassi BCE | 2,5% (in calo) |

![Trading floor di Wall Street](https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&h=500&fit=crop)

## Europa in ripresa

Il dato piu interessante riguarda l'Europa. Il rapporto tra investimenti e fatturato delle aziende europee ha raggiunto il livello piu alto dalla crisi finanziaria globale.

La Germania ha varato politiche fiscali espansive. Le valutazioni restano contenute rispetto agli Stati Uniti. Per gli investitori, e un'opportunita di diversificazione.

## Il rischio concentrazione

Il pericolo principale, concordano tutti i report, non e un singolo evento catastrofico ma l'**eccesso di concentrazione**.

I "Magnifici 7" pesano troppo sugli indici. Se la narrazione sull'intelligenza artificiale dovesse deludere, l'impatto sarebbe rapido e significativo.

## La parola chiave: resilienza

La parola chiave per il 2026 non e previsione. E **resilienza**.

Costruire portafogli capaci di resistere a scenari diversi, diversificare geograficamente, mantenere liquidita per le opportunita tattiche: questa la ricetta suggerita dai grandi gestori.
`
  },
  {
    slug: 'monaco-yacht-show-2026-4-miliardi',
    title: 'Monaco Yacht Show, quattro miliardi di euro in banchina: il superyachting celebra i 35 anni',
    excerpt: 'Dal 23 al 26 settembre a Port Hercule oltre 125 imbarcazioni. Debutta Blue Wake, l\'hub della sostenibilita. Il primo giorno riservato agli invitati.',
    date: '2026-01-14',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Monaco Yacht Show',
    sourceUrl: 'https://www.monacoyachtshow.com',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&h=630&fit=crop',
    content: `
Porto Hercule si prepara a ospitare la piu grande concentrazione di ricchezza galleggiante del pianeta. Dal 23 al 26 settembre 2026, il [Monaco Yacht Show](https://www.monacoyachtshow.com) celebrera il suo **trentacinquesimo anniversario**.

Oltre 125 superyacht in esposizione, per un valore complessivo che sfiora i **quattro miliardi di euro**.

## I numeri dell'evento

L'evento, nato nel 1991, si e trasformato nel corso dei decenni nel punto di riferimento mondiale per armatori, broker, cantieri e fornitori del settore.

| Dato | Valore |
|------|--------|
| Yacht esposti | 125+ |
| Valore totale | ~€4 miliardi |
| Espositori | 560+ |
| Visitatori attesi | 30.000+ |

![Superyacht ormeggiati a Port Hercule, Monaco](https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=900&h=500&fit=crop)

## Accesso e biglietti

La manifestazione si apre il mercoledi con una giornata riservata agli invitati e ai possessori del **Sapphire Experience**.

Da giovedi a sabato, i cancelli si aprono al pubblico:
- Pass giornaliero: **€690**
- Orari: 10:00-18:30 (sabato fino alle 18:00)

Non e un evento per curiosi. E un marketplace dove si concludono trattative da decine di milioni di euro.

## Blue Wake: la svolta green

La novita del 2026 si chiama **Blue Wake**, evoluzione del Sustainability Hub lanciato nelle edizioni precedenti.

![Yacht a propulsione ibrida, il futuro del superyachting](https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=900&h=500&fit=crop)

Uno spazio dedicato alle tecnologie per ridurre l'impatto ambientale del superyachting:
- Sistemi di propulsione next-gen
- Materiali sostenibili per i refit
- Soluzioni per il trattamento delle acque

## Il mercato dei superyacht

Il settore continua a crescere nonostante le incertezze macroeconomiche:

- **Ordini in aumento** per yacht oltre i 50 metri
- **Tempi di consegna**: 3-5 anni per nuove costruzioni
- **Charter**: domanda record per Mediterraneo e Caraibi

Per chi puo permetterselo, il superyacht resta l'ultima frontiera del lusso.
`
  },
  {
    slug: 'patek-philippe-1518-record-178-milioni-2026',
    title: 'Patek Philippe 1518, record mondiale a 17,8 milioni: l\'orologio piu caro mai venduto',
    excerpt: 'All\'asta Phillips di Ginevra un calendario perpetuo in oro rosa del 1950 riscrive la storia. Il Rolex Daytona "Paul Newman" tocca i 5,5 milioni.',
    date: '2026-01-13',
    readTime: 6,
    category: 'Lifestyle',
    source: 'Phillips Watches',
    sourceUrl: 'https://www.phillips.com/watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=630&fit=crop',
    content: `
Diciassette milioni e ottocentomila dollari per un orologio da polso. E il nuovo record mondiale, stabilito all'asta [Phillips](https://www.phillips.com) di Ginevra per un **Patek Philippe Reference 1518** in oro rosa del 1950.

Il pezzo, un calendario perpetuo con cronografo, apparteneva a una collezione privata europea e non era mai apparso sul mercato.

## Perche il 1518 vale cosi tanto

Il Reference 1518 occupa un posto speciale nella storia dell'orologeria. E il **primo calendario perpetuo con cronografo** prodotto in serie, realizzato da Patek Philippe tra il 1941 e il 1954.

![Patek Philippe, la manifattura piu prestigiosa al mondo](https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=900&h=500&fit=crop)

I numeri parlano chiaro:
- Solo **281 esemplari** prodotti
- Appena **58 in oro rosa**
- Condizioni: eccezionali
- Provenienza: impeccabile

## I top lot della serata

Ma il 1518 non e stato l'unico protagonista della serata ginevrina.

| Orologio | Prezzo | Anno |
|----------|--------|------|
| Patek 1518 oro rosa | $17.800.000 | 1950 |
| Rolex Daytona "Paul Newman" | $5.500.000 | 1969 |
| Patek 2499 oro giallo | $4.200.000 | 1957 |
| A. Lange Grand Complication | $2.800.000 | 2019 |

![Rolex Daytona Paul Newman, icona del collezionismo](https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=900&h=500&fit=crop)

## Orologi come asset class

Per i collezionisti piu sofisticati, l'orologeria di alto livello e ormai un'**asset class** a tutti gli effetti.

I vantaggi:
- **Portabilita** del valore
- **Nessuna tassazione** patrimoniale
- Possibilita di **utilizzo quotidiano**
- Potenziale di **apprezzamento**

## Le regole per investire

Le regole per investire restano pero rigorose:

1. **Condizioni**: Solo esemplari impeccabili
2. **Provenienza**: Documentazione completa
3. **Rarita**: Edizioni limitate o varianti rare
4. **Pazienza**: I migliori affari si fanno aspettando

Nel mondo degli orologi, come in quello dell'arte, la fretta e cattiva consigliera.
`
  },
  {
    slug: 'vino-borgogna-la-tache-1886-record-325000',
    title: 'Vino da record, una bottiglia di La Tache 1886 venduta a 325mila sterline',
    excerpt: 'All\'asta Christie\'s la cantina storica di Bouchard Pere & Fils. Incasso totale di 2,38 milioni. La Borgogna si riprende dopo la correzione del 40 per cento.',
    date: '2026-01-12',
    readTime: 6,
    category: 'Lifestyle',
    source: 'Decanter',
    sourceUrl: 'https://www.decanter.com',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=630&fit=crop',
    content: `
Trecentoventicinquemila sterline per una singola bottiglia di vino. E il prezzo raggiunto da una **La Tache 1886** all'asta [Christie's](https://www.christies.com) dedicata alla cantina storica di Bouchard Pere & Fils.

La stima iniziale era di 19mila sterline. Il risultato finale l'ha superata di **diciassette volte**.

## L'asta Bouchard

Bouchard Pere & Fils e uno dei produttori piu prestigiosi della Borgogna, con una storia che risale al 1731. La vendita della sua cantina storica ha rappresentato un evento irripetibile per i collezionisti.

![Cantina storica con bottiglie di Borgogna d'annata](https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&h=500&fit=crop)

**Risultati:**
- Totale vendite: **£2,38 milioni**
- Lotti venduti: **100%**
- Star lot: La Tache 1886 a £325.000

## Il mercato del fine wine

Tra il 2022 e il 2025, i vini di Borgogna avevano perso tra il 25 e il 40 per cento del loro valore. Gli ultimi mesi mostrano segnali di ripresa.

| Vino | Performance 2025 |
|------|------------------|
| DRC La Tache 2018 | +37% |
| Bordeaux First Growths | +5-8% |
| Champagne Prestige | +3-5% |
| Burgundy Index (dal 2014) | +131% |

![Degustazione di Borgogna Grand Cru](https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=900&h=500&fit=crop)

## Dove investire nel 2026

Gli esperti indicano tre aree di interesse:

**Borgogna:**
- En Primeur 2024 in arrivo Q1
- Focus su annate 2016-2020
- Produttori: DRC, Leroy, Roumier

**Bordeaux:**
- Prezzi corretti, entry point interessante
- First Growths: Lafite, Latour, Margaux
- Annate: 2015, 2016, 2019, 2020

**Champagne:**
- Dom Perignon, Krug in crescita
- Salon, Jacques Selosse per collezionisti

## Come investire

Per chi vuole entrare nel mercato del fine wine:

| Aspetto | Dettaglio |
|---------|-----------|
| Piattaforme | Liv-ex, Cult Wines, Berry Bros |
| Stoccaggio | Bonded warehouse (esenzione IVA) |
| Assicurazione | 0.5-1% annuo |
| Orizzonte | 5-10 anni |

Il vino, come l'arte, richiede pazienza. Ma i rendimenti possono essere straordinari.
`
  },
]

export function getAllNews(): NewsArticle[] {
  return newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find(article => article.slug === slug)
}

export function getNewsByCategory(category: NewsArticle['category']): NewsArticle[] {
  return newsArticles.filter(article => article.category === category)
}
