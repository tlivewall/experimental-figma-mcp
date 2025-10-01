'use client';
import React, { InputHTMLAttributes, useState, useRef } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

interface FormFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  buttonText?: string;
  fileInputClassName?: string;
}

/**
 * Form File Upload Component
 * File upload input for forms with label, error states, and helper text
 */
const FormFile: React.FC<FormFileProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  fileInputClassName = '',
  buttonText = 'Choose File',
  required,
  id,
  ...inputProps
}) => {
  const fileInputId = id || `file-${inputProps.name}`;
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        setFileName(files[0].name);
      } else {
        setFileName(`${files.length} files selected`);
      }
    } else {
      setFileName('');
    }
    
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={classNames('flex flex-col', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={fileInputId} className="mb-1">
          <Typography type="span" size="body14" weight="semibold" color="black">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
          </Typography>
        </label>
      )}
      
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          id={fileInputId}
          className="hidden"
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${fileInputId}-error` : helperText ? `${fileInputId}-helper` : undefined}
          onChange={handleFileChange}
          {...inputProps}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          className={classNames(
            'px-2 py-1.5 border rounded-[4px] transition-colors',
            'text-[16px] leading-[24px]',
            'bg-white hover:bg-gray-50',
            error
              ? 'border-red-600'
              : 'border-[#CCCCCC] hover:border-[#000017]',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            fileInputClassName
          )}
        >
          <Typography type="span" size="body14" weight="semibold" color="black">
            {buttonText}
          </Typography>
        </button>

        {fileName && (
          <Typography type="span" size="body14" color="gray">
            {fileName}
          </Typography>
        )}
      </div>

      {error && (
        <div id={`${fileInputId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {!error && helperText && (
        <div id={`${fileInputId}-helper`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray">
            {helperText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FormFile;

