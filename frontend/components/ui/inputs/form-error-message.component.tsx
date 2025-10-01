import React from 'react';
import classNames from 'classnames';
import Typography from '../typography/typography.component';

interface FormErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

/**
 * Form Error Message Component
 * Displays form-level error messages with consistent styling
 */
const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  title = 'Error',
  message,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={classNames(
        'p-2 border-l-4 border-red-600 bg-red-50 rounded-[4px]',
        className
      )}
    >
      <Typography type="p" size="body16" weight="semibold" color="black" className="text-red-600 mb-0.5">
        {title}
      </Typography>
      <Typography type="p" size="body14" color="gray" className="text-red-800">
        {message}
      </Typography>
    </div>
  );
};

export default FormErrorMessage;

