# Vercel Environment Variables

Für das Deployment auf Vercel musst du folgende Environment Variables konfigurieren:

## Erforderliche Variables

### 1. DATABASE_URL
**Wert:** Deine Supabase PostgreSQL Connection String

**Wo finden:**
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt
3. Gehe zu **Settings** → **Database**
4. Kopiere die **Connection String** unter "Connection pooling"
5. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

**Wichtig:** Verwende die **Connection Pooling** URL (Port 6543), nicht die direkte Connection (Port 5432)

**Beispiel:**
```
postgresql://postgres.abcdefghijklmnop:your-password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 2. JWT_SECRET
**Wert:** Ein zufälliger, sicherer String für JWT Token Signing

**Generieren:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Beispiel:**
```
aB3dEf7gH9jK2lM4nP6qR8sT0uV1wX3yZ5aB7cD9eF1g
```

## Vercel Konfiguration

### Schritt 1: Projekt zu Vercel importieren
1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicke auf **Add New** → **Project**
3. Importiere dein GitHub Repository: `scalingxrebels/sales-weekly-tool`

### Schritt 2: Environment Variables hinzufügen
1. Im Import-Dialog, scrolle zu **Environment Variables**
2. Füge beide Variables hinzu:
   - Name: `DATABASE_URL`, Value: [Deine Supabase Connection String]
   - Name: `JWT_SECRET`, Value: [Dein generierter Secret]
3. Wähle **Production**, **Preview**, und **Development** für beide

### Schritt 3: Build Settings
Die Build Settings sollten automatisch erkannt werden:
- **Framework Preset:** Vite
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### Schritt 4: Deploy
1. Klicke auf **Deploy**
2. Warte auf den Build (ca. 2-3 Minuten)
3. Deine App ist live unter `https://your-project.vercel.app`

## Custom Domain (Optional)

Für deine Custom Domain `kode.scalingx.io`:

1. Gehe zu **Project Settings** → **Domains**
2. Klicke auf **Add Domain**
3. Gib `kode.scalingx.io` ein
4. Folge den DNS-Anweisungen:
   - Füge einen **CNAME** Record hinzu:
     - Name: `kode`
     - Value: `cname.vercel-dns.com`
5. Warte auf DNS-Propagation (5-30 Minuten)

## Troubleshooting

### Build Fehler: "Cannot find module"
- Stelle sicher, dass alle Dependencies in `package.json` sind
- Prüfe, dass `pnpm-lock.yaml` committed ist

### Database Connection Fehler
- Verwende die **Connection Pooling** URL (Port 6543)
- Prüfe, dass die Supabase Datenbank läuft
- Stelle sicher, dass CLEAN_INIT.sql ausgeführt wurde

### 500 Server Error nach Deployment
- Prüfe die Vercel Logs: **Deployments** → [Dein Deployment] → **Functions**
- Stelle sicher, dass beide Environment Variables gesetzt sind
- Prüfe, dass die Datenbank-Tabellen existieren

## Lokale Entwicklung

Für lokale Entwicklung, erstelle eine `.env` Datei:

```bash
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
JWT_SECRET="your-local-secret-key"
```

**Wichtig:** `.env` ist in `.gitignore` und wird NICHT zu Git committed!

## Sicherheit

⚠️ **Wichtige Hinweise:**
- Teile niemals deine Environment Variables öffentlich
- Verwende unterschiedliche JWT_SECRET für Production und Development
- Rotiere dein JWT_SECRET regelmäßig (alle 3-6 Monate)
- Verwende starke Passwörter für die Supabase Datenbank

