# Deployment Steps für Vercel

## ✅ Was bereits erledigt ist:
- [x] Code ist fertig entwickelt
- [x] TypeScript Fehler behoben
- [x] Alles zu GitHub gepusht: `https://github.com/scalingxrebels/sales-weekly-tool`
- [x] CLEAN_INIT.sql für Datenbank erstellt
- [x] Dokumentation für DATABASE_URL erstellt

## 📋 Was du jetzt tun musst:

### Schritt 1: Vercel Projekt erstellen
1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicke auf **Add New** → **Project**
3. Wähle **Import Git Repository**
4. Suche nach `scalingxrebels/sales-weekly-tool`
5. Klicke auf **Import**

### Schritt 2: Environment Variables setzen
Im Import-Dialog, scrolle zu **Environment Variables** und füge hinzu:

#### DATABASE_URL
**Name:** `DATABASE_URL`  
**Value:** Deine Supabase Connection Pooling URL

**Wichtig:** Verwende Port **6543** (Connection Pooling), NICHT Port 5432!

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Wie finde ich die richtige URL?**
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt: `rjadlhenhaygfopeaasn`
3. Gehe zu **Settings** → **Database**
4. Scrolle zu **Connection Pooling** (nicht Connection String!)
5. Wähle **Transaction Mode**
6. Kopiere die URL
7. Ersetze `[YOUR-PASSWORD]` mit: `S7D4kGNms8JQMY123`

**Beispiel (ersetze REGION):**
```
postgresql://postgres.rjadlhenhaygfopeaasn:S7D4kGNms8JQMY123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

#### JWT_SECRET
**Name:** `JWT_SECRET`  
**Value:** Ein zufälliger String (z.B.):
```
OjO9G3zCoglTULBII05jUFb6FQMzsY5/vr1WfzLdm8I=
```

**Environments:** Wähle **Production**, **Preview**, und **Development** für beide Variables

### Schritt 3: Deploy
1. Klicke auf **Deploy**
2. Warte 2-3 Minuten
3. Deine App ist live! 🎉

### Schritt 4: Teste den Login
1. Öffne die Vercel URL (z.B. `https://sales-weekly-tool.vercel.app`)
2. Login mit:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Wenn es funktioniert: Fertig! ✅

### Schritt 5: Custom Domain (Optional)
Für `kode.scalingx.io`:

1. Gehe zu **Project Settings** → **Domains**
2. Klicke auf **Add Domain**
3. Gib `kode.scalingx.io` ein
4. Folge den DNS-Anweisungen:
   - Füge einen **CNAME** Record bei deinem DNS-Provider hinzu:
     - **Name:** `kode`
     - **Value:** `cname.vercel-dns.com`
5. Warte 5-30 Minuten auf DNS-Propagation

## 🐛 Troubleshooting

### Problem: Login funktioniert nicht
**Fehler:** "Unexpected token 'A', 'A server e'... is not valid JSON"

**Lösung:**
1. Prüfe, dass DATABASE_URL **Port 6543** verwendet (nicht 5432)
2. Prüfe, dass CLEAN_INIT.sql in Supabase ausgeführt wurde
3. Prüfe Vercel Logs:
   - Gehe zu **Deployments** → [Dein Deployment] → **Functions**
   - Suche nach Fehlern

### Problem: Build schlägt fehl
**Lösung:**
1. Prüfe Build Logs in Vercel
2. Stelle sicher, dass `pnpm-lock.yaml` committed ist
3. Stelle sicher, dass alle Dependencies in `package.json` sind

### Problem: Database Connection Error
**Lösung:**
1. Verwende **Connection Pooling** URL (Port 6543)
2. Prüfe, dass Supabase Datenbank läuft
3. Prüfe, dass CLEAN_INIT.sql erfolgreich ausgeführt wurde
4. Teste die Connection String lokal:
   ```bash
   psql "postgresql://postgres.rjadlhenhaygfopeaasn:S7D4kGNms8JQMY123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   ```

## 📚 Weitere Dokumentation

- **CLEAN_INIT.sql**: Datenbank Setup Script
- **DATABASE_URL_FIX.md**: Detaillierte Anleitung für Connection Pooling
- **VERCEL_ENV.md**: Vollständige Environment Variables Dokumentation
- **README.md**: Projekt-Übersicht und Features

## 🎯 Nächste Schritte nach Deployment

Nach erfolgreichem Deployment kannst du:
1. **Passwort ändern**: Login mit admin/admin123, dann neues Passwort setzen
2. **Weitere User anlegen**: Über Supabase SQL Editor
3. **Features testen**: Weekly Dashboard, Sales Log, Insights Feed
4. **Custom Domain einrichten**: kode.scalingx.io

## ✉️ Support

Bei Problemen:
1. Prüfe die Vercel Logs
2. Prüfe die Supabase Logs
3. Kontaktiere: michel.lason@scalingx.io

