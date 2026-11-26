import {
  CalendarX,
  CarFront,
  OctagonAlert,
  ClipboardList,
  ClockAlert,
  UserRoundX,
  UsersRound,
  WifiOff,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { AlertIconKey } from '../../types';

export const ALERT_ICONS: Record<AlertIconKey, { icon: LucideIcon; label: string }> = {
  wrench: { icon: Wrench, label: 'תקלה טכנית' },
  alert: { icon: OctagonAlert, label: 'התערבות אנושית' },
  'wifi-off': { icon: WifiOff, label: 'אובדן תקשורת' },
  car: { icon: CarFront, label: 'תאונה' },
  'calendar-x': { icon: CalendarX, label: 'בעיית הזמנה' },
  clock: { icon: ClockAlert, label: 'עיכוב' },
  clipboard: { icon: ClipboardList, label: 'משימה' },
  'user-x': { icon: UserRoundX, label: 'פנייה של לקוח' },
  users: { icon: UsersRound, label: 'כוח אדם' },
};

export const ALERT_ICON_KEYS = Object.keys(ALERT_ICONS) as AlertIconKey[];
