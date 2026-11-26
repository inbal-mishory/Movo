export interface FleetStatusSlice {
  key: 'available' | 'rented' | 'reserved' | 'maintenance';
  label: string;
  count: number;
  color: string;
}

// Listed in legend order; the donut draws them clockwise from 12 o'clock in the order of DONUT_ORDER.
export const FLEET_STATUS: FleetStatusSlice[] = [
  { key: 'available', label: 'זמינים להשכרה', count: 48, color: '#397250' },
  { key: 'rented', label: 'משוכרים', count: 58, color: '#1a3525' },
  { key: 'reserved', label: 'שמורים', count: 10, color: '#a7c3b2' },
  { key: 'maintenance', label: 'בטיפול', count: 4, color: '#c3d7cb' },
];

export const DONUT_ORDER: FleetStatusSlice['key'][] = ['maintenance', 'reserved', 'available', 'rented'];

export interface FleetTypeRow {
  name: string;
  total: number;
  available: number;
}

export const FLEET_TYPES: FleetTypeRow[] = [
  { name: 'פרימיום', total: 52, available: 20 },
  { name: 'קומפקטי', total: 38, available: 8 },
  { name: 'ואן', total: 30, available: 10 },
];

export const FLEET_TOTAL = FLEET_STATUS.reduce((sum, s) => sum + s.count, 0);
