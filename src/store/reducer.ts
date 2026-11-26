import { INITIAL_SHIFT_OVERRIDES, SEED_ALERTS, SEED_ORDERS } from '../data/seed';
import type { Alert, AlertAssignment, Order, PersistedState, ShiftType } from '../types';

export const STORAGE_KEY = 'movo:state';
export const STATE_VERSION = 2;

export type Action =
  | { type: 'alert/add'; alert: Alert }
  | { type: 'alert/update'; alert: Alert }
  | { type: 'alert/delete'; id: string }
  | { type: 'alert/assign'; id: string; assignment: AlertAssignment }
  | { type: 'order/add'; order: Order }
  | { type: 'order/update'; order: Order }
  | { type: 'shift/set'; employeeId: string; date: string; shift: ShiftType };

export function createInitialState(): PersistedState {
  return {
    version: STATE_VERSION,
    alerts: SEED_ALERTS,
    orders: SEED_ORDERS,
    shiftOverrides: INITIAL_SHIFT_OVERRIDES,
  };
}

export function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'alert/add':
      return { ...state, alerts: [action.alert, ...state.alerts] };
    case 'alert/update':
      return { ...state, alerts: state.alerts.map((a) => (a.id === action.alert.id ? action.alert : a)) };
    case 'alert/delete':
      return { ...state, alerts: state.alerts.filter((a) => a.id !== action.id) };
    case 'alert/assign':
      return {
        ...state,
        alerts: state.alerts.map((a) => (a.id === action.id ? { ...a, assignment: action.assignment } : a)),
      };
    case 'order/add':
      return { ...state, orders: [...state.orders, action.order] };
    case 'order/update':
      return { ...state, orders: state.orders.map((o) => (o.id === action.order.id ? action.order : o)) };
    case 'shift/set':
      return {
        ...state,
        shiftOverrides: { ...state.shiftOverrides, [`${action.employeeId}|${action.date}`]: action.shift },
      };
  }
}

export function loadState(storage: Pick<Storage, 'getItem'> | undefined): PersistedState {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (
      parsed.version !== STATE_VERSION ||
      !Array.isArray(parsed.alerts) ||
      !Array.isArray(parsed.orders) ||
      typeof parsed.shiftOverrides !== 'object' ||
      parsed.shiftOverrides === null
    ) {
      return createInitialState();
    }
    return parsed as PersistedState;
  } catch {
    return createInitialState();
  }
}

export function nextOrderId(orders: Order[]): number {
  return orders.reduce((max, o) => Math.max(max, o.id), 4500) + 1;
}

