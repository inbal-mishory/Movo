import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { formatClock } from '../../lib/dates';
import { useAppStore } from '../../store/AppStore';
import type { Alert } from '../../types';
import { AlertFormModal } from './AlertFormModal';
import { AlertRow } from './AlertRow';
import { AssignModal } from './AssignModal';

type Filter = 'all' | 'critical' | 'operational';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'critical', label: 'התרעות קריטיות' },
  { key: 'operational', label: 'התרעות תפעוליות' },
];

type ModalState =
  | { kind: 'add' }
  | { kind: 'edit'; alert: Alert }
  | { kind: 'assign'; alert: Alert }
  | { kind: 'delete'; alert: Alert }
  | null;

export function AlertsPanel() {
  const { state, dispatch } = useAppStore();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return state.alerts.filter(
      (a) => (filter === 'all' || a.severity === filter) && (!q || a.title.includes(q) || a.description.includes(q)),
    );
  }, [state.alerts, filter, query]);

  const criticalCount = state.alerts.filter((a) => a.severity === 'critical').length;
  const operationalCount = state.alerts.length - criticalCount;
  const title =
    filter === 'critical'
      ? `התרעות קריטיות (${criticalCount})`
      : filter === 'operational'
        ? `התרעות תפעוליות (${operationalCount})`
        : `התרעות פעילות (${state.alerts.length})`;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollState({
      atStart: el.scrollTop <= 1,
      atEnd: el.scrollTop + el.clientHeight >= el.scrollHeight - 1,
    });
  }, []);

  useEffect(updateScrollState, [filtered, expandedId, updateScrollState]);

  const scrollPage = (direction: 1 | -1) =>
    scrollRef.current?.scrollBy({ top: direction * scrollRef.current.clientHeight * 0.9, behavior: 'smooth' });

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setExpandedId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const close = () => setModal(null);

  return (
    <section className="card alerts" aria-labelledby="alerts-title">
      <div className="alerts__head">
        <h2 id="alerts-title" className="card__title">
          {title}
        </h2>
        <Button size="sm" onClick={() => setModal({ kind: 'add' })}>
          הוספת התרעה <Plus size="1em" aria-hidden />
        </Button>
      </div>

      <div className="alerts__toolbar">
        <div className="pills" role="group" aria-label="סינון התרעות">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`pill pill--${key}${filter === key ? ' pill--active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => changeFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="alerts__tools">
          <button type="button" className="icon-btn" aria-label="גלילה למעלה" disabled={scrollState.atStart} onClick={() => scrollPage(-1)}>
            <ChevronRight />
          </button>
          <button type="button" className="icon-btn" aria-label="גלילה למטה" disabled={scrollState.atEnd} onClick={() => scrollPage(1)}>
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="חיפוש"
            aria-pressed={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              if (searchOpen) setQuery('');
            }}
          >
            <Search />
          </button>
          {searchOpen && (
            <input
              className="input input--search"
              type="search"
              autoFocus
              value={query}
              placeholder="חיפוש התרעה"
              aria-label="חיפוש התרעה"
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="alerts__scroll scroll-area" ref={scrollRef} onScroll={updateScrollState}>
        {filtered.length === 0 ? (
          <p className="empty">אין התרעות להצגה</p>
        ) : (
          <ul className="alerts__list">
            {filtered.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                expanded={expandedId === alert.id}
                onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                onEdit={() => setModal({ kind: 'edit', alert })}
                onAssign={() => setModal({ kind: 'assign', alert })}
                onDelete={() => setModal({ kind: 'delete', alert })}
              />
            ))}
          </ul>
        )}
      </div>

      {modal?.kind === 'add' && (
        <AlertFormModal
          onClose={close}
          onSubmit={(values) => {
            dispatch({
              type: 'alert/add',
              alert: { ...values, id: `a-${Date.now()}`, timeLabel: formatClock(new Date()) },
            });
            setFilter('all');
            close();
            toast('התרעה נוספה בהצלחה');
            scrollRef.current?.scrollTo({ top: 0 });
          }}
        />
      )}
      {modal?.kind === 'edit' && (
        <AlertFormModal
          alert={modal.alert}
          onClose={close}
          onSubmit={(values) => {
            dispatch({ type: 'alert/update', alert: { ...modal.alert, ...values } });
            close();
            toast('התרעה עודכנה בהצלחה');
          }}
        />
      )}
      {modal?.kind === 'assign' && (
        <AssignModal
          alert={modal.alert}
          onClose={close}
          onSubmit={(assignment) => {
            dispatch({ type: 'alert/assign', id: modal.alert.id, assignment });
            close();
            toast('התרעה הועברה לטיפול בהצלחה');
          }}
        />
      )}
      {modal?.kind === 'delete' && (
        <ConfirmDialog
          title="מחיקת התרעה"
          confirmLabel="מחיקה"
          onCancel={close}
          onConfirm={() => {
            dispatch({ type: 'alert/delete', id: modal.alert.id });
            if (expandedId === modal.alert.id) setExpandedId(null);
            close();
            toast('התרעה נמחקה בהצלחה');
          }}
        >
          <span>האם למחוק את ההתרעה</span>
          <strong>{modal.alert.title}?</strong>
          <span>לא ניתן לבטל פעולה זו.</span>
        </ConfirmDialog>
      )}
    </section>
  );
}
