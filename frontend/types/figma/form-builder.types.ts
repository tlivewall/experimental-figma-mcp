// Form Field Types
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'url'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldBase {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FormFieldText extends FormFieldBase {
  type: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface FormFieldTextarea extends FormFieldBase {
  type: 'textarea';
  rows?: number;
  maxLength?: number;
  minLength?: number;
}

export interface FormFieldSelect extends FormFieldBase {
  type: 'select';
  options: FormFieldOption[];
  multiple?: boolean;
}

export interface FormFieldCheckbox extends FormFieldBase {
  type: 'checkbox';
}

export interface FormFieldRadio extends FormFieldBase {
  type: 'radio';
  options: FormFieldOption[];
}

export interface FormFieldFile extends FormFieldBase {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

export type FormField = 
  | FormFieldText 
  | FormFieldTextarea 
  | FormFieldSelect 
  | FormFieldCheckbox 
  | FormFieldRadio 
  | FormFieldFile;

// Form Field Group (for layout)
export interface FormFieldGroup {
  id: string;
  fields: FormField[];
  columns?: 1 | 2 | 3; // Number of columns in the group
  gap?: number; // Gap between fields in px
}

// Form Step (for multi-step forms)
export interface FormStep {
  id: string;
  title?: string;
  description?: string;
  fieldGroups: (FormFieldGroup | FormField)[]; // Can contain either groups or individual fields
  showStepNumber?: boolean;
}

// Form Builder Fields
export interface FormBuilderFields {
  title?: string;
  description?: string;
  steps: FormStep[];
  submitButtonText?: string;
  submitButtonHref?: string; // Legacy: redirect after submit (deprecated)
  submitApiUrl?: string; // API endpoint to POST form data to
  submitMethod?: 'POST' | 'PUT'; // HTTP method for API submission
  allowSaveDraft?: boolean;
  successMessage?: string;
  successRedirectUrl?: string; // Redirect URL after successful submission
  errorMessage?: string; // Custom error message when API call fails
}
