# PRODUCT REQUIREMENTS DOCUMENT

## CUTOS — Body Recomposition Operating System

Version: 1.0 (MVP Build Spec)

---

# 1. PRODUCT OVERVIEW

## 1.1 Purpose

CUTOS is a metabolic trajectory verification system that determines whether a user’s current behavior will produce measurable fat loss within a predictable timeframe.

The product removes uncertainty during a fat-loss phase by validating the relationship between effort and biological outcome.

CUTOS does not function as a fitness tracker or habit logger.
It functions as a **closed-loop physiological control system**.

---

## 1.2 Core User Question

Every day the product must answer:

> If I continue like this, will my body become leaner?

---

## 1.3 Product Category

Metabolic Decision System

Not:

* calorie tracker
* workout planner
* habit tracker

---

## 1.4 Core Value Proposition

The product verifies three layers simultaneously:

1. Behavioral execution (Did the user follow the plan)
2. Energy accounting (Could fat loss physically occur)
3. Biological response (Is fat loss actually happening)

Only when all three align is progress confirmed.

---

# 2. TARGET USERS

Primary:
Individuals already engaged in a fat-loss or recomposition phase who have previously experienced effort without predictable results.

Secondary:
Analytical users seeking objective validation rather than motivational coaching.

Not targeted:
Beginners needing education about nutrition or exercise basics.

---

# 3. SYSTEM ARCHITECTURE

CUTOS consists of four core engines:

1. Input Engine – Collects minimal daily signals
2. Target Engine – Generates adaptive physiological targets
3. Metabolic Accounting Engine – Computes energy balance physics
4. Trajectory Engine – Validates biological response
5. Decision Engine – Adjusts the plan when mismatch occurs

---

# 4. DATA INPUT REQUIREMENTS

## 4.1 Required Daily Inputs (≤20 seconds logging)

| Field              | Type    |
| ------------------ | ------- |
| Body Weight        | numeric |
| Calorie Intake     | numeric |
| Protein Intake     | numeric |
| Training Performed | boolean |
| Sleep Adequate     | boolean |

---

## 4.2 Optional Inputs

| Field              | Purpose              |
| ------------------ | -------------------- |
| Hydration          | optimization         |
| Fasting Window     | metabolic signal     |
| Meditation         | recovery indicator   |
| Wind-Down Routine  | sleep reliability    |
| Deep Sleep Minutes | wearable integration |

The system must function fully without optional inputs.

---

# 5. TARGET ENGINE (ADAPTIVE PHYSIOLOGY)

Targets are never stored as fixed values.
They are computed daily from the user’s biological state and active protocol.

---

## 5.1 Body Model

lean_mass = weight × (1 − bodyfat)
TDEE = resting_burn + activity_estimate + training_expenditure

---

## 5.2 Example Mini-Cut Protocol Formulas

protein_target = lean_mass × 2.2 g
deficit_target = TDEE × 0.30
hydration_target = weight × 0.035 L

Targets update every 7 days only.

The user must be informed when adjustments occur.

---

# 6. METABOLIC ACCOUNTING ENGINE (ENERGY LEDGER)

The system stores an immutable daily metabolic record.

## 6.1 Intake Layer

calorie_intake
calorie_target
calorie_adherence %

---

## 6.2 Expenditure Layer

resting_burn
activity_burn
sport_burn
total_energy_expenditure (TDEE)

---

## 6.3 Deficit Layer

net_daily_deficit = TDEE − intake
deficit_target
deficit_adherence %

---

## 6.4 Protein Layer

protein_intake
protein_target
protein_adherence %

---

## 6.5 Weekly Theoretical Fat Loss

weekly_fat_loss = sum(net_deficit_7d) / 7700 kcal

This value feeds trajectory validation.

---

# 7. DAILY EXECUTION SCORING

The user is never shown success/failure.

Instead they receive an execution quality score.

| Score  | Label     |
| ------ | --------- |
| 90–100 | Optimal   |
| 75–89  | On Track  |
| 60–74  | At Risk   |
| <60    | Off Track |

---

## 7.1 Score Weights

| Category       | Weight |
| -------------- | ------ |
| Energy balance | 35%    |
| Protein        | 20%    |
| Recovery       | 20%    |
| Training       | 10%    |
| Hydration      | 10%    |
| Signals        | 5%     |

---

# 8. TRAJECTORY ENGINE (CORE DIFFERENTIATION)

The system ignores daily scale fluctuations.

Instead it compares:

Expected weight change vs smoothed observed change.

---

## 8.1 Computation

expected_loss = weekly_deficit / 7700
actual_trend = 7-day smoothed weight change

---

## 8.2 Output States

| State     | Meaning                      |
| --------- | ---------------------------- |
| Validated | Fat loss confirmed           |
| Delayed   | Water retention masking loss |
| Plateau   | Adaptation occurring         |
| Diverging | Plan ineffective             |

---

## 8.3 Fat Loss Confidence Score

The system outputs probability that fat loss is occurring based on deficit reliability vs weight trend.

---

# 9. DECISION ENGINE

Triggered when mismatch persists ≥ 7 days.

| Condition            | Adjustment                      |
| -------------------- | ------------------------------- |
| Plateau              | Increase deficit 5–8%           |
| Recovery degradation | Reduce deficit                  |
| Excessive loss       | Protect muscle (raise calories) |
| No training stimulus | Recommend minimum sessions      |

Adjustments occur weekly only.

---

# 10. USER INTERFACE REQUIREMENTS

## Home Screen Must Display Only:

1. Today’s Execution Status
2. Trajectory Status
3. Transformation Reliability Rate (TRR)
4. Predicted Visible Abs Date
5. Today’s Required Actions

No charts on entry screen.

---

## Advanced Screen

Shows metabolic ledger and calculations for analytical users.

---

# 11. WEEKLY REVIEW

Every 7 days the user receives:

• adaptation report
• updated targets
• revised prediction date

---

# 12. PREDICTION SYSTEM

Continuously updated:

target_weight_date
estimated_bodyfat_date
visible_abs_date

Prediction confidence increases with logged days.

---

# 13. EDGE CASE HANDLING

| Scenario   | Behavior            |
| ---------- | ------------------- |
| Refeed     | Neutral day         |
| Travel     | Maintenance mode    |
| Illness    | Pause protocol      |
| Cheat meal | Recalculate deficit |

---

# 14. MVP SCOPE

Included:
adaptive targets
execution score
metabolic ledger
trajectory validation
weekly adjustments
prediction dates

Excluded:
social features
meal plans
recipes
community
wearable dependency

---

# 15. SUCCESS CRITERIA

The product succeeds if users can reliably maintain ≥ 80% valid days over 60 days and report reduced uncertainty about progress.

---

# FINAL PRODUCT DEFINITION

CUTOS is a system that verifies effort converts into results and automatically corrects the plan when it does not.

Users do not open the app to record what they did.

They open it to know:

**Whether continuing today guarantees a leaner body tomorrow.**
