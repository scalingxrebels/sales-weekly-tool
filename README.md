# Sales Weekly Tool

Track weekly sales metrics, log observations, and capture insights.

## Features

- **Weekly Dashboard**: Track pipeline coverage, proposals, wins, and overall health
- **Sales Log**: Record observations, causes, and actions with status tracking
- **Insights Feed**: Capture monthly learnings and patterns
- **Authentication**: Secure username/password login with JWT

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express + tRPC 11 + Drizzle ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + bcrypt

## Setup Instructions

### 1. Database Setup (Supabase)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the content from `INIT_DATABASE.sql`
5. Paste and click **Run**

This will create:
- All database tables (users, weekly_dashboard, sales_log, insights_feed)
- All required ENUMs
- Admin user (username: `admin`, password: `admin123`)

### 2. Environment Variables

The following environment variables are already configured:

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing

### 3. Login Credentials

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change the password after first login!**

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Database Schema

### Users Table
- id, username, password (hashed), name, email, role, timestamps

### Weekly Dashboard Table
- Week info, pipeline metrics, proposals, wins, health status, opportunities, notes

### Sales Log Table
- Category, observation, cause, action, owner, due date, status, impact level, CRM link

### Insights Feed Table
- Month, top learnings, top actions, patterns, playbook updates, training needs

## API Routes

All API endpoints are available via tRPC at `/api/trpc`:

- `auth.login` - Login with username/password
- `auth.logout` - Logout current user
- `auth.me` - Get current user
- `weeklyDashboard.*` - CRUD operations for weekly dashboards
- `salesLog.*` - CRUD operations for sales logs
- `insightsFeed.*` - CRUD operations for insights

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy

### Custom Domain

Configure your custom domain (e.g., kode.scalingx.io) in Vercel project settings.

## Support

For issues or questions, contact: michel.lason@scalingx.io

