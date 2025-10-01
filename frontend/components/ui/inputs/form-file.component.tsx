'use client';
import React, { InputHTMLAttributes, useState, useRef, DragEvent } from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';
import AddPhotoIcon from '@assets/icon/add_a_photo.svg';

interface FormFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  fileInputClassName?: string;
}

interface UploadedFile {
  file: File;
  id: string;
}

/**
 * Form File Upload Component - Drag & Drop
 * Modern drag and drop file upload with visual feedback
 */
const FormFile: React.FC<FormFileProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  fileInputClassName = '',
  required,
  id,
  ...inputProps
}) => {
  const fileInputId = id || `file-${inputProps.name}`;
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    if (inputProps.multiple) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } else {
      setUploadedFiles(newFiles.slice(0, 1));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    processFiles(files);

    // Trigger onChange for form handling
    if (inputRef.current && inputProps.onChange) {
      const event = {
        target: { files, value: '' },
        currentTarget: inputRef.current,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      inputProps.onChange(event);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDropZoneClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
      
      {/* Hidden file input */}
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

      {/* Drag & Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleDropZoneClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label={label || 'Upload bestand'}
        className={classNames(
          'relative border-2 border-dashed rounded-[8px] p-4 transition-all cursor-pointer',
          isDragging
            ? 'border-[#000017] bg-gray-50'
            : error
            ? 'border-red-600 hover:border-red-700 hover:bg-red-50'
            : 'border-[#CCCCCC] hover:border-[#000017] hover:bg-gray-50',
          fileInputClassName
        )}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Upload Icon */}
          <div className="">
            <AddPhotoIcon 
              className={classNames(
                'w-3 h-3 transition-colors',
                isDragging ? 'text-[#000017]' : error ? 'text-red-600' : 'text-gray-400'
              )}
            />
          </div>

          {/* Upload Text */}
          <div className="text-center">
            <Typography type="p" size="body16" weight="semibold" color="gray" className="mb-0.5">
              {isDragging ? 'Drop bestanden hier' : 'Upload een bestand'}
            </Typography>
            <Typography type="p" size="body12" color="gray">
              Upload  je bestand (bijv. foto&apos;s, video&apos;s, audio of document).
            </Typography>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {uploadedFiles.map(({ file, id: fileId }) => (
            <div
              key={fileId}
              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-[6px] group hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* File Icon */}
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <Typography type="span" size="body14" weight="semibold" color="black" className="block truncate">
                    {file.name}
                  </Typography>
                  <Typography type="span" size="body14" color="gray" className="text-[12px]">
                    {formatFileSize(file.size)}
                  </Typography>
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(fileId);
                }}
                className="ml-2 p-1 rounded-[4px] hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                aria-label={`Verwijder ${file.name}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div id={`${fileInputId}-error`} className="mt-0.5">
          <Typography type="span" size="body14" color="gray" className="text-red-600">
            {error}
          </Typography>
        </div>
      )}

      {/* Helper Text */}
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

