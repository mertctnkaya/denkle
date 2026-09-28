import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconClassName?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconClassName = 'text-primary dark:text-primary-light'
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 w-full h-full min-h-[300px]">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/80 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
        <Icon name={icon} size={36} className={iconClassName} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} icon="plus">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
