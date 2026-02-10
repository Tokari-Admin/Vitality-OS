# TECHNICAL SCHEMA: CUTOS DATABASE DESIGN
**Version:** 1.0 (MVP)
**Database:** PostgreSQL (Supabase/Neon compatible)

This schema implements the "core engines" described in the PRD.

---

## 1. USER & BIO SYSTEM

### `users`
*Core identity and authn references.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Linked to Auth Provider ID |
| `email` | VARCHAR | UNIQUE, NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `timezone` | VARCHAR | DEFAULT 'UTC' | Critical for determining "daily" boundaries |

### `user_profiles`
*Biological constants and baseline metrics.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | FK -> users.id, PK | |
| `height_cm` | NUMERIC(5,2) | NOT NULL | Used for BMR calc |
| `birth_date` | DATE | NOT NULL | Age determines BMR |
| `biological_sex` | VARCHAR(10) | NOT NULL | 'MALE' or 'FEMALE' (impacts BMR formula) |
| `activity_level_tier` | INTEGER | DEFAULT 1 | 1=Sedentary, 5=Athlete (Baseline multiplier) |
| `updated_at` | TIMESTAMPTZ | | |

---

## 2. PROTOCOL & TARGET ENGINE

### `protocols`
*Defines the high-level intent (e.g., "Summer Cut 2026").*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, DEFAULT gen_random_uuid() | |
| `user_id` | UUID | FK -> users.id | |
| `status` | VARCHAR | 'ACTIVE', 'COMPLETED', 'PAUSED' | Only one ACTIVE per user |
| `goal_type` | VARCHAR | 'FAT_LOSS', 'RECOMP', 'GAIN' | |
| `start_date` | DATE | NOT NULL | |
| `target_end_date` | DATE | | Predicted date |
| `initial_weight_kg` | NUMERIC(5,2) | | Baseline snapshot |
| `initial_bodyfat_pct` | NUMERIC(4,2) | | |
| `goal_weight_kg` | NUMERIC(5,2) | | |

### `weekly_targets`
*The output of the Target Engine. Updates every 7 days.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `protocol_id` | UUID | FK -> protocols.id | |
| `week_number` | INTEGER | NOT NULL | Sequential week index |
| `start_date` | DATE | NOT NULL | |
| `end_date` | DATE | NOT NULL | |
| `daily_calories_target`| INTEGER | NOT NULL | e.g. 2200 |
| `daily_protein_target` | INTEGER | NOT NULL | e.g. 180 |
| `daily_steps_target` | INTEGER | | Optional activity baseline |
| `hydration_target_l` | NUMERIC(3,1) | | e.g. 3.5 |

---

## 3. INPUT ENGINE (DAILY LOGS)

### `daily_inputs`
*Raw user data. Minimal inputs as requested.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `user_id` | UUID | FK -> users.id | |
| `date` | DATE | NOT NULL | Unique composite (user_id, date) |
| `weight_kg` | NUMERIC(5,2) | | Morning fasted weight |
| `calories_consumed` | INTEGER | | Total kcal |
| `protein_consumed` | INTEGER | | Grams |
| `training_completed` | BOOLEAN | DEFAULT FALSE | Did they train? |
| `sleep_quality_score` | INTEGER | 1-5 or NULL | 'Sleep Adequate' boolean mapped to score or simple bool |
| `is_sleep_adequate` | BOOLEAN | | PRD requirement |
| `steps_count` | INTEGER | | Optional |
| `notes` | TEXT | | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 4. METABOLIC ACCOUNTING & LEDGER

### `daily_ledger`
*The "Immutable Metabolic Record". Computes physics and scores.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `input_id` | UUID | FK -> daily_inputs.id | 1:1 Relationship |
| `date` | DATE | NOT NULL | |
| `target_calories` | INTEGER | | Snapshot of target at that time |
| `target_protein` | INTEGER | | Snapshot |
| `calculated_tdee` | INTEGER | | Dynamic TDEE for that day |
| `net_deficit` | INTEGER | | (TDEE - Consumed) |
| `deficit_adherence_pct`| NUMERIC(5,2) | | |
| `execution_score` | INTEGER | | 0-100 (The "Quality Score") |
| `execution_label` | VARCHAR | | 'OPTIMAL', 'ON_TRACK', 'AT_RISK', 'OFF_TRACK' |

---

## 5. TRAJECTORY ENGINE & ANALYTICS

### `trajectory_snapshots`
*Daily or Weekly logic output validating the biological response.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `user_id` | UUID | FK | |
| `date` | DATE | | |
| `weight_trend_7d` | NUMERIC(5,2) | | Smoothed Average |
| `expected_weight` | NUMERIC(5,2) | | Theoretical based on ledger |
| `actual_weight` | NUMERIC(5,2) | | Raw weight |
| `divergence_kg` | NUMERIC(4,2) | | (Actual - Expected) |
| `fat_loss_confidence` | NUMERIC(3,0) | | 0-100% |
| `status_label` | VARCHAR | | 'VALIDATED', 'DELAYED', 'PLATEAU', 'DIVERGING' |

### `decisions_log`
*Records of the "Decision Engine".*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | |
| `user_id` | UUID | FK | |
| `date` | DATE | | Weekly triggger |
| `decision_code` | VARCHAR | | 'MAINTAIN', 'INCREASE_DEFICIT', 'REFEED', etc. |
| `reasoning` | TEXT | | Auto-generated explanation |
| `adjustment_magnitude` | JSONB | | e.g. { "calories": -100 } |

---

## 6. PREDICTIONS

### `predictions`
*Forecasts updated daily/weekly.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | FK | |
| `date` | DATE | | |
| `predicted_goal_date` | DATE | | |
| `predicted_abs_date` | DATE | | "Visible Abs Date" |
| `confidence_score` | NUMERIC | | Increases with logged days |

