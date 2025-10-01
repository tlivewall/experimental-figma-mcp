import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

export interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  options: RadioOption[];
  error?: string;
  helperText?: string;
  radioClassName?: string;
  name: string;
}

/**
 * Form Radio Component
 * Radio button group for forms with label, error states, and helper text
 */
const FormRadio: React.FC<FormRadioProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  radioClassName = '',
  required,
  name,
  ...inputProps
}) => {
  const radioGroupId = `radio-group-${name}`;

  return (
    <div className={classNames('flex flex-col', className)}>
      {label && (
        <div className="mb-1">
          <Typography type="span" size="body14" weight="semibold" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </div>
      )}

      <div
        role="radiogroup"
        aria-labelledby={label ? radioGroupId : undefined}
        aria-describedby={error ? `${radioGroupId}-error` : helperText ? `${radioGroupId}-helper` : undefined}
        className="flex flex-col gap-1"
      >
        {options.map((option, index) => {
          const radioId = `${name}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                className={classNames(
                  'w-2 h-2 border transition-colors',
                  'cursor-pointer',
                  error
                    ? 'border-red-600 text-red-600 focus:ring-red-600'
                    : 'border-[#CCCCCC] text-[#000017] focus:ring-[#000017]',
                  'focus:ring-1',
                  'disabled:bg-gray-100 disabled:cursor-not-allowed',
                  radioClassName
                )}
                required={required && index === 0}
                aria-invalid={error ? 'true' : 'false'}
                {...inputProps}
              />
              <label htmlFor={radioId} className="ml-1 cursor-pointer">
                <Typography type="span" size="body14" color="black">
                  {option.label}
                </Typography>
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <div id={`${radioGroupId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${radioGroupId}-helper`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormRadio;

