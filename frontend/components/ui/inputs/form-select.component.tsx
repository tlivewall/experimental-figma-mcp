import React, { SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  selectClassName?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Form Select Component
 * Dropdown select input for forms with label, error states, and helper text
 */
const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  selectClassName = '',
  required,
  id,
  options,
  placeholder,
  ...selectProps
}) => {
  const selectId = id || `select-${selectProps.name}`;

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={selectId} className="mb-1">
          <Typography type="span" size="body14" weight="semibold" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </label>
      )}
      
      <select
        id={selectId}
        className={classNames(
          'px-2 py-1.5 border rounded-[4px] transition-colors',
          'text-[16px] leading-[24px]',
          'bg-white',
          error
            ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
            : 'border-[#CCCCCC] focus:border-[#000017] focus:ring-1 focus:ring-[#000017]',
          'outline-none',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          selectClassName
        )}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div id={`${selectId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${selectId}-helper`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormSelect;

