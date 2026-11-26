import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
}

const ToastContext = createContext<((message: string) => void) | null>(null);

const TOAST_DURATION_MS = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), TOAST_DURATION_MS);
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast__icon" aria-hidden>
              <Check />
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
