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
    title: 'Milano Prima al Mondo per Concentrazione di Milionari: 1 Ogni 12 Abitanti',
    excerpt: 'Il rapporto Henley & Partners conferma Milano come la citta con il piu alto tasso di HNWI al mondo. Superata New York e Londra.',
    date: '2026-01-23',
    readTime: 4,
    category: 'Wealth',
    source: 'Henley & Partners',
    sourceUrl: 'https://www.ansa.it/sito/notizie/economia/2026/01/16/hp-a-milano-il-piu-alto-tasso-di-milionari-al-mondo_909b14b3-24b6-4fc9-8b95-e465fd425741.html',
    image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=1200&h=630&fit=crop',
    content: `
## Milano Batte New York e Londra

Secondo l'ultimo rapporto di Henley & Partners, Milano si posiziona al primo posto mondiale per concentrazione di milionari: **uno ogni 12 abitanti iscritti all'anagrafe**.

Il confronto con le altre metropoli globali e impietoso:
- **Milano:** 1 milionario ogni 12 abitanti
- **New York:** 1 ogni 22 abitanti
- **Londra:** 1 ogni 41 abitanti
- **Roma:** 1 ogni 54 abitanti

## I Numeri di Milano

La citta conta oggi **182 centimilionari** (patrimonio liquido superiore a 100 milioni di dollari), quasi quanto il Principato di Monaco (192) e piu dell'intero cantone di Zurigo.

Questo posiziona Milano come hub finanziario di riferimento per l'Europa meridionale.

## Perche Milano Attrae i Ricchi

I fattori chiave:
- **Flat Tax neo-residenti** (anche se aumentata a €300.000)
- **Qualita della vita** e clima
- **Hub per fashion, design e finanza**
- **Posizione strategica** nel cuore dell'Europa
- **Ecosistema di private banking** sviluppato

## Impatto sul Mercato Immobiliare

La concentrazione di HNWI spinge i prezzi nelle zone prime:
- **Brera:** €15.000-20.000/mq
- **CityLife:** €12.000-18.000/mq
- **Quadrilatero:** €18.000-25.000/mq

## Prospettive

Con i Giochi Olimpici Invernali 2026 alle porte, l'esposizione mediatica internazionale potrebbe attrarre ulteriori capitali e talenti nella citta.
`
  },
  {
    slug: 'italia-terza-meta-milionari-2026',
    title: 'Italia Terzo "Porto Sicuro" dei Milionari: +3.600 HNWI nel 2025',
    excerpt: 'Dopo Emirati e USA, l\'Italia e la meta preferita degli High Net Worth Individuals. Tasse, lifestyle e clima i fattori decisivi.',
    date: '2026-01-22',
    readTime: 5,
    category: 'Wealth',
    source: 'Henley Private Wealth Migration Report',
    sourceUrl: 'https://www.quotidiano.net/economia/italia-milionari-tasse-stile-vita-clima-dd5bdfc4',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=630&fit=crop',
    content: `
## Il Flusso dei Milionari verso l'Italia

L'Italia ha registrato un saldo positivo di **+3.600 milionari** in ingresso nel 2025, posizionandosi al terzo posto mondiale dopo:

| Paese | Saldo Milionari 2025 |
|-------|---------------------|
| Emirati Arabi | +9.800 |
| Stati Uniti | +7.500 |
| **Italia** | **+3.600** |
| Svizzera | +2.900 |
| Singapore | +2.500 |

## Chi Sono i "Milionari"

La definizione del report si riferisce alla **liquid investable wealth** (ricchezza liquidabile rapidamente):
- Partecipazioni quotate
- Cash e depositi
- Obbligazioni
- Criptovalute
- **Esclusi gli immobili**

Soglia minima: **1 milione di dollari**.

## Perche Scelgono l'Italia

### Fiscalita Prevedibile
Il regime dei neo-residenti (flat tax su redditi esteri) offre certezza fiscale per 15 anni.

### Qualita della Vita
Clima, gastronomia, cultura, sanita privata di alto livello.

### Posizione Strategica
Hub per il Mediterraneo e l'Europa, con collegamenti aerei eccellenti.

### Immobiliare
Prezzi ancora competitivi rispetto a Londra, Monaco o Zurigo per proprieta di prestigio.

## I Numeri degli HNWI in Italia

| Categoria | Soglia | Numero |
|-----------|--------|--------|
| Sub-HNWI | >€250k | 3 milioni |
| HNWI | >€1M | 470.000 |
| Very-HNWI | >€5M | 94.000 |
| Ultra-HNWI | >€30M | 5.800 |
| Centimilionari | >€100M | 2.300 |
| Miliardari | >€1B | 71 |

## Trend Futuro

Entro il 2048, si stima che **83,5 trilioni di dollari** saranno trasferiti alle nuove generazioni (Gen X, Millennials, Gen Z). L'Italia, con la sua attrattivita per HNWI, potrebbe intercettare una quota significativa di questo passaggio generazionale.
`
  },
  {
    slug: 'ferrari-250-gto-38-milioni-mecum-2026',
    title: 'Ferrari 250 GTO Venduta a $38.5 Milioni: Record a Mecum Kissimmee',
    excerpt: 'La "Bianco Speciale" unica al mondo acquistata dal collezionista David Lee. Enzo triplica il record a $17.9M.',
    date: '2026-01-21',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Hagerty / duPont Registry',
    sourceUrl: 'https://news.dupontregistry.com/blogs/events/ferrari-dominates-mecum-kissimmee-2026',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=630&fit=crop',
    content: `
## Record Assoluto per la 250 GTO Bianca

La **Ferrari 250 GTO "Bianco Speciale"** (telaio 3729GT), l'unica al mondo in questo colore, e stata venduta per **$38.500.000** all'asta Mecum Kissimmee 2026.

L'acquirente e il noto collezionista **David Lee**, gia proprietario di diverse Ferrari iconiche.

## L'Enzo Triplica il Record

Una Ferrari Enzo Giallo Modena della Bachman Collection ha raggiunto **$17.875.000**, triplicando il precedente record per il modello (circa $6M nel 2023).

Un'altra Enzo in Rosso Dino - l'unica prodotta in questo colore - ha toccato $11.1 milioni.

## I Numeri dell'Asta

| Modello | Prezzo | Note |
|---------|--------|------|
| 250 GTO Bianco | $38.500.000 | Unica al mondo |
| Enzo Giallo | $17.875.000 | 3x record precedente |
| F50 Rosso | $12.210.000 | Nuovo record modello |
| LaFerrari Aperta | $11.000.000 | Hypercar moderna |
| Enzo Rosso Dino | $11.110.000 | Colore unico |

**Totale vendite Mecum:** $441 milioni - il doppio del record precedente.

## Cambio di Paradigma

I risultati segnano un cambio nel mercato Ferrari:

- Le **hypercar anni '80-2000** ora superano molte classiche degli anni '50-'60
- L'Enzo, F40, F50 e LaFerrari sono diventati "classici moderni" da investimento
- La provenienza e i bassi chilometraggi comandano premi enormi

## Per il Collezionista

Cosa significa per chi investe in auto:
- Le Ferrari moderne a tiratura limitata sono ormai asset class
- La storia del veicolo conta quanto il modello
- I colori unici o le prime produzioni valgono multipli
`
  },
  {
    slug: 'oro-record-5000-dollari-2026',
    title: 'Oro Verso i $5.000: Le Banche d\'Investimento Alzano i Target',
    excerpt: 'Goldman Sachs vede €4.900, J.P. Morgan €5.055, Citi prevede €5.000 in tre mesi. Le banche centrali continuano ad accumulare.',
    date: '2026-01-20',
    readTime: 5,
    category: 'Mercati',
    source: 'Milano Finanza / Confinvest',
    sourceUrl: 'https://www.milanofinanza.it/news/oro-verso-5-000-dollari-nel-2026-con-la-nuova-guerra-dei-dazi-vontobel-in-portafoglio-al-3-5-202601191128147390',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=630&fit=crop',
    content: `
## Performance Straordinaria dell'Oro

L'oro ha chiuso il 2025 con una performance del **+67%**, il miglior risultato dal 1979.

All'inizio del 2026, le quotazioni si aggirano intorno ai **$4.668/oncia**, non lontane dal record storico di $4.690 toccato a fine dicembre.

## Target delle Banche d'Investimento

| Banca | Target 2026 | Orizzonte |
|-------|-------------|-----------|
| Goldman Sachs | $4.900 | Dicembre 2026 |
| J.P. Morgan | $5.055 | Q4 2026 |
| Citigroup | $5.000 | 3 mesi |
| Vontobel | $4.800 | Fine anno |

## I Driver del Rialzo

### Banche Centrali
Le banche centrali continuano ad accumulare oro. Oggi possiedono piu oro che titoli del Tesoro USA - un cambio storico.

### De-Dollarizzazione
Ken Griffin, CEO di Citadel: *"Le persone cominciano a vedere l'oro come un porto sicuro nei confronti del dollaro. Stiamo assistendo a una sostanziale fuga di chi cerca un modo per de-dollarizzare."*

### Tassi in Calo
La Fed accomodante riduce il costo opportunita di detenere oro (che non paga interessi).

### Geopolitica
Conflitti e tensioni internazionali alimentano la domanda di beni rifugio.

## Allocazione Consigliata

Gli esperti suggeriscono una quota del **3-5%** del portafoglio in oro fisico o ETC per:
- Protezione dall'inflazione
- Copertura rischi geopolitici
- Hedge contro debolezza del dollaro

## Come Investire

### Oro Fisico
- Lingotti (da 1g a 1kg)
- Monete (Krugerrand, Maple Leaf, Filarmonica)
- Costo di custodia: 0.5-1%/anno

### ETC
- Invesco Physical Gold
- iShares Physical Gold
- Xetra-Gold
- TER: 0.12-0.25%

### Attenzione
L'oro non produce reddito. E adatto come diversificatore, non come asset principale.
`
  },
  {
    slug: 'private-banking-1400-miliardi-2026',
    title: 'Private Banking: 1.400 Miliardi di Masse Entro Fine 2026',
    excerpt: 'AIPB prevede crescita del 6,6% annuo. Il settore gestira il 36% della ricchezza investibile delle famiglie italiane.',
    date: '2026-01-19',
    readTime: 4,
    category: 'Wealth',
    source: 'AIPB / Wall Street Italia',
    sourceUrl: 'https://www.wallstreetitalia.com/private-banking-entro-il-2026-il-gestira-il-36-della-ricchezza-degli-italiani/',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop',
    content: `
## Crescita del Private Banking

Secondo l'Associazione Italiana Private Banking (AIPB), il settore raggiungera **1.412 miliardi di euro** di masse gestite entro fine 2026.

Questo rappresenta il **36% della ricchezza investibile** delle famiglie italiane, in crescita rispetto al 30% del 2022.

## I Numeri

| Metrica | Valore |
|---------|--------|
| Masse gestite 2026 | €1.412 miliardi |
| Crescita media annua | 6,6% |
| Quota ricchezza famiglie | 36% |
| Ricchezza totale famiglie | ~€4.000 miliardi |

## Driver della Crescita

### Nuovi Flussi (+4,2%)
Affluenti che diventano HNWI e nuova ricchezza generata.

### Performance Mercati (+2,4%)
Ripresa dei mercati finanziari dopo la volatilita 2023-2024.

### Consolidamento
Le banche private specializzate guadagnano quote rispetto alle reti tradizionali.

## Trend del Settore

### Specializzazione
I player specializzati (ISP Private Banking, UniCredit Private Banking, Banca Aletti, Credem Euromobiliare) hanno aumentato la quota dal 19,1% al 22,8%.

### Alternative in Crescita
L'asset mix nei portafogli sofisticati vede:
- Private equity: 5-8%
- Private credit: 3-5%
- Infrastrutture: 2-4%
- Cripto: 1-3%

Totale alternativi: **15%** (in crescita)

### ESG
La sostenibilita sta ridisegnando le priorita sia per i gestori che per la clientela.

## Outlook

Il 56% dei leader di settore prevede che l'industria continuera a crescere nei prossimi 12-18 mesi, mentre il 44% si aspetta stabilita.

Nessuno prevede contrazione.

## Per l'Investitore

Se il tuo patrimonio supera il milione di euro, valuta il passaggio da una banca commerciale a un private banker dedicato. I vantaggi:
- Consulenza personalizzata
- Accesso a prodotti esclusivi
- Reporting consolidato
- Pianificazione successoria
`
  },
  {
    slug: 'riforma-successioni-doppia-franchigia-2026',
    title: 'Successioni 2026: Arriva la Doppia Franchigia da 2 Milioni',
    excerpt: 'Eliminato il coacervo. Donazioni e successioni valutate separatamente: si potranno sommare due franchigie da €1 milione ciascuna.',
    date: '2026-01-18',
    readTime: 5,
    category: 'Fiscalita',
    source: 'Fiscomania / Money.it',
    sourceUrl: 'https://fiscomania.com/riforma-successioni-quanto-si-risparmiera/',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop',
    content: `
## La Grande Novita: Fine del Coacervo

Il D.Lgs. 139/2024 elimina dal 2026 il **coacervo** - la regola che obbligava a sommare le donazioni ricevute in vita all'eredita per calcolare l'imposta di successione.

## Come Funzionava Prima

Se un genitore aveva donato €800.000 al figlio in vita, e poi lasciava €500.000 in eredita:
- Base imponibile: €800.000 + €500.000 = €1.300.000
- Franchigia: €1.000.000
- Imponibile: €300.000
- Imposta (4%): €12.000

## Come Funziona dal 2026

Le due operazioni sono valutate **separatamente**:

**Donazione:**
- Valore: €800.000
- Franchigia: €1.000.000
- Imposta: €0

**Successione:**
- Valore: €500.000
- Franchigia: €1.000.000
- Imposta: €0

**Risparmio:** €12.000

## La Doppia Franchigia

In pratica, si possono trasferire fino a **€2.000.000** senza imposte:
- €1.000.000 via donazione
- €1.000.000 via successione

## Chi Beneficia di Piu

- Famiglie con patrimonio immobiliare consistente
- Genitori che vogliono trasferire partecipazioni societarie
- Nuclei con piu figli (ogni figlio ha la sua doppia franchigia)

## Autoliquidazione

Altra novita: l'imposta di successione si paga in **autoliquidazione**.

L'erede calcola e versa l'imposta entro 90 giorni dalla dichiarazione di successione. L'Agenzia delle Entrate ha 2 anni per i controlli.

## Passaggi Aziendali

Confermate le agevolazioni per trasferimenti di aziende tra coniugi o genitori-figli:
- **Esenzione totale** se l'attivita viene mantenuta per almeno 5 anni

## Trust

La riforma chiarisce il trattamento dei trust:
- Imposta dovuta al momento del trasferimento ai beneficiari
- Applicabile se beni in Italia o disponente residente

## Azioni da Intraprendere

1. **Rivalutare** le donazioni gia effettuate
2. **Pianificare** donazioni prima della successione
3. **Consultare** un notaio per ottimizzare la struttura
4. **Documentare** tutto per i controlli fiscali
`
  },
  {
    slug: 'immobiliare-lusso-milano-outlook-2026',
    title: 'Immobiliare di Lusso Milano: Prezzi +7% nel 2026, Boom CityLife',
    excerpt: 'Il segmento prime registra €10.000-25.000/mq. CityLife +10% in un anno. Olimpiadi Invernali attraggono investitori esteri.',
    date: '2026-01-17',
    readTime: 5,
    category: 'Immobiliare',
    source: 'Nomisma / Tailor Made Real Estate',
    sourceUrl: 'https://milano.notizie.it/cronaca-milano/2026/01/12/analisi-del-mercato-immobiliare-di-lusso-a-milano-nel-2026-4/',
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&h=630&fit=crop',
    content: `
## Il Mercato Prime di Milano

Nel 2026, il valore medio al metro quadrato nel segmento lusso ha registrato un incremento del **+5%** rispetto all'anno precedente, con previsioni di crescita totale del **+7%** entro fine anno.

## Prezzi per Zona

| Zona | Prezzo/mq |
|------|-----------|
| Quadrilatero della Moda | €18.000 - €25.000 |
| Brera | €15.000 - €20.000 |
| CityLife | €12.000 - €18.000 |
| Porta Venezia | €10.000 - €15.000 |
| Isola | €8.000 - €12.000 |

## CityLife: +10% in un Anno

CityLife si conferma l'area con la crescita piu rapida:
- Progetti di riqualificazione completati
- Torri residenziali iconiche
- Servizi premium integrati
- Parco pubblico attrattivo

## Driver del Mercato

### Olimpiadi Invernali 2026
L'esposizione mediatica internazionale aumenta la visibilita di Milano come destinazione di investimento.

### Milionari in Ingresso
Con +3.600 HNWI in Italia nel 2025 (molti a Milano), la domanda di immobili prime aumenta.

### Offerta Limitata
Poche nuove costruzioni nel centro storico. La domanda supera l'offerta.

### Rendimenti Interessanti
Cap rate medio per immobili di lusso: **4-5%**, competitivo rispetto ad altre asset class.

## Opportunita di Investimento

### Ristrutturazioni
Immobili storici da ristrutturare offrono potenziale di valorizzazione del 20-30%.

### Nuove Costruzioni Premium
Progetti come Porta Nuova 2.0 e nuovi sviluppi in zona Scalo di Porta Romana.

## Consigli per Investitori

1. **Focus su location prime** - Centro storico, Brera, CityLife
2. **Qualita edilizia** - Preferire nuove costruzioni o ristrutturazioni complete
3. **Servizi** - Portineria, sicurezza, parcheggio sono must-have
4. **Terrazzo/Vista** - Premium significativo per esposizioni uniche

## Prospettive

Il mercato del lusso milanese dovrebbe continuare a crescere del **+2-4%** annuo nei prossimi 3-5 anni, sostenuto da:
- Attrattivita internazionale
- Scarsita di offerta
- Consolidamento di Milano come hub finanziario europeo
`
  },
  {
    slug: 'outlook-mercati-2026-jp-morgan-goldman',
    title: 'Outlook 2026: Cosa Dicono J.P. Morgan e Goldman Sachs',
    excerpt: 'AI, frammentazione e inflazione le tre forze del decennio. Europa in fase di rinnovamento. Attenzione alla concentrazione nei portafogli.',
    date: '2026-01-16',
    readTime: 6,
    category: 'Mercati',
    source: 'J.P. Morgan Private Bank',
    sourceUrl: 'https://privatebank.jpmorgan.com/eur/it/insights/latest-and-featured/outlook',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    content: `
## Le Tre Forze del Decennio

J.P. Morgan Private Bank identifica tre macro-trend che definiranno i mercati:

### 1. Intelligenza Artificiale
L'AI influenzera produttivita, investimenti e utili. Ma i benefici non sono immediati ne uguali per tutte le aziende.

### 2. Frammentazione Geopolitica
Supply chain che si accorciano, reshoring, tensioni commerciali. Impatto su costi e margini.

### 3. Inflazione Persistente
Livelli strutturalmente piu alti rispetto al decennio 2010-2020.

## Scenario Macro 2026

| Metrica | Previsione |
|---------|------------|
| PIL Globale | +3,1% |
| PIL Italia | +0,7% |
| Inflazione Eurozona | 2,2-2,5% |
| Tassi BCE | 2,5% (in calo) |

## Azionario: Opportunita e Rischi

### Valutazioni Elevate
Paralleli con la bolla delle dotcom. Gli hyperscaler hanno investito massicciamente in AI - ma i rendimenti non sono ancora visibili.

### Concentrazione Pericolosa
I "Magnifici 7" pesano troppo sugli indici. Se la narrazione AI delude, l'impatto sara rapido.

### Europa in Ripresa
Rapporto CapEx/vendite al massimo dalla crisi finanziaria. Politiche fiscali espansive (Germania). Valutazioni piu contenute degli USA.

## Obbligazionario

Divergenze ampie tra paesi. Opportunita per chi e attivo nell'allocazione:
- **USA:** Rendimenti elevati, duration interessante
- **Europa:** Spread corporate ancora attraenti
- **Emergenti:** Selettivita necessaria

## Raccomandazioni per HNWI

### Diversificazione Geografica
Non solo USA. Europa e Asia emergenti offrono opportunita a valutazioni inferiori.

### Alternativi
Private equity, private credit, infrastrutture. Quota consigliata: 10-20% del portafoglio.

### Oro
3-5% come hedge contro inflazione e rischi geopolitici.

### Cash
Mantenere liquidita per opportunita tattiche. I rendimenti del cash sono ancora positivi in termini reali.

## La Parola Chiave: Resilienza

I report sono allineati sui rischi: piu che un singolo evento, il pericolo principale e l'eccesso di concentrazione.

Costruire portafogli resilienti, non ottimizzati per un singolo scenario.
`
  },
  {
    slug: 'dividendi-tassazione-2026-family-office',
    title: 'Nuova Tassa sui Dividendi: Allarme per Family Office e HNWI',
    excerpt: 'Il DDL Bilancio 2026 introduce una stretta che impatta gli investimenti illiquidi. Cosa cambia per le partecipazioni qualificate.',
    date: '2026-01-15',
    readTime: 4,
    category: 'Fiscalita',
    source: 'We Wealth',
    sourceUrl: 'https://www.we-wealth.com/news/nuova-tassa-dividendi-allarme-family-office-hnwi',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop',
    content: `
## La Stretta sui Dividendi

Il DDL Bilancio 2026 introduce modifiche alla tassazione dei dividendi che impattano particolarmente:
- Family office
- Holdings familiari
- HNWI con partecipazioni qualificate

## Cosa Cambia

### Prima
Dividendi da partecipazioni qualificate: tassati al 26% con possibilita di compensazione con minusvalenze.

### Dal 2026
Nuove limitazioni sulla compensabilita e trattamento meno favorevole per strutture di investimento illiquido.

## Impatto sui Family Office

I family office italiani tipicamente:
- Detengono partecipazioni in societa operative
- Investono in private equity
- Hanno strutture holding per ottimizzazione fiscale

Le nuove norme riducono l'efficienza di queste strutture.

## Strategie di Adattamento

### 1. Revisione Holding Structure
Valutare se le holding esistenti rimangono efficienti.

### 2. PIR Alternativi
I PIR alternativi mantengono vantaggi fiscali per investimenti in PMI italiane.

### 3. ELTIF
Gli ELTIF offrono ancora esenzione fiscale per detenzioni superiori a 5 anni.

### 4. Exit Prima della Riforma
Per partecipazioni con plusvalenze latenti significative, valutare realizzo anticipato.

## Confronto Internazionale

| Paese | Tassazione Dividendi |
|-------|---------------------|
| Italia | 26% + nuove limitazioni |
| Svizzera | ~35% (con credito) |
| UK | 39,35% (top rate) |
| Lussemburgo | 0% (holding regimi) |

## Consulenza Necessaria

Le modifiche richiedono una revisione delle strutture patrimoniali esistenti. Consultare un fiscalista prima di fine anno per:
- Valutare l'impatto specifico
- Identificare opportunita di ottimizzazione
- Pianificare azioni correttive
`
  },
  {
    slug: 'monaco-yacht-show-2026-4-miliardi',
    title: 'Monaco Yacht Show 2026: €4 Miliardi di Superyacht in Esposizione',
    excerpt: 'Oltre 125 yacht, 560 espositori. Debutta Blue Wake per la sostenibilita. Pass da €690, ma il mercoledi e solo su invito.',
    date: '2026-01-14',
    readTime: 4,
    category: 'Lifestyle',
    source: 'Monaco Yacht Show / Boat International',
    sourceUrl: 'https://www.monacoyachtshow.com/en',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&h=630&fit=crop',
    content: `
## Il Gioiello del Superyachting

Il Monaco Yacht Show 2026 celebra il suo **35° anniversario** dal 23 al 26 settembre a Port Hercule.

Con circa **4 miliardi di dollari** di yacht in esposizione, e l'evento di riferimento mondiale per UHNWI interessati al settore nautico.

## I Numeri

| Metrica | Valore |
|---------|--------|
| Yacht esposti | 125+ |
| Valore totale | ~€4 miliardi |
| Espositori | 560+ |
| Visitatori attesi | 30.000+ |

## Accesso Esclusivo

- **Mercoledi 23:** Solo su invito o Sapphire Experience
- **Giovedi-Sabato:** Pass generale da €690/giorno
- **Orari:** 10:00-18:30 (sabato fino alle 18:00)

## Novita 2026: Blue Wake

L'evoluzione del Sustainability Hub introduce:
- Sistemi di propulsione next-gen
- Materiali di refit sostenibili
- Tecnologie a basso impatto ambientale

## Adventure Area

Lanciata nel 2022, presenta:
- Tender di lusso
- Water toys high-tech
- Veicoli esclusivi (auto, moto, elicotteri)

## Design & Innovation Hub

Presentazioni live di yacht designer e architetti navali. Esperienze immersive con le ultime innovazioni del settore.

## Il Mercato Superyacht

Il settore continua a crescere nonostante le incertezze macro:
- Ordini in aumento per yacht 50m+
- Tempi di consegna: 3-5 anni per nuove costruzioni
- Charter: domanda record per Mediterraneo e Caraibi
`
  },
  {
    slug: 'patek-philippe-1518-record-178-milioni-2026',
    title: 'Patek Philippe 1518: Venduto a $17.8 Milioni, Nuovo Record Mondiale',
    excerpt: 'Il calendario perpetuo in oro rosa del 1950 batte ogni record. Rolex Daytona Paul Newman a $5.5M. Il mercato degli orologi esplode.',
    date: '2026-01-13',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Phillips Watches / Hodinkee',
    sourceUrl: 'https://www.phillips.com/auctions/auction/watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=630&fit=crop',
    content: `
## Record Assoluto per Patek Philippe

Un **Patek Philippe 1518** in oro rosa del 1950 e stato venduto per **$17.800.000** all'asta Phillips di Ginevra, stabilendo il nuovo record mondiale per un orologio da polso.

## I Top Lot dell'Asta

| Orologio | Prezzo | Anno |
|----------|--------|------|
| Patek 1518 oro rosa | $17.800.000 | 1950 |
| Rolex Daytona "Paul Newman" | $5.500.000 | 1969 |
| Patek 2499 oro giallo | $4.200.000 | 1957 |
| A. Lange & Sohne Grand Comp. | $2.800.000 | 2019 |

## Perche il 1518 Vale Cosi Tanto

Il Reference 1518 e il primo calendario perpetuo con cronografo prodotto in serie:
- Solo **281 esemplari** prodotti (1941-1954)
- Appena **58 in oro rosa**
- Questo esemplare: condizioni eccezionali, provenienza impeccabile

## Il Mercato degli Orologi di Lusso

Dopo la correzione del 2023-2024, il mercato si e stabilizzato:
- **Patek Philippe:** sempre forte, soprattutto complicazioni
- **Rolex vintage:** Paul Newman e "Tropical" in ripresa
- **Indipendenti:** F.P. Journe, MB&F in crescita

## Orologi come Asset Class

Per HNWI, gli orologi offrono:
- Portabilita del valore
- Nessuna tassazione patrimoniale
- Piacere d'uso quotidiano
- Potenziale apprezzamento

## Consigli per Collezionisti

1. **Condizioni:** Solo esemplari in condizioni eccellenti
2. **Provenienza:** Documentazione completa e storico
3. **Rarita:** Edizioni limitate o varianti rare
4. **Pazienza:** I migliori affari si fanno aspettando
`
  },
  {
    slug: 'vino-borgogna-la-tache-1886-record-325000',
    title: 'Vino Record: La Tache 1886 Venduta a £325.000 da Christie\'s',
    excerpt: 'Asta storica Bouchard Pere & Fils: £2.38M totali. Borgogna in ripresa dopo -40%. DRC La Tache 2018 +37% in un anno.',
    date: '2026-01-12',
    readTime: 5,
    category: 'Lifestyle',
    source: 'Decanter / Christie\'s',
    sourceUrl: 'https://www.decanter.com/premium/wine-investment-modest-growth-for-top-burgundies-573239/',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=630&fit=crop',
    content: `
## Asta Storica per Bouchard Pere & Fils

Christie's ha battuto la cantina storica di Bouchard Pere & Fils, uno dei produttori piu prestigiosi della Borgogna.

**Risultati:**
- Totale vendite: **£2.38 milioni**
- 100% dei lotti venduti
- Star lot: **La Tache 1886** a £325.000 (stima: £19.000)

## Il Mercato del Fine Wine

Dopo una correzione del **25-40%** dal picco 2022, il mercato mostra segni di stabilizzazione:

| Indice | Performance 2025 |
|--------|------------------|
| DRC La Tache 2018 | +37% |
| Bordeaux Top Chateaux | +5-8% |
| Champagne Prestige | +3-5% |
| Burgundy Index (dal 2014) | +131% |

## Fine Wine come Investimento

Vantaggi per HNWI:
- Correlazione bassa con mercati finanziari
- Protezione dall'inflazione
- Possibilita di consumo (godimento diretto)
- Esenzione IVA per stoccaggio bonded

## Dove Investire nel 2026

### Borgogna
- En Primeur 2024 in arrivo Q1
- Focus su annate 2016-2020
- DRC, Leroy, Roumier sempre ricercati

### Bordeaux
- Prezzi corretti, entry point interessante
- First Growths: Lafite, Latour, Margaux
- Annate 2015, 2016, 2019, 2020

### Champagne
- Dom Perignon, Krug in crescita
- Salon, Jacques Selosse per collezionisti

## Come Investire

- **Piattaforme:** Liv-ex, Cult Wines, Berry Bros
- **Stoccaggio:** Bonded warehouse per esenzione IVA
- **Assicurazione:** 0.5-1% del valore annuo
- **Orizzonte:** 5-10 anni per risultati ottimali
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
