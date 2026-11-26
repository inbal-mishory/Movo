import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDotted, parseIsoDate } from '../../lib/dates';
import { ORDER_STATUS_LABEL, PAYMENT_LABEL, PICKUP_LABEL, RETURN_LABEL } from '../../lib/labels';
import type { Order } from '../../types';

interface OrderDetailsModalProps {
  order: Order;
  onEdit: () => void;
  onClose: () => void;
}

export function rentalDays(order: Pick<Order, 'pickupDate' | 'returnDate'>): number {
  const ms = parseIsoDate(order.returnDate).getTime() - parseIsoDate(order.pickupDate).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

const dayLabel = (days: number) => (days === 1 ? 'יום אחד' : `${days} ימים`);

export function OrderDetailsModal({ order, onEdit, onClose }: OrderDetailsModalProps) {
  const rows: [string, string, string?][] = [
    ['שם הלקוח', order.customer],
    ['מספר הזמנה', String(order.id)],
    ['מועד איסוף', `${formatDotted(order.pickupDate, true)} · ${order.pickupTime}`, 'ltr'],
    ['מועד החזרה', `${formatDotted(order.returnDate, true)} · ${order.returnTime}`, 'ltr'],
    ['רכב', order.vehicleModel],
    ['קטגוריה', order.category],
    ['מספר רכב פנימי', order.internalNumber],
    ['משך השכרה', dayLabel(rentalDays(order))],
    ['אופן קבלה', PICKUP_LABEL[order.pickupMethod]],
    ['אופן החזרה', RETURN_LABEL[order.returnMethod]],
    ['סטטוס תשלום', PAYMENT_LABEL[order.paymentStatus], order.paymentStatus === 'paid' ? 'paid' : 'pending'],
    ['סכום כולל', `₪${order.total.toLocaleString('he-IL')}`, 'ltr'],
  ];

  return (
    <Modal
      title={`פרטי הזמנה #${order.id}`}
      size="md"
      onClose={onClose}
      headerExtra={<span className={`status-badge status-badge--${order.status}`}>{ORDER_STATUS_LABEL[order.status]}</span>}
      footer={
        <div className="modal__actions">
          <Button variant="secondary" onClick={onEdit}>
            עריכה
          </Button>
          <Button onClick={onClose}>סגירה</Button>
        </div>
      }
    >
      <dl className="details">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="details__item">
            <dt>{label}</dt>
            <dd className={tone && tone !== 'ltr' ? `details__value--${tone}` : undefined}>
              {tone === 'ltr' ? <bdi dir="ltr">{value}</bdi> : value}
            </dd>
          </div>
        ))}
      </dl>
      <dl className="details__notes">
        <dt>הערות להזמנה</dt>
        <dd>{order.notes || '—'}</dd>
      </dl>
    </Modal>
  );
}
