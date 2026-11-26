import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'dark' | 'secondary' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'xs' | 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn--${variant} btn--${size} ${className}`.trim()} {...rest} />;
}
