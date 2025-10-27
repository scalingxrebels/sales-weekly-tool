-- CLEAN_INIT.sql
-- Clean database initialization without backup
-- Use this for first-time setup or when tables don't exist yet

-- Step 1: Drop all existing tables if they exist (cascade to remove dependencies)
DROP TABLE IF EXISTS insights_feed CASCADE;
DROP TABLE IF EXISTS sales_log CASCADE;
DROP TABLE IF EXISTS weekly_dashboard CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Drop and recreate all ENUMs
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

-- Step 3: Create users table
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

-- Step 4: Create weekly_dashboard table
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

-- Step 5: Create sales_log table
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

-- Step 6: Create insights_feed table
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

-- Step 7: Create indexes for performance
CREATE INDEX idx_weekly_dashboard_user_id ON weekly_dashboard(user_id);
CREATE INDEX idx_weekly_dashboard_date ON weekly_dashboard(date);
CREATE INDEX idx_sales_log_user_id ON sales_log(user_id);
CREATE INDEX idx_sales_log_weekly_dashboard_id ON sales_log(weekly_dashboard_id);
CREATE INDEX idx_sales_log_status ON sales_log(status);
CREATE INDEX idx_insights_feed_user_id ON insights_feed(user_id);

-- Step 8: Insert admin user (password: admin123)
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
);

-- Success message
SELECT 'Database initialized successfully!' as message;
SELECT 'Login with username: admin, password: admin123' as credentials;

