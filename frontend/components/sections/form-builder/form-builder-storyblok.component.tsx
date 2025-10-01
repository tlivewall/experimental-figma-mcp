import React from 'react';
import {
  StoryblokFormBuilder,
  StoryblokFormStep,
  StoryblokFormFieldGroup,
  StoryblokFormField,
} from 'types/storyblok';
import {
  FormBuilderFields,
  FormStep,
  FormFieldGroup,
  FormField,
  FormFieldOption,
} from 'types/figma';
import FormBuilder from './form-builder.component';

type Props = StoryblokFormBuilder;

/**
 * Storyblok wrapper for FormBuilder
 * Transforms Storyblok CMS data to Figma component props
 */
const FormBuilderStoryblok: React.FC<Props> = (props) => {
  const {
    title,
    description,
    steps,
    submit_button_text,
    submit_button_href,
    show_progress_bar,
    allow_save_draft,
    success_message,
    success_redirect_url,
    padding,
    paddingMobile,
  } = props;

  // Early return for validation
  if (!steps || steps.length === 0) {
    return null;
  }

  /**
   * Transform Storyblok field option to Figma field option
   */
  const transformFieldOption = (option: { label?: string; value?: string }): FormFieldOption => ({
    label: option.label || '',
    value: option.value || '',
  });

  /**
   * Transform Storyblok field to Figma field
   */
  const transformField = (storyblokField: StoryblokFormField): FormField | null => {
    const baseField = {
      id: storyblokField._uid,
      name: storyblokField.name,
      label: storyblokField.label,
      helperText: storyblokField.helper_text,
      required: storyblokField.required,
      disabled: storyblokField.disabled,
    };
    
    // Normalize component name (handle both display name and technical name)
    const componentType = storyblokField.component.toLowerCase().replace(/\s+/g, '_');

    switch (componentType) {
      case 'form_field_text':
        return {
          ...baseField,
          type: storyblokField.field_type || 'text',
          placeholder: storyblokField.placeholder,
          maxLength: storyblokField.max_length,
          minLength: storyblokField.min_length,
          pattern: storyblokField.pattern,
        };

      case 'form_field_textarea':
        return {
          ...baseField,
          type: 'textarea',
          placeholder: storyblokField.placeholder,
          rows: storyblokField.rows,
          maxLength: storyblokField.max_length,
          minLength: storyblokField.min_length,
        };

      case 'form_field_select':
        return {
          ...baseField,
          type: 'select',
          placeholder: storyblokField.placeholder,
          options: (storyblokField.options || []).map(transformFieldOption),
          multiple: storyblokField.multiple,
        };

      case 'form_field_checkbox':
        return {
          ...baseField,
          type: 'checkbox',
          label: storyblokField.label || '',
        };

      case 'form_field_radio':
        return {
          ...baseField,
          type: 'radio',
          options: (storyblokField.options || []).map(transformFieldOption),
        };

      case 'form_field_file':
        return {
          ...baseField,
          type: 'file',
          accept: storyblokField.accept,
          multiple: storyblokField.multiple,
          maxSize: storyblokField.max_size,
        };

      default:
        return null;
    }
  };

  /**
   * Transform Storyblok field group to Figma field group
   */
  const transformFieldGroup = (storyblokGroup: StoryblokFormFieldGroup): FormFieldGroup => {
    const fieldsArray = storyblokGroup.fields || [];
    
    const transformedFields = fieldsArray
      .map(transformField)
      .filter((field): field is FormField => field !== null);

    return {
      id: storyblokGroup._uid,
      fields: transformedFields,
      columns: storyblokGroup.columns ? parseInt(storyblokGroup.columns, 10) as 1 | 2 | 3 : 1,
      gap: storyblokGroup.gap,
    };
  };

  /**
   * Transform Storyblok step to Figma step
   */
  const transformStep = (storyblokStep: StoryblokFormStep): FormStep => {
    // Transform field_groups array - can contain both FormFieldGroup and individual fields
    const fieldGroupsOrFields = (storyblokStep.field_groups || []).map((item: StoryblokFormFieldGroup | StoryblokFormField) => {
      const componentType = item.component.toLowerCase().replace(/\s+/g, '_');
      
      // If it's a form_field_group, transform as a group
      if (componentType === 'form_field_group') {
        return transformFieldGroup(item as StoryblokFormFieldGroup);
      }
      
      // Otherwise, it's an individual field - transform it directly
      const transformedField = transformField(item as StoryblokFormField);
      return transformedField;
    }).filter((item): item is FormFieldGroup | FormField => item !== null);
    
    return {
      id: storyblokStep._uid,
      title: storyblokStep.title,
      description: storyblokStep.description,
      fieldGroups: fieldGroupsOrFields,
      showStepNumber: storyblokStep.show_step_number,
    };
  };

  // Transform all data
  const transformedProps: FormBuilderFields = {
    title,
    description,
    steps: steps.map(transformStep),
    submitButtonText: submit_button_text,
    submitButtonHref: submit_button_href,
    showProgressBar: show_progress_bar,
    allowSaveDraft: allow_save_draft,
    successMessage: success_message,
    successRedirectUrl: success_redirect_url,
  };

  // Padding class mapping (applies to both top and bottom) - same as card slider
  const getPaddingClass = (size?: string, defaultSize = 'medium') => {
    const paddingMap: Record<string, string> = {
      'none': '',
      'small': 'py-2',      // 16px top & bottom
      'medium': 'py-4',     // 32px top & bottom
      'large': 'py-9',      // 64px top & bottom
      'xlarge': 'py-14',    // 128px top & bottom
    };
    return paddingMap[size || defaultSize] || paddingMap[defaultSize];
  };

  const desktopPadding = getPaddingClass(padding);
  const mobilePadding = getPaddingClass(paddingMobile || padding);

  return (
    <div 
      className={`
        ${mobilePadding}
        md:${desktopPadding}
      `}
    >
      <FormBuilder {...transformedProps} />
    </div>
  );
};

export default FormBuilderStoryblok;

