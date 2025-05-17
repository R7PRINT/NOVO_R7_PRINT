import React from 'react';

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className="h-8 w-8 bg-secondary-500 rounded-md flex items-center justify-center text-white font-bold">
          R7
        </div>
        <span className="ml-2 text-xl font-bold text-white">Print Suite</span>
      </div>
    </div>
  );
};

Logo.displayName = 'Logo';

export { Logo };
export default Logo;
