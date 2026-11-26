import { describe, expect, it } from 'vitest';
import { EMPLOYEES, INITIAL_SHIFT_OVERRIDES, SEED_ALERTS, SEED_ORDERS } from '../data/seed';
import { getDayCoverage, getShift, isUnscheduled, shiftKey, summarizeWeek } from './schedule';

const WEEK = ['2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'];

describe('schedule coverage', () => {
  it('staffs every shift fully on a regular weekday', () => {
    const coverage = getDayCoverage('2026-10-26', {}, EMPLOYEES);
    expect(coverage.morning.byDepartment).toEqual({ cleaning: 3, counter: 3, maintenance: 3 });
    expect(coverage.afternoon.total).toBe(9);
    expect(coverage.night.total).toBe(9);
  });

  it('leaves Saturday unscheduled until shifts are assigned', () => {
    expect(isUnscheduled(getDayCoverage('2026-10-31', {}, EMPLOYEES))).toBe(true);
    expect(getShift(EMPLOYEES[0], '2026-10-31', {})).toBe('off');
  });

  it('reflects the staffing gaps of the design week', () => {
    const wed = getDayCoverage('2026-10-28', INITIAL_SHIFT_OVERRIDES, EMPLOYEES);
    expect([wed.morning.total, wed.afternoon.total, wed.night.total]).toEqual([8, 8, 9]);
    const thu = getDayCoverage('2026-10-29', INITIAL_SHIFT_OVERRIDES, EMPLOYEES);
    expect(thu.night.byDepartment.maintenance).toBe(1);
  });

  it('updates coverage when a shift is edited', () => {
    const employee = EMPLOYEES[0];
    const date = '2026-10-26';
    expect(getShift(employee, date, {})).toBe('morning');
    const coverage = getDayCoverage(date, { [shiftKey(employee.id, date)]: 'night' }, EMPLOYEES);
    expect(coverage.morning.byDepartment.cleaning).toBe(2);
    expect(coverage.night.byDepartment.cleaning).toBe(4);
  });

  it('summarizes the days that need completing', () => {
    const summary = summarizeWeek(WEEK, INITIAL_SHIFT_OVERRIDES, EMPLOYEES, (s) => s);
    expect(summary.daysWithGaps).toBe(3);
    expect(summary.gaps.map((g) => g.date)).toEqual(['2026-10-28', '2026-10-29', '2026-10-31']);
    expect(summary.gaps[0]).toMatchObject({ label: 'morning וafternoon', missing: 2 });
  });
});

describe('seed data', () => {
  it('matches the counts shown in the design', () => {
    expect(SEED_ALERTS).toHaveLength(23);
    expect(SEED_ALERTS.filter((a) => a.severity === 'critical')).toHaveLength(7);
    expect(SEED_ORDERS).toHaveLength(42);
    expect(new Set(SEED_ORDERS.map((o) => o.id)).size).toBe(42);
  });
});
