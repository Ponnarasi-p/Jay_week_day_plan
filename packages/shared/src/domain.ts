import { z } from 'zod';

/** Planning logic chosen per machine line before each week's plan. */
export const LOGICS = ['BLACK', 'FLAVOUR', 'MIX_CARTON', 'VARIETY'] as const;
export const LogicSchema = z.enum(LOGICS);
export type Logic = z.infer<typeof LogicSchema>;

export const LOGIC_NAMES: Record<Logic, string> = {
  BLACK: 'Black tea',
  FLAVOUR: 'Flavour tea',
  MIX_CARTON: 'Mix carton',
  VARIETY: 'Variety pack',
};

export const ROLES = ['ADMIN', 'PLANNER', 'SUPERVISOR', 'VIEWER'] as const;
export type Role = (typeof ROLES)[number];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const SHIFT_NAMES = ['A', 'B'] as const;
/** 12 shifts: Mon A .. Sat B. */
export const N_SHIFTS = DAY_NAMES.length * SHIFT_NAMES.length;

/** Calendar date as YYYY-MM-DD. Plans never use JS Date with a time zone. */
export const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date as YYYY-MM-DD');
export type IsoDate = z.infer<typeof IsoDateSchema>;

export const WorkCenterPatchSchema = z.object({
  zone: z.string().optional(),
  logic: LogicSchema.optional(),
  capPerMin: z.number().nonnegative().optional(),
  minutesPerShift: z.number().int().positive().optional(),
  dayEfficiency: z.number().min(0).max(100).optional(),
  changeoverDay: z.boolean().optional(),
  flavourGrouping: z.boolean().optional(),
});
export type WorkCenterPatch = z.infer<typeof WorkCenterPatchSchema>;

export interface HealthStatus {
  status: 'ok';
  db: 'up' | 'down';
  time: string;
}
