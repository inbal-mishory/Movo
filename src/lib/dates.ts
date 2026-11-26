const pad = (n: number) => String(n).padStart(2, '0');

// The app clock is fixed to the date shown in the design.
export const DEMO_NOW = new Date(2026, 9, 26, 10, 30);
export const DEMO_TODAY = '2026-10-26';

export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const d = parseIsoDate(iso);
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

// Weeks start on Sunday.
export function startOfWeek(iso: string): string {
  const d = parseIsoDate(iso);
  d.setDate(d.getDate() - d.getDay());
  return toIsoDate(d);
}

export function formatDotted(iso: string, withYear = false): string {
  const d = parseIsoDate(iso);
  const base = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
  return withYear ? `${base}.${d.getFullYear()}` : base;
}

export function formatSlashedDate(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatClock(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const WEEKDAY_LABEL = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
