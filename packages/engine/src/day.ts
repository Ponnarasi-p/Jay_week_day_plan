import type { Actuals, DayLine, Demand, LinePlan } from './types';

/**
 * Auto day plan for one machine line over 12 shifts. Phase 1 ports the rules of the original
 * day_engine.py here: BLACK / FLAVOUR / MIX_CARTON / VARIETY logics, flavour grouping,
 * change-over cleaning days, and carry-forward of shortfalls to the same machine's next shift.
 */
export function planLine(_line: DayLine, _demands: Demand[], _actuals: Actuals = {}): LinePlan {
  throw new Error('planLine is not ported yet (phase 1)');
}
