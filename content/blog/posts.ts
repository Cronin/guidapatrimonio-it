export interface ContentImage {
  src: string
  alt: string
  caption?: string
  credit?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: number
  category: string
  image?: string
  images?: ContentImage[] // Inline images from Wikipedia
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'yacht-costi-reali-proprieta',
    title: 'Quanto Costa Davvero Uno Yacht: La Guida per Chi Compra',
    excerpt: 'Il prezzo di acquisto è solo l\'inizio. Manutenzione, equipaggio, ormeggio, assicurazione: i costi reali della proprietà nautica.',
    date: '2025-01-23',
    readTime: 15,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Superyacht_A_in_Norway.jpg/1280px-Superyacht_A_in_Norway.jpg',
        alt: 'Superyacht A, uno dei più grandi yacht del mondo',
        caption: 'Superyacht "A" (119 metri) - Il costo di gestione annuale supera i 20 milioni di euro',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Port_Hercule_Monaco.jpg/1280px-Port_Hercule_Monaco.jpg',
        alt: 'Porto Ercole a Monaco, marina di lusso',
        caption: 'Port Hercule, Monaco - L\'ormeggio può costare fino a €400 al metro al giorno in alta stagione',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Yacht_Porto_Cervo.jpg/1280px-Yacht_Porto_Cervo.jpg',
        alt: 'Marina di Porto Cervo in Sardegna',
        caption: 'Porto Cervo, Costa Smeralda - Una delle destinazioni più esclusive del Mediterraneo',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## Il Vero Costo di Uno Yacht

La regola del 10% è nota a tutti gli armatori: **ogni anno spenderai circa il 10% del valore dello yacht in costi di gestione**. Uno yacht da 5 milioni costa 500.000 euro l'anno. Uno da 20 milioni, 2 milioni l'anno.

Ma questa è una semplificazione. Vediamo i numeri reali.

## Costi di Acquisto

### Yacht a Vela 15-20m
- **Nuovo:** €800.000 - €2.500.000
- **Usato (5 anni):** €500.000 - €1.500.000

### Yacht a Motore 20-30m
- **Nuovo:** €2.000.000 - €8.000.000
- **Usato (5 anni):** €1.200.000 - €5.000.000

### Superyacht 30-50m
- **Nuovo:** €8.000.000 - €30.000.000
- **Usato:** €5.000.000 - €20.000.000

## Costi Annuali di Gestione

### Equipaggio

Per uno yacht di 25 metri servono almeno 3-4 persone:
- **Capitano:** €60.000 - €120.000/anno
- **Primo ufficiale:** €40.000 - €60.000/anno
- **Marinaio:** €30.000 - €45.000/anno
- **Steward/Chef:** €35.000 - €55.000/anno

**Totale equipaggio:** €165.000 - €280.000/anno

A questo si aggiungono contributi, assicurazioni, vitto e alloggio.

### Ormeggio

I marina premium in Mediterraneo:
- **Porto Cervo:** €150 - €300/metro/giorno in alta stagione
- **Monaco:** €200 - €400/metro/giorno
- **Portofino:** €100 - €250/metro/giorno

Per uno yacht di 25m, l'ormeggio annuale in un buon marina costa **€80.000 - €150.000**.

### Manutenzione

- **Manutenzione ordinaria:** 3-5% del valore/anno
- **Refit importante (ogni 5-7 anni):** 10-20% del valore

### Carburante

Uno yacht a motore di 25m consuma 200-400 litri/ora. Con 200 ore di navigazione annue e gasolio a €1,5/litro:
- **€60.000 - €120.000/anno**

### Assicurazione

- **Corpo (hull):** 1-2% del valore
- **P&I (responsabilità):** €5.000 - €15.000/anno

## Strategie di Ottimizzazione

### 1. Bandiera e Registro

La scelta della bandiera impatta su:
- IVA (Malta, Isole del Canale)
- Requisiti equipaggio
- Ispezioni e certificazioni

Le bandiere più usate: **Malta, Isole Cayman, Isole Marshall, Isola di Man**.

### 2. Charter

Mettere lo yacht a charter può coprire il 30-50% dei costi annuali. Ma richiede:
- Certificazioni commerciali
- Equipaggio qualificato
- Disponibilità a "condividere" la barca

### 3. Fractional Ownership

Programmi come SeaNet o altre società permettono di possedere quote di yacht. Meno costi, meno disponibilità.

## Considerazioni Fiscali Italia

- **IVA:** 22% sul valore se importato da extra-UE
- **Regime del margine:** su yacht usati da privati
- **Ammortamento:** possibile se intestato a società e usato per charter

### Attenzione al Redditometro

L'Agenzia delle Entrate considera lo yacht un indicatore di capacità contributiva. Yacht oltre 10m possono far scattare accertamenti.

## Conclusione

Un yacht da 5 milioni costa davvero **700.000 - 900.000 euro l'anno** tutto compreso. È un lusso che richiede pianificazione patrimoniale seria.
`
  },
  {
    slug: 'private-jet-fractional-ownership',
    title: 'Private Jet: Proprietà, Fractional o Jet Card?',
    excerpt: 'Le tre opzioni per volare privato. Analisi dei costi, break-even point e quale soluzione conviene in base alle ore di volo annue.',
    date: '2025-01-22',
    readTime: 12,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gulfstream_G650_N650GA.jpg/1280px-Gulfstream_G650_N650GA.jpg',
        alt: 'Gulfstream G650, jet privato di lusso',
        caption: 'Gulfstream G650 - Il top di gamma dei jet privati (prezzo: circa $65 milioni)',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/NetJets_Europe_Cessna_680A_Citation_Latitude_CS-LAT.jpg/1280px-NetJets_Europe_Cessna_680A_Citation_Latitude_CS-LAT.jpg',
        alt: 'NetJets Citation Latitude',
        caption: 'Citation Latitude di NetJets - La fractional ownership rende accessibile il volo privato',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Embraer_Phenom_300_interior.jpg/1280px-Embraer_Phenom_300_interior.jpg',
        alt: 'Interno di un Embraer Phenom 300',
        caption: 'Interni di un Phenom 300 - Comfort e produttività ad alta quota',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## Le Tre Vie del Volo Privato

Chi vola più di 50 ore l'anno in privato deve porsi la domanda: **continuo a noleggiare o ha senso possedere?**

## Opzione 1: Charter On-Demand

**Ideale per:** meno di 50 ore/anno

### Costi Tipici (Europa)

| Categoria | Costo/ora | Esempio |
|-----------|-----------|---------|
| Light Jet | €3.500 - €5.000 | Citation CJ3 |
| Midsize | €5.000 - €7.500 | Citation XLS |
| Super-Midsize | €7.500 - €10.000 | Challenger 350 |
| Large Cabin | €10.000 - €15.000 | Falcon 900 |

**Pro:** Nessun impegno, paghi solo quando voli
**Contro:** Disponibilità non garantita, prezzi variabili

## Opzione 2: Jet Card

**Ideale per:** 25-100 ore/anno, prevedibilità

### Come Funziona

Acquisti un "pacchetto" di ore di volo prepagato. Prezzi fissi, disponibilità garantita (con preavviso).

### Costi Tipici

- **Light Jet 25 ore:** €100.000 - €150.000
- **Midsize 25 ore:** €150.000 - €200.000
- **Heavy Jet 25 ore:** €250.000 - €350.000

**Pro:** Prezzo fisso, disponibilità garantita
**Contro:** Le ore scadono (tipicamente 12-24 mesi)

## Opzione 3: Fractional Ownership

**Ideale per:** 50-200 ore/anno

### Come Funziona

Acquisti una quota dell'aeromobile (1/16, 1/8, 1/4). Ogni quota dà diritto a un certo numero di ore/anno.

### Esempio: NetJets

- **1/16 di un Phenom 300:** ~€700.000 + €15.000/mese + €2.500/ora
- **Ore incluse:** ~50/anno

### Costi Totali Annui (stima 50 ore)

- Quota mensile: €180.000
- Ore di volo: €125.000
- **Totale:** ~€305.000/anno

## Opzione 4: Full Ownership

**Ideale per:** 200+ ore/anno

### Costi di Acquisto

| Aeromobile | Nuovo | Usato (5 anni) |
|------------|-------|----------------|
| Phenom 300 | €10M | €6-7M |
| Citation Latitude | €18M | €12-14M |
| Challenger 350 | €27M | €18-22M |
| Gulfstream G650 | €65M | €40-50M |

### Costi Operativi Annui (200 ore)

Per un midsize jet come il Citation Latitude:
- **Equipaggio (2 piloti):** €250.000
- **Hangaraggio:** €50.000 - €100.000
- **Manutenzione:** €300.000 - €500.000
- **Carburante:** €400.000 - €600.000
- **Assicurazione:** €80.000 - €120.000
- **Management fee:** €100.000 - €150.000

**Totale:** €1.200.000 - €1.500.000/anno

### Break-Even Analysis

| Ore/Anno | Soluzione Ottimale |
|----------|-------------------|
| < 25 | Charter on-demand |
| 25-50 | Jet Card |
| 50-150 | Fractional |
| 150-250 | Fractional o proprietà condivisa |
| > 250 | Full ownership |

## Considerazioni Fiscali

### Proprietà Personale
- IVA 22% recuperabile solo se l'aereo è usato per attività economica
- No ammortamento

### Proprietà Societaria
- Ammortamento in 8 anni
- IVA detraibile se uso aziendale documentato
- Fringe benefit se uso promiscuo

### Strutture Ottimizzate
- Società di leasing in Irlanda o Malta
- Wet lease per charter

## Conclusione

Per chi vola 100 ore/anno, il **fractional** è spesso la soluzione ottimale: costi prevedibili, nessun pensiero di gestione, flotta moderna.
`
  },
  {
    slug: 'arte-come-investimento',
    title: 'Arte come Investimento: Guida per Collezionisti Seri',
    excerpt: 'Non è solo passione. L\'arte può essere un asset class. Rendimenti storici, costi nascosti, fiscalità e come costruire una collezione.',
    date: '2025-01-21',
    readTime: 14,
    category: 'Investimenti Alternativi',
    image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        alt: 'Notte Stellata di Van Gogh',
        caption: '"Notte Stellata" di Van Gogh - Le opere dei maestri sono considerate beni rifugio',
        credit: 'Wikipedia Commons / MoMA'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Christies_South_Kensington_auction_house.jpg/1280px-Christies_South_Kensington_auction_house.jpg',
        alt: 'Christie\'s casa d\'aste',
        caption: 'Christie\'s, una delle principali case d\'asta - Le commissioni possono raggiungere il 25%',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Art_Basel_2018_%2842166584645%29.jpg/1280px-Art_Basel_2018_%2842166584645%29.jpg',
        alt: 'Art Basel fiera d\'arte contemporanea',
        caption: 'Art Basel - La fiera d\'arte più importante al mondo per il mercato primario',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## L'Arte come Asset Class

Negli ultimi 25 anni, l'indice Artprice100 (le 100 opere più vendute all'asta) ha reso il **8,5% annuo**. Comparabile all'azionario, ma con caratteristiche diverse.

## Perché i Grandi Patrimoni Investono in Arte

### 1. Decorrelazione
L'arte non segue i mercati finanziari. Durante la crisi del 2008, mentre le azioni perdevano il 50%, l'arte contemporanea scendeva solo del 25%.

### 2. Protezione dall'Inflazione
Le opere di maestri riconosciuti tendono a mantenere il valore reale nel tempo.

### 3. Passione + Rendimento
È l'unico investimento che puoi appendere in salotto.

### 4. Pianificazione Successoria
L'arte può essere trasferita con strumenti fiscalmente efficienti.

## I Numeri del Mercato

### Volume Globale
- **2023:** $65 miliardi
- **Top 3 mercati:** USA (42%), Cina (19%), UK (17%)
- **Italia:** ~2% del mercato globale

### Rendimenti per Categoria (ultimi 20 anni)

| Categoria | Rendimento Annuo |
|-----------|-----------------|
| Arte Contemporanea | 9-12% |
| Impressionisti | 6-8% |
| Old Masters | 3-5% |
| Arte Moderna | 7-9% |

## Costi Nascosti

### Commissioni d'Asta
- **Compratore:** 20-25% del prezzo di aggiudicazione
- **Venditore:** 5-15% del prezzo

Su un'opera da €1 milione:
- Paghi €1.200.000 - €1.250.000
- Se rivendi a €1 milione, ricevi €850.000 - €950.000

### Conservazione e Assicurazione
- **Assicurazione:** 0.3-0.5% del valore/anno
- **Caveau climatizzato:** €50 - €200/mq/anno
- **Restauro:** variabile, può essere significativo

### Autenticazione
- **Expertise:** €500 - €5.000 per opera
- **Analisi scientifiche:** €2.000 - €10.000

## Come Costruire una Collezione

### Budget Minimo Consigliato
Per una collezione "seria" che possa apprezzarsi: **€500.000+**

Con meno, il rischio di comprare opere che non manterranno valore è alto.

### Strategia

1. **Specializzati:** Un periodo, una scuola, un movimento
2. **Qualità > Quantità:** Meglio 5 opere eccellenti che 20 mediocri
3. **Provenienza:** La storia dell'opera conta
4. **Condizioni:** Restauri importanti deprimono il valore
5. **Documentazione:** Certificati, cataloghi ragionati, expertise

### Dove Comprare

- **Case d'asta:** Christie's, Sotheby's, Phillips, Bonhams
- **Gallerie:** Relazione diretta con l'artista
- **Fiere:** Art Basel, Frieze, TEFAF
- **Privato:** Attenzione a provenienza e autenticità

## Fiscalità in Italia

### Plusvalenze
- **Privati:** Non tassate se l'opera è detenuta da più di 5 anni e non è attività speculativa
- **Speculazione:** Tassazione ordinaria (fino al 43%)

### IVA
- **Importazione da extra-UE:** 10% (regime del margine) o 22%
- **Acquisto in Italia:** 22% o regime del margine

### Successione
L'arte rientra nell'asse ereditario. Valutazione spesso favorevole rispetto al mercato.

### Bonus
- **Art Bonus:** Detrazione 65% per donazioni a musei pubblici

## Investire in Arte senza Comprare Opere

### Fondi d'Arte
- **Anthea Art Investments**
- **The Fine Art Group**
- **Masterworks** (frazionamento opere)

Ticket minimo: €100.000 - €500.000

### Azioni di Case d'Asta
- **Sotheby's** (privata dal 2019)
- **Christie's** (privata, Pinault)

## Red Flags

- Artisti "emergenti" pompati da una sola galleria
- Prezzi che salgono troppo in fretta
- Opere senza provenienza chiara
- Mercanti che garantiscono rendimenti

## Conclusione

L'arte è un investimento per chi ha già diversificato il patrimonio e cerca **decorrelazione, passione e potenziale apprezzamento**. Non è per chi cerca liquidità o rendimenti certi.
`
  },
  {
    slug: 'residenza-fiscale-monaco-svizzera',
    title: 'Residenza Fiscale: Monaco, Svizzera o Restare in Italia?',
    excerpt: 'Analisi comparata per chi considera il trasferimento. Requisiti, costi reali, vantaggi fiscali e cosa significa davvero "cambiare residenza".',
    date: '2025-01-20',
    readTime: 18,
    category: 'Fiscalità',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Monaco_City_001.jpg/1280px-Monaco_City_001.jpg',
        alt: 'Panorama del Principato di Monaco',
        caption: 'Il Principato di Monaco - Zero imposte sul reddito, ma costo della vita tra i più alti al mondo',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Lugano_view.jpg/1280px-Lugano_view.jpg',
        alt: 'Lugano, Svizzera',
        caption: 'Lugano, Canton Ticino - Destinazione preferita degli italiani per la vicinanza e la lingua',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Geneve_pont_du_Mont-Blanc.jpg/1280px-Geneve_pont_du_Mont-Blanc.jpg',
        alt: 'Ginevra, Svizzera',
        caption: 'Ginevra - Hub della finanza internazionale e sede di molti family office',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## Il Trasferimento di Residenza Fiscale

Ogni anno centinaia di italiani facoltosi valutano il trasferimento all'estero. Ma **quanti lo fanno davvero nel modo corretto?**

L'Agenzia delle Entrate contesta sempre più spesso le residenze fittizie. Le sanzioni possono essere devastanti.

## Monaco: Il Principato

### Requisiti di Ingresso

- **Deposito bancario:** €500.000 - €1.000.000 presso banca monegasca
- **Contratto d'affitto:** Minimo €3.000 - €5.000/mese per un monolocale
- **Fedina penale pulita**
- **Referenze bancarie**

### Fiscalità

- **IRPEF:** 0% (non esiste imposta sul reddito per residenti)
- **Successione:** 0% tra parenti stretti
- **IVA:** 20%
- **Capital gain:** 0%

### Costo della Vita

| Voce | Costo Mensile |
|------|--------------|
| Affitto monolocale | €3.000 - €5.000 |
| Affitto 3 locali | €8.000 - €20.000 |
| Acquisto al mq | €50.000 - €100.000 |

### Pro e Contro

**Pro:**
- Zero imposte sul reddito
- Sicurezza eccezionale
- Posizione strategica
- Network di HNWI

**Contro:**
- Costo della vita altissimo
- Spazio limitato
- Difficile avere la residenza effettiva se si lavora altrove
- Controlli italiani serrati

## Svizzera: Canton Ticino e Regime dei Globalisti

### Opzione 1: Forfait Fiscale (Globalisti)

Per chi non lavora in Svizzera. Tassazione basata sulle spese di vita, non sul reddito.

**Requisiti:**
- Non avere mai avuto residenza svizzera
- Non lavorare in Svizzera

**Costo:**
- Imposta calcolata su 7x il costo dell'alloggio
- Minimo imponibile: CHF 400.000 - CHF 1.000.000 (varia per cantone)
- Aliquota: ~25-35%
- **Imposta minima:** CHF 100.000 - €250.000/anno

### Opzione 2: Tassazione Ordinaria

- **Aliquota marginale:** 35-40% (federale + cantonale + comunale)
- **Capital gain:** 0% per privati
- **Dividendi:** Tassati come reddito
- **Successione:** Varia per cantone, spesso 0% tra parenti stretti

### Costo della Vita (Lugano)

| Voce | Costo |
|------|-------|
| Affitto 4 locali | CHF 4.000 - €8.000/mese |
| Acquisto villa | CHF 3M - €15M |
| Scuola internazionale | CHF 30.000 - €50.000/anno |

## Italia: Regime dei Neo-Residenti (Flat Tax €100.000)

### Come Funziona

Chi trasferisce la residenza in Italia dopo 9 anni all'estero può optare per:
- **€100.000/anno** di imposta sostitutiva su tutti i redditi esteri
- **€25.000/anno** per ogni familiare
- Durata: 15 anni

### Requisiti

- Residenza fiscale estera per almeno 9 dei 10 anni precedenti
- Trasferimento effettivo della residenza in Italia

### Cosa Copre

- Redditi di lavoro esteri
- Dividendi esteri
- Capital gain esteri
- Redditi immobiliari esteri

### Cosa NON Copre

- Redditi di fonte italiana (tassati normalmente)
- Capital gain su partecipazioni italiane

## Exit Tax e Controlli

### Exit Tax Italiana

Chi trasferisce la residenza in uno Stato non collaborativo deve pagare:
- **26%** sulle plusvalenze latenti su partecipazioni qualificate

### Come l'Italia Ti Controlla

L'Agenzia delle Entrate verifica:
- Iscrizione AIRE
- Utenze intestate in Italia
- Conti correnti italiani
- Presenza di familiari
- Viaggi (dati delle compagnie aeree)
- Attività sui social media
- Proprietà immobiliari

### La Regola dei 183 Giorni

Per essere residente all'estero devi:
- Passare **meno di 183 giorni** in Italia
- Avere il **domicilio** (centro degli affetti e interessi) all'estero
- Essere iscritto all'**AIRE**

**Attenzione:** Tutti e tre i requisiti devono essere soddisfatti. La sola iscrizione AIRE non basta.

## Confronto Economico

**Scenario:** Reddito annuo €2.000.000

| Paese | Imposta Annua |
|-------|--------------|
| Italia (regime ordinario) | ~€860.000 |
| Italia (flat tax) | €100.000 + tasse su redditi IT |
| Svizzera (forfait) | €150.000 - €250.000 |
| Monaco | €0 |

## La Scelta Giusta

### Monaco se:
- Puoi permetterti il costo della vita
- Non hai bisogno di lavorare in Italia
- Vuoi zero tasse
- Accetti di vivere davvero lì

### Svizzera se:
- Vuoi qualità della vita elevata
- Hai famiglia (scuole eccellenti)
- Accetti una tassazione moderata
- Vuoi rimanere vicino all'Italia

### Italia (Flat Tax) se:
- I tuoi redditi sono principalmente esteri
- Vuoi vivere in Italia
- Non vuoi rinunciare allo stile di vita italiano

## Conclusione

Il trasferimento di residenza fiscale è un'operazione complessa che richiede **pianificazione seria**, non improvvisazione. Le residenze "di comodo" vengono contestate sempre più spesso.

Consulta un fiscalista internazionale prima di muoverti.
`
  },
  {
    slug: 'family-office-quando-conviene',
    title: 'Family Office: Quando Ha Senso e Quanto Costa',
    excerpt: 'Single family office vs multi family office. I costi reali, il patrimonio minimo, i servizi offerti e come scegliere.',
    date: '2025-01-19',
    readTime: 10,
    category: 'Wealth Management',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Rockefeller_Center_complex_from_Top_of_the_Rock.jpg/1280px-Rockefeller_Center_complex_from_Top_of_the_Rock.jpg',
        alt: 'Rockefeller Center, sede storica del Rockefeller Family Office',
        caption: 'Rockefeller Center - La famiglia Rockefeller ha creato il moderno concetto di family office',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bahnhofstrasse_ZH.jpg/800px-Bahnhofstrasse_ZH.jpg',
        alt: 'Bahnhofstrasse, Zurigo',
        caption: 'Bahnhofstrasse, Zurigo - Concentrazione di private bank e family office',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## Cos'è un Family Office

Un family office è una **struttura dedicata alla gestione del patrimonio di una famiglia facoltosa**. Si occupa di:

- Gestione investimenti
- Pianificazione fiscale
- Passaggio generazionale
- Gestione immobiliare
- Concierge e lifestyle
- Filantropia
- Governance familiare

## Single vs Multi Family Office

### Single Family Office (SFO)

Struttura dedicata esclusivamente a una famiglia.

**Patrimonio minimo consigliato:** €50-100 milioni

**Costi:**
- **Staff:** €500.000 - €2.000.000/anno
- **Infrastruttura:** €100.000 - €300.000/anno
- **Consulenti esterni:** €200.000 - €500.000/anno
- **Totale:** €800.000 - €3.000.000/anno

**Pro:**
- Totale personalizzazione
- Riservatezza assoluta
- Nessun conflitto di interesse

**Contro:**
- Costi fissi elevati
- Difficile attrarre talenti top
- Rischio di "single point of failure"

### Multi Family Office (MFO)

Struttura che serve più famiglie, condividendo costi e competenze.

**Patrimonio minimo:** €5-20 milioni

**Costi:**
- **Fee fissa:** €50.000 - €200.000/anno
- **Fee su AUM:** 0.3% - 1%/anno

**Pro:**
- Costi accessibili
- Team multidisciplinare
- Best practices condivise

**Contro:**
- Meno personalizzazione
- Potenziali conflitti tra famiglie
- Riservatezza inferiore

## Quando Ha Senso un Family Office

### Patrimonio
- **< €5M:** Private banking tradizionale
- **€5-30M:** Multi family office
- **€30-100M:** MFO premium o SFO leggero
- **> €100M:** Single family office

### Complessità
Un family office ha senso quando la famiglia ha:
- Attività imprenditoriali attive
- Immobili in più paesi
- Esigenze di passaggio generazionale
- Membri con interessi diversi
- Necessità di governance strutturata

## Servizi Tipici

### Core
- Asset allocation e gestione portafoglio
- Selezione fondi e gestori
- Risk management
- Reporting consolidato

### Fiscale e Legale
- Ottimizzazione fiscale
- Strutture holding
- Trust e fondazioni
- Compliance internazionale

### Real Estate
- Acquisizioni e vendite
- Property management
- Sviluppo immobiliare

### Lifestyle
- Gestione staff domestico
- Viaggi e jet
- Arte e collezioni
- Sicurezza personale

### Next Gen
- Educazione finanziaria
- Governance familiare
- Patti di famiglia
- Filantropia

## Come Scegliere un Multi Family Office

### Red Flags
- Fee non trasparenti
- Prodotti proprietari (conflitto di interesse)
- Promesse di rendimento
- Poca esperienza nel tuo settore

### Domande da Fare
1. Qual è il vostro modello di fee?
2. Avete prodotti proprietari?
3. Chi sono i vostri partner per fiscalità/legale?
4. Quante famiglie servite e con che patrimonio medio?
5. Posso parlare con clienti esistenti?

## I Migliori Family Office in Italia

### Multi Family Office Indipendenti
- **Tosetti Value**
- **Patrimonia**
- **Finint Private Bank (MFO)**
- **Fiduciaria Antonveneta**

### Private Bank con Servizi MFO
- **UBS Italia**
- **Credit Suisse (ora UBS)**
- **Julius Baer**
- **Lombard Odier**

## Conclusione

Un family office ha senso quando la complessità del patrimonio supera le capacità di gestione di una singola banca privata. Non è questione solo di dimensioni, ma di **esigenze**.

Per patrimoni tra €5 e €30 milioni, un **multi family office indipendente** è spesso la scelta migliore: costi ragionevoli, competenze elevate, nessun conflitto di interesse.
`
  },
  {
    slug: 'private-equity-accesso-investitori-privati',
    title: 'Private Equity: Come Accedere per Investitori Privati',
    excerpt: 'Non più solo per istituzionali. Fondi di fondi, co-investimenti, secondario: le vie per accedere al PE con ticket da €100k.',
    date: '2025-01-18',
    readTime: 13,
    category: 'Investimenti Alternativi',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=630&fit=crop',
    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/BlackRock_headquarters_in_New_York_City.jpg/1280px-BlackRock_headquarters_in_New_York_City.jpg',
        alt: 'BlackRock headquarters New York',
        caption: 'Sede BlackRock a New York - Uno dei maggiori gestori di fondi PE al mondo',
        credit: 'Wikipedia Commons'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/NYSE127.jpg/1024px-NYSE127.jpg',
        alt: 'New York Stock Exchange',
        caption: 'NYSE - Il private equity offre rendimenti decorrelati dai mercati pubblici',
        credit: 'Wikipedia Commons'
      }
    ],
    content: `
## Perché il Private Equity

Negli ultimi 20 anni, il private equity ha sovraperformato i mercati pubblici di **3-5% annuo** (premium di illiquidità).

| Asset Class | Rendimento Annuo (20 anni) |
|-------------|---------------------------|
| PE Buyout | 13-15% |
| PE Growth | 15-18% |
| S&P 500 | 9-10% |
| MSCI World | 7-8% |

Ma l'accesso è sempre stato riservato a istituzionali e UHNWI.

## Le Vie di Accesso

### 1. Fondi Diretti (Difficile)

**Ticket minimo:** €5-10 milioni

I fondi PE tradizionali (KKR, Blackstone, Carlyle) richiedono impegni minimi elevati e investitori qualificati.

**Per chi:** Family office e UHNWI con patrimonio > €50M

### 2. Fondi di Fondi

**Ticket minimo:** €100.000 - €500.000

Investono in un portafoglio di 15-25 fondi PE, offrendo diversificazione.

**Pro:**
- Diversificazione automatica
- Accesso a fondi top-tier
- Gestione professionale

**Contro:**
- Doppio strato di commissioni (1.5% + 10% sul fondo di fondi, più le fee dei fondi sottostanti)
- Rendimento netto inferiore

**Esempi:**
- Partners Group
- HarbourVest
- Neuberger Berman

### 3. Feeder Funds

**Ticket minimo:** €125.000 (ELTIF) - €500.000

Veicoli che aggregano capitali di più investitori per accedere a un singolo fondo PE.

**In Italia:**
- ELTIF (European Long-Term Investment Fund)
- FIA riservati

### 4. Piattaforme di Secondario

**Ticket minimo:** €50.000 - €200.000

Acquisto di quote di fondi PE esistenti sul mercato secondario.

**Pro:**
- J-curve ridotta (il fondo ha già investito)
- Visibilità sul portafoglio
- Spesso a sconto sul NAV

**Piattaforme:**
- Moonfare
- iCapital
- Titanbay

### 5. Co-Investimenti

**Ticket minimo:** €250.000 - €1.000.000

Investimento diretto a fianco di un fondo PE in una specifica operazione.

**Pro:**
- Zero o basse commissioni di gestione
- Cherry-picking delle opportunità
- Allineamento con il GP

**Contro:**
- Richiede competenze di valutazione
- Concentrazione del rischio
- Deal flow limitato

## La J-Curve

Il private equity ha un profilo di rendimento particolare:

- **Anni 1-3:** Rendimenti negativi (commissioni + investimenti)
- **Anni 4-6:** Rendimenti crescenti
- **Anni 7-10:** Realizzi e distribuzioni

**Non investire in PE se hai bisogno di liquidità nei prossimi 7-10 anni.**

## Fiscalità in Italia

### Tassazione Capital Gain
- **26%** sulle plusvalenze realizzate

### ELTIF
- Esenzione fiscale se detenuti per almeno 5 anni e < 30% in Italia
- Patrimonio massimo investibile: €300.000/anno per i non professionali

### Fondi Esteri
- Rilevante il monitoraggio fiscale (quadro RW)
- IVAFE: 0.2% sul valore

## Quanto Allocare

**Regola prudenziale:** Non più del 10-15% del patrimonio in private equity.

**Motivi:**
- Illiquidità totale
- Impossibilità di disinvestire rapidamente
- Capital call imprevedibili

## Red Flags

- Fondi che promettono rendimenti garantiti
- Assenza di track record verificabile
- Strutture commissionaliopache
- Pressione a investire rapidamente

## Come Iniziare

1. **Verifica di essere investitore qualificato** (patrimonio > €500k o esperienza)
2. **Scegli la via di accesso** (feeder, fondo di fondi, secondario)
3. **Diversifica su più vintage** (non tutto nello stesso anno)
4. **Prepara la liquidità** per le capital call
5. **Monitora il portafoglio** con reporting trimestrale

## Conclusione

Il private equity non è più inaccessibile. Con €100.000-500.000 puoi costruire un'esposizione diversificata tramite ELTIF, feeder fund o piattaforme specializzate.

Ma ricorda: è un investimento **illiquido e a lungo termine**. Adatto solo a chi ha già un patrimonio ben diversificato e non ha bisogno di quella liquidità per 7-10 anni.
`
  },
]

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}
