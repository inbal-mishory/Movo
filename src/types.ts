export type Department = 'cleaning' | 'counter' | 'maintenance';
export type ShiftType = 'morning' | 'afternoon' | 'night' | 'off';
export type AlertSeverity = 'critical' | 'operational';
export type AlertIconKey =
  | 'clock'
  | 'alert'
  | 'wifi-off'
  | 'calendar-x'
  | 'car'
  | 'wrench'
  | 'clipboard'
  | 'user-x'
  | 'users';

export interface AlertAssignment {
  department: Department;
  contact: string;
  targetMinutes: number;
  notes: string;
  notifyCustomer: boolean;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  icon: AlertIconKey;
  vehicle: string;
  audience: Department | 'all';
  // Display time ("12:20") for today's alerts or a short date ("25 באוק'") for older ones.
  timeLabel: string;
  assignment?: AlertAssignment;
}

export type PickupMethod = 'lot' | 'delivery';
export type PaymentStatus = 'paid' | 'pending';
export type OrderStatus = 'approved' | 'pending' | 'cancelled';

export interface Order {
  id: number;
  customer: string;
  vehicleModel: string;
  category: string;
  internalNumber: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string;
  returnTime: string;
  pickupMethod: PickupMethod;
  returnMethod: PickupMethod;
  paymentStatus: PaymentStatus;
  total: number;
  status: OrderStatus;
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  defaultShift: Exclude<ShiftType, 'off'>;
}

export type ShiftOverrides = Record<string, ShiftType>;

export interface PersistedState {
  version: number;
  alerts: Alert[];
  orders: Order[];
  shiftOverrides: ShiftOverrides;
}
