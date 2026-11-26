import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  // Optional strip rendered between the title and the body (e.g. the alert summary banner).
  banner?: ReactNode;
  headerExtra?: ReactNode;
  size?: 'sm' | 'md';
  plain?: boolean;
}

export function Modal({ title, onClose, children, footer, banner, headerExtra, size = 'md', plain = false }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>('input:not([type="checkbox"]), textarea');
    (first ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
      if (event.key === 'Tab' && dialog) {
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'),
        );
        if (focusable.length === 0) return;
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          {headerExtra && <div className="modal__header-extra">{headerExtra}</div>}
          <button type="button" className="modal__close" onClick={onClose} aria-label="סגירה" data-close>
            <X strokeWidth={1.6} />
          </button>
        </div>
        {banner}
        <div className={plain ? 'modal__body modal__body--plain' : 'modal__body'}>{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
