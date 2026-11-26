import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Download, Moon, Send, Sun, Sunset } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { EMPLOYEES } from '../data/seed';
import { addDays, DEMO_TODAY, formatDotted, parseIsoDate, startOfWeek, WEEKDAY_LABEL } from '../lib/dates';
import { DEPARTMENT_LABEL, DEPARTMENTS, REQUIRED_PER_DEPARTMENT_SHIFT, SHIFT_LABEL, SHIFTS } from '../lib/labels';
import { getDayCoverage, getShift, isUnscheduled, summarizeWeek, type WorkingShift } from '../lib/schedule';
import { useAppStore } from '../store/AppStore';
import type { Department, ShiftType } from '../types';

type DepartmentFilter = Department | 'all';

const SHIFT_OPTIONS: ShiftType[] = [...SHIFTS, 'off'];

const SHIFT_HOURS: { shift: WorkingShift; range: string; icon: typeof Sun }[] = [
  { shift: 'morning', range: '08:00–16:00', icon: Sun },
  { shift: 'afternoon', range: '16:00–00:00', icon: Sunset },
  { shift: 'night', range: '00:00–08:00', icon: Moon },
];

export function SchedulePage() {
  const { state, dispatch } = useAppStore();
  const toast = useToast();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(DEMO_TODAY));
  const [filter, setFilter] = useState<DepartmentFilter>('all');

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const coverage = useMemo(() => days.map((day) => getDayCoverage(day, state.shiftOverrides, EMPLOYEES)), [days, state.shiftOverrides]);
  const summary = useMemo(
    () => summarizeWeek(days, state.shiftOverrides, EMPLOYEES, (s) => SHIFT_LABEL[s]),
    [days, state.shiftOverrides],
  );

  const departments = filter === 'all' ? DEPARTMENTS : [filter];
  const required = filter === 'all' ? REQUIRED_PER_DEPARTMENT_SHIFT * DEPARTMENTS.length : REQUIRED_PER_DEPARTMENT_SHIFT;
  const rangeLabel = `${formatDotted(days[0])} – ${formatDotted(days[6], true)}`;

  const FILTERS: { key: DepartmentFilter; label: string }[] = [
    { key: 'all', label: `כל המחלקות (${EMPLOYEES.length})` },
    ...DEPARTMENTS.map((d) => ({
      key: d,
      label: `${DEPARTMENT_LABEL[d]} (${EMPLOYEES.filter((e) => e.department === d).length})`,
    })),
  ];

  return (
    <section className="card schedule" aria-labelledby="schedule-title">
      <div className="schedule__main">
        <div className="schedule__head">
          <h2 id="schedule-title" className="card__title">
            סידור עבודה
          </h2>
          <div className="view-toggle" role="group" aria-label="תצוגה">
            <button type="button" className="view-toggle__option" disabled>
              יומי
            </button>
            <button type="button" className="view-toggle__option view-toggle__option--active" aria-pressed="true">
              שבועי
            </button>
          </div>
          <div className="week-nav">
            <button type="button" className="icon-btn" aria-label="שבוע קודם" onClick={() => setWeekStart(addDays(weekStart, -7))}>
              <ChevronRight />
            </button>
            <span dir="ltr">{rangeLabel}</span>
            <button type="button" className="icon-btn" aria-label="שבוע הבא" onClick={() => setWeekStart(addDays(weekStart, 7))}>
              <ChevronLeft />
            </button>
          </div>
          <button type="button" className="view-toggle__option" disabled>
            חודשי
          </button>
        </div>

        <div className="pills schedule__filters" role="group" aria-label="סינון לפי מחלקה">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`pill pill--filter${filter === key ? ' pill--active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="schedule__scroll scroll-area">
          <table className="grid">
            <colgroup>
              <col className="grid__employee-col" />
              {days.map((day) => (
                <col key={day} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="grid__employee-head">
                  עובד · תפקיד
                </th>
                {days.map((day) => (
                  <th key={day} scope="col" className={day === DEMO_TODAY ? 'grid__day grid__day--today' : 'grid__day'}>
                    {WEEKDAY_LABEL[parseIsoDate(day).getDay()]}
                    <small>
                      {parseIsoDate(day).getDate()}
                      {day === DEMO_TODAY && ' · היום'}
                    </small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <DepartmentRows
                  key={department}
                  department={department}
                  days={days}
                  onChange={(employeeId, date, shift) => {
                    dispatch({ type: 'shift/set', employeeId, date, shift });
                    toast('המשמרת עודכנה בהצלחה');
                  }}
                />
              ))}
            </tbody>
            <tfoot>
              {SHIFTS.map((shift) => (
                <tr key={shift}>
                  <th scope="row">כיסוי {SHIFT_LABEL[shift]}</th>
                  {days.map((day, i) => (
                    <CoverageCell
                      key={day}
                      pending={isUnscheduled(coverage[i])}
                      count={filter === 'all' ? coverage[i][shift].total : coverage[i][shift].byDepartment[filter]}
                      required={required}
                      department={filter === 'all' ? singleShortDepartment(coverage[i][shift].byDepartment) : filter}
                    />
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </div>

      <aside className="schedule__side" aria-label="סיכום שיבוץ">
        <div className="schedule__actions">
          <Button variant="dark">
            פרסום סידור <Send size="1.1em" aria-hidden />
          </Button>
          <Button variant="outline">
            ייצוא <Download size="1.1em" aria-hidden />
          </Button>
        </div>

        <section className="side-card schedule__summary">
          <div className="side-card__head">
            <h3 className="side-card__title">סיכום שיבוץ שבועי</h3>
            <CalendarDays aria-hidden strokeWidth={1.6} />
          </div>
          <div className="kpis">
            <div className="kpi">
              <span>שיבוצים חסרים</span>
              <strong>{summary.missingSlots}</strong>
            </div>
            <div className="kpi">
              <span>ימים עם חוסרים</span>
              <strong>{summary.daysWithGaps}</strong>
            </div>
          </div>
          <h4 className="side-card__subtitle">שיבוצים להשלמה</h4>
          {summary.gaps.length === 0 ? (
            <p className="gaps">השיבוץ מלא לכל השבוע</p>
          ) : (
            <ul className="gaps">
              {summary.gaps.map((gap) => (
                <li key={gap.date}>
                  <span>
                    {WEEKDAY_LABEL[parseIsoDate(gap.date).getDay()]} · {gap.label}
                  </span>
                  {gap.missing === null ? <span>טרם שובץ</span> : <span><b>{gap.missing}</b> חסרים</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="side-card schedule__hours">
          <h3 className="side-card__title">שעות המשמרות</h3>
          <ul className="hours">
            {SHIFT_HOURS.map(({ shift, range, icon: Icon }) => (
              <li key={shift}>
                <span className="hours__name">
                  {SHIFT_LABEL[shift]}
                  <Icon aria-hidden strokeWidth={1.8} />
                </span>
                <span className="hours__range">{range}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </section>
  );
}

// When a day is short by two or more people in a single department, the cell names it instead of showing the fraction.
function singleShortDepartment(counts: Record<Department, number>): Department | null {
  const short = DEPARTMENTS.filter((d) => counts[d] < REQUIRED_PER_DEPARTMENT_SHIFT);
  return short.length === 1 && REQUIRED_PER_DEPARTMENT_SHIFT - counts[short[0]] >= 2 ? short[0] : null;
}

interface CoverageCellProps {
  pending: boolean;
  count: number;
  required: number;
  department: Department | null;
}

function CoverageCell({ pending, count, required, department }: CoverageCellProps) {
  const missing = required - count;
  const short = pending || missing > 0;
  let content = `${count}/${required}`;
  if (pending) content = 'טרם הושלם';
  else if (department && missing >= 2) content = `חסרים ${missing} ב${DEPARTMENT_LABEL[department]}`;

  return (
    <td
      className={`grid__coverage${short ? ' grid__coverage--short' : ''}${pending || content.startsWith('חסרים') ? ' grid__coverage--pending' : ''}`}
    >
      {content}
    </td>
  );
}

interface DepartmentRowsProps {
  department: Department;
  days: string[];
  onChange: (employeeId: string, date: string, shift: ShiftType) => void;
}

function DepartmentRows({ department, days, onChange }: DepartmentRowsProps) {
  const { state } = useAppStore();
  const employees = EMPLOYEES.filter((e) => e.department === department);

  return (
    <>
      <tr className="grid__group">
        <th scope="rowgroup" colSpan={days.length + 1}>
          {DEPARTMENT_LABEL[department]}
        </th>
      </tr>
      {employees.map((employee) => (
        <tr key={employee.id}>
          <th scope="row" className="grid__employee">
            <strong>{employee.name}</strong>
            <span>{employee.role}</span>
          </th>
          {days.map((day) => {
            const shift = getShift(employee, day, state.shiftOverrides);
            return (
              <td key={day} className={day === DEMO_TODAY ? 'grid__cell grid__cell--today' : 'grid__cell'}>
                <select
                  className={`shift-select shift-select--${shift}`}
                  value={shift}
                  aria-label={`משמרת של ${employee.name} בתאריך ${formatDotted(day, true)}`}
                  onChange={(e) => onChange(employee.id, day, e.target.value as ShiftType)}
                >
                  {SHIFT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {SHIFT_LABEL[s]}
                    </option>
                  ))}
                </select>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
