import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  help?: string;
  required?: boolean;
  containerClassName?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  help,
  required = false,
  containerClassName = '',
  className = '',
  id,
  onChange,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const selectClasses = [
    'form-select',
    className,
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className={required ? 'form-label-required' : 'form-label'}>
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        className={selectClasses}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <p className="form-error">{error}</p>}
      {help && <p className="form-help">{help}</p>}
    </div>
  );
};
