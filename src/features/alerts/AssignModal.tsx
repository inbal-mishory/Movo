import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EMPLOYEES } from '../../data/seed';
import { DEPARTMENT_LABEL, DEPARTMENTS, SEVERITY_LABEL } from '../../lib/labels';
import type { Alert, AlertAssignment, Department } from '../../types';

interface AssignModalProps {
  alert: Alert;
  onSubmit: (assignment: AlertAssignment) => void;
  onClose: () => void;
}

const contactsFor = (department: Department) => EMPLOYEES.filter((e) => e.department === department);

export function AssignModal({ alert, onSubmit, onClose }: AssignModalProps) {
  const initialDepartment: Department = alert.assignment?.department ?? (alert.audience === 'all' ? 'cleaning' : alert.audience);
  const [department, setDepartment] = useState<Department>(initialDepartment);
  const [contact, setContact] = useState(alert.assignment?.contact ?? contactsFor(initialDepartment)[0].name);
  const [targetMinutes, setTargetMinutes] = useState(String(alert.assignment?.targetMinutes ?? 30));
  const [notes, setNotes] = useState(alert.assignment?.notes ?? '');
  const [notifyCustomer, setNotifyCustomer] = useState(alert.assignment?.notifyCustomer ?? false);

  const minutes = Number(targetMinutes);
  const valid = Number.isFinite(minutes) && minutes > 0;

  const changeDepartment = (next: Department) => {
    setDepartment(next);
    setContact(contactsFor(next)[0].name);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmit({ department, contact, targetMinutes: minutes, notes: notes.trim(), notifyCustomer });
  };

  return (
    <Modal
      title="העברה לטיפול"
      onClose={onClose}
      size="md"
      banner={
        <div className={`assign-banner assign-banner--${alert.severity}`}>
          <strong>{alert.title}</strong>
          <span aria-hidden>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span className="assign-banner__severity">{SEVERITY_LABEL[alert.severity]}</span>
        </div>
      }
      footer={
        <>
          <span className="modal__note">* שדות חובה</span>
          <div className="modal__actions">
            <Button variant="secondary" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" form="assign-form" variant="dark" disabled={!valid}>
              בצע העברה
            </Button>
          </div>
        </>
      }
    >
      <form id="assign-form" className="form-rows" onSubmit={submit} noValidate>
        <div className="field field--row">
          <label className="field__label" htmlFor="assign-department">
            העברה למחלקה<span className="field__required"> *</span>
          </label>
          <select
            id="assign-department"
            className="input input--select"
            value={department}
            onChange={(e) => changeDepartment(e.target.value as Department)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {DEPARTMENT_LABEL[d]}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--row">
          <label className="field__label" htmlFor="assign-contact">
            איש קשר
          </label>
          <select id="assign-contact" className="input input--select" value={contact} onChange={(e) => setContact(e.target.value)}>
            {contactsFor(department).map((e) => (
              <option key={e.id} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--row">
          <label className="field__label" htmlFor="assign-minutes">
            זמן יעד
          </label>
          <input
            id="assign-minutes"
            className="input input--number"
            type="number"
            min={1}
            aria-label="זמן יעד בדקות"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(e.target.value)}
          />
        </div>
        <div className="field field--row field--top">
          <label className="field__label" htmlFor="assign-notes">
            הערות
          </label>
          <textarea
            id="assign-notes"
            className="input input--textarea"
            value={notes}
            placeholder="פרטו את הפעולות הנדרשות, מידע רלוונטי או דגשים לצוות המטפל..."
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="field field--row">
          <label className="field__label" htmlFor="assign-notify">
            עדכון הלקוח
          </label>
          <input
            id="assign-notify"
            type="checkbox"
            className="checkbox"
            checked={notifyCustomer}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
          />
        </div>
      </form>
    </Modal>
  );
}
