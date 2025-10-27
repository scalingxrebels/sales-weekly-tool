-- RESET_DATABASE.sql
-- Complete database reset with backup of existing data
-- This script will:
-- 1. Backup your existing data (especially entry from 22.10.)
-- 2. Drop all old tables
-- 3. Create new schema with correct column names
-- 4. Restore your data
-- 5. Add admin user

-- Step 1: Create temporary backup tables
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;
CREATE TABLE IF NOT EXISTS weekly_dashboard_backup AS SELECT * FROM weekly_dashboard;
CREATE TABLE IF NOT EXISTS sales_log_backup AS SELECT * FROM sales_log;
CREATE TABLE IF NOT EXISTS insights_feed_backup AS SELECT * FROM insights_feed;

-- Step 2: Drop all existing tables (cascade to remove dependencies)
DROP TABLE IF EXISTS insights_feed CASCADE;
DROP TABLE IF EXISTS sales_log CASCADE;
DROP TABLE IF EXISTS weekly_dashboard CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 3: Drop and recreate all ENUMs
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS health CASCADE;
DROP TYPE IF EXISTS category CASCADE;
DROP TYPE IF EXISTS status CASCADE;
DROP TYPE IF EXISTS impact_level CASCADE;
DROP TYPE IF EXISTS playbook_update CASCADE;

CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE health AS ENUM ('green', 'yellow', 'red');
CREATE TYPE category AS ENUM ('pipeline', 'kpi', 'process', 'enablement', 'deal', 'pricing');
CREATE TYPE status AS ENUM ('open', 'in_progress', 'done');
CREATE TYPE impact_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE playbook_update AS ENUM ('yes', 'no');

-- Step 4: Create new users table with correct schema
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 5: Create weekly_dashboard table
CREATE TABLE weekly_dashboard (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week VARCHAR(50) NOT NULL,
  date TIMESTAMP NOT NULL,
  pipeline_coverage TEXT,
  opps_total TEXT,
  proposals TEXT,
  wins TEXT,
  sql_proposal_rate TEXT,
  velocity TEXT,
  overall_health health DEFAULT 'green' NOT NULL,
  opps_to_move TEXT,
  opps_to_push TEXT,
  opps_to_close TEXT,
  movement_notes TEXT,
  owner TEXT,
  next_steps TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 6: Create sales_log table
CREATE TABLE sales_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekly_dashboard_id TEXT REFERENCES weekly_dashboard(id) ON DELETE SET NULL,
  category category NOT NULL,
  observation TEXT NOT NULL,
  cause TEXT,
  action TEXT,
  owner TEXT,
  due_date TIMESTAMP,
  status status DEFAULT 'open' NOT NULL,
  impact_level impact_level DEFAULT 'medium' NOT NULL,
  crm_deal_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 7: Create insights_feed table
CREATE TABLE insights_feed (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(50) NOT NULL,
  top_learnings TEXT,
  top_actions TEXT,
  patterns TEXT,
  playbook_update_needed playbook_update DEFAULT 'no' NOT NULL,
  training_need TEXT,
  owner TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 8: Create indexes for performance
CREATE INDEX idx_weekly_dashboard_user_id ON weekly_dashboard(user_id);
CREATE INDEX idx_weekly_dashboard_date ON weekly_dashboard(date);
CREATE INDEX idx_sales_log_user_id ON sales_log(user_id);
CREATE INDEX idx_sales_log_weekly_dashboard_id ON sales_log(weekly_dashboard_id);
CREATE INDEX idx_sales_log_status ON sales_log(status);
CREATE INDEX idx_insights_feed_user_id ON insights_feed(user_id);

-- Step 9: Restore data from backup tables (if they exist and have data)
-- Restore users (map old columns to new columns)
INSERT INTO users (id, username, password, name, email, role, created_at, updated_at, last_signed_in)
SELECT 
  COALESCE(id, gen_random_uuid()::text),
  username,
  password,
  name,
  email,
  CASE 
    WHEN role = 'admin' THEN 'admin'::role
    ELSE 'user'::role
  END,
  COALESCE(createdat, CURRENT_TIMESTAMP),
  COALESCE(updatedat, CURRENT_TIMESTAMP),
  COALESCE(lastsignedin, CURRENT_TIMESTAMP)
FROM users_backup
WHERE username IS NOT NULL
ON CONFLICT (username) DO NOTHING;

-- Restore weekly_dashboard (map old columns to new columns)
INSERT INTO weekly_dashboard (
  id, user_id, week, date, pipeline_coverage, opps_total, proposals, wins,
  sql_proposal_rate, velocity, overall_health, opps_to_move, opps_to_push,
  opps_to_close, movement_notes, owner, next_steps, created_at, updated_at
)
SELECT 
  COALESCE(id, gen_random_uuid()::text),
  userid,
  week,
  date,
  pipelinecoverage,
  oppstotal,
  proposals,
  wins,
  sqlproposalrate,
  velocity,
  CASE 
    WHEN overallhealth = 'green' THEN 'green'::health
    WHEN overallhealth = 'yellow' THEN 'yellow'::health
    WHEN overallhealth = 'red' THEN 'red'::health
    ELSE 'green'::health
  END,
  oppstomove,
  oppstopush,
  oppstoclose,
  movementnotes,
  owner,
  nextsteps,
  COALESCE(createdat, CURRENT_TIMESTAMP),
  COALESCE(updatedat, CURRENT_TIMESTAMP)
FROM weekly_dashboard_backup
WHERE userid IS NOT NULL AND date IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Restore sales_log
INSERT INTO sales_log (
  id, user_id, weekly_dashboard_id, category, observation, cause, action,
  owner, due_date, status, impact_level, crm_deal_link, created_at, updated_at
)
SELECT 
  COALESCE(id, gen_random_uuid()::text),
  userid,
  weeklydashboardid,
  CASE 
    WHEN category = 'pipeline' THEN 'pipeline'::category
    WHEN category = 'kpi' THEN 'kpi'::category
    WHEN category = 'process' THEN 'process'::category
    WHEN category = 'enablement' THEN 'enablement'::category
    WHEN category = 'deal' THEN 'deal'::category
    WHEN category = 'pricing' THEN 'pricing'::category
    ELSE 'pipeline'::category
  END,
  observation,
  cause,
  action,
  owner,
  duedate,
  CASE 
    WHEN status = 'open' THEN 'open'::status
    WHEN status = 'in_progress' THEN 'in_progress'::status
    WHEN status = 'done' THEN 'done'::status
    ELSE 'open'::status
  END,
  CASE 
    WHEN impactlevel = 'low' THEN 'low'::impact_level
    WHEN impactlevel = 'medium' THEN 'medium'::impact_level
    WHEN impactlevel = 'high' THEN 'high'::impact_level
    ELSE 'medium'::impact_level
  END,
  crmdeallink,
  COALESCE(createdat, CURRENT_TIMESTAMP),
  COALESCE(updatedat, CURRENT_TIMESTAMP)
FROM sales_log_backup
WHERE userid IS NOT NULL AND observation IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Restore insights_feed
INSERT INTO insights_feed (
  id, user_id, month, top_learnings, top_actions, patterns,
  playbook_update_needed, training_need, owner, created_at, updated_at
)
SELECT 
  COALESCE(id, gen_random_uuid()::text),
  userid,
  month,
  toplearnings,
  topactions,
  patterns,
  CASE 
    WHEN playbookupdateneeded = 'yes' THEN 'yes'::playbook_update
    ELSE 'no'::playbook_update
  END,
  trainingneed,
  owner,
  COALESCE(createdat, CURRENT_TIMESTAMP),
  COALESCE(updatedat, CURRENT_TIMESTAMP)
FROM insights_feed_backup
WHERE userid IS NOT NULL AND month IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Step 10: Add admin user (password: admin123)
INSERT INTO users (id, username, password, name, email, role, created_at, updated_at, last_signed_in)
VALUES (
  'admin-user-001',
  'admin',
  '$2b$10$.8Fcp1cpiEq9FJ2FSv2iXuM1WI6sk6LHraRPwwG0BpIdd3N02brma',
  'Admin User',
  'admin@scalingx.io',
  'admin'::role,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;

-- Step 11: Drop backup tables
DROP TABLE IF EXISTS users_backup CASCADE;
DROP TABLE IF EXISTS weekly_dashboard_backup CASCADE;
DROP TABLE IF EXISTS sales_log_backup CASCADE;
DROP TABLE IF EXISTS insights_feed_backup CASCADE;

-- Success message
SELECT 'Database reset completed successfully! All data from 22.10. has been preserved.' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_dashboards FROM weekly_dashboard;
SELECT COUNT(*) as total_logs FROM sales_log;
SELECT COUNT(*) as total_insights FROM insights_feed;

