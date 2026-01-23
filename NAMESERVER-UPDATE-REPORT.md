# Nameserver Update Report - guidapatrimonio.it

**Date:** 2026-01-23
**Domain:** guidapatrimonio.it
**Registrar:** OpenProvider

## Status: ✅ ALREADY CONFIGURED

### Current Nameservers (OpenProvider)

The domain is already configured with Cloudflare nameservers:

- `adelaide.ns.cloudflare.com`
- `vick.ns.cloudflare.com`

### OpenProvider Domain Status

- **Status:** ACT (Active)
- **Nameservers:** Correctly set to Cloudflare
- **Last Verified:** 2026-01-23 14:35 CET

## Next Steps

### 1. Verify Cloudflare Zone Configuration

Visit Cloudflare dashboard to ensure the zone is properly configured:
- https://dash.cloudflare.com

Expected zone: `guidapatrimonio.it`

### 2. Add DNS Records in Cloudflare

Once the zone is confirmed, add the necessary DNS records:

```
A     @              [IP address of hosting server]
A     www            [IP address of hosting server]
CNAME *              guidapatrimonio.it
```

### 3. Wait for DNS Propagation

- DNS propagation can take 24-48 hours
- Check propagation status at: https://dnschecker.org

### 4. Verify DNS Resolution

After propagation, verify with:

```bash
dig NS guidapatrimonio.it
dig A guidapatrimonio.it
nslookup guidapatrimonio.it
```

## Important Notes

⚠️ **No action was needed** - The nameservers were already correctly configured in OpenProvider.

If the domain was previously using CNR.IT nameservers, the change has already been applied in the OpenProvider system. The DNS propagation may still be in progress globally.

## Troubleshooting

If the domain doesn't resolve after 48 hours:

1. **Check OpenProvider panel manually:**
   - Login at: https://cp.openprovider.eu
   - Verify NS records are saved

2. **Check Cloudflare:**
   - Ensure zone exists
   - Check nameservers match
   - Verify DNS records are configured

3. **Contact support if needed:**
   - OpenProvider: support@openprovider.com
   - Cloudflare: https://support.cloudflare.com

## Scripts Used

- `/Users/claudiocronin/websites/scripts/list-openprovider-domains.py` - List all domains
- `/Users/claudiocronin/websites/scripts/update-nameservers-guidapatrimonio.py` - Update NS (not executed as already correct)

## API Credentials

- **Username:** 24prontocom@gmail.com
- **API Endpoint:** https://api.openprovider.eu/v1beta
- **Handle:** RM950786-IT (for .it domains)
