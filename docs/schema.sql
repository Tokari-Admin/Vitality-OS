-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER & BIO SYSTEM

-- users (Handled by Supabase Auth usually, but we extend public.users or reference auth.users)
-- For this schema, we assume we are in the public schema and reference auth.users if needed.
-- But standard practice is to have a public.users table that mirrors auth.users or just use auth.users.
-- The PRD schema implies a local reference. Let's create public.user_profiles linked to auth.users.

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    height_cm NUMERIC(5,2) NOT NULL,
    birth_date DATE NOT NULL,
    biological_sex VARCHAR(10) NOT NULL CHECK (biological_sex IN ('MALE', 'FEMALE')), -- Simplified for biological BMR
    activity_level_tier INTEGER DEFAULT 1 CHECK (activity_level_tier BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROTOCOL & TARGET ENGINE

CREATE TABLE IF NOT EXISTS protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')) DEFAULT 'ACTIVE',
    goal_type VARCHAR(20) CHECK (goal_type IN ('FAT_LOSS', 'RECOMP', 'GAIN')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_end_date DATE,
    initial_weight_kg NUMERIC(5,2),
    initial_bodyfat_pct NUMERIC(4,2),
    goal_weight_kg NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_calories_target INTEGER NOT NULL,
    daily_protein_target INTEGER NOT NULL,
    daily_steps_target INTEGER,
    hydration_target_l NUMERIC(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INPUT ENGINE (DAILY LOGS)

CREATE TABLE IF NOT EXISTS daily_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight_kg NUMERIC(5,2),
    calories_consumed INTEGER,
    protein_consumed INTEGER,
    training_completed BOOLEAN DEFAULT FALSE,
    sleep_quality_score INTEGER CHECK (sleep_quality_score BETWEEN 1 AND 5),
    is_sleep_adequate BOOLEAN,
    steps_count INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 4. METABOLIC ACCOUNTING & LEDGER

CREATE TABLE IF NOT EXISTS daily_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    input_id UUID NOT NULL REFERENCES daily_inputs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    target_calories INTEGER,
    target_protein INTEGER,
    calculated_tdee INTEGER,
    net_deficit INTEGER, -- (TDEE - Consumed)
    deficit_adherence_pct NUMERIC(5,2),
    execution_score INTEGER CHECK (execution_score BETWEEN 0 AND 100),
    execution_label VARCHAR(20) CHECK (execution_label IN ('OPTIMAL', 'ON_TRACK', 'AT_RISK', 'OFF_TRACK')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRAJECTORY ENGINE & ANALYTICS

CREATE TABLE IF NOT EXISTS trajectory_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_trend_7d NUMERIC(5,2),
    expected_weight NUMERIC(5,2),
    actual_weight NUMERIC(5,2),
    divergence_kg NUMERIC(4,2),
    fat_loss_confidence NUMERIC(3,0) CHECK (fat_loss_confidence BETWEEN 0 AND 100),
    status_label VARCHAR(20) CHECK (status_label IN ('VALIDATED', 'DELAYED', 'PLATEAU', 'DIVERGING')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decisions_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    decision_code VARCHAR(50),
    reasoning TEXT,
    adjustment_magnitude JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PREDICTIONS

CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    predicted_goal_date DATE,
    predicted_abs_date DATE,
    confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE trajectory_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Policies (Allow users to see/edit their own data)
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own protocols" ON protocols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own protocols" ON protocols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own protocols" ON protocols FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly targets" ON weekly_targets FOR SELECT USING (protocol_id IN (SELECT id FROM protocols WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own daily inputs" ON daily_inputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily inputs" ON daily_inputs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily inputs" ON daily_inputs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ledger" ON daily_ledger FOR SELECT USING (input_id IN (SELECT id FROM daily_inputs WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own trajectory" ON trajectory_snapshots FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own decisions" ON decisions_log FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own predictions" ON predictions FOR SELECT USING (auth.uid() = user_id);
