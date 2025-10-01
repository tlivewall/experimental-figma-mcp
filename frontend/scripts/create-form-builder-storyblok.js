const { default: StoryblokClient } = require('storyblok-js-client');
require('dotenv').config();

// Environment variables
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.STORYBLOK_ENVIRONMENT || 'master';

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   STORYBLOK_SPACE_ID:', SPACE_ID ? '✓' : '❌');
  console.error('   STORYBLOK_MANAGEMENT_TOKEN:', MANAGEMENT_TOKEN ? '✓' : '❌');
  process.exit(1);
}

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: MANAGEMENT_TOKEN
});

async function getComponentId(componentName) {
  try {
    const response = await Storyblok.get(`spaces/${SPACE_ID}/components/`);
    const component = response.data.components.find(c => c.name === componentName);
    return component ? component.id : null;
  } catch (error) {
    console.error('Error getting component ID:', error.response?.data || error.message);
    return null;
  }
}

async function createOrUpdateComponent(componentName, componentData) {
  try {
    const componentId = await getComponentId(componentName);
    
    if (componentId) {
      const response = await Storyblok.put(`spaces/${SPACE_ID}/components/${componentId}`, componentData);
      console.log(`✅ ${componentName} component updated successfully`);
      return response.data;
    } else {
      const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, componentData);
      console.log(`✅ ${componentName} component created successfully`);
      return response.data;
    }
  } catch (error) {
    console.error(`❌ Error with ${componentName} component:`, error.response?.data || error.message);
    throw error;
  }
}

// 1. Form Field Option (for select and radio fields)
async function createFormFieldOptionComponent() {
  const componentData = {
    component: {
      name: 'Form Field Option',
      schema: {
        label: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Option label (visible to user)',
          translatable: true
        },
        value: {
          type: 'text',
          pos: 1,
          required: true,
          description: 'Option value (submitted with form)'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_option',
      color: '#4a5568',
      icon: 'block-list-item'
    }
  };

  return createOrUpdateComponent('Form Field Option', componentData);
}

// 2. Form Field Text (text, email, tel, number, url, password)
async function createFormFieldTextComponent() {
  const componentData = {
    component: {
      name: 'Form Field Text',
      schema: {
        field_type: {
          type: 'option',
          pos: 0,
          required: true,
          default_value: 'text',
          description: 'Type of text input',
          options: [
            { name: 'Text', value: 'text' },
            { name: 'Email', value: 'email' },
            { name: 'Phone', value: 'tel' },
            { name: 'Number', value: 'number' },
            { name: 'URL', value: 'url' },
            { name: 'Password', value: 'password' }
          ]
        },
        name: {
          type: 'text',
          pos: 1,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Field label',
          translatable: true
        },
        placeholder: {
          type: 'text',
          pos: 3,
          required: false,
          description: 'Placeholder text',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 4,
          required: false,
          description: 'Helper text below the field',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 5,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 6,
          default_value: false,
          description: 'Is this field disabled?'
        },
        max_length: {
          type: 'number',
          pos: 7,
          required: false,
          description: 'Maximum character length'
        },
        min_length: {
          type: 'number',
          pos: 8,
          required: false,
          description: 'Minimum character length'
        },
        pattern: {
          type: 'text',
          pos: 9,
          required: false,
          description: 'Regex pattern for validation'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_text',
      color: '#3182ce',
      icon: 'block-text'
    }
  };

  return createOrUpdateComponent('Form Field Text', componentData);
}

// 3. Form Field Textarea
async function createFormFieldTextareaComponent() {
  const componentData = {
    component: {
      name: 'Form Field Textarea',
      schema: {
        name: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 1,
          required: false,
          description: 'Field label',
          translatable: true
        },
        placeholder: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Placeholder text',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 3,
          required: false,
          description: 'Helper text below the field',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 4,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 5,
          default_value: false,
          description: 'Is this field disabled?'
        },
        rows: {
          type: 'number',
          pos: 6,
          default_value: 4,
          description: 'Number of visible text rows'
        },
        max_length: {
          type: 'number',
          pos: 7,
          required: false,
          description: 'Maximum character length'
        },
        min_length: {
          type: 'number',
          pos: 8,
          required: false,
          description: 'Minimum character length'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_textarea',
      color: '#3182ce',
      icon: 'block-textarea'
    }
  };

  return createOrUpdateComponent('Form Field Textarea', componentData);
}

// 4. Form Field Select
async function createFormFieldSelectComponent() {
  const componentData = {
    component: {
      name: 'Form Field Select',
      schema: {
        name: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 1,
          required: false,
          description: 'Field label',
          translatable: true
        },
        placeholder: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Placeholder text',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 3,
          required: false,
          description: 'Helper text below the field',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 4,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 5,
          default_value: false,
          description: 'Is this field disabled?'
        },
        options: {
          type: 'bloks',
          pos: 6,
          required: true,
          description: 'Select options',
          restrict_components: true,
          component_whitelist: ['form_field_option']
        },
        multiple: {
          type: 'boolean',
          pos: 7,
          default_value: false,
          description: 'Allow multiple selections?'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_select',
      color: '#3182ce',
      icon: 'block-dropdown'
    }
  };

  return createOrUpdateComponent('Form Field Select', componentData);
}

// 5. Form Field Checkbox
async function createFormFieldCheckboxComponent() {
  const componentData = {
    component: {
      name: 'Form Field Checkbox',
      schema: {
        name: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 1,
          required: true,
          description: 'Checkbox label',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Helper text below the checkbox',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 3,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 4,
          default_value: false,
          description: 'Is this field disabled?'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_checkbox',
      color: '#3182ce',
      icon: 'block-checkbox'
    }
  };

  return createOrUpdateComponent('Form Field Checkbox', componentData);
}

// 6. Form Field Radio
async function createFormFieldRadioComponent() {
  const componentData = {
    component: {
      name: 'Form Field Radio',
      schema: {
        name: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 1,
          required: false,
          description: 'Field label',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Helper text below the field',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 3,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 4,
          default_value: false,
          description: 'Is this field disabled?'
        },
        options: {
          type: 'bloks',
          pos: 5,
          required: true,
          description: 'Radio options',
          restrict_components: true,
          component_whitelist: ['form_field_option']
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_radio',
      color: '#3182ce',
      icon: 'block-radio'
    }
  };

  return createOrUpdateComponent('Form Field Radio', componentData);
}

// 7. Form Field File
async function createFormFieldFileComponent() {
  const componentData = {
    component: {
      name: 'Form Field File',
      schema: {
        name: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Field name (used for form submission)'
        },
        label: {
          type: 'text',
          pos: 1,
          required: false,
          description: 'Field label',
          translatable: true
        },
        helper_text: {
          type: 'text',
          pos: 2,
          required: false,
          description: 'Helper text below the field',
          translatable: true
        },
        required: {
          type: 'boolean',
          pos: 3,
          default_value: false,
          description: 'Is this field required?'
        },
        disabled: {
          type: 'boolean',
          pos: 4,
          default_value: false,
          description: 'Is this field disabled?'
        },
        accept: {
          type: 'text',
          pos: 5,
          required: false,
          description: 'Accepted file types (e.g., .pdf,.doc,.docx or image/*)',
          default_value: '*'
        },
        multiple: {
          type: 'boolean',
          pos: 6,
          default_value: false,
          description: 'Allow multiple file uploads?'
        },
        max_size: {
          type: 'number',
          pos: 7,
          required: false,
          description: 'Maximum file size in bytes (e.g., 5242880 for 5MB)'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_file',
      color: '#3182ce',
      icon: 'block-attachment'
    }
  };

  return createOrUpdateComponent('Form Field File', componentData);
}

// 8. Form Field Group (layout container)
async function createFormFieldGroupComponent() {
  const componentData = {
    component: {
      name: 'Form Field Group',
      schema: {
        fields: {
          type: 'bloks',
          pos: 0,
          required: true,
          description: 'Form fields in this group',
          restrict_components: true,
          component_whitelist: [
            'form_field_text',
            'form_field_textarea',
            'form_field_select',
            'form_field_checkbox',
            'form_field_radio',
            'form_field_file'
          ]
        },
        columns: {
          type: 'option',
          pos: 1,
          default_value: '1',
          description: 'Number of columns (desktop)',
          options: [
            { name: '1 Column', value: '1' },
            { name: '2 Columns', value: '2' },
            { name: '3 Columns', value: '3' }
          ]
        },
        gap: {
          type: 'number',
          pos: 2,
          default_value: 24,
          description: 'Gap between fields in pixels'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_field_group',
      color: '#48bb78',
      icon: 'block-grid'
    }
  };

  return createOrUpdateComponent('Form Field Group', componentData);
}

// 9. Form Step
async function createFormStepComponent() {
  const componentData = {
    component: {
      name: 'Form Step',
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: false,
          description: 'Step title',
          translatable: true
        },
        description: {
          type: 'textarea',
          pos: 1,
          required: false,
          description: 'Step description',
          translatable: true
        },
        field_groups: {
          type: 'bloks',
          pos: 2,
          required: true,
          description: 'Field groups OR individual fields (no group needed for single fields)',
          restrict_components: true,
          component_whitelist: [
            'form_field_group',
            'form_field_text',
            'form_field_textarea',
            'form_field_select',
            'form_field_checkbox',
            'form_field_radio',
            'form_field_file'
          ]
        },
        show_step_number: {
          type: 'boolean',
          pos: 3,
          default_value: true,
          description: 'Show step number?'
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_step',
      color: '#9f7aea',
      icon: 'block-steps'
    }
  };

  return createOrUpdateComponent('Form Step', componentData);
}

// 10. Form Builder (main component)
async function createFormBuilderComponent() {
  const componentData = {
    component: {
      name: 'Form Builder',
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: false,
          description: 'Form title',
          translatable: true
        },
        description: {
          type: 'textarea',
          pos: 1,
          required: false,
          description: 'Form description',
          translatable: true
        },
        steps: {
          type: 'bloks',
          pos: 2,
          required: true,
          description: 'Form steps (use 1 step for single-page forms)',
          restrict_components: true,
          component_whitelist: ['form_step']
        },
        submit_button_text: {
          type: 'text',
          pos: 3,
          default_value: 'Submit',
          description: 'Submit button text',
          translatable: true
        },
        submit_button_href: {
          type: 'text',
          pos: 4,
          required: false,
          description: 'Redirect URL after submission'
        },
        show_progress_bar: {
          type: 'boolean',
          pos: 5,
          default_value: true,
          description: 'Show progress bar for multi-step forms?'
        },
        allow_save_draft: {
          type: 'boolean',
          pos: 6,
          default_value: false,
          description: 'Allow users to save draft?'
        },
        success_message: {
          type: 'text',
          pos: 7,
          default_value: 'Form submitted successfully!',
          description: 'Success message after submission',
          translatable: true
        },
        success_redirect_url: {
          type: 'text',
          pos: 8,
          required: false,
          description: 'Redirect URL after success (optional)'
        },
        paddingTop: {
          type: 'option',
          pos: 9,
          default_value: 'medium',
          description: 'Top padding (desktop)',
          options: [
            { name: 'None', value: 'none' },
            { name: 'Small (48px)', value: 'small' },
            { name: 'Medium (112px)', value: 'medium' },
            { name: 'Large (168px)', value: 'large' }
          ]
        },
        paddingBottom: {
          type: 'option',
          pos: 10,
          default_value: 'medium',
          description: 'Bottom padding (desktop)',
          options: [
            { name: 'None', value: 'none' },
            { name: 'Small (48px)', value: 'small' },
            { name: 'Medium (112px)', value: 'medium' },
            { name: 'Large (168px)', value: 'large' }
          ]
        },
        paddingTopMobile: {
          type: 'option',
          pos: 11,
          description: 'Top padding (mobile) - defaults to desktop if not set',
          options: [
            { name: 'Default (use desktop)', value: '' },
            { name: 'None', value: 'none' },
            { name: 'Small (48px)', value: 'small' },
            { name: 'Medium (112px)', value: 'medium' },
            { name: 'Large (168px)', value: 'large' }
          ]
        },
        paddingBottomMobile: {
          type: 'option',
          pos: 12,
          description: 'Bottom padding (mobile) - defaults to desktop if not set',
          options: [
            { name: 'Default (use desktop)', value: '' },
            { name: 'None', value: 'none' },
            { name: 'Small (48px)', value: 'small' },
            { name: 'Medium (112px)', value: 'medium' },
            { name: 'Large (168px)', value: 'large' }
          ]
        }
      },
      is_root: false,
      is_nestable: true,
      real_name: 'form_builder',
      color: '#ed8936',
      icon: 'block-form'
    }
  };

  return createOrUpdateComponent('Form Builder', componentData);
}

async function createDemoStory() {
  const storyData = {
    story: {
      name: 'Demo - Form Builder',
      slug: 'demo-form-builder',
      content: {
        component: 'page',
        body: [
          {
            component: 'form_builder',
            title: 'Contact Us',
            description: 'Fill out this form and we will get back to you as soon as possible.',
            show_progress_bar: true,
            submit_button_text: 'Send Message',
            success_message: 'Thank you! We have received your message.',
            paddingTop: 'medium',
            paddingBottom: 'medium',
            steps: [
              {
                component: 'form_step',
                title: 'Personal Information',
                description: 'Please provide your contact details',
                show_step_number: true,
                field_groups: [
                  {
                    component: 'form_field_group',
                    columns: '2',
                    fields: [
                      {
                        component: 'form_field_text',
                        field_type: 'text',
                        name: 'first_name',
                        label: 'First Name',
                        placeholder: 'John',
                        required: true
                      },
                      {
                        component: 'form_field_text',
                        field_type: 'text',
                        name: 'last_name',
                        label: 'Last Name',
                        placeholder: 'Doe',
                        required: true
                      }
                    ]
                  },
                  {
                    component: 'form_field_group',
                    columns: '1',
                    fields: [
                      {
                        component: 'form_field_text',
                        field_type: 'email',
                        name: 'email',
                        label: 'Email Address',
                        placeholder: 'john@example.com',
                        required: true
                      },
                      {
                        component: 'form_field_text',
                        field_type: 'tel',
                        name: 'phone',
                        label: 'Phone Number',
                        placeholder: '+31 6 12345678',
                        required: false
                      }
                    ]
                  }
                ]
              },
              {
                component: 'form_step',
                title: 'Your Message',
                description: 'Tell us what you need help with',
                show_step_number: true,
                field_groups: [
                  {
                    component: 'form_field_group',
                    columns: '1',
                    fields: [
                      {
                        component: 'form_field_select',
                        name: 'subject',
                        label: 'Subject',
                        placeholder: 'Select a subject',
                        required: true,
                        options: [
                          {
                            component: 'form_field_option',
                            label: 'General Inquiry',
                            value: 'general'
                          },
                          {
                            component: 'form_field_option',
                            label: 'Technical Support',
                            value: 'support'
                          },
                          {
                            component: 'form_field_option',
                            label: 'Sales',
                            value: 'sales'
                          }
                        ]
                      },
                      {
                        component: 'form_field_textarea',
                        name: 'message',
                        label: 'Message',
                        placeholder: 'Type your message here...',
                        required: true,
                        rows: 6
                      },
                      {
                        component: 'form_field_checkbox',
                        name: 'newsletter',
                        label: 'I would like to receive newsletter updates',
                        required: false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };

  try {
    const response = await Storyblok.post(`spaces/${SPACE_ID}/stories/`, storyData);
    console.log('✅ Demo story created successfully');
    console.log(`   URL: https://app.storyblok.com/#!/me/spaces/${SPACE_ID}/stories/0/0/${response.data.story.id}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error?.includes('already exists')) {
      console.log('⚠️  Demo story already exists, skipping...');
      return null;
    }
    console.error('❌ Error creating demo story:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Creating Storyblok components for Form Builder...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  console.log(`🔧 Environment: ${ENVIRONMENT}`);
  console.log('');

  try {
    // Create components in order (leaf components first)
    console.log('📦 Creating field option component...');
    await createFormFieldOptionComponent();
    
    console.log('📦 Creating field components...');
    await createFormFieldTextComponent();
    await createFormFieldTextareaComponent();
    await createFormFieldSelectComponent();
    await createFormFieldCheckboxComponent();
    await createFormFieldRadioComponent();
    await createFormFieldFileComponent();
    
    console.log('📦 Creating field group component...');
    await createFormFieldGroupComponent();
    
    console.log('📦 Creating form step component...');
    await createFormStepComponent();
    
    console.log('📦 Creating form builder component...');
    await createFormBuilderComponent();
    
    console.log('');
    console.log('📝 Creating demo story...');
    await createDemoStory();
    
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Components created in Storyblok:');
    console.log('   • form_field_option → Form Field Option');
    console.log('   • form_field_text → Form Field Text');
    console.log('   • form_field_textarea → Form Field Textarea');
    console.log('   • form_field_select → Form Field Select');
    console.log('   • form_field_checkbox → Form Field Checkbox');
    console.log('   • form_field_radio → Form Field Radio');
    console.log('   • form_field_file → Form Field File');
    console.log('   • form_field_group → Form Field Group');
    console.log('   • form_step → Form Step');
    console.log('   • form_builder → Form Builder (main component)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Check your Storyblok Block Library');
    console.log('   2. View the demo story: /demo-form-builder');
    console.log('   3. Create custom forms by adding Form Builder to pages');
    console.log('   4. Configure form submission endpoint');
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Use 1 step for single-page forms');
    console.log('   - Use multiple steps for multi-step forms with progress bar');
    console.log('   - Use Field Groups with 2-3 columns for side-by-side fields');
    console.log('   - All field names must be unique within a form');
    
  } catch (error) {
    console.error('');
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

main();

