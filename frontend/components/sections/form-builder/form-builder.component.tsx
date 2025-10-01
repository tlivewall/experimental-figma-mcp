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

type Props = FormBuilderFields & {
  onSubmit?: (formData: Record<string, unknown>) => void | Promise<void>;
};

/**
 * Form Builder Component
 * Flexible multi-step form builder with field groups and various input types
 */
const FormBuilder: React.FC<Props> = ({
  title,
  // description, // Not used in current implementation
  steps,
  submitButtonText = 'Submit',
  submitButtonHref,
  showProgressBar = true,
  successMessage = 'Form submitted successfully!',
  onSubmit,
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
  // const progress = ((currentStepIndex + 1) / steps.length) * 100; // Not used in current implementation

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
      // Call custom onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // If no submit URL is provided, log form data to console
      if (!submitButtonHref) {
        console.log('==============================================');
        console.log('📋 FORM SUBMISSION - Form Data');
        console.log('==============================================');
        console.log('Form Data:', formData);
        console.log('==============================================');
      }
      
      // Simulate API call if no custom handler
      if (!onSubmit) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
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
      <div key={group.id} className={classNames('grid gap-4', gridColsClass)}>
        {group.fields.map((field) => renderField(field))}
      </div>
    );
  };

  const renderFieldGroupOrField = (item: FormFieldGroup | FormField) => {
    // Check if it's a FormFieldGroup (has 'fields' property and 'columns')
    if ('fields' in item && Array.isArray(item.fields)) {
      return renderFieldGroup(item as FormFieldGroup);
    }
    
    // It's a direct FormField - render without wrapper
    return renderField(item as FormField);
  };

  // Success state
  if (isSubmitted) {
    return (
      <Container>
        <div className="max-w-[680px] mx-auto  px-2">
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm p-6 md:p-8 text-center">
            {/* Success Icon */}
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Success Message */}
            <Typography type="h2" size="body16" weight="bold" color="black" className="text-[24px] leading-[32px] mb-2">
              Form Submitted Successfully!
            </Typography>
            <Typography type="p" size="body16" color="gray" className="max-w-[480px] mx-auto">
              {successMessage}
            </Typography>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-[680px] mx-auto">
        {/* Progress Bar */}
        {showProgressBar && steps.length > 1 && (
          <div className="mb-2">
            <div className="flex justify-start items-center mb-2">
              <Typography type="span" size="body16" weight="semibold" color="black">
                Stap {currentStepIndex + 1} of {steps.length}
              </Typography>
              <Typography type="span" size="body16"  color="black" className="ml-0.5">
              - {currentStep.title}
              </Typography>
              {/* <Typography type="span" size="body16" weight="semibold" color="gray">
                {Math.round(progress)}%
              </Typography> */}
            </div>
            {/* <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#000017] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div> */}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white">
          {/* Step Header */}
          {(currentStep.title || currentStep.description) && (
            <div>
              {/* {currentStep.showStepNumber && steps.length > 1 && (
                <div className="mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#000017] text-white text-[12px] font-semibold">
                    {currentStepIndex + 1}
                  </span>
                </div>
              )} */}
              {currentStep.title && (
                <Typography 
                  type="h2" 
                  size="body32" 
                  weight="bold" 
                  color="black" 
                  family="heading"
                  className={classNames("uppercase", currentStep.description ? 'mb-1.5' : '')}
                >
                  {title}
                </Typography>
              )}
              {currentStep.description && (
                <Typography type="p" size="body16" color="black" className="leading-[22px]">
                  {currentStep.description}
                </Typography>
              )}
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="px-4 md:px-6 py-2">
              <FormErrorMessage message={submitError} />
            </div>
          )}

          {/* Field Groups or Individual Fields */}
          <div className="space-y-2 py-2">
            {currentStep.fieldGroups.map((item) => renderFieldGroupOrField(item))}
          </div>

          {/* Navigation Buttons */}
          <div className="px-4 md:px-6 pb-6 pt-2 border-t border-[#F3F4F6] flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <div className="flex-1 sm:flex-initial">
              {!isFirstStep && (
                <Button 
                  type="secondary" 
                  buttonElementType="button" 
                  onClick={handlePrevious}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  <Typography type="span" size="body16" weight="semibold" color="black">
                    Previous
                  </Typography>
                </Button>
              )}
            </div>
            
            <div className="flex gap-3 flex-1 sm:flex-initial">
              {isLastStep ? (
                <Button 
                  type="primary" 
                  buttonElementType="submit"
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  <Typography type="span" size="body16" weight="semibold" color="black">
                    {submitButtonText}
                  </Typography>
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  buttonElementType="button" 
                  onClick={handleNext}
                  className="w-full sm:w-auto min-w-[120px]"
                >
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

