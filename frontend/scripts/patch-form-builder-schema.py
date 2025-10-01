#!/usr/bin/env python3
"""
Patch the Form Builder component schema to add API integration fields
"""

import re

# Read the original file
with open('create-form-builder-storyblok.js', 'r') as f:
    content = f.read()

# Define the new schema section for Form Builder
new_schema = '''        submit_button_text: {
          type: 'text',
          pos: 3,
          default_value: 'Submit',
          description: 'Submit button text',
          translatable: true
        },
        submit_api_url: {
          type: 'text',
          pos: 4,
          required: false,
          description: '🆕 API endpoint URL (e.g., https://api.example.com/forms/submit) - If set, form data will be POSTed here'
        },
        submit_method: {
          type: 'option',
          pos: 5,
          default_value: 'POST',
          description: '🆕 HTTP method for API submission',
          options: [
            { name: 'POST', value: 'POST' },
            { name: 'PUT', value: 'PUT' }
          ]
        },
        show_progress_bar: {
          type: 'boolean',
          pos: 6,
          default_value: true,
          description: 'Show progress bar for multi-step forms?'
        },
        allow_save_draft: {
          type: 'boolean',
          pos: 7,
          default_value: false,
          description: 'Allow users to save draft?'
        },
        success_message: {
          type: 'textarea',
          pos: 8,
          default_value: 'Thank you! Your form has been submitted successfully.',
          description: 'Message shown after successful submission',
          translatable: true
        },
        success_redirect_url: {
          type: 'text',
          pos: 9,
          required: false,
          description: 'URL to redirect to after successful submission (optional)'
        },
        error_message: {
          type: 'textarea',
          pos: 10,
          required: false,
          default_value: 'Failed to submit form. Please try again.',
          description: '🆕 Custom error message when API submission fails',
          translatable: true
        },
        submit_button_href: {
          type: 'text',
          pos: 11,
          required: false,
          description: '⚠️ DEPRECATED - Use success_redirect_url instead'
        },
        padding: {
          type: 'option',
          pos: 12,
          default_value: 'medium',
          description: 'Vertical padding (top & bottom) for desktop',
          options: [
            { name: 'None (0px)', value: 'none' },
            { name: 'Small (16px)', value: 'small' },
            { name: 'Medium (32px)', value: 'medium' },
            { name: 'Large (64px)', value: 'large' },
            { name: 'Extra Large (128px)', value: 'xlarge' }
          ]
        },
        paddingMobile: {
          type: 'option',
          pos: 13,
          required: false,
          description: 'Vertical padding (top & bottom) for mobile - defaults to desktop if not set',
          options: [
            { name: 'Default (use desktop)', value: '' },
            { name: 'None (0px)', value: 'none' },
            { name: 'Small (16px)', value: 'small' },
            { name: 'Medium (32px)', value: 'medium' },
            { name: 'Large (64px)', value: 'large' },
            { name: 'Extra Large (128px)', value: 'xlarge' }
          ]
        }'''

# Pattern to match the Form Builder schema section
pattern = r'(submit_button_text:\s*\{[\s\S]*?paddingMobile:\s*\{[\s\S]*?\}[\s\S]*?\})'

# Replace the schema
updated_content = re.sub(pattern, new_schema, content)

# Write the updated file
with open('create-form-builder-storyblok.js', 'w') as f:
    f.write(updated_content)

print("✅ Successfully updated Form Builder schema with API integration fields")

