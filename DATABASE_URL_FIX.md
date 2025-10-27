# DATABASE_URL Fix

## Problem
Du verwendest die direkte PostgreSQL Connection (Port 5432), aber für Serverless-Umgebungen wie Vercel brauchst du **Connection Pooling** (Port 6543).

## Deine aktuelle URL (FALSCH für Vercel):
```
postgresql://postgres:S7D4kGNms8JQMY123@db.rjadlhenhaygfopeaasn.supabase.co:5432/postgres
```

## Korrekte URL für Vercel (Connection Pooling):
```
postgresql://postgres.rjadlhenhaygfopeaasn:S7D4kGNms8JQMY123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Unterschiede:
1. **Host**: `db.rjadlhenhaygfopeaasn.supabase.co` → `aws-0-eu-central-1.pooler.supabase.com`
2. **Port**: `5432` → `6543`
3. **Username**: `postgres` → `postgres.rjadlhenhaygfopeaasn`

## Wie finde ich die richtige URL?

### Option 1: Supabase Dashboard
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt: `rjadlhenhaygfopeaasn`
3. Gehe zu **Settings** → **Database**
4. Scrolle zu **Connection Pooling**
5. Wähle **Transaction Mode**
6. Kopiere die **Connection String**
7. Ersetze `[YOUR-PASSWORD]` mit deinem echten Passwort: `S7D4kGNms8JQMY123`

### Option 2: Manuelle Konstruktion
Basierend auf deiner aktuellen URL:

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Deine Werte:**
- PROJECT-REF: `rjadlhenhaygfopeaasn`
- PASSWORD: `S7D4kGNms8JQMY123`
- REGION: Musst du in Supabase prüfen (wahrscheinlich `eu-central-1` oder `us-east-1`)

**Beispiel für EU Central 1:**
```
postgresql://postgres.rjadlhenhaygfopeaasn:S7D4kGNms8JQMY123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Was musst du tun?

### Lokal (Development):
1. Erstelle/Bearbeite `.env` Datei im Projekt-Root:
```bash
DATABASE_URL="postgresql://postgres.rjadlhenhaygfopeaasn:S7D4kGNms8JQMY123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="OjO9G3zCoglTULBII05jUFb6FQMzsY5/vr1WfzLdm8I="
```

2. Starte den Server neu:
```bash
pnpm dev
```

### Auf Vercel:
1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Wähle dein Projekt
3. Gehe zu **Settings** → **Environment Variables**
4. Bearbeite `DATABASE_URL`:
   - Ersetze den Wert mit der neuen Connection Pooling URL
5. **Redeploy** das Projekt:
   - Gehe zu **Deployments**
   - Klicke auf die drei Punkte beim letzten Deployment
   - Wähle **Redeploy**

## Warum Connection Pooling?

**Direkte Connection (Port 5432):**
- ❌ Begrenzte Anzahl gleichzeitiger Verbindungen (max. 100)
- ❌ Jede Serverless Function öffnet neue Connection
- ❌ Führt zu "too many connections" Fehlern
- ✅ Gut für lokale Entwicklung

**Connection Pooling (Port 6543):**
- ✅ Unbegrenzte gleichzeitige Verbindungen
- ✅ Wiederverwendung von Connections
- ✅ Perfekt für Serverless (Vercel, Netlify, etc.)
- ✅ Bessere Performance

## Test

Nach dem Update, teste den Login:
```bash
curl -X POST 'http://localhost:3000/api/trpc/auth.login' \
  -H "Content-Type: application/json" \
  -d '{"json":{"username":"admin","password":"admin123"}}'
```

Sollte zurückgeben:
```json
{"result":{"data":{"json":{"token":"...", "user":{...}}}}}
```

## Weitere Hilfe

Falls du die Region nicht kennst, schau in Supabase unter:
- **Settings** → **General** → **Region**

Oder kontaktiere mich mit einem Screenshot von der Supabase Database Settings Seite.

