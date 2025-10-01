import React, { TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  textareaClassName?: string;
}

/**
 * Form Textarea Component
 * Multi-line text input for forms with label, error states, and helper text
 */
const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  textareaClassName = '',
  required,
  id,
  rows = 4,
  ...textareaProps
}) => {
  const textareaId = id || `textarea-${textareaProps.name}`;

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={textareaId} className="mb-1">
          <Typography type="span" size="body14" weight="semibold" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        className={classNames(
          'px-2 py-1.5 border rounded-[4px] transition-colors',
          'text-[16px] leading-[24px]',
          'resize-vertical',
          error
            ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
            : 'border-[#CCCCCC] focus:border-[#000017] focus:ring-1 focus:ring-[#000017]',
          'outline-none',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          textareaClassName
        )}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...textareaProps}
      />

      {error && (
        <div id={`${textareaId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${textareaId}-helper`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormTextarea;

