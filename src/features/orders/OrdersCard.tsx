import { useMemo, useState } from 'react';
import { ChevronsUpDown, House, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { FLEET_MODELS } from '../../data/seed';
import { PICKUP_LABEL } from '../../lib/labels';
import { useAppStore } from '../../store/AppStore';
import { nextOrderId } from '../../store/reducer';
import type { Order } from '../../types';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderFormModal } from './OrderFormModal';

type SortKey = 'time' | 'customer' | 'vehicle';
type SortDirection = 'asc' | 'desc';

const collator = new Intl.Collator('he');

const COMPARERS: Record<SortKey, (a: Order, b: Order) => number> = {
  time: (a, b) => `${a.pickupDate} ${a.pickupTime}`.localeCompare(`${b.pickupDate} ${b.pickupTime}`),
  customer: (a, b) => collator.compare(a.customer, b.customer),
  vehicle: (a, b) => collator.compare(`${a.vehicleModel} ${a.category}`, `${b.vehicleModel} ${b.category}`),
};

type ModalState = { kind: 'add' } | { kind: 'details'; id: number } | { kind: 'edit'; id: number } | null;

export function OrdersCard() {
  const { state, dispatch } = useAppStore();
  const toast = useToast();
  // Orders are listed in booking order until a column header is used to sort them.
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<ModalState>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? state.orders.filter((o) => o.customer.includes(q) || o.vehicleModel.toLowerCase().includes(q) || String(o.id).includes(q))
      : state.orders;
    if (!sort) return filtered;
    const sorted = [...filtered].sort((a, b) => COMPARERS[sort.key](a, b) || a.id - b.id);
    return sort.direction === 'asc' ? sorted : sorted.reverse();
  }, [state.orders, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) => (current?.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));

  const selected = modal && modal.kind !== 'add' ? state.orders.find((o) => o.id === modal.id) : undefined;

  const header = (key: SortKey, label: string) => {
    const active = sort?.key === key;
    return (
      <th scope="col" aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
        <button type="button" className="th-sort" onClick={() => toggleSort(key)}>
          {label}
          {key !== 'time' && <ChevronsUpDown aria-hidden />}
        </button>
      </th>
    );
  };

  return (
    <section className="card orders" aria-labelledby="orders-title">
      <div className="orders__head">
        <h2 id="orders-title" className="card__title">
          הזמנות היום ({state.orders.length})
        </h2>
        <Button size="sm" onClick={() => setModal({ kind: 'add' })}>
          הוספת הזמנה <Plus size="1em" aria-hidden />
        </Button>
      </div>
      <div className="orders__search">
        <input type="search" className="search-pill" value={query} placeholder="חיפוש" aria-label="חיפוש הזמנות" onChange={(e) => setQuery(e.target.value)} />
        <span className="search-icon" aria-hidden>
          <Search />
        </span>
      </div>

      <div className="orders__scroll scroll-area">
        <table className="table">
          <colgroup>
            <col style={{ width: '10.8%' }} />
            <col style={{ width: '23.1%' }} />
            <col style={{ width: '24.2%' }} />
            <col style={{ width: '18.3%' }} />
            <col style={{ width: '23.6%' }} />
          </colgroup>
          <thead>
            <tr>
              {header('time', 'שעה')}
              {header('customer', 'לקוח')}
              {header('vehicle', 'קטגוריה/רכב')}
              <th scope="col">אופן קבלה</th>
              <th scope="col">הערות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr
                key={order.id}
                tabIndex={0}
                onClick={() => setModal({ kind: 'details', id: order.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModal({ kind: 'details', id: order.id });
                  }
                }}
                aria-label={`הזמנה ${order.id} – ${order.customer}`}
              >
                <td className="table__time">{order.pickupTime}</td>
                <td className="table__customer">{order.customer}</td>
                <td>
                  <span className="table__vehicle">{order.vehicleModel}</span>
                  <span className="table__category">{order.category}</span>
                </td>
                <td>
                  <span className="method">
                    {order.pickupMethod === 'lot' ? <i aria-hidden /> : <House aria-hidden />}
                    {PICKUP_LABEL[order.pickupMethod]}
                  </span>
                </td>
                <td className="table__notes">{order.notes}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  לא נמצאו הזמנות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.kind === 'add' && (
        <OrderFormModal
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            const prefix = FLEET_MODELS.find((m) => m.model === values.vehicleModel)?.prefix ?? 'MOVO-0';
            const id = nextOrderId(state.orders);
            dispatch({ type: 'order/add', order: { ...values, id, internalNumber: `${prefix}${String(id % 100).padStart(2, '0')}`, status: 'approved' } });
            setModal(null);
            toast('ההזמנה נוספה בהצלחה');
          }}
        />
      )}
      {modal?.kind === 'details' && selected && (
        <OrderDetailsModal order={selected} onClose={() => setModal(null)} onEdit={() => setModal({ kind: 'edit', id: selected.id })} />
      )}
      {modal?.kind === 'edit' && selected && (
        <OrderFormModal
          order={selected}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            dispatch({ type: 'order/update', order: { ...selected, ...values } });
            setModal(null);
            toast('ההזמנה עודכנה בהצלחה');
          }}
        />
      )}
    </section>
  );
}
