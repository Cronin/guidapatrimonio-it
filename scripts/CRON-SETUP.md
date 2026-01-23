# Cron Setup for GuidaPatrimonio Scrapers

I dati finanziari vengono aggiornati automaticamente tramite scraper che raccolgono:
- **BCE rates**: Tassi di interesse della Banca Centrale Europea
- **BTP yields**: Rendimenti dei titoli di stato italiani e spread BTP-Bund
- **ISTAT inflation**: Dati sull'inflazione italiana (se disponibile)
- **Borsa Italiana**: Indici di borsa (se disponibile)

## Quick Setup

Aggiungi al crontab (`crontab -e`):

```bash
# GuidaPatrimonio - Run all scrapers every 6 hours
0 */6 * * * /Users/claudiocronin/websites/sites/guidapatrimonio.it/scripts/run-all-scrapers.sh >> /tmp/guidapatrimonio-scrapers.log 2>&1
```

## Setup Granulare (Alternativo)

Se preferisci controllare singolarmente ogni scraper:

```bash
# BCE rates - once daily at 8am (rates change rarely, only on ECB meeting days)
0 8 * * * cd /Users/claudiocronin/websites/sites/guidapatrimonio.it && npx tsx scripts/scrapers/bce-rates.ts >> /tmp/guidapatrimonio-bce.log 2>&1

# BTP yields - every 6 hours during market hours (Mon-Fri, 9am-6pm CET)
0 9,12,15,18 * * 1-5 cd /Users/claudiocronin/websites/sites/guidapatrimonio.it && npx tsx scripts/scrapers/btp-yields.ts >> /tmp/guidapatrimonio-btp.log 2>&1

# ISTAT inflation - once daily (monthly data, rarely changes)
0 7 * * * cd /Users/claudiocronin/websites/sites/guidapatrimonio.it && npx tsx scripts/scrapers/istat-inflazione.ts >> /tmp/guidapatrimonio-istat.log 2>&1

# Borsa Italiana - every hour during market hours
0 9-17 * * 1-5 cd /Users/claudiocronin/websites/sites/guidapatrimonio.it && npx tsx scripts/scrapers/borsa-italiana.ts >> /tmp/guidapatrimonio-borsa.log 2>&1
```

## Comandi Utili

### Check logs
```bash
# Log principale
tail -f /tmp/guidapatrimonio-scrapers.log

# Ultimi 50 righe
tail -50 /tmp/guidapatrimonio-scrapers.log

# Cerca errori
grep -i error /tmp/guidapatrimonio-scrapers.log
```

### Manual run
```bash
cd /Users/claudiocronin/websites/sites/guidapatrimonio.it

# Tutti gli scraper
./scripts/run-all-scrapers.sh

# Singoli scraper
npx tsx scripts/scrapers/bce-rates.ts
npx tsx scripts/scrapers/btp-yields.ts
```

### Verifica crontab
```bash
# Lista cron jobs attivi
crontab -l

# Modifica crontab
crontab -e
```

### Verifica dati salvati
```bash
# BCE rates
cat data/scraped/bce-rates.json | jq .

# BTP yields
cat data/scraped/btp-yields.json | jq .

# Lista tutti i file scraped
ls -la data/scraped/
```

## Output Files

I dati vengono salvati in `data/scraped/`:

| File | Descrizione | Frequenza consigliata |
|------|-------------|----------------------|
| `bce-rates.json` | Tassi BCE (deposit, refinancing, lending) | 1x/giorno |
| `btp-yields.json` | Rendimenti BTP (2Y, 5Y, 10Y, 30Y) + spread | 4x/giorno (market hours) |
| `istat-inflazione.json` | Indice inflazione ISTAT | 1x/giorno |
| `borsa-italiana.json` | Indici FTSE MIB | 1x/ora (market hours) |

## Troubleshooting

### Lo scraper non trova npx/tsx
Assicurati che il PATH includa node:
```bash
# Aggiungi all'inizio del crontab
PATH=/usr/local/bin:/opt/homebrew/bin:$PATH
```

### Errori di permessi
```bash
chmod +x /Users/claudiocronin/websites/sites/guidapatrimonio.it/scripts/run-all-scrapers.sh
```

### Yahoo Finance blocca le richieste
Gli scraper hanno un delay di 500ms tra le richieste e usano dati di fallback se l'API non risponde.

### BCE API non disponibile
Lo scraper BCE usa dati di fallback con i tassi storici conosciuti se l'API ECB non risponde.
