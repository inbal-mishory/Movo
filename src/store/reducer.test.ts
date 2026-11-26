import { describe, expect, it } from 'vitest';
import { createInitialState, loadState, nextOrderId, reducer, STORAGE_KEY } from './reducer';

const storageWith = (value: string | null) => ({ getItem: (key: string) => (key === STORAGE_KEY ? value : null) });

describe('reducer', () => {
  it('adds new alerts to the top and deletes by id', () => {
    const state = createInitialState();
    const alert = { ...state.alerts[0], id: 'new-1', title: 'חדש' };
    const added = reducer(state, { type: 'alert/add', alert });
    expect(added.alerts[0].id).toBe('new-1');
    expect(added.alerts).toHaveLength(state.alerts.length + 1);

    const removed = reducer(added, { type: 'alert/delete', id: 'new-1' });
    expect(removed.alerts.map((a) => a.id)).not.toContain('new-1');
  });

  it('stores an assignment on the matching alert only', () => {
    const state = createInitialState();
    const assignment = { department: 'maintenance' as const, contact: 'רועי מזרחי', targetMinutes: 15, notes: '', notifyCustomer: true };
    const next = reducer(state, { type: 'alert/assign', id: state.alerts[1].id, assignment });
    expect(next.alerts[1].assignment).toEqual(assignment);
    expect(next.alerts[0].assignment).toBeUndefined();
  });

  it('allocates order ids above the existing maximum', () => {
    const { orders } = createInitialState();
    const max = Math.max(...orders.map((o) => o.id));
    expect(nextOrderId(orders)).toBe(max + 1);
  });
});

describe('loadState', () => {
  it('restores a valid persisted state', () => {
    const persisted = { ...createInitialState(), alerts: [] };
    expect(loadState(storageWith(JSON.stringify(persisted))).alerts).toEqual([]);
  });

  it('falls back to seed data for missing, corrupt or outdated storage', () => {
    const seed = createInitialState();
    expect(loadState(storageWith(null)).alerts).toHaveLength(seed.alerts.length);
    expect(loadState(storageWith('{not json')).alerts).toHaveLength(seed.alerts.length);
    expect(loadState(storageWith(JSON.stringify({ ...seed, version: 0, alerts: [] }))).alerts).toHaveLength(seed.alerts.length);
  });
});
