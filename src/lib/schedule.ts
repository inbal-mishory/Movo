import { DEPARTMENTS, REQUIRED_PER_DEPARTMENT_SHIFT, SHIFTS } from './labels';
import { parseIsoDate } from './dates';
import type { Department, Employee, ShiftOverrides, ShiftType } from '../types';

export const shiftKey = (employeeId: string, date: string) => `${employeeId}|${date}`;

// Everyone works their regular shift Sunday to Friday; Saturday has no roster until it is published.
export function getShift(employee: Employee, date: string, overrides: ShiftOverrides): ShiftType {
  const override = overrides[shiftKey(employee.id, date)];
  if (override) return override;
  return parseIsoDate(date).getDay() === 6 ? 'off' : employee.defaultShift;
}

export type DepartmentCounts = Record<Department, number>;

export interface ShiftCoverage {
  total: number;
  required: number;
  byDepartment: DepartmentCounts;
}

export type WorkingShift = Exclude<ShiftType, 'off'>;
export type DayCoverage = Record<WorkingShift, ShiftCoverage>;

export function getDayCoverage(date: string, overrides: ShiftOverrides, employees: Employee[]): DayCoverage {
  const result = {} as DayCoverage;
  for (const shift of SHIFTS) {
    result[shift] = {
      total: 0,
      required: REQUIRED_PER_DEPARTMENT_SHIFT * DEPARTMENTS.length,
      byDepartment: { cleaning: 0, counter: 0, maintenance: 0 },
    };
  }
  for (const employee of employees) {
    const shift = getShift(employee, date, overrides);
    if (shift === 'off') continue;
    result[shift].total += 1;
    result[shift].byDepartment[employee.department] += 1;
  }
  return result;
}

// A day with nobody rostered at all has not been scheduled yet.
export const isUnscheduled = (coverage: DayCoverage) => SHIFTS.every((s) => coverage[s].total === 0);

export interface WeekSummary {
  missingSlots: number;
  daysWithGaps: number;
  gaps: { date: string; label: string; missing: number | null }[];
}

export function summarizeWeek(
  days: string[],
  overrides: ShiftOverrides,
  employees: Employee[],
  shiftLabel: (shift: WorkingShift) => string,
): WeekSummary {
  let missingSlots = 0;
  let daysWithGaps = 0;
  const gaps: WeekSummary['gaps'] = [];

  for (const date of days) {
    const coverage = getDayCoverage(date, overrides, employees);
    if (isUnscheduled(coverage)) {
      missingSlots += SHIFTS.reduce((sum, s) => sum + coverage[s].required, 0);
      daysWithGaps += 1;
      gaps.push({ date, label: 'כל המשמרות', missing: null });
      continue;
    }
    const short = SHIFTS.filter((s) => coverage[s].total < coverage[s].required);
    if (short.length === 0) continue;
    const missing = short.reduce((sum, s) => sum + coverage[s].required - coverage[s].total, 0);
    missingSlots += missing;
    daysWithGaps += 1;
    gaps.push({ date, label: short.map(shiftLabel).join(' ו'), missing });
  }
  return { missingSlots, daysWithGaps, gaps };
}
