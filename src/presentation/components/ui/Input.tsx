import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  help?: string | undefined;
  required?: boolean;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  help,
  required = false,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={required ? 'form-label-required' : 'form-label'}>
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      
      {error && <p className="form-error">{error}</p>}
      {help && <p className="form-help">{help}</p>}
    </div>
  );
};
