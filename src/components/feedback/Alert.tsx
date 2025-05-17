import React from 'react';
import { cn } from '../../lib/utils';

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  icon,
  className,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'rounded-md p-4',
        variant === 'info' && 'bg-blue-50',
        variant === 'success' && 'bg-green-50',
        variant === 'warning' && 'bg-yellow-50',
        variant === 'danger' && 'bg-red-50',
        className
      )}
    >
      <div className="flex">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className={cn('flex-1', icon && 'ml-3')}>
          {title && (
            <h3
              className={cn(
                'text-sm font-medium',
                variant === 'info' && 'text-blue-800',
                variant === 'success' && 'text-green-800',
                variant === 'warning' && 'text-yellow-800',
                variant === 'danger' && 'text-red-800'
              )}
            >
              {title}
            </h3>
          )}
          <div
            className={cn(
              'text-sm',
              variant === 'info' && 'text-blue-700',
              variant === 'success' && 'text-green-700',
              variant === 'warning' && 'text-yellow-700',
              variant === 'danger' && 'text-red-700',
              title && 'mt-2'
            )}
          >
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  variant === 'info' && 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600',
                  variant === 'success' && 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600',
                  variant === 'warning' && 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                  variant === 'danger' && 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600'
                )}
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';

export { Alert };
export default Alert;
