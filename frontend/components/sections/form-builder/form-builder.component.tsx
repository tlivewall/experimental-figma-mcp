'use client';

import React, { useState, FormEvent } from 'react';
import { FormBuilderFields, FormStep, FormFieldGroup, FormField } from 'types/figma';
import Container from '@components/ui/container/container.component';
import Typography from '@components/ui/typography/typography.component';
import Button from '@components/ui/button/button.component';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormFile,
  FormErrorMessage,
} from '@components/ui';
import classNames from 'classnames';

type Props = FormBuilderFields;

/**
 * Form Builder Component
 * Flexible multi-step form builder with field groups and various input types
 */
const FormBuilder: React.FC<Props> = ({
  title,
  description,
  steps,
  submitButtonText = 'Submit',
  submitButtonHref,
  showProgressBar = true,
  successMessage = 'Form submitted successfully!',
}) => {
  console.log('steps', steps);
  // Early return for validation
  if (!steps || steps.length === 0) {
    return null;
  }

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateStep = (step: FormStep): boolean => {
    const stepErrors: Record<string, string> = {};
    
    step.fieldGroups.forEach((item) => {
      // Check if it's a FormFieldGroup or a direct FormField
      if ('fields' in item && Array.isArray(item.fields)) {
        // It's a FormFieldGroup
        const group = item as FormFieldGroup;
        group.fields.forEach((field: FormField) => {
          if (field.required && !formData[field.name]) {
            stepErrors[field.name] = `${field.label || field.name} is required`;
          }
        });
      } else {
        // It's a direct FormField
        const field = item as FormField;
        if (field.required && !formData[field.name]) {
          stepErrors[field.name] = `${field.label || field.name} is required`;
        }
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      // TODO: Implement actual form submission logic
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirect if URL is provided
      if (submitButtonHref) {
        setTimeout(() => {
          window.location.href = submitButtonHref;
        }, 2000);
      }
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'url':
      case 'password':
        return (
          <FormInput
            key={field.id}
            type={field.type}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            value={(fieldValue as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            maxLength={'maxLength' in field ? field.maxLength : undefined}
            minLength={'minLength' in field ? field.minLength : undefined}
            pattern={'pattern' in field ? field.pattern : undefined}
          />
        );

      case 'textarea':
        return (
          <FormTextarea
            key={field.id}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            value={(fieldValue as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={'rows' in field ? field.rows : 4}
            maxLength={'maxLength' in field ? field.maxLength : undefined}
            minLength={'minLength' in field ? field.minLength : undefined}
          />
        );

      case 'select':
        return (
          <FormSelect
            key={field.id}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            value={(fieldValue as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            options={'options' in field ? field.options : []}
          />
        );

      case 'checkbox':
        return (
          <FormCheckbox
            key={field.id}
            name={field.name}
            label={field.label || ''}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            checked={(fieldValue as boolean) || false}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
          />
        );

      case 'radio':
        return (
          <FormRadio
            key={field.id}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            options={'options' in field ? field.options : []}
            value={(fieldValue as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        );

      case 'file':
        return (
          <FormFile
            key={field.id}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            required={field.required}
            disabled={field.disabled}
            error={fieldError}
            onChange={(e) => handleFieldChange(field.name, e.target.files)}
            accept={'accept' in field ? field.accept : undefined}
            multiple={'multiple' in field ? field.multiple : false}
          />
        );

      default:
        return null;
    }
  };

  const renderFieldGroup = (group: FormFieldGroup) => {
    const columns = group.columns || 1;
    const gridColsClass = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
    }[columns] || 'grid-cols-1';

    return (
      <div key={group.id} className={classNames('grid gap-3', gridColsClass)}>
        {group.fields.map((field) => renderField(field))}
      </div>
    );
  };

  const renderFieldGroupOrField = (item: FormFieldGroup | FormField) => {
    // Check if it's a FormFieldGroup (has 'fields' property and 'columns')
    if ('fields' in item && Array.isArray(item.fields)) {
      return renderFieldGroup(item as FormFieldGroup);
    }
    
    // It's a direct FormField - render it with single column layout
    return (
      <div key={item.id} className="grid grid-cols-1 gap-3">
        {renderField(item as FormField)}
      </div>
    );
  };

  // Success state
  if (isSubmitted) {
    return (
      <Container>
        <div className="max-w-[600px] mx-auto my-7 text-center">
          <div className="mb-3 p-4 bg-green-50 border-l-4 border-green-600 rounded-[4px]">
            <Typography type="h2" size="body16" weight="bold" color="black" className="text-green-600 mb-1">
              Success!
            </Typography>
            <Typography type="p" size="body14" color="gray" className="text-green-800">
              {successMessage}
            </Typography>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-[800px] mx-auto my-7">
        {/* Form Header */}
        {(title || description) && (
          <div className="mb-4 text-center">
            {title && (
              <Typography type="h1" size="heading40" weight="bold" color="black" className="mb-2">
                {title}
              </Typography>
            )}
            {description && (
              <Typography type="p" size="body16" color="gray">
                {description}
              </Typography>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {showProgressBar && steps.length > 1 && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <Typography type="span" size="body14" weight="semibold" color="black">
                Step {currentStepIndex + 1} of {steps.length}
              </Typography>
              <Typography type="span" size="body14" color="gray">
                {Math.round(progress)}%
              </Typography>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#000017] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-[8px] border border-[#CCCCCC]">
          {/* Step Header */}
          {currentStep.title && (
            <div className="mb-3 pb-3 border-b border-[#CCCCCC]">
              {currentStep.showStepNumber && (
                <Typography type="span" size="body14" weight="semibold" color="gray" className="mb-1 block">
                  Step {currentStepIndex + 1}
                </Typography>
              )}
              <Typography type="h2" size="body16" weight="bold" color="black" className={currentStep.description ? 'mb-1' : ''}>
                {currentStep.title}
              </Typography>
              {currentStep.description && (
                <Typography type="p" size="body14" color="gray">
                  {currentStep.description}
                </Typography>
              )}
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <FormErrorMessage message={submitError} className="mb-3" />
          )}

          {/* Field Groups or Individual Fields */}
          <div className="space-y-4">
            {currentStep.fieldGroups.map((item) => renderFieldGroupOrField(item))}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 pt-4 border-t border-[#CCCCCC] flex justify-between gap-2">
            <div>
              {!isFirstStep && (
                <Button type="secondary" buttonElementType="button" onClick={handlePrevious}>
                  <Typography type="span" size="body16" weight="semibold" color="black">
                    Previous
                  </Typography>
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {isLastStep ? (
                <Button type="primary" buttonElementType="submit">
                  <Typography type="span" size="body16" weight="semibold" color="black">
                    {submitButtonText}
                  </Typography>
                </Button>
              ) : (
                <Button type="primary" buttonElementType="button" onClick={handleNext}>
                  <Typography type="span" size="body16" weight="semibold" color="black">
                    Next
                  </Typography>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormBuilder;

