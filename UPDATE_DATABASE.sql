-- UPDATE_DATABASE.sql
-- Run this if ENUMs already exist in your database

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create weekly_dashboard table if not exists
CREATE TABLE IF NOT EXISTS weekly_dashboard (
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
  overall_health VARCHAR(20) DEFAULT 'green',
  opps_to_move TEXT,
  opps_to_push TEXT,
  opps_to_close TEXT,
  movement_notes TEXT,
  owner TEXT,
  next_steps TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create sales_log table if not exists
CREATE TABLE IF NOT EXISTS sales_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekly_dashboard_id TEXT REFERENCES weekly_dashboard(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL,
  observation TEXT NOT NULL,
  cause TEXT,
  action TEXT,
  owner TEXT,
  due_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'open',
  impact_level VARCHAR(20) DEFAULT 'medium',
  crm_deal_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create insights_feed table if not exists
CREATE TABLE IF NOT EXISTS insights_feed (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(50) NOT NULL,
  top_learnings TEXT,
  top_actions TEXT,
  patterns TEXT,
  playbook_update_needed VARCHAR(10) DEFAULT 'no',
  training_need TEXT,
  owner TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weekly_dashboard_user_id ON weekly_dashboard(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_dashboard_date ON weekly_dashboard(date);
CREATE INDEX IF NOT EXISTS idx_sales_log_user_id ON sales_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_log_weekly_dashboard_id ON sales_log(weekly_dashboard_id);
CREATE INDEX IF NOT EXISTS idx_sales_log_status ON sales_log(status);
CREATE INDEX IF NOT EXISTS idx_insights_feed_user_id ON insights_feed(user_id);

-- Insert admin user if not exists (password: admin123)
INSERT INTO users (id, username, password, name, email, role, created_at, updated_at, last_signed_in)
VALUES (
  'admin-user-001',
  'admin',
  '$2b$10$.8Fcp1cpiEq9FJ2FSv2iXuM1WI6sk6LHraRPwwG0BpIdd3N02brma',
  'Admin User',
  'admin@scalingx.io',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;

-- Success message
SELECT 'Database update completed successfully!' as message;

