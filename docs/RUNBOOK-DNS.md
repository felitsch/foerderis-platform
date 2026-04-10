# RUNBOOK: DNS-Konfiguration foerderis.de

> **Zweck:** Dieser Runbook dokumentiert die aktuelle DNS-Konfiguration für `foerderis.de`, erklärt die Designentscheidungen, beschreibt Änderungsprozesse und enthält Cache-Bust-Befehle für DNS-Ausfälle.
>
> **Letzte Überprüfung:** 2026-04-10 (FRDAA-120)

---

## 1. Aktuelle DNS-Records

Alle Records sind bei **Hostinger DNS** konfiguriert (Nameserver: `pixel.dns-parking.com`, `byte.dns-parking.com`).

| Typ   | Name              | Wert / Ziel                      | TTL  | Zweck                                              |
|-------|-------------------|----------------------------------|------|----------------------------------------------------|
| A     | `foerderis.de`    | `76.76.21.21`                    | 300  | Apex-Domain → Vercel Anycast IP                    |
| CNAME | `www.foerderis.de`| `cname.vercel-dns.com.`          | 300  | www-Subdomain → Vercel (IP-unabhängig via CNAME)   |
| MX    | `foerderis.de`    | `10 mx1.forwardemail.net.`       | 300  | E-Mail-Routing via ForwardEmail.net                |
| MX    | `foerderis.de`    | `10 mx2.forwardemail.net.`       | 300  | E-Mail-Routing via ForwardEmail.net (Fallback)     |
| TXT   | `foerderis.de`    | `v=spf1 a mx include:spf.forwardemail.net -all` | 300 | SPF-Record — autorisiert ForwardEmail.net zum Senden |
| TXT   | `foerderis.de`    | `forward-email=kontakt:...,hallo:...,info:...,felix:...` | 300 | ForwardEmail-Routing-Konfiguration |
| NS    | `foerderis.de`    | `pixel.dns-parking.com.`         | 86400| Hostinger Primary Nameserver                       |
| NS    | `foerderis.de`    | `byte.dns-parking.com.`          | 86400| Hostinger Secondary Nameserver                     |

### Nicht vorhandene Records

| Typ   | Status | Notiz |
|-------|--------|-------|
| AAAA  | ❌ nicht konfiguriert | Vercel-Hosting ist IPv4-only für Apex (kein IPv6-Anycast-IP dokumentiert) |
| DMARC | ❌ nicht konfiguriert | Empfehlung: `_dmarc.foerderis.de TXT "v=DMARC1; p=none; rua=mailto:dmarc@foerderis.de"` hinzufügen |

---

## 2. Warum diese Konfiguration?

### Apex-Domain: A-Record statt CNAME

DNS-Standard (RFC 1034) verbietet CNAME-Records an der Apex-Domain (`foerderis.de`), da dort NS- und MX-Records koexistieren müssen. Hostingers DNS-Parking-Nameserver unterstützen kein ALIAS/ANAME (proprietäre CNAME-Emulation für Apex-Domains).

**Entscheidung:** A-Record auf `76.76.21.21` (Vercel Anycast IP). Vercel empfiehlt diese IP für Apex-Custom-Domains und unterstützt sie dauerhaft. TTL=300 ermöglicht schnelle Updates bei IP-Wechsel.

### www-Subdomain: CNAME zu `cname.vercel-dns.com.`

`www.foerderis.de` kann als CNAME konfiguriert werden, da dort keine MX/NS-Konflikte bestehen. Vorteil: Vercel kann die dahinterliegende IP transparent ändern (Anycast-Load-Balancing), ohne dass wir den DNS-Record aktualisieren müssen.

**Resilienzvorteil:** Bei einem Vercel-IP-Wechsel ändert nur der Apex A-Record — www bleibt automatisch aktuell.

### E-Mail: ForwardEmail.net

Alle Mails an `@foerderis.de` werden über ForwardEmail.net an `sami.gaber96@gmail.com` weitergeleitet. Die MX-Records zeigen auf ForwardEmail-Server. Der SPF-Record (`include:spf.forwardemail.net`) autorisiert diese Server.

Konfigurierte Weiterleitungen:
- `kontakt@foerderis.de` → `sami.gaber96@gmail.com`
- `hallo@foerderis.de` → `sami.gaber96@gmail.com`
- `info@foerderis.de` → `sami.gaber96@gmail.com`
- `felix@foerderis.de` → `sami.gaber96@gmail.com`

---

## 3. Wie DNS-Records ändern

### Hostinger DNS (A, MX, TXT, CNAME)

1. Login: [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Domain auswählen → **DNS / Nameservers**
3. Record bearbeiten oder hinzufügen
4. Speichern — Propagation bei TTL=300 dauert max. 5–10 Minuten

> **Wichtig:** Nach dem Speichern immer mit `curl -I https://foerderis.de` und einem zweiten DNS-Resolver prüfen!

### Vercel Domain-Config synchronisieren

Nach DNS-Änderungen prüfen, ob Vercel die Domain korrekt erkennt:

1. [vercel.com/dashboard](https://vercel.com/dashboard) → Projekt → **Settings → Domains**
2. Status für `foerderis.de` und `www.foerderis.de` prüfen — sollte grün/Valid sein
3. Bei Fehlern: **Refresh** im Vercel-Domain-Panel klicken

### Vercel A-Record-IP aktualisieren

Falls Vercel neue Anycast-IPs kommuniziert (selten, aber möglich):

1. Neue IP in Vercel-Docs oder via `dig alias.vercel-dns.com` ermitteln
2. In Hostinger: A-Record von alt → neu ändern
3. TTL bleibt 300 — Propagation dauert max. 5 Minuten

---

## 4. Cache-Bust-Befehle

Bei einem DNS-Incident (Domain nicht erreichbar) zuerst den lokalen DNS-Cache leeren, bevor weitere Diagnose erfolgt.

### macOS

```bash
# macOS 12+ (Monterey und neuer)
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# Überprüfen ob der Flush gewirkt hat
scutil --dns | grep nameserver

# Aktuellen A-Record für foerderis.de prüfen (ohne lokalen Cache)
nslookup foerderis.de 8.8.8.8
```

### Linux (systemd-resolved)

```bash
# systemd-resolved Cache leeren
sudo systemd-resolve --flush-caches

# Alternativ bei nscd
sudo systemctl restart nscd

# Prüfen (ohne lokalen Cache — direkt gegen Google DNS)
nslookup foerderis.de 8.8.8.8
# oder
dig @8.8.8.8 foerderis.de A
```

### Windows

```powershell
# DNS-Cache leeren (als Administrator)
ipconfig /flushdns

# Prüfen
nslookup foerderis.de 8.8.8.8
```

### DNS-Diagnose von extern (ohne lokalen Cache)

```bash
# Google DNS
nslookup foerderis.de 8.8.8.8

# Cloudflare DNS
nslookup foerderis.de 1.1.1.1

# DNS over HTTPS (kein lokaler Cache, überall nutzbar)
curl -sH 'accept: application/dns-json' \
  'https://cloudflare-dns.com/dns-query?name=foerderis.de&type=A' | python3 -m json.tool
```

**Erwartete Antwort:** IP `76.76.21.21` (Vercel)

---

## 5. DNS-Outage erkennen

### Symptome (aus dem Vorfall 2026-04-10)

| Symptom | Mögliche Ursache |
|---------|-----------------|
| `ERR_CONNECTION_REFUSED` im Browser | Lokaler DNS-Cache veraltet — Cache leeren (→ Abschnitt 4) |
| `curl -I https://foerderis.de` schlägt fehl | DNS löst auf alte IP auf oder A-Record geändert |
| `curl -I https://76.76.21.21` funktioniert | DNS-Problem (nicht Vercel) — Cache-Bust oder DNS-Record prüfen |
| Seite bei Google-DNS ok, bei lokalem DNS nicht | Lokaler ISP-DNS propagiert noch alte IP |
| HTTP 404 bei `curl -I https://foerderis.de` | Domain nicht in Vercel konfiguriert oder Vercel-Deploy fehlt |

### Schnell-Diagnose-Checkliste

```bash
# 1. Welche IP löst mein System auf?
nslookup foerderis.de

# 2. Was sagt Google DNS?
nslookup foerderis.de 8.8.8.8
# → Sollte 76.76.21.21 sein

# 3. Ist Vercel erreichbar?
curl -I https://76.76.21.21 -H 'Host: foerderis.de'
# → Sollte HTTP/2 200 sein

# 4. Ist der A-Record korrekt gesetzt?
curl -sH 'accept: application/dns-json' \
  'https://cloudflare-dns.com/dns-query?name=foerderis.de&type=A'
# → "data":"76.76.21.21"

# 5. Ist das Deployment auf Vercel Ready?
# → Vercel Dashboard: https://vercel.com/dashboard
```

### Eskalations-Pfad

1. **Lokaler Cache** → Cache leeren (Abschnitt 4)
2. **Falscher DNS-Record bei Hostinger** → Hostinger hPanel korrigieren
3. **Vercel-Deployment-Problem** → Vercel Dashboard prüfen, ggf. Redeploy
4. **Hostinger DNS-Ausfall** → Hostinger Status prüfen, ggf. zu Cloudflare DNS wechseln

---

## 6. Änderungshistorie

| Datum      | Wer | Änderung |
|------------|-----|----------|
| 2026-04-10 | CTO | Runbook erstellt nach DNS-Caching-Vorfall (FRDAA-117) |
| 2026-04-10 | CTO | DNS-Audit: Apex A-Record `76.76.21.21` korrekt, TTL=300 ✓, www CNAME zu `cname.vercel-dns.com.` ✓ — keine Änderungen nötig |
