const StoryblokClient = require('storyblok-js-client').default;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Storyblok Schema Upload Script
 * Uploads component schemas to Storyblok via Management API
 */

// Check environment variables
if (!process.env.STORYBLOK_MANAGEMENT_TOKEN) {
  console.error('❌ STORYBLOK_MANAGEMENT_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.STORYBLOK_SPACE_ID) {
  console.error('❌ STORYBLOK_SPACE_ID is required in .env file');
  process.exit(1);
}

// Initialize Storyblok Management API client
const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN
});

const spaceId = process.env.STORYBLOK_SPACE_ID;

async function uploadSchemas() {
  try {
    console.log('🚀 Starting Storyblok schema upload...');
    console.log(`📍 Space ID: ${spaceId}`);

    // Read the schema file
    const schemaPath = path.join(__dirname, '../storyblok/schemas/quick-actions-schema.json');
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    console.log('📖 Schema file loaded successfully');

    // Upload each component schema
    for (const [componentName, componentSchema] of Object.entries(schemaData)) {
      console.log(`\n🔄 Processing component: ${componentName}`);

      try {
        // Check if component already exists
        const existingComponents = await Storyblok.get(`spaces/${spaceId}/components`);
        const existingComponent = existingComponents.data.components.find(
          comp => comp.name === componentName
        );

        if (existingComponent) {
          console.log(`📝 Updating existing component: ${componentName}`);
          
          // Update existing component
          const response = await Storyblok.put(
            `spaces/${spaceId}/components/${existingComponent.id}`,
            {
              component: {
                ...componentSchema,
                id: existingComponent.id
              }
            }
          );
          
          console.log(`✅ Updated: ${componentName} (ID: ${response.data.component.id})`);
        } else {
          console.log(`🆕 Creating new component: ${componentName}`);
          
          // Create new component
          const response = await Storyblok.post(
            `spaces/${spaceId}/components`,
            {
              component: componentSchema
            }
          );
          
          console.log(`✅ Created: ${componentName} (ID: ${response.data.component.id})`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error with component ${componentName}:`, error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Schema upload completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Storyblok space → Components');
    console.log('2. Verify the components are created correctly');
    console.log('3. Create a new Story and test the Quick Actions component');
    console.log('4. Configure Visual Editor preview URL if needed');

  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the upload
uploadSchemas();
