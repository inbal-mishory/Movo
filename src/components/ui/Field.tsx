import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  error?: string;
}

export function Field({ label, required, children, htmlFor, className = '', error }: FieldProps) {
  return (
    <div className={`field ${className}`.trim()}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="field__required"> *</span>}
      </label>
      {children}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
