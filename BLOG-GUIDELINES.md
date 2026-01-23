# Blog Guidelines - GuidaPatrimonio.it

## Target: UHNWI (Ultra High Net Worth Individuals)

Il blog è per chi investe **€100k+ fino a milioni**. NO contenuti da "poveracci".

### Argomenti OK
- Yacht (costi reali, gestione, bandiere)
- Private jet (proprietà, fractional, jet card)
- Arte come investimento
- Residenza fiscale (Monaco, Svizzera, Flat Tax Italia)
- Family office (single vs multi)
- Private equity
- Luxury real estate
- Trust, holding, passaggio generazionale

### Argomenti NO
- Budget 50/30/20
- Fondo emergenza
- Come risparmiare €100/mese
- PAC per principianti
- Qualsiasi cosa per chi ha meno di €100k

---

## Struttura Articoli

### 1. Featured Image
- Solo da Unsplash (funzionano sempre)
- URL format: `https://images.unsplash.com/photo-XXXXX?w=1200&h=630&fit=crop`
- NO Wikipedia Commons (immagini spesso rotte o bloccate)

### 2. Table of Contents
- Posizione: **SOPRA l'articolo**, non sidebar
- Mostra solo H2 (titoli principali)
- Layout: lista orizzontale numerata
- Label: "Contenuti" (non "In questo articolo")

```tsx
// Esempio corretto
<nav className="bg-white rounded-xl p-6 mb-8">
  <p className="text-xs text-gray-400 uppercase mb-3">Contenuti</p>
  <ol className="flex flex-wrap gap-x-6 gap-y-2">
    {/* Solo H2, numerati, inline */}
  </ol>
</nav>
```

### 3. Contenuto
- H2 per sezioni principali (5-8 max)
- H3 per sottosezioni
- Tabelle per confronti e dati
- Liste puntate per elenchi
- **Bold** per cifre e concetti chiave

### 4. NO Gallery/Immagini Inline
- Le immagini Wikipedia/Commons sono spesso bloccate
- Se servono immagini inline, usare SOLO Unsplash
- Meglio nessuna immagine che immagini rotte

---

## Struttura File

```
content/blog/posts.ts
```

### Interface BlogPost
```typescript
export interface BlogPost {
  slug: string          // URL-friendly, es: "yacht-costi-reali"
  title: string         // Titolo completo
  excerpt: string       // 1-2 frasi per preview
  content: string       // Markdown-like content
  date: string          // YYYY-MM-DD
  readTime: number      // minuti (stima)
  category: string      // "Lifestyle", "Fiscalità", "Wealth Management", etc.
  image?: string        // SOLO Unsplash URL
}
```

### NO questi campi
```typescript
// MAI aggiungere:
images?: ContentImage[]  // Gallerie rotte
wikipediaImages?: any    // Non funzionano
```

---

## Design

### Colori
- Verde forest: `#1a3c34` (bg-forest)
- Crema: `#faf9f6` (bg-cream)
- Grigio testo: `text-gray-600`
- Verde accent: `text-green-600`

### NO blu, NO viola
Il sito usa SOLO verde/grigio. Mai usare `blue-*` o `purple-*`.

---

## Checklist Prima di Pubblicare

- [ ] Argomento per UHNWI (€100k+)
- [ ] Featured image da Unsplash
- [ ] TOC semplice in alto (solo H2)
- [ ] Nessuna immagine Wikipedia
- [ ] Nessuna galleria
- [ ] Solo colori verde/grigio
- [ ] Dati e cifre reali/verificabili
