# Sales Weekly Tool - TODO

## Database Setup
- [x] Konfiguriere Supabase PostgreSQL Verbindung
- [x] Erstelle Datenbankschema mit Drizzle ORM
- [x] Implementiere users Tabelle
- [x] Implementiere weeklyDashboard Tabelle
- [x] Implementiere salesLog Tabelle
- [x] Implementiere insightsFeed Tabelle
- [x] Erstelle Datenbankmigrationen
- [x] Generiere INIT_DATABASE.sql Script

## Authentication
- [x] Implementiere Username/Password Login mit JWT
- [x] Implementiere bcrypt Passwort-Hashing
- [x] Erstelle Login-Seite
- [x] Implementiere Session Management (7 Tage)
- [x] Implementiere Logout Funktionalität
- [ ] Erstelle Admin-User in Datenbank (manuell via Supabase SQL Editor)

## Weekly Dashboard Feature
- [x] Erstelle Weekly Dashboard Seite (Basis)
- [x] Implementiere Dashboard Layout
- [ ] Implementiere Dashboard Formular mit allen Feldern
- [ ] Implementiere Dashboard Liste/Übersicht
- [ ] Implementiere Dashboard CRUD Operationen (Create, Read, Update, Delete)
- [ ] Implementiere Health Status Visualisierung (green/yellow/red)
- [ ] Implementiere Wochenauswahl

## Sales Log Feature
- [x] Erstelle Sales Log Seite (Basis)
- [ ] Implementiere Sales Log Formular
- [ ] Implementiere Sales Log Liste mit Filterung
- [ ] Implementiere Sales Log CRUD Operationen
- [ ] Implementiere Kategorie-Filter (pipeline/kpi/process/enablement/deal/pricing)
- [ ] Implementiere Status-Tracking (open/in_progress/done)
- [ ] Implementiere Impact Level Visualisierung

## Insights Feed Feature
- [x] Erstelle Insights Feed Seite (Basis)
- [ ] Implementiere Insights Formular
- [ ] Implementiere Insights Liste nach Monat
- [ ] Implementiere Insights CRUD Operationen
- [ ] Implementiere Monatsauswahl

## UI/UX
- [x] Implementiere responsive Design mit Tailwind CSS
- [x] Erstelle Navigation/Sidebar Layout
- [x] Implementiere Dashboard Layout
- [ ] Füge Loading States hinzu
- [ ] Füge Error Handling hinzu
- [ ] Implementiere Toast Notifications

## Backend API
- [x] Erstelle tRPC Router für Authentication
- [x] Erstelle tRPC Router für Weekly Dashboard
- [x] Erstelle tRPC Router für Sales Log
- [x] Erstelle tRPC Router für Insights Feed
- [x] Implementiere Protected Procedures
- [x] Implementiere JWT Context Middleware

## Testing & Optimierung
- [ ] Teste alle CRUD Operationen
- [ ] Teste Authentication Flow
- [ ] Teste Responsive Design
- [ ] Optimiere Performance
- [ ] Teste Supabase Verbindung

## Deployment Vorbereitung
- [ ] Konfiguriere Environment Variables
- [ ] Erstelle Build
- [ ] Teste Preview
- [ ] Bereite Vercel Deployment vor

## Nächste Schritte
1. **WICHTIG**: Führe `INIT_DATABASE.sql` in Supabase SQL Editor aus
2. Teste Login mit admin/admin123
3. Entwickle die CRUD Formulare für alle Features
4. Implementiere vollständige Datenanbindung




## Bugs
- [ ] Login wirft JSON Parse Fehler: "Unexpected token 'A', 'A server e'... is not valid JSON"




## Deployment Status
- [ ] Vercel Deployment konfigurieren
- [ ] DATABASE_URL auf Connection Pooling (Port 6543) ändern
- [ ] JWT_SECRET auf Vercel setzen
- [ ] Redeploy nach Environment Variable Änderung
- [ ] Login auf Production testen




## Critical Bugs
- [x] Vercel deployment: /api route not found - need to create Vercel serverless function handler
- [x] Vercel deployment: Frontend 404 NOT_FOUND - need to configure static file serving
- [ ] Vercel deployment: API returns 500 errors - need to configure proper serverless function routing




## In Progress
- [ ] Fix API Routing für Vercel Serverless Functions (tRPC Endpoints)
  - [x] Node-Version pinnen (22.x)
  - [x] Node Runtime erzwingen
  - [x] Dependencies prüfen
  - [x] Health-Check Endpoint erstellen
  - [ ] Problem: api/index.ts kann nicht kompiliert werden (TypeScript + komplexe Imports)
  - [ ] Lösung: Backend als separaten Build-Step oder Vercel Functions anders strukturieren

