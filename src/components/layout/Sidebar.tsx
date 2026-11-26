import { NavLink } from 'react-router-dom';
import { Calendar, CalendarCheck, CarFront, ChartColumn, LayoutDashboard, Settings, UsersRound, Wallet, type LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
}

// Only the dashboard and the work schedule have screens in the design.
const ITEMS: NavItem[] = [
  { label: 'עמוד ראשי', icon: LayoutDashboard, to: '/' },
  { label: 'רכבים', icon: CarFront },
  { label: 'הזמנות', icon: CalendarCheck },
  { label: 'דוחות', icon: ChartColumn },
  { label: 'יומן', icon: Calendar },
  { label: 'סידור עבודה', icon: UsersRound, to: '/schedule' },
  { label: 'כספים', icon: Wallet },
  { label: 'הגדרות', icon: Settings },
];

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="ניווט ראשי">
      <ul className="sidebar__list">
        {ITEMS.map(({ label, icon: Icon, to }) => (
          <li key={label}>
            {to ? (
              <NavLink to={to} end className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
                <Icon aria-hidden />
                <span>{label}</span>
              </NavLink>
            ) : (
              <span className="nav-item nav-item--disabled" aria-disabled="true">
                <Icon aria-hidden />
                <span>{label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
