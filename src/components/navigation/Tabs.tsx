import React from 'react';
import { cn } from '../../lib/utils';

export interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ children, className }) => {
  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({
  children,
  active = false,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
        active
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        className
      )}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

Tabs.displayName = 'Tabs';
Tab.displayName = 'Tab';

export { Tabs };
export default Tabs;
