import type { WeekPlanInput, WeekPlanResult } from './types';

/**
 * Auto week plan. Phase 1 ports the rules of the original week_engine.py here:
 * - SO planned one week before its buyer-requested ship date (overdue -> production week)
 * - whole SO in one week, spilling at most into the next week
 * - production week needs warehouse material for every SKU, else the whole SO is held
 * - PM weeks: material in factory first, else one week after packing-material arrival
 * - carry-forward first, PM week kept unless the ship date changed
 * - Premix / Instant Tea: each change-over costs one day of capacity
 */
export function planWeeks(_input: WeekPlanInput): WeekPlanResult {
  throw new Error('planWeeks is not ported yet (phase 1)');
}
