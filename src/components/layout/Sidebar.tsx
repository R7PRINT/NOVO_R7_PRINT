import React from 'react';
import { cn } from '../../lib/utils';
import { Logo } from './Logo';

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  text,
  active = false,
  onClick,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
        active
          ? 'bg-primary-600 text-white'
          : 'text-white hover:bg-primary-600/50'
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex flex-col h-full w-64 bg-primary-500 text-white',
        className
      )}
    >
      <div className="p-4">
        <Logo />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Sidebar items will be added here */}
      </nav>
    </div>
  );
};

Sidebar.displayName = 'Sidebar';

export { Sidebar };
export default Sidebar;
