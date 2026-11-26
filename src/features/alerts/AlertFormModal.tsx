import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { VEHICLES } from '../../data/seed';
import { DEPARTMENT_LABEL, DEPARTMENTS, SEVERITY_LABEL } from '../../lib/labels';
import type { Alert, AlertIconKey, AlertSeverity, Department } from '../../types';
import { ALERT_ICON_KEYS, ALERT_ICONS } from './alertIcons';

interface AlertFormModalProps {
  alert?: Alert;
  onSubmit: (values: Omit<Alert, 'id' | 'timeLabel' | 'assignment'>) => void;
  onClose: () => void;
}

export function AlertFormModal({ alert, onSubmit, onClose }: AlertFormModalProps) {
  const [title, setTitle] = useState(alert?.title ?? '');
  const [description, setDescription] = useState(alert?.description ?? '');
  const [icon, setIcon] = useState<AlertIconKey>(alert?.icon ?? 'wrench');
  const [severity, setSeverity] = useState<AlertSeverity>(alert?.severity ?? 'operational');
  const [vehicle, setVehicle] = useState(alert?.vehicle ?? '');
  const [audience, setAudience] = useState<Department | 'all'>(alert?.audience ?? 'all');

  const valid = title.trim().length > 0 && description.trim().length > 0;
  const IconPreview = ALERT_ICONS[icon].icon;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onSubmit({ title: title.trim(), description: description.trim(), icon, severity, vehicle, audience });
  };

  return (
    <Modal
      title={alert ? 'עריכת התרעה' : 'הוספת התרעה'}
      onClose={onClose}
      size="md"
      footer={
        <>
          <span className="modal__note">* שדות חובה</span>
          <div className="modal__actions">
            <Button variant="secondary" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" form="alert-form" disabled={!valid}>
              אישור
            </Button>
          </div>
        </>
      }
    >
      <form id="alert-form" className="form-grid" onSubmit={submit} noValidate>
        <Field label="כותרת ההתרעה" required htmlFor="alert-title" className="form-grid__full">
          <input
            id="alert-title"
            className="input"
            value={title}
            placeholder="הכנס טקסט"
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </Field>
        <Field label="תוכן ההתרעה" required htmlFor="alert-description" className="form-grid__full">
          <textarea
            id="alert-description"
            className="input input--textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
          />
        </Field>
        <Field label="אייקון ההתרעה" htmlFor="alert-icon">
          <div className="select-with-icon">
            <select id="alert-icon" className="input input--select" value={icon} onChange={(e) => setIcon(e.target.value as AlertIconKey)}>
              {ALERT_ICON_KEYS.map((key) => (
                <option key={key} value={key}>
                  {ALERT_ICONS[key].label}
                </option>
              ))}
            </select>
            <IconPreview />
          </div>
        </Field>
        <Field label="סיווג ההתרעה" required>
          <div className="segmented" role="radiogroup" aria-label="סיווג ההתרעה">
            {(['operational', 'critical'] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={severity === value}
                className={`segmented__option${severity === value ? ' segmented__option--active' : ''}`}
                onClick={() => setSeverity(value)}
              >
                {SEVERITY_LABEL[value]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="רכב משויך" htmlFor="alert-vehicle">
          <select id="alert-vehicle" className="input input--select" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="">בחירת רכב</option>
            {VEHICLES.map((v) => (
              <option key={v} value={v}>
                רכב {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="קהל יעד" required htmlFor="alert-audience">
          <select
            id="alert-audience"
            className="input input--select"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Department | 'all')}
          >
            <option value="all">כל צוות המשמרת</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {DEPARTMENT_LABEL[d]}
              </option>
            ))}
          </select>
        </Field>
      </form>
    </Modal>
  );
}
