import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = '',
  onClose,
}) => {
  const alertClasses = [
    'alert',
    `alert-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-sm font-medium hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
