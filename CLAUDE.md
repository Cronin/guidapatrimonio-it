# Claude Code Instructions - GuidaPatrimonio.it

## DESIGN RULES - CRITICAL

### COLOR PALETTE - DO NOT CHANGE

This site uses a **GREEN** color scheme. Do not change to navy, blue, or any other color.

**Primary Colors:**
- `forest`: `#1B4D3E` - Primary dark green (headings, dark backgrounds)
- `green-600`: `#2D6A4F` - Buttons, backgrounds
- `green-500`: `#368859` - Mid tone
- `green-400`: `#40916C` - Primary CTA, accents
- `green-300`: `#52B788` - Highlights on dark backgrounds
- `green-250`: `#74C69D`
- `green-200`: `#95D5B2`
- `green-100`: `#B7E4C7`
- `green-50`: `#D8F3DC` - Light backgrounds

**Neutral Colors:**
- `black`: `#333438`
- `cream`: `#fcfcfa` - Page background
- `cream-dark`: `#f7f5f0` - Section backgrounds

**NEVER USE:**
- Navy (`#0d1b2a`)
- Gold (`#C9A227`)
- Gradients of any kind

---

### NO GRADIENTS - ABSOLUTE RULE

**NEVER use gradients anywhere:**
- Hero overlays must be SOLID colors
- Buttons must be SOLID colors
- Backgrounds must be SOLID colors
- No `bg-gradient-to-*` classes
- No `linear-gradient()` in CSS

**Example - CORRECT:**
```css
.hero-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
```

**Example - WRONG:**
```css
.hero-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
}
```

---

## HOME IMAGE - NEVER TOUCH

**DO NOT CHANGE THE HERO IMAGE**

The forest image in the Hero MUST remain ALWAYS:
```
https://images.unsplash.com/photo-1542273917363-3b1817f69a2d
```

**REASON**: The client specifically chose this image. Never change it.

---

## IMAGES - RULES

**NEVER use stock photos (Unsplash, Pexels, etc) for new images.**

For new images use ONLY:
1. **Wikipedia Agent** (`4d-wikipedia-image-fetcher`) - For real images of places, buildings, famous people
2. **AI Gemini** (`4e-logo-generator` or `realistic-photo-generator`) - For generated images

**Exception**: The existing Home/Hero image (forest) stays as is.

---

## PARTNER AND MESSAGING

This site does lead generation for a Swiss partner (not named).

**Key messages:**
- "Partner with headquarters in Geneva, Switzerland"
- "CSSF Regulation"
- "Corporate High-Yield Bonds"
- "Portfolios over 150K EUR"
- "Passive income from bond coupons"

**DO NOT mention:**
- Partner name (Geneve Invest) - only "Swiss partner"
- Specific service prices
- Return guarantees

---

## CONTACT FORM

Qualification threshold: **>= 150,000 EUR**

- If portfolio < 150K: message "use free tools"
- If portfolio >= 150K: loading + "you will be contacted by Geneva partner"

---

## EMAIL - CRITICAL RULES

**Mailgun domain**: `mg.guidapatrimonio.it`

**Send emails ONLY to**: `info@guidapatrimonio.it`

**NEVER EVER:**
- Send to `24prontocom@gmail.com`
- Use `mg.bord.dev` domain
- Add CC or BCC to any other email
- Hardcode external email addresses

This site is SEPARATE from 24pronto/Bord. Never mix email configurations.

---

## FILE STRUCTURE

```
components/
  Hero.tsx       - DO NOT TOUCH IMAGE
  About.tsx      - Uses Wikipedia Zurich image
  CTA.tsx        - Green forest background
  Contact.tsx    - Contact form section
  ContactForm.tsx - Lead qualification logic
  Footer.tsx     - Forest green background
  Navbar.tsx     - Transparent on hero
  WhoWeHelp.tsx  - Client types cards
  HowWeHelp.tsx  - Forest green steps section

app/
  page.tsx       - Home page
  globals.css    - Color definitions (DO NOT CHANGE COLORS)

tailwind.config.ts - Color palette (DO NOT CHANGE COLORS)
```

---

## DEPLOY

```bash
git add .
git commit -m "description"
git push
```

Auto-deploy to Vercel on push to main.

---

## BOSS WHATSAPP INTEGRATION

**Boss Emanuele:** +39 347 394 6608

Quando Boss manda task via WhatsApp:
1. Rispondi "TASK X PRESA IN CARICO!" con breve descrizione
2. Esegui la modifica
3. Push automatico (MAI chiedere all'utente)
4. Screenshot della modifica
5. Invia screenshot + conferma "TASK X COMPLETATA!"

### Task Numbering
Continua dalla numerazione esistente. Ultima task: **TASK 14** (2026-01-27).

### Siti Autorizzati per Boss
Boss puo' richiedere modifiche SOLO per:
- guidapatrimonio.it
- cybersecuritydome.com

Se chiede modifiche ad altri siti → rispondi che non hai accesso.

---

## MODIFICHE RECENTI

### TASK 13 (2026-01-27)
- `formatCurrency()` mostra "100k" invece di "100.000 €"
- Y-axis min calcolato dinamicamente da `Math.min(...proiezioni.map(p => p.conservativo))`

### TASK 14 (2026-01-27)
- Hover tooltip sul grafico proiezioni in `ContactForm.tsx`
- Linea verticale tratteggiata
- Pallini colorati su ogni strategia
- Tooltip in alto a destra con Anno + valori
