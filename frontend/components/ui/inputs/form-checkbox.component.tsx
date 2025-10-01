import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
  checkboxClassName?: string;
}

/**
 * Form Checkbox Component
 * Checkbox input for forms with label, error states, and helper text
 */
const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  error,
  helperText,
  className = '',
  checkboxClassName = '',
  required,
  id,
  ...inputProps
}) => {
  const checkboxId = id || `checkbox-${inputProps.name}`;

  return (
    <div className={classNames('flex flex-col', className)}>
      <div className="flex items-start">
        <input
          type="checkbox"
          id={checkboxId}
          className={classNames(
            'mt-0.5 w-2 h-2 border rounded-[2px] transition-colors',
            'cursor-pointer',
            error
              ? 'border-red-600 text-red-600 focus:ring-red-600'
              : 'border-[#CCCCCC] text-[#000017] focus:ring-[#000017]',
            'focus:ring-1',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            checkboxClassName
          )}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined}
          {...inputProps}
        />
        <label htmlFor={checkboxId} className="ml-1 cursor-pointer">
          <Typography type="span" size="body14" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </label>
      </div>

      {error && (
        <div id={`${checkboxId}-error`} className="mt-0.5 ml-3">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${checkboxId}-helper`} className="mt-0.5 ml-3">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormCheckbox;

