import React from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: IconName;
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25',
    secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light',
    danger: 'bg-danger/10 text-danger hover:bg-danger hover:text-white',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
  };

  const sizes = {
    sm: 'py-2 px-4 text-xs gap-1.5',
    md: 'py-3 px-5 text-sm gap-2',
    lg: 'py-4 px-6 text-base gap-2.5'
  };

  return (
    <button
      className={`cursor-pointer ${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : icon ? (
        <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} strokeWidth={2.5} />
      ) : null}
      {children}
    </button>
  );
};
