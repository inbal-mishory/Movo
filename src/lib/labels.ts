import type { AlertSeverity, Department, PaymentStatus, PickupMethod, ShiftType, OrderStatus } from '../types';

export const DEPARTMENTS: Department[] = ['cleaning', 'counter', 'maintenance'];

export const DEPARTMENT_LABEL: Record<Department, string> = {
  cleaning: 'ניקיון',
  counter: 'דלפק',
  maintenance: 'תחזוקה',
};

export const DEPARTMENT_ROLE: Record<Department, string> = {
  cleaning: 'מנקה רכבים',
  counter: 'נציג שירות',
  maintenance: 'טכנאי',
};

export const SHIFTS: Exclude<ShiftType, 'off'>[] = ['morning', 'afternoon', 'night'];

export const SHIFT_LABEL: Record<ShiftType, string> = {
  morning: 'בוקר',
  afternoon: 'צהריים',
  night: 'לילה',
  off: 'ללא שיבוץ',
};

export const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  critical: 'קריטית',
  operational: 'תפעולית',
};

export const PICKUP_LABEL: Record<PickupMethod, string> = {
  lot: 'איסוף מחניון P',
  delivery: 'משלוח מחברה',
};

export const RETURN_LABEL: Record<PickupMethod, string> = {
  lot: 'החזרה לחניון P',
  delivery: 'איסוף מכתובת הלקוח',
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  paid: 'שולם',
  pending: 'ממתין לתשלום',
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  approved: 'מאושרת',
  pending: 'ממתינה',
  cancelled: 'בוטלה',
};

export const REQUIRED_PER_DEPARTMENT_SHIFT = 3;
export const REQUIRED_PER_SHIFT = REQUIRED_PER_DEPARTMENT_SHIFT * DEPARTMENTS.length;

