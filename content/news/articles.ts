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
    readTime: 4,
    category: 'Wealth',
    source: 'Henley & Partners',
    sourceUrl: 'https://www.henleyglobal.com/publications/henley-private-wealth-migration-report',
    image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=1200&h=630&fit=crop',
    content: `
Milano si conferma capitale mondiale della ricchezza. Non in termini assoluti, ma per concentrazione: un milionario ogni dodici abitanti iscritti all'anagrafe. E il dato piu alto mai registrato per una grande metropoli, secondo l'ultimo rapporto Henley & Partners sulla migrazione dei patrimoni privati.

Il confronto con le altre capitali finanziarie e impietoso. New York si ferma a un milionario ogni ventidue residenti. Londra, un tempo regina indiscussa, scivola a uno ogni quarantuno. Roma, per dare una misura italiana, conta un high net worth individual ogni cinquantaquattro abitanti.

## I numeri della ricchezza meneghina

La citta ospita oggi 182 centimilionari, individui con un patrimonio liquido superiore ai cento milioni di dollari. Un numero che sfiora quello del Principato di Monaco, tradizionale rifugio dei grandi patrimoni europei, e supera l'intero cantone di Zurigo.

A trainare questa concentrazione, secondo gli analisti, e un mix di fattori difficilmente replicabile: il regime fiscale per i neo-residenti, l'ecosistema del lusso e della moda, la posizione geografica nel cuore dell'Europa, un sistema bancario privato tra i piu sviluppati del continente.

## L'effetto Olimpiadi

L'appuntamento con i Giochi Invernali 2026 sta accelerando ulteriormente l'afflusso di capitali. Gli investitori stranieri guardano a Milano come hub per l'Europa meridionale, una porta d'accesso al Mediterraneo con infrastrutture finanziarie di primo livello.

Il mercato immobiliare di lusso ne e la cartina tornasole: nelle zone prime i prezzi hanno superato i ventimila euro al metro quadro, con punte nel Quadrilatero della Moda che toccano i venticinquemila. CityLife registra incrementi a doppia cifra anno su anno.

Per il private banking italiano, questi numeri rappresentano un'opportunita storica. Ma anche una sfida: trattenere e servire una clientela sempre piu sofisticata ed esigente.
`
  },
  {
    slug: 'italia-terza-meta-milionari-2026',
    title: 'Fuga dei ricchi verso l\'Italia: terzo approdo mondiale dopo Emirati e Stati Uniti',
    excerpt: 'Nel 2025 il Paese ha accolto 3.600 nuovi milionari. Un flusso che ridisegna gli equilibri del wealth management europeo e alimenta il mercato del lusso.',
    date: '2026-01-22',
    readTime: 5,
    category: 'Wealth',
    source: 'Henley Private Wealth Migration Report',
    sourceUrl: 'https://www.henleyglobal.com/publications/henley-private-wealth-migration-report',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=630&fit=crop',
    content: `
L'Italia si e trasformata in una calamita per i grandi patrimoni. Con un saldo positivo di 3.600 milionari nel 2025, il Paese si posiziona al terzo posto mondiale nella classifica delle destinazioni preferite dagli high net worth individuals, preceduta solo dagli Emirati Arabi Uniti e dagli Stati Uniti.

Il dato emerge dal rapporto annuale di Henley & Partners sulla migrazione dei patrimoni privati, documento di riferimento per chi analizza i flussi globali della ricchezza. Gli Emirati guidano la classifica con 9.800 nuovi arrivi, seguiti dagli Stati Uniti con 7.500. L'Italia, con i suoi 3.600, precede la Svizzera (2.900) e Singapore (2.500).

## Chi sono i nuovi arrivati

La definizione di milionario adottata dal rapporto si basa sulla ricchezza liquida investibile: partecipazioni quotate, depositi bancari, obbligazioni, criptovalute. Sono esclusi gli immobili. La soglia minima e fissata a un milione di dollari.

I nuovi residenti provengono principalmente dal Regno Unito, in fase di diaspora post-Brexit, dalla Russia, dalla Cina e dal Medio Oriente. Cercano stabilita politica, qualita della vita, e un regime fiscale che, pur con l'aumento della flat tax a 300mila euro, resta competitivo rispetto alle alternative europee.

## I numeri della ricchezza italiana

L'Italia conta oggi 470mila individui con patrimonio superiore al milione di euro. Di questi, 94mila superano i cinque milioni, 5.800 i trenta milioni, 2.300 i cento milioni. I miliardari sono 71.

Un patrimonio complessivo che si avvia a superare i quattromila miliardi di euro, di cui oltre un terzo affidato al private banking.

## Il passaggio generazionale

L'aspetto che piu interessa gli operatori del settore e il grande trasferimento di ricchezza in arrivo. Entro il 2048, secondo le stime, 83,5 trilioni di dollari passeranno alle nuove generazioni. L'Italia, con la sua crescente attrattivita per gli HNWI, potrebbe intercettare una quota significativa di questo flusso storico.

Per il sistema finanziario italiano, e il momento di prepararsi.
`
  },
  {
    slug: 'ferrari-250-gto-38-milioni-mecum-2026',
    title: 'La Ferrari 250 GTO bianca venduta a 38,5 milioni di dollari: record mondiale',
    excerpt: 'All\'asta Mecum di Kissimmee l\'unico esemplare in Bianco Speciale. David Lee, collezionista di Los Angeles, si aggiudica il pezzo. L\'Enzo triplica il suo record.',
    date: '2026-01-21',
    readTime: 5,
    category: 'Lifestyle',
    source: 'duPont Registry',
    sourceUrl: 'https://news.dupontregistry.com/blogs/events/ferrari-dominates-mecum-kissimmee-2026',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=630&fit=crop',
    content: `
Trentotto milioni e mezzo di dollari per un'automobile. E il nuovo record mondiale per una Ferrari venduta all'asta, stabilito a Kissimmee, Florida, durante l'edizione 2026 della Mecum, la piu grande casa d'aste americana per auto da collezione.

Protagonista, una 250 GTO del 1962, telaio 3729GT, l'unico esemplare mai prodotto nella livrea Bianco Speciale. Ad aggiudicarsela, dopo una battaglia che ha tenuto col fiato sospeso la sala, e stato David Lee, imprenditore e collezionista di Los Angeles gia proprietario di alcune delle Ferrari piu iconiche al mondo.

## Il fenomeno Enzo

Ma la 250 GTO non e stata l'unica sorpresa della serata. Una Ferrari Enzo in Giallo Modena, proveniente dalla prestigiosa collezione Bachman, ha raggiunto i 17,8 milioni di dollari, triplicando il precedente record per il modello.

Un'altra Enzo, l'unica mai verniciata in Rosso Dino, e stata battuta a 11,1 milioni. La F50 ha toccato i 12,2 milioni, stabilendo a sua volta un nuovo record. La LaFerrari Aperta ha sfiorato gli 11 milioni.

Complessivamente, l'asta ha movimentato 441 milioni di dollari, il doppio del precedente record per Mecum.

## Un mercato che cambia

I risultati di Kissimmee segnano un punto di svolta nel mercato delle auto da collezione. Le hypercar moderne degli anni Ottanta, Novanta e Duemila hanno ormai raggiunto, e in alcuni casi superato, le quotazioni delle classiche del dopoguerra.

L'Enzo, la F40, la F50, la LaFerrari non sono piu solo automobili: sono asset class. La provenienza, i chilometri percorsi, i colori speciali comandano premi che possono raddoppiare o triplicare il valore di base.

Per chi investe in questo settore, la lezione e chiara: la documentazione impeccabile e i bassi chilometraggi valgono quanto il modello stesso. E i colori unici, come quel Bianco Speciale, non hanno prezzo.
`
  },
  {
    slug: 'oro-record-5000-dollari-2026',
    title: 'Corsa all\'oro: Goldman e J.P. Morgan vedono quota 5.000 dollari',
    excerpt: 'Il metallo giallo ha chiuso il 2025 con un rialzo del 67%, il migliore dal 1979. Le banche centrali accumulano riserve. Il dollaro perde il suo ruolo di rifugio.',
    date: '2026-01-20',
    readTime: 5,
    category: 'Mercati',
    source: 'Milano Finanza',
    sourceUrl: 'https://www.milanofinanza.it/news/oro',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop',
    content: `
L'oro non smette di correre. Dopo aver chiuso il 2025 con un rialzo del 67 per cento, il migliore risultato dal 1979, il metallo giallo si appresta a varcare la soglia psicologica dei cinquemila dollari l'oncia. A crederci sono le principali banche d'investimento del pianeta.

Goldman Sachs ha fissato il target a 4.900 dollari per fine anno. J.P. Morgan si spinge oltre, a 5.055. Citigroup, la piu aggressiva, vede i cinquemila dollari gia entro tre mesi. Vontobel resta piu cauta, con un obiettivo a 4.800.

## Le banche centrali cambiano strategia

A trainare il rally e un cambiamento strutturale nelle riserve delle banche centrali. Per la prima volta nella storia, gli istituti di emissione detengono piu oro che titoli del Tesoro americano. E una rivoluzione silenziosa che sta ridisegnando gli equilibri finanziari globali.

Ken Griffin, fondatore e CEO di Citadel, uno dei piu grandi hedge fund al mondo, ha sintetizzato il fenomeno: "Le persone cominciano a vedere l'oro come un porto sicuro nei confronti del dollaro. Stiamo assistendo a una sostanziale fuga di chi cerca un modo per de-dollarizzare".

## Il ruolo dei tassi

A sostenere le quotazioni contribuisce anche la politica monetaria della Federal Reserve. Con i tassi in calo, il costo opportunita di detenere oro, che non paga interessi, si riduce. E le tensioni geopolitiche, dal Medio Oriente all'Europa dell'Est, alimentano la domanda di beni rifugio.

## Come posizionarsi

Gli esperti suggeriscono un'allocazione tra il tre e il cinque per cento del portafoglio in oro fisico o strumenti equivalenti. Non come asset principale, ma come diversificatore e copertura contro l'inflazione e i rischi sistemici.

Le opzioni sono molteplici: lingotti e monete per chi preferisce il possesso fisico, ETC come Invesco Physical Gold o iShares Physical Gold per chi cerca la liquidita. I costi di gestione oscillano tra lo 0,12 e lo 0,25 per cento annuo.
`
  },
  {
    slug: 'private-banking-1400-miliardi-2026',
    title: 'Private banking, la corsa ai 1.400 miliardi: gestira un terzo della ricchezza italiana',
    excerpt: 'L\'Associazione italiana del settore prevede masse in crescita del 6,6% annuo. Nessun operatore si aspetta una contrazione. Gli alternativi pesano il 15% dei portafogli.',
    date: '2026-01-19',
    readTime: 4,
    category: 'Wealth',
    source: 'AIPB',
    sourceUrl: 'https://www.aipb.it/ricerche',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop',
    content: `
Il private banking italiano punta ai 1.400 miliardi di euro di masse gestite entro la fine del 2026. Un traguardo che, se raggiunto, porterebbe il settore a controllare il 36 per cento della ricchezza investibile delle famiglie italiane, in crescita rispetto al 30 per cento del 2022.

Le previsioni arrivano dall'Associazione Italiana Private Banking, che ha presentato l'outlook annuale del comparto. La crescita attesa e del 6,6 per cento medio annuo, trainata per il 4,2 per cento dai nuovi flussi e per il 2,4 per cento dalla performance dei mercati finanziari.

## Il consolidamento del settore

Il dato piu significativo riguarda la concentrazione del mercato. Le banche specializzate, da Intesa Sanpaolo Private Banking a UniCredit Private Banking, da Banca Aletti a Credem Euromobiliare, hanno incrementato la loro quota dal 19,1 al 22,8 per cento, erodendo spazio alle reti tradizionali.

E un segnale di maturita del settore, che premia gli operatori capaci di offrire servizi dedicati e consulenza personalizzata.

## La svolta degli alternativi

Nei portafogli piu sofisticati, gli investimenti alternativi hanno raggiunto il 15 per cento del totale. Private equity, private credit, infrastrutture e, in misura minore, criptovalute stanno ridisegnando l'asset allocation dei grandi patrimoni.

E una tendenza destinata a rafforzarsi, secondo gli operatori del settore. Il 56 per cento dei leader intervistati prevede che l'industria continuera a crescere nei prossimi dodici-diciotto mesi. Il restante 44 per cento si aspetta stabilita.

Nessuno prevede contrazione.
`
  },
  {
    slug: 'riforma-successioni-doppia-franchigia-2026',
    title: 'Successioni, la rivoluzione silenziosa: arriva la doppia franchigia da due milioni',
    excerpt: 'Con l\'eliminazione del coacervo, donazioni ed eredita saranno tassate separatamente. Per le famiglie con grandi patrimoni un risparmio che puo valere decine di migliaia di euro.',
    date: '2026-01-18',
    readTime: 5,
    category: 'Fiscalita',
    source: 'Fiscomania',
    sourceUrl: 'https://fiscomania.com/riforma-successioni',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop',
    content: `
Dal primo gennaio 2026 cambia tutto, o quasi, nella tassazione dei passaggi generazionali. Il decreto legislativo 139/2024 elimina il coacervo, la regola che obbligava a sommare le donazioni effettuate in vita all'eredita per calcolare l'imposta di successione.

E una rivoluzione silenziosa, che passa quasi inosservata nel dibattito pubblico ma che puo valere decine di migliaia di euro per le famiglie con patrimoni significativi.

## Come funzionava prima

Fino al 2025, le donazioni e l'eredita facevano cumulo ai fini del calcolo della franchigia. Se un genitore aveva donato 800mila euro al figlio in vita, e poi lasciava 500mila euro in eredita, la base imponibile era di 1,3 milioni. Sottratta la franchigia di un milione, restavano 300mila euro tassabili al 4 per cento: 12mila euro di imposta.

## Come funziona ora

Dal 2026, le due operazioni sono valutate separatamente. La donazione di 800mila euro resta sotto la franchigia di un milione: zero imposte. L'eredita di 500mila euro, anch'essa sotto il milione: zero imposte. Risparmio netto: 12mila euro.

In pratica, ogni figlio puo ricevere fino a due milioni di euro senza imposte: un milione via donazione, un milione via successione.

## Chi ne beneficia

Le famiglie con patrimoni immobiliari consistenti, quelle che vogliono trasferire partecipazioni societarie, i nuclei con piu figli. Per chi ha eredi multipli, il vantaggio si moltiplica: ogni figlio ha la sua doppia franchigia.

## L'autoliquidazione

Altra novita: l'imposta di successione si paga in autoliquidazione. L'erede calcola e versa quanto dovuto entro novanta giorni dalla dichiarazione. L'Agenzia delle Entrate ha due anni per i controlli.

Per le aziende di famiglia, restano confermate le agevolazioni: esenzione totale se l'attivita viene mantenuta per almeno cinque anni. Una norma che, combinata con l'eliminazione del coacervo, apre scenari di pianificazione successoria prima impensabili.
`
  },
  {
    slug: 'immobiliare-lusso-milano-outlook-2026',
    title: 'Immobiliare di lusso, Milano corre: prezzi su del 7 per cento, CityLife guida la carica',
    excerpt: 'Nel segmento prime le quotazioni toccano i 25mila euro al metro quadro. L\'effetto Olimpiadi attira investitori internazionali. Domanda superiore all\'offerta nelle zone centrali.',
    date: '2026-01-17',
    readTime: 5,
    category: 'Immobiliare',
    source: 'Nomisma',
    sourceUrl: 'https://www.nomisma.it/osservatorio-immobiliare',
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&h=630&fit=crop',
    content: `
Il mercato immobiliare di lusso milanese non conosce soste. Nel primo trimestre del 2026, i valori medi al metro quadro nel segmento prime hanno registrato un incremento del 5 per cento rispetto allo stesso periodo dell'anno precedente. Le previsioni parlano di un rialzo complessivo del 7 per cento entro dicembre.

A trainare la corsa e CityLife, il quartiere nato sulle ceneri della vecchia Fiera. Qui i prezzi sono saliti del 10 per cento in dodici mesi, con punte che sfiorano i 18mila euro al metro quadro per gli appartamenti nelle torri residenziali.

## La mappa dei prezzi

Il Quadrilatero della Moda resta il quartiere piu caro: tra i 18mila e i 25mila euro al metro quadro per gli immobili di rappresentanza. Brera si attesta tra i 15mila e i 20mila. Porta Venezia tra i 10mila e i 15mila. Isola, la zona emergente, oscilla tra gli 8mila e i 12mila.

## L'effetto Olimpiadi

I Giochi Invernali del 2026 stanno funzionando da acceleratore. L'esposizione mediatica internazionale ha attirato l'attenzione di investitori stranieri che vedono in Milano un hub per l'Europa meridionale, una citta con infrastrutture moderne e un mercato del lusso consolidato.

La domanda supera strutturalmente l'offerta, soprattutto nel centro storico dove le nuove costruzioni sono rare e gli immobili storici richiedono ristrutturazioni complete.

## Rendimenti e prospettive

Per gli investitori, il segmento lusso offre cap rate medi del 4-5 per cento, competitivi rispetto ad altre asset class. Le ristrutturazioni di palazzi storici possono generare valorizzazioni del 20-30 per cento.

Le proiezioni per i prossimi tre-cinque anni indicano una crescita annua del 2-4 per cento, sostenuta dall'attrattivita internazionale della citta e dalla scarsita di offerta nelle zone prime.
`
  },
  {
    slug: 'outlook-mercati-2026-jp-morgan-goldman',
    title: 'I mercati nel 2026 secondo J.P. Morgan e Goldman Sachs: le tre forze che definiranno il decennio',
    excerpt: 'Intelligenza artificiale, frammentazione geopolitica, inflazione persistente. Le grandi banche d\'investimento tracciano la rotta. Europa in ripresa, attenzione alla concentrazione.',
    date: '2026-01-16',
    readTime: 6,
    category: 'Mercati',
    source: 'J.P. Morgan Private Bank',
    sourceUrl: 'https://privatebank.jpmorgan.com/insights/outlook',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    content: `
Tre forze plasmeranno i mercati finanziari nel prossimo decennio. A individuarle e J.P. Morgan Private Bank, nel suo outlook annuale riservato alla clientela di alto profilo. Le stesse conclusioni emergono, con sfumature diverse, dall'analisi di Goldman Sachs e delle principali case d'investimento globali.

La prima forza e l'intelligenza artificiale. Non come moda passeggera, ma come trasformazione strutturale che ridisegnera produttivita, modelli di business e margini aziendali. I benefici, avvertono gli analisti, non saranno immediati ne distribuiti uniformemente. Distinguere i vincitori dai perdenti sara la sfida dei prossimi anni.

## Frammentazione e inflazione

La seconda forza e la frammentazione geopolitica. Le catene di fornitura si accorciano, il reshoring accelera, le tensioni commerciali si intensificano. Per le aziende significa costi piu alti e margini sotto pressione. Per gli investitori, la necessita di ripensare l'esposizione geografica.

La terza forza e l'inflazione persistente. I livelli resteranno strutturalmente piu elevati rispetto al decennio 2010-2020. La BCE prevede un'inflazione nell'Eurozona tra il 2,2 e il 2,5 per cento, con tassi al 2,5 per cento in calo graduale.

## Europa in ripresa

Il dato piu interessante riguarda l'Europa. Il rapporto tra investimenti e fatturato delle aziende europee ha raggiunto il livello piu alto dalla crisi finanziaria globale. La Germania ha varato politiche fiscali espansive. Le valutazioni restano contenute rispetto agli Stati Uniti.

Per gli investitori, e un'opportunita di diversificazione in un momento in cui i mercati americani appaiono concentrati e costosi.

## Il rischio concentrazione

Il pericolo principale, concordano tutti i report, non e un singolo evento catastrofico ma l'eccesso di concentrazione. I Magnifici 7 pesano troppo sugli indici. Se la narrazione sull'intelligenza artificiale dovesse deludere, l'impatto sarebbe rapido e significativo.

La parola chiave per il 2026 non e previsione. E resilienza.
`
  },
  {
    slug: 'monaco-yacht-show-2026-4-miliardi',
    title: 'Monaco Yacht Show, quattro miliardi di euro in banchina: il superyachting celebra i 35 anni',
    excerpt: 'Dal 23 al 26 settembre a Port Hercule oltre 125 imbarcazioni. Debutta Blue Wake, l\'hub della sostenibilita. Il primo giorno riservato agli invitati.',
    date: '2026-01-14',
    readTime: 4,
    category: 'Lifestyle',
    source: 'Monaco Yacht Show',
    sourceUrl: 'https://www.monacoyachtshow.com',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&h=630&fit=crop',
    content: `
Porto Hercule si prepara a ospitare la piu grande concentrazione di ricchezza galleggiante del pianeta. Dal 23 al 26 settembre 2026, il Monaco Yacht Show celebrera il suo trentacinquesimo anniversario con oltre 125 superyacht in esposizione, per un valore complessivo che sfiora i quattro miliardi di euro.

L'evento, nato nel 1991, si e trasformato nel corso dei decenni nel punto di riferimento mondiale per armatori, broker, cantieri e fornitori del settore. Oltre 560 espositori animeranno i quattro giorni della manifestazione, che si apre il mercoledi con una giornata riservata agli invitati e ai possessori del Sapphire Experience.

## L'ingresso al pubblico

Da giovedi a sabato, i cancelli si aprono al pubblico, con biglietti a partire da 690 euro per il pass giornaliero. Gli orari: dalle 10 alle 18.30, con chiusura anticipata alle 18 il sabato.

Non e un evento per curiosi. E un marketplace dove si concludono trattative da decine di milioni di euro, si commissionano nuove costruzioni, si pianificano charter per le prossime stagioni.

## Blue Wake, la svolta green

La novita del 2026 si chiama Blue Wake, evoluzione del Sustainability Hub lanciato nelle edizioni precedenti. Uno spazio dedicato alle tecnologie per ridurre l'impatto ambientale del superyachting: propulsioni di nuova generazione, materiali sostenibili per i refit, soluzioni per il trattamento delle acque.

E il segnale che anche il mondo degli yacht sta facendo i conti con la transizione ecologica, cercando di conciliare lusso estremo e responsabilita ambientale.

## Il mercato dei superyacht

Il settore continua a crescere nonostante le incertezze macroeconomiche. Gli ordini per imbarcazioni oltre i cinquanta metri sono in aumento, con tempi di consegna che si allungano a tre-cinque anni per le nuove costruzioni. Il charter registra una domanda record, soprattutto per Mediterraneo e Caraibi.

Per chi puo permetterselo, il superyacht resta l'ultima frontiera del lusso.
`
  },
  {
    slug: 'patek-philippe-1518-record-178-milioni-2026',
    title: 'Patek Philippe 1518, record mondiale a 17,8 milioni: l\'orologio piu caro mai venduto',
    excerpt: 'All\'asta Phillips di Ginevra un calendario perpetuo in oro rosa del 1950 riscrive la storia. Il Rolex Daytona "Paul Newman" tocca i 5,5 milioni.',
    date: '2026-01-13',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Phillips Watches',
    sourceUrl: 'https://www.phillips.com/watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=630&fit=crop',
    content: `
Diciassette milioni e ottocentomila dollari per un orologio da polso. E il nuovo record mondiale, stabilito all'asta Phillips di Ginevra per un Patek Philippe Reference 1518 in oro rosa del 1950.

Il pezzo, un calendario perpetuo con cronografo, apparteneva a una collezione privata europea e non era mai apparso sul mercato. La sua storia, tracciabile attraverso i registri della manifattura ginevrina, e impeccabile. Le condizioni, secondo gli esperti, eccezionali.

## Perche il 1518 vale cosi tanto

Il Reference 1518 occupa un posto speciale nella storia dell'orologeria. E il primo calendario perpetuo con cronografo prodotto in serie, realizzato da Patek Philippe tra il 1941 e il 1954. Ne esistono solo 281 esemplari, di cui appena 58 in oro rosa.

La combinazione di rarita assoluta, importanza storica e condizioni perfette ha scatenato una battaglia tra collezionisti che ha portato il prezzo a livelli mai visti.

## Gli altri record della serata

Ma il 1518 non e stato l'unico protagonista. Un Rolex Daytona "Paul Newman" del 1969, con quadrante esotico originale, ha raggiunto i 5,5 milioni di dollari. Un Patek Philippe 2499 in oro giallo del 1957 si e fermato a 4,2 milioni. Un A. Lange & Sohne Grand Complication del 2019 ha toccato i 2,8 milioni.

## Orologi come asset class

Per i collezionisti piu sofisticati, l'orologeria di alto livello e ormai un'asset class a tutti gli effetti. Offre portabilita del valore, assenza di tassazione patrimoniale, possibilita di utilizzo quotidiano e, per i pezzi giusti, potenziale di apprezzamento.

Le regole per investire restano pero rigorose: condizioni impeccabili, provenienza documentata, rarita certificata. E soprattutto pazienza. I migliori affari, nel mondo degli orologi, si fanno aspettando.
`
  },
  {
    slug: 'vino-borgogna-la-tache-1886-record-325000',
    title: 'Vino da record, una bottiglia di La Tache 1886 venduta a 325mila sterline',
    excerpt: 'All\'asta Christie\'s la cantina storica di Bouchard Pere & Fils. Incasso totale di 2,38 milioni. La Borgogna si riprende dopo la correzione del 40 per cento.',
    date: '2026-01-12',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Decanter',
    sourceUrl: 'https://www.decanter.com',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=630&fit=crop',
    content: `
Trecentoventicinquemila sterline per una singola bottiglia di vino. E il prezzo raggiunto da una La Tache 1886 all'asta Christie's dedicata alla cantina storica di Bouchard Pere & Fils, uno dei produttori piu prestigiosi della Borgogna.

La stima iniziale era di 19mila sterline. Il risultato finale l'ha superata di diciassette volte, confermando l'appetito dei collezionisti per i pezzi di eccezionale rarita e provenienza.

## L'asta Bouchard

L'intera vendita ha generato 2,38 milioni di sterline, con il cento per cento dei lotti aggiudicati. Un risultato che segnala la ripresa del mercato del fine wine dopo la pesante correzione degli ultimi anni.

Tra il 2022 e il 2025, i vini di Borgogna avevano perso tra il 25 e il 40 per cento del loro valore, dopo anni di crescita ininterrotta. Molti collezionisti avevano accumulato posizioni eccessive, e il mercato aveva bisogno di ritrovare equilibrio.

## I segnali di ripresa

Gli ultimi mesi mostrano segnali incoraggianti. La DRC La Tache 2018 ha guadagnato il 37 per cento in un anno. I grandi Bordeaux sono tornati a crescere del 5-8 per cento. Lo Champagne di prestigio registra incrementi del 3-5 per cento.

L'indice Cult Wines Burgundy segna un rendimento del 131 per cento dall'inizio del 2014.

## Dove investire nel 2026

Gli esperti indicano tre aree di interesse. In Borgogna, le annate 2016-2020 dei produttori di riferimento: DRC, Leroy, Roumier. In Bordeaux, i prezzi corretti offrono punti di ingresso interessanti sui First Growths delle annate 2015, 2016, 2019, 2020. Nello Champagne, Dom Perignon e Krug mostrano dinamiche positive, mentre Salon e Jacques Selosse attraggono i collezionisti piu esigenti.

Per chi vuole investire, le piattaforme specializzate come Liv-ex, Cult Wines e Berry Bros offrono accesso al mercato. Lo stoccaggio in bonded warehouse garantisce l'esenzione IVA. I costi di assicurazione oscillano tra lo 0,5 e l'1 per cento annuo del valore usage. L'orizzonte consigliato e di cinque-dieci anni.
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
