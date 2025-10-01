import { StoryblokComponent } from './base.types';

// Field Option (for select, radio)
export interface StoryblokFormFieldOption extends StoryblokComponent {
  component: 'form_field_option';
  label: string;
  value: string;
}

// Individual Field Components
export interface StoryblokFormFieldText extends StoryblokComponent {
  component: 'form_field_text';
  field_type: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password';
  name: string;
  label?: string;
  placeholder?: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
  max_length?: number;
  min_length?: number;
  pattern?: string;
}

export interface StoryblokFormFieldTextarea extends StoryblokComponent {
  component: 'form_field_textarea';
  name: string;
  label?: string;
  placeholder?: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  max_length?: number;
  min_length?: number;
}

export interface StoryblokFormFieldSelect extends StoryblokComponent {
  component: 'form_field_select';
  name: string;
  label?: string;
  placeholder?: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
  options?: StoryblokFormFieldOption[];
  multiple?: boolean;
}

export interface StoryblokFormFieldCheckbox extends StoryblokComponent {
  component: 'form_field_checkbox';
  name: string;
  label: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface StoryblokFormFieldRadio extends StoryblokComponent {
  component: 'form_field_radio';
  name: string;
  label?: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
  options?: StoryblokFormFieldOption[];
}

export interface StoryblokFormFieldFile extends StoryblokComponent {
  component: 'form_field_file';
  name: string;
  label?: string;
  helper_text?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  max_size?: number;
}

export type StoryblokFormField = 
  | StoryblokFormFieldText 
  | StoryblokFormFieldTextarea 
  | StoryblokFormFieldSelect 
  | StoryblokFormFieldCheckbox 
  | StoryblokFormFieldRadio 
  | StoryblokFormFieldFile;

// Field Group (for layout)
export interface StoryblokFormFieldGroup extends StoryblokComponent {
  component: 'form_field_group';
  fields?: StoryblokFormField[];
  columns?: '1' | '2' | '3';
  gap?: number;
}

// Form Step
export interface StoryblokFormStep extends StoryblokComponent {
  component: 'form_step';
  title?: string;
  description?: string;
  field_groups?: StoryblokFormFieldGroup[];
  show_step_number?: boolean;
}

// Main Form Builder Component
export interface StoryblokFormBuilder extends StoryblokComponent {
  component: 'form_builder';
  title?: string;
  description?: string;
  steps?: StoryblokFormStep[];
  submit_button_text?: string;
  submit_button_href?: string; // Legacy: deprecated
  submit_api_url?: string; // API endpoint URL
  submit_method?: 'POST' | 'PUT'; // HTTP method
  allow_save_draft?: boolean;
  success_message?: string;
  success_redirect_url?: string;
  error_message?: string; // Custom error message
  
  // Spacing fields (same pattern as card slider)
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  paddingMobile?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
}
