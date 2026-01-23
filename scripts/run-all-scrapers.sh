#!/bin/bash
# Run all scrapers for guidapatrimonio.it
#
# Usage: ./scripts/run-all-scrapers.sh
# Cron:  0 */6 * * * /Users/claudiocronin/websites/sites/guidapatrimonio.it/scripts/run-all-scrapers.sh >> /tmp/guidapatrimonio-scrapers.log 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "========================================"
echo "$(date): Starting scraper run..."
echo "Working directory: $PROJECT_DIR"
echo "========================================"

# BCE Interest Rates
echo ""
echo "[1/4] Running BCE rates scraper..."
if [ -f "scripts/scrapers/bce-rates.ts" ]; then
    npx tsx scripts/scrapers/bce-rates.ts
    echo "BCE rates: OK"
else
    echo "BCE rates scraper not found, skipping"
fi

# BTP Yields
echo ""
echo "[2/4] Running BTP yields scraper..."
if [ -f "scripts/scrapers/btp-yields.ts" ]; then
    npx tsx scripts/scrapers/btp-yields.ts
    echo "BTP yields: OK"
else
    echo "BTP yields scraper not found, skipping"
fi

# ISTAT Inflation (if exists)
echo ""
echo "[3/4] Running ISTAT inflation scraper..."
if [ -f "scripts/scrapers/istat-inflazione.ts" ]; then
    npx tsx scripts/scrapers/istat-inflazione.ts
    echo "ISTAT inflation: OK"
else
    echo "ISTAT scraper not found, skipping"
fi

# Borsa Italiana (if exists)
echo ""
echo "[4/4] Running Borsa Italiana scraper..."
if [ -f "scripts/scrapers/borsa-italiana.ts" ]; then
    npx tsx scripts/scrapers/borsa-italiana.ts
    echo "Borsa Italiana: OK"
else
    echo "Borsa scraper not found, skipping"
fi

echo ""
echo "========================================"
echo "$(date): Scraper run complete!"
echo "========================================"
