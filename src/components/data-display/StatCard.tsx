import React from 'react';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendDirection?: 'good' | 'bad' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 rounded-md bg-primary-100 p-3 text-primary-600">
              {icon}
            </div>
          )}
          <div className={cn('ml-5', !icon && 'ml-0')}>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      {trend !== undefined && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span
              className={cn(
                'font-medium',
                trendDirection === 'good' ? 'text-green-600' : 
                trendDirection === 'bad' ? 'text-red-600' : 
                'text-gray-600'
              )}
            >
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
            </span>{' '}
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
      )}
    </div>
  );
};

StatCard.displayName = 'StatCard';

export { StatCard };
export default StatCard;
