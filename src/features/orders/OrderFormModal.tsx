import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { FLEET_MODELS } from '../../data/seed';
import { DEMO_TODAY } from '../../lib/dates';
import { PAYMENT_LABEL, PICKUP_LABEL, RETURN_LABEL } from '../../lib/labels';
import type { Order, PaymentStatus, PickupMethod } from '../../types';
import { rentalDays } from './OrderDetailsModal';

export type OrderFormValues = Omit<Order, 'id' | 'internalNumber' | 'status'>;

interface OrderFormModalProps {
  order?: Order;
  onSubmit: (values: OrderFormValues) => void;
  onClose: () => void;
}

const dailyRate = (model: string) => FLEET_MODELS.find((m) => m.model === model)?.dailyRate ?? 0;

export function OrderFormModal({ order, onSubmit, onClose }: OrderFormModalProps) {
  const [customer, setCustomer] = useState(order?.customer ?? '');
  const [model, setModel] = useState(order?.vehicleModel ?? FLEET_MODELS[0].model);
  const [pickupDate, setPickupDate] = useState(order?.pickupDate ?? DEMO_TODAY);
  const [pickupTime, setPickupTime] = useState(order?.pickupTime ?? '');
  const [returnDate, setReturnDate] = useState(order?.returnDate ?? DEMO_TODAY);
  const [returnTime, setReturnTime] = useState(order?.returnTime ?? '');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>(order?.pickupMethod ?? 'lot');
  const [returnMethod, setReturnMethod] = useState<PickupMethod>(order?.returnMethod ?? 'lot');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus ?? 'pending');
  const [total, setTotal] = useState(order ? String(order.total) : String(dailyRate(FLEET_MODELS[0].model)));
  const [totalTouched, setTotalTouched] = useState(Boolean(order));
  const [notes, setNotes] = useState(order?.notes ?? '');

  const datesValid = returnDate >= pickupDate;
  const valid = customer.trim().length > 0 && pickupTime !== '' && returnTime !== '' && datesValid && Number(total) >= 0 && total !== '';

  // Suggest a price from the daily rate until the user types their own total.
  const suggest = (nextModel: string, nextPickup: string, nextReturn: string) => {
    if (totalTouched || nextReturn < nextPickup) return;
    setTotal(String(rentalDays({ pickupDate: nextPickup, returnDate: nextReturn }) * dailyRate(nextModel)));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    const fleet = FLEET_MODELS.find((m) => m.model === model)!;
    onSubmit({
      customer: customer.trim(),
      vehicleModel: model,
      category: fleet.category,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupMethod,
      returnMethod,
      paymentStatus,
      total: Number(total),
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      title={order ? `עריכת הזמנה #${order.id}` : 'הוספת הזמנה'}
      onClose={onClose}
      size="md"
      footer={
        <>
          <span className="modal__note">* שדות חובה</span>
          <div className="modal__actions">
            <Button variant="secondary" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" form="order-form" disabled={!valid}>
              אישור
            </Button>
          </div>
        </>
      }
    >
      <form id="order-form" className="form-grid" onSubmit={submit} noValidate>
        <Field label="שם הלקוח" required htmlFor="order-customer">
          <input id="order-customer" className="input" value={customer} placeholder="הכנס טקסט" onChange={(e) => setCustomer(e.target.value)} />
        </Field>
        <Field label="רכב" required htmlFor="order-model">
          <select
            id="order-model"
            className="input input--select"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              suggest(e.target.value, pickupDate, returnDate);
            }}
          >
            {FLEET_MODELS.map((m) => (
              <option key={m.model} value={m.model}>
                {m.model} · {m.category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="מועד איסוף" required htmlFor="order-pickup-date">
          <div className="form-grid__pair">
            <input
              id="order-pickup-date"
              className="input"
              type="date"
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                suggest(model, e.target.value, returnDate);
              }}
            />
            <input className="input" type="time" aria-label="שעת איסוף" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
          </div>
        </Field>
        <Field label="מועד החזרה" required htmlFor="order-return-date" error={datesValid ? undefined : 'מועד ההחזרה חייב להיות אחרי מועד האיסוף'}>
          <div className="form-grid__pair">
            <input
              id="order-return-date"
              className="input"
              type="date"
              value={returnDate}
              min={pickupDate}
              onChange={(e) => {
                setReturnDate(e.target.value);
                suggest(model, pickupDate, e.target.value);
              }}
            />
            <input className="input" type="time" aria-label="שעת החזרה" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
          </div>
        </Field>
        <Field label="אופן קבלה" htmlFor="order-pickup-method">
          <select id="order-pickup-method" className="input input--select" value={pickupMethod} onChange={(e) => setPickupMethod(e.target.value as PickupMethod)}>
            {(Object.keys(PICKUP_LABEL) as PickupMethod[]).map((k) => (
              <option key={k} value={k}>
                {PICKUP_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="אופן החזרה" htmlFor="order-return-method">
          <select id="order-return-method" className="input input--select" value={returnMethod} onChange={(e) => setReturnMethod(e.target.value as PickupMethod)}>
            {(Object.keys(RETURN_LABEL) as PickupMethod[]).map((k) => (
              <option key={k} value={k}>
                {RETURN_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="סטטוס תשלום" htmlFor="order-payment">
          <select id="order-payment" className="input input--select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}>
            {(Object.keys(PAYMENT_LABEL) as PaymentStatus[]).map((k) => (
              <option key={k} value={k}>
                {PAYMENT_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="סכום כולל (₪)" required htmlFor="order-total">
          <input
            id="order-total"
            className="input"
            type="number"
            min={0}
            value={total}
            onChange={(e) => {
              setTotal(e.target.value);
              setTotalTouched(true);
            }}
          />
        </Field>
        <Field label="הערות להזמנה" htmlFor="order-notes" className="form-grid__full">
          <textarea id="order-notes" className="input input--textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
