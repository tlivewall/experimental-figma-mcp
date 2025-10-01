import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  inputClassName?: string;
}

/**
 * Form Input Component
 * Flexible input field for forms with label, error states, and helper text
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  inputClassName = '',
  required,
  id,
  ...inputProps
}) => {
  const inputId = id || `input-${inputProps.name}`;

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1">
          <Typography type="span" size="body14" weight="semibold" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </label>
      )}
      
      <input
        id={inputId}
        className={classNames(
          'px-2 py-1.5 border rounded-[4px] transition-colors',
          'text-[16px] leading-[24px]',
          error
            ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
            : 'border-[#CCCCCC] focus:border-[#000017] focus:ring-1 focus:ring-[#000017]',
          'outline-none',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          inputClassName
        )}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...inputProps}
      />

      {error && (
        <div id={`${inputId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${inputId}-helper`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormInput;

