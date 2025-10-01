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

async function createContentCardUspComponent() {
  const componentData = {
    component: {
      name: 'Content Card',
      display_name: null,
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Card title (e.g., "JeugdVISpas") - "VIS" will be auto-highlighted in orange (even cards) or purple (odd cards)',
          translatable: true
        },
        image: {
          type: 'asset',
          pos: 1,
          required: true,
          description: 'Card image',
          filetypes: ['images']
        },
        usps: {
          type: 'textarea',
          pos: 2,
          required: true,
          description: 'USP items, one per line (max 3 shown)',
          translatable: true
        },
        primary_button_text: {
          type: 'text',
          pos: 3,
          required: true,
          description: 'Primary button text',
          default_value: 'Aanvragen',
          translatable: true
        },
        primary_button_href: {
          type: 'text',
          pos: 4,
          required: false,
          description: 'Primary button link URL'
        },
        secondary_button_text: {
          type: 'text',
          pos: 5,
          required: true,
          description: 'Secondary button text',
          default_value: 'Meer info',
          translatable: true
        },
        secondary_button_href: {
          type: 'text',
          pos: 6,
          required: false,
          description: 'Secondary button link URL'
        }
      },
      image: null,
      preview_field: null,
      is_root: false,
      preview_tmpl: null,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'content_card_usp',
      component_group_uuid: null,
      color: '#1b243f',
      icon: 'block-card'
    }
  };

  try {
    // Check if component exists (check both old and new names)
    let componentId = await getComponentId('Content Card');
    if (!componentId) {
      componentId = await getComponentId('Content Card USP'); // Check old name
    }
    
    if (componentId) {
      // Update existing component
      const response = await Storyblok.put(`spaces/${SPACE_ID}/components/${componentId}`, componentData);
      console.log('✅ Content Card component updated successfully');
      return response.data;
    } else {
      // Create new component
      const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, componentData);
      console.log('✅ Content Card component created successfully');
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error with Content Card component:', error.response?.data || error.message);
    throw error;
  }
}

async function createCardSliderComponent() {
  const componentData = {
    component: {
      name: 'Card Slider',
      display_name: null,
      schema: {
        title: {
          type: 'text',
          pos: 0,
          required: true,
          description: 'Section title',
          translatable: true
        },
        cards: {
          type: 'bloks',
          pos: 1,
          required: true,
          description: 'Card items for the slider',
          restrict_components: true,
          component_whitelist: ['content_card_usp']
        },
        padding: {
          type: 'option',
          pos: 2,
          required: false,
          description: 'Vertical padding (top & bottom) for desktop',
          default_value: 'medium',
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
          pos: 3,
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
        }
      },
      image: null,
      preview_field: null,
      is_root: false,
      preview_tmpl: null,
      is_nestable: true,
      all_presets: [],
      preset_id: null,
      real_name: 'card_slider',
      component_group_uuid: null,
      color: '#1b243f',
      icon: 'block-slider'
    }
  };

  try {
    // Check if component exists
    const componentId = await getComponentId('Card Slider');
    
    if (componentId) {
      // Update existing component
      const response = await Storyblok.put(`spaces/${SPACE_ID}/components/${componentId}`, componentData);
      console.log('✅ Card Slider component updated successfully');
      return response.data;
    } else {
      // Create new component
      const response = await Storyblok.post(`spaces/${SPACE_ID}/components/`, componentData);
      console.log('✅ Card Slider component created successfully');
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error with Card Slider component:', error.response?.data || error.message);
    throw error;
  }
}

async function createDemoStory() {
  const storyData = {
    story: {
      name: 'Demo - Card Slider',
      slug: 'demo-card-slider',
      content: {
        component: 'page',
        body: [
          {
            component: 'card_slider',
            title: 'Visdocumenten & Toestemmingen',
            padding: 'medium',
            cards: [
              {
                component: 'content_card_usp',
                title: 'JeugdVISpas',
                image: {
                  filename: 'https://a.storyblok.com/f/your-space/placeholder-image.jpg',
                  alt: 'JeugdVISpas'
                },
                usps: 'Egestas pellentesque ac males uada\nConsectetur feugiat eu utrum\nEgestas pellentesque',
                primary_button_text: 'Aanvragen',
                primary_button_href: '/aanvragen',
                secondary_button_text: 'Meer info',
                secondary_button_href: '/meer-info'
              },
              {
                component: 'content_card_usp',
                title: 'Kleine VISpas',
                image: {
                  filename: 'https://a.storyblok.com/f/your-space/placeholder-image-2.jpg',
                  alt: 'Kleine VISpas'
                },
                usps: 'Egestas pellentesque ac males uada\nConsectetur feugiat eu utrum\nEgestas pellentesque',
                primary_button_text: 'Aanvragen',
                primary_button_href: '/aanvragen',
                secondary_button_text: 'Meer info',
                secondary_button_href: '/meer-info'
              },
              {
                component: 'content_card_usp',
                title: 'MeeVIStoestemming',
                image: {
                  filename: 'https://a.storyblok.com/f/your-space/placeholder-image-3.jpg',
                  alt: 'MeeVIStoestemming'
                },
                usps: 'Egestas pellentesque ac males uada\nConsectetur feugiat eu utrum\nEgestas pellentesque',
                primary_button_text: 'Aanvragen',
                primary_button_href: '/aanvragen',
                secondary_button_text: 'Meer info',
                secondary_button_href: '/meer-info'
              },
              {
                component: 'content_card_usp',
                title: 'JeugdVISpas',
                image: {
                  filename: 'https://a.storyblok.com/f/your-space/placeholder-image-4.jpg',
                  alt: 'JeugdVISpas'
                },
                usps: 'Egestas pellentesque ac males uada\nConsectetur feugiat eu utrum\nEgestas pellentesque',
                primary_button_text: 'Aanvragen',
                primary_button_href: '/aanvragen',
                secondary_button_text: 'Meer info',
                secondary_button_href: '/meer-info'
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
    // Don't throw, demo story is optional
  }
}

async function publishComponents() {
  try {
    // Publish content_card_usp
    await Storyblok.put(`spaces/${SPACE_ID}/components/content_card_usp/publish`, {});
    console.log('📦 Content Card USP component published');

    // Publish card_slider
    await Storyblok.put(`spaces/${SPACE_ID}/components/card_slider/publish`, {});
    console.log('📦 Card Slider component published');
  } catch (error) {
    console.error('❌ Error publishing components:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Creating Storyblok components for Card Slider...');
  console.log(`📍 Space ID: ${SPACE_ID}`);
  console.log(`🔧 Environment: ${ENVIRONMENT}`);
  console.log('');

  try {
    // Create components in order (sub-component first)
    await createContentCardUspComponent();
    await createCardSliderComponent();
    
    // Publish components
    await publishComponents();
    
    // Create demo story
    await createDemoStory();
    
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('📋 Components created in Storyblok:');
    console.log('   • content_card_usp → Content Card (sub-component)');
    console.log('   • card_slider → Card Slider (main component)');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Check your Storyblok Block Library');
    console.log('   2. View the demo story in Storyblok');
    console.log('   3. Add real images to the cards');
    console.log('   4. Test the slider functionality');
    
  } catch (error) {
    console.error('');
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

main();


