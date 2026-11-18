import { describe, expect, it } from 'vitest';
import { addDays, defaultProductionWeek, isoWeekNo, mondayOf, shiftLabel, weekday } from '../src/dates';

describe('dates', () => {
  it('finds the Monday of a week', () => {
    expect(mondayOf('2026-11-18')).toBe('2026-11-16'); // Wednesday
    expect(mondayOf('2026-11-16')).toBe('2026-11-16'); // Monday
    expect(mondayOf('2026-11-22')).toBe('2026-11-16'); // Sunday
  });

  it('uses Monday = 0 like Python', () => {
    expect(weekday('2026-11-16')).toBe(0);
    expect(weekday('2026-11-22')).toBe(6);
  });

  it('crosses month and year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });

  it('plans the coming week from Friday', () => {
    expect(defaultProductionWeek('2026-11-19')).toBe('2026-11-16'); // Thursday
    expect(defaultProductionWeek('2026-11-20')).toBe('2026-11-23'); // Friday
  });

  it('gives ISO week numbers', () => {
    expect(isoWeekNo('2026-11-18')).toBe(47);
    expect(isoWeekNo('2027-01-01')).toBe(53);
  });

  it('labels the 12 shifts', () => {
    expect(shiftLabel(0)).toBe('Mon A');
    expect(shiftLabel(11)).toBe('Sat B');
  });
});
