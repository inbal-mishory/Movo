import { Headset, Sparkles, Users, UsersRound, Wrench, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { DEMO_TODAY } from '../../lib/dates';
import { DEPARTMENT_LABEL, REQUIRED_PER_DEPARTMENT_SHIFT, SHIFT_LABEL, SHIFTS } from '../../lib/labels';
import { getDayCoverage } from '../../lib/schedule';
import { EMPLOYEES } from '../../data/seed';
import { useAppStore } from '../../store/AppStore';
import type { Department, ShiftType } from '../../types';

const CARDS: { department: Department; icon: LucideIcon; people: LucideIcon }[] = [
  { department: 'counter', icon: Headset, people: UsersRound },
  { department: 'maintenance', icon: Wrench, people: Users },
  { department: 'cleaning', icon: Sparkles, people: UsersRound },
];

export function ShiftStaffingCard() {
  const { state } = useAppStore();
  const [shift, setShift] = useState<Exclude<ShiftType, 'off'>>('morning');
  const coverage = getDayCoverage(DEMO_TODAY, state.shiftOverrides, EMPLOYEES)[shift];

  return (
    <section className="card staffing" aria-labelledby="staffing-title">
      <div className="staffing__head">
        <h2 id="staffing-title" className="staffing__title">
          עובדים במשמרת
        </h2>
        <select className="staffing__select" value={shift} aria-label="בחירת משמרת" onChange={(e) => setShift(e.target.value as typeof shift)}>
          {SHIFTS.map((s) => (
            <option key={s} value={s}>
              {SHIFT_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <ul className="staffing__cards">
        {CARDS.map(({ department, icon: Icon, people: People }) => {
          const count = coverage.byDepartment[department];
          const short = count < REQUIRED_PER_DEPARTMENT_SHIFT;
          return (
            <li key={department} className={`staffing__card${short ? ' staffing__card--short' : ''}`}>
              <span className="staffing__name">
                <Icon aria-hidden strokeWidth={1.7} />
                {DEPARTMENT_LABEL[department]}
              </span>
              <People className="staffing__people" aria-hidden strokeWidth={1.5} />
              <span className="staffing__count">
                {count}/{REQUIRED_PER_DEPARTMENT_SHIFT}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
