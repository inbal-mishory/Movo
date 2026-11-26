import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, children, confirmLabel, cancelLabel = 'ביטול', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      size="sm"
      plain
      onClose={onCancel}
      footer={
        <div className="modal__actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="confirm__text">{children}</div>
    </Modal>
  );
}
