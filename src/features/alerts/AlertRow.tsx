import { ChevronLeft, Pencil, Send, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DEPARTMENT_LABEL } from '../../lib/labels';
import type { Alert } from '../../types';
import { ALERT_ICONS } from './alertIcons';

interface AlertRowProps {
  alert: Alert;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onAssign: () => void;
  onDelete: () => void;
}

export function AlertRow({ alert, expanded, onToggle, onEdit, onAssign, onDelete }: AlertRowProps) {
  const Icon = ALERT_ICONS[alert.icon].icon;
  const panelId = `alert-details-${alert.id}`;

  return (
    <li className={`alert alert--${alert.severity}${expanded ? ' alert--expanded' : ''}`}>
      <button type="button" className="alert__summary" aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
        <span className="alert__icon" aria-hidden>
          <Icon strokeWidth={1.5} />
        </span>
        <span className="alert__text">
          <span className="alert__title">{alert.title}</span>
          <span className="alert__description">{alert.description}</span>
        </span>
        <span className="alert__time">{alert.timeLabel}</span>
        <ChevronLeft className="alert__chevron" strokeWidth={2.2} aria-hidden />
      </button>
      {expanded && (
        <div id={panelId} className="alert__details">
          {alert.assignment && (
            <p className="alert__assignment">
              הועברה לטיפול: {DEPARTMENT_LABEL[alert.assignment.department]} · {alert.assignment.contact} · יעד{' '}
              {alert.assignment.targetMinutes} דקות
              {alert.assignment.notes && <span> · {alert.assignment.notes}</span>}
            </p>
          )}
          <div className="alert__actions">
            <Button size="xs" variant="primary" onClick={onAssign}>
              <Send size="1em" aria-hidden /> העברה לטיפול
            </Button>
            <Button size="xs" variant="secondary" onClick={onEdit}>
              <Pencil size="1em" aria-hidden /> עריכה
            </Button>
            <Button size="xs" variant="outline" className="btn--danger-outline" onClick={onDelete}>
              <Trash2 size="1em" aria-hidden /> מחיקה
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
