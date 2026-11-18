/**
 * Engine input and output types. These mirror the dataclasses of the original Python engines
 * (week_engine.py and day_engine.py) so the port in phase 1 can be checked one-to-one.
 */
import type { IsoDate } from './dates';

export type Logic = 'BLACK' | 'FLAVOUR' | 'MIX_CARTON' | 'VARIETY';

// ---------- week plan ----------

export interface WorkCenterCap {
  code: string;
  /** Sum of capacity per minute over the line's active machines (tea bags / min). */
  lineCapPerMin: number;
  minutesPerShift: number;
  shiftsPerDay: number;
  daysPerWeek: number;
  /** Premix / Instant Tea: each change-over costs one day of capacity. */
  changeoverDay: boolean;
}

export interface OrderLine {
  soNo: string;
  lineNo: string;
  item: string;
  /** Cases in the item's UOM. */
  qty: number;
  tbgsPerCase: number;
  workCenter: string;
  shipDate: IsoDate | null;
  priority: number | null;
  poDate: IsoDate | null;
}

export interface Material {
  /** item -> cases the warehouse material covers */
  available: Record<string, number>;
  /** item -> earliest pending packing-material arrival date */
  arrivals: Record<string, IsoDate>;
}

/** Where the previous week plan put an SO, and the ship date it had then. */
export interface PriorAssignment {
  weekStart: IsoDate;
  shipDate: IsoDate | null;
}

export interface PlannedLine {
  /** 0 = production week, 1.. = PM weeks */
  weekIndex: number;
  soNo: string;
  lineNo: string;
  item: string;
  workCenter: string;
  qty: number;
  tbgs: number;
  shipDate: IsoDate | null;
  priority: number | null;
  reason: string;
}

export type IssueKind = 'held' | 'unplanned' | 'later';

export interface Issue {
  soNo: string;
  item: string;
  qty: number;
  kind: IssueKind;
  reason: string;
}

export interface WeekPlanInput {
  productionWeek: IsoDate;
  nWeeks: number;
  orders: OrderLine[];
  workCenters: WorkCenterCap[];
  material: Material;
  prior?: Record<string, PriorAssignment>;
  carryForward?: string[];
}

export interface WeekPlanResult {
  weeks: IsoDate[];
  lines: PlannedLine[];
  issues: Issue[];
}

// ---------- day plan ----------

export interface DayMachine {
  machineNo: string;
  /** Tea bags per shift (capacity/min x minutes x day efficiency). */
  capPerShift: number;
}

export interface DayLine {
  code: string;
  logic: Logic;
  machines: DayMachine[];
  shiftsPerDay: number;
  changeoverDay: boolean;
  flavourGrouping: boolean;
}

export interface Demand {
  item: string;
  /** Cases */
  qty: number;
  tbgsPerCase: number;
  shipDate: IsoDate | null;
  priority: number | null;
  flavour: string;
  /** Cases already in stock (the VARIETY logic deducts it). */
  stock: number;
}

export interface Cell {
  shiftIdx: number;
  machineNo: string;
  item: string;
  planned: number;
  carryIn: number;
  /** planned - carryIn: material is requested only for new quantity. */
  requisition: number;
  produced: number | null;
  note: string;
}

/** Key: `${shiftIdx}|${machineNo}|${item}` -> produced cases. */
export type Actuals = Record<string, number>;

export interface LinePlan {
  code: string;
  logic: Logic;
  cells: Cell[];
  /** Cases not fitted into the 12 shifts (to next week). */
  leftover: Record<string, number>;
  order: string[];
  /** FLAVOUR logic: machines assigned per SKU. */
  machinesNeeded: Record<string, number>;
}
