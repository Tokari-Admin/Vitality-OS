export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            daily_inputs: {
                Row: {
                    active_calories_burned: number | null
                    body_fat_pct: number | null
                    calories_consumed: number | null
                    created_at: string | null
                    date: string
                    hydration_liters: number | null
                    id: string
                    is_sleep_adequate: boolean | null
                    notes: string | null
                    protein_consumed: number | null
                    sleep_quality_score: number | null
                    steps_count: number | null
                    training_completed: boolean | null
                    user_id: string
                    weight_kg: number | null
                }
                Insert: {
                    active_calories_burned?: number | null
                    body_fat_pct?: number | null
                    calories_consumed?: number | null
                    created_at?: string | null
                    date: string
                    hydration_liters?: number | null
                    id?: string
                    is_sleep_adequate?: boolean | null
                    notes?: string | null
                    protein_consumed?: number | null
                    sleep_quality_score?: number | null
                    steps_count?: number | null
                    training_completed?: boolean | null
                    user_id: string
                    weight_kg?: number | null
                }
                Update: {
                    active_calories_burned?: number | null
                    body_fat_pct?: number | null
                    calories_consumed?: number | null
                    created_at?: string | null
                    date?: string
                    hydration_liters?: number | null
                    id?: string
                    is_sleep_adequate?: boolean | null
                    notes?: string | null
                    protein_consumed?: number | null
                    sleep_quality_score?: number | null
                    steps_count?: number | null
                    training_completed?: boolean | null
                    user_id?: string
                    weight_kg?: number | null
                }
            }
            daily_ledger: {
                Row: {
                    calculated_tdee: number | null
                    created_at: string
                    date: string
                    deficit_adherence_pct: number | null
                    execution_label: 'OPTIMAL' | 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | null
                    execution_score: number | null
                    id: string
                    input_id: string
                    net_deficit: number | null
                    target_calories: number | null
                    target_protein: number | null
                }
                Insert: {
                    calculated_tdee?: number | null
                    created_at?: string
                    date: string
                    deficit_adherence_pct?: number | null
                    execution_label?: 'OPTIMAL' | 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | null
                    execution_score?: number | null
                    id?: string
                    input_id: string
                    net_deficit?: number | null
                    target_calories?: number | null
                    target_protein?: number | null
                }
                Update: {
                    calculated_tdee?: number | null
                    created_at?: string
                    date?: string
                    deficit_adherence_pct?: number | null
                    execution_label?: 'OPTIMAL' | 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | null
                    execution_score?: number | null
                    id?: string
                    input_id?: string
                    net_deficit?: number | null
                    target_calories?: number | null
                    target_protein?: number | null
                }
            }
            decisions_log: {
                Row: {
                    adjustment_magnitude: Json | null
                    created_at: string
                    date: string
                    decision_code: string | null
                    id: string
                    reasoning: string | null
                    user_id: string
                }
                Insert: {
                    adjustment_magnitude?: Json | null
                    created_at?: string
                    date?: string
                    decision_code?: string | null
                    id?: string
                    reasoning?: string | null
                    user_id: string
                }
                Update: {
                    adjustment_magnitude?: Json | null
                    created_at?: string
                    date?: string
                    decision_code?: string | null
                    id?: string
                    reasoning?: string | null
                    user_id?: string
                }
            }
            predictions: {
                Row: {
                    confidence_score: number | null
                    created_at: string
                    date: string
                    id: string
                    predicted_abs_date: string | null
                    predicted_goal_date: string | null
                    user_id: string
                }
                Insert: {
                    confidence_score?: number | null
                    created_at?: string
                    date?: string
                    id?: string
                    predicted_abs_date?: string | null
                    predicted_goal_date?: string | null
                    user_id: string
                }
                Update: {
                    confidence_score?: number | null
                    created_at?: string
                    date?: string
                    id?: string
                    predicted_abs_date?: string | null
                    predicted_goal_date?: string | null
                    user_id?: string
                }
            }
            protocols: {
                Row: {
                    created_at: string
                    goal_type: 'FAT_LOSS' | 'RECOMP' | 'GAIN' | null
                    goal_weight_kg: number | null
                    goal_bodyfat_pct: number | null
                    id: string
                    initial_bodyfat_pct: number | null
                    initial_weight_kg: number | null
                    start_date: string
                    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | null
                    target_end_date: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    goal_type?: 'FAT_LOSS' | 'RECOMP' | 'GAIN' | null
                    goal_weight_kg?: number | null
                    goal_bodyfat_pct?: number | null
                    id?: string
                    initial_bodyfat_pct?: number | null
                    initial_weight_kg?: number | null
                    start_date?: string
                    status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | null
                    target_end_date?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string
                    goal_type?: 'FAT_LOSS' | 'RECOMP' | 'GAIN' | null
                    goal_weight_kg?: number | null
                    goal_bodyfat_pct?: number | null
                    id?: string
                    initial_bodyfat_pct?: number | null
                    initial_weight_kg?: number | null
                    start_date?: string
                    status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | null
                    target_end_date?: string | null
                    user_id?: string
                }
            }
            trajectory_snapshots: {
                Row: {
                    actual_weight: number | null
                    created_at: string
                    date: string
                    divergence_kg: number | null
                    expected_weight: number | null
                    fat_loss_confidence: number | null
                    id: string
                    status_label: 'VALIDATED' | 'DELAYED' | 'PLATEAU' | 'DIVERGING' | null
                    user_id: string
                    weight_trend_7d: number | null
                }
                Insert: {
                    actual_weight?: number | null
                    created_at?: string
                    date?: string
                    divergence_kg?: number | null
                    expected_weight?: number | null
                    fat_loss_confidence?: number | null
                    id?: string
                    status_label?: 'VALIDATED' | 'DELAYED' | 'PLATEAU' | 'DIVERGING' | null
                    user_id: string
                    weight_trend_7d?: number | null
                }
                Update: {
                    actual_weight?: number | null
                    created_at?: string
                    date?: string
                    divergence_kg?: number | null
                    expected_weight?: number | null
                    fat_loss_confidence?: number | null
                    id?: string
                    status_label?: 'VALIDATED' | 'DELAYED' | 'PLATEAU' | 'DIVERGING' | null
                    user_id: string
                    weight_trend_7d?: number | null
                }
            }
            user_profiles: {
                Row: {
                    activity_level_tier: number | null
                    biological_sex: 'MALE' | 'FEMALE'
                    birth_date: string
                    created_at: string | null
                    height_cm: number
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    activity_level_tier?: number | null
                    biological_sex: 'MALE' | 'FEMALE'
                    birth_date: string
                    created_at?: string | null
                    height_cm: number
                    updated_at?: string | null
                    user_id?: string
                }
                Update: {
                    activity_level_tier?: number | null
                    biological_sex?: 'MALE' | 'FEMALE'
                    birth_date?: string
                    created_at?: string | null
                    height_cm: number
                    updated_at?: string | null
                    user_id?: string
                }
            }
            weekly_targets: {
                Row: {
                    created_at: string
                    daily_calories_target: number
                    daily_protein_target: number
                    daily_steps_target: number | null
                    end_date: string
                    hydration_target_l: number | null
                    id: string
                    protocol_id: string
                    start_date: string
                    week_number: number
                }
                Insert: {
                    created_at?: string
                    daily_calories_target: number
                    daily_protein_target: number
                    daily_steps_target?: number | null
                    end_date: string
                    hydration_target_l?: number | null
                    id?: string
                    protocol_id: string
                    start_date: string
                    week_number: number
                }
                Update: {
                    created_at?: string
                    daily_calories_target: number
                    daily_protein_target: number
                    daily_steps_target?: number | null
                    end_date: string
                    hydration_target_l?: number | null
                    id?: string
                    protocol_id: string
                    start_date: string
                    week_number: number
                }
            }
        }
    }
}
