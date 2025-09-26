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

async function createQuickActionItemComponent() {
  const componentData = {
    component: {
      name: 'Quick Action Item',
      display_name: null,
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Title of the quick action item'
        },
        description: {
          type: 'text',
          pos: 1,
          required: true,
          description: 'Description text for the quick action item'
        },
        icon: {
          type: 'asset',
          pos: 2,
          required: false,
          description: 'Icon image for the quick action item',
          filetypes: ['images']
        },
        link: {
          type: 'multilink',
          pos: 3,
          required: false,
          description: 'Link destination for the quick action item'
        }
      },
      image: null,
      preview_field: null,
      is_root: false,
      preview_tmpl: null,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'quick_action_item',
      component_group_uuid: null,
      color: '#1b243f',
      icon: 'block-list'
    }
  };

  try {
    const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, componentData);
    console.log('✅ Quick Action Item component created successfully');
    return response.data;
  } catch (error) {
    if (error.response?.data?.error?.includes('already exists')) {
      console.log('⚠️  Quick Action Item component already exists, skipping...');
      return null;
    }
    console.error('❌ Error creating Quick Action Item component:', error.response?.data || error.message);
    throw error;
  }
}

async function createQuickActionsComponent() {
  const componentData = {
    component: {
      name: 'Quick Actions',
      display_name: null,
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Title for the quick actions section'
        },
        items: {
          type: 'bloks',
          pos: 1,
          required: true,
          description: 'List of quick action items',
          restrict_components: true,
          component_whitelist: ['quick_action_item']
        },
        layout: {
          type: 'option',
          pos: 2,
          required: false,
          description: 'Layout style for desktop view',
          default_value: 'vertical',
          options: [
            {
              value: 'vertical',
              name: 'Vertical Cards (3 columns)'
            },
            {
              value: 'horizontal', 
              name: 'Horizontal Cards (3x2 grid)'
            }
          ]
        },
        show_more_button: {
          type: 'boolean',
          pos: 3,
          required: false,
          description: 'Show "View More" button on mobile'
        },
        more_button_text: {
          type: 'text',
          pos: 4,
          required: false,
          description: 'Text for the "View More" button',
          default_value: 'Bekijk meer'
        },
        more_button_link: {
          type: 'multilink',
          pos: 5,
          required: false,
          description: 'Link for the "View More" button'
        }
      },
      image: null,
      preview_field: null,
      is_root: false,
      preview_tmpl: null,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'quick_actions',
      component_group_uuid: null,
      color: '#1b243f',
      icon: 'block-grid'
    }
  };

  try {
    const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, componentData);
    console.log('✅ Quick Actions component created successfully');
    return response.data;
  } catch (error) {
    if (error.response?.data?.error?.includes('already exists')) {
      console.log('⚠️  Quick Actions component already exists, skipping...');
      return null;
    }
    console.error('❌ Error creating Quick Actions component:', error.response?.data || error.message);
    throw error;
  }
}

async function publishComponents() {
  try {
    // Publish quick_action_item
    await Storyblok.put(`spaces/${SPACE_ID}/components/quick_action_item/publish`, {});
    console.log('📦 Quick Action Item component published');

    // Publish quick_actions  
    await Storyblok.put(`spaces/${SPACE_ID}/components/quick_actions/publish`, {});
    console.log('📦 Quick Actions component published');
  } catch (error) {
    console.error('❌ Error publishing components:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Creating Storyblok components for Quick Actions...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  console.log(`🔧 Environment: ${ENVIRONMENT}`);
  console.log('');

  try {
    // Create components in order (sub-component first)
    await createQuickActionItemComponent();
    await createQuickActionsComponent();
    
    // Publish components
    await publishComponents();
    
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('📋 Components created in Storyblok:');
    console.log('   • quick_action_item (sub-component)');
    console.log('   • quick_actions (main component)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Check your Storyblok Block Library');
    console.log('   2. Create a test story with Quick Actions component');
    console.log('   3. Add some Quick Action Items to test the functionality');
    
  } catch (error) {
    console.error('');
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

main();
