# 🏗️ Storyblok Integration Setup

## 🎯 Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
# Storyblok Configuration
STORYBLOK_ACCESS_TOKEN=your_storyblok_access_token_here
STORYBLOK_PREVIEW_TOKEN=your_storyblok_preview_token_here  # Optional
STORYBLOK_VERSION=published                                # or 'draft' for preview
STORYBLOK_REGION=eu                                       # or 'us' or 'cn'

# Contentful Configuration (for secondary CMS features)
CONTENTFUL_SPACE_ID=your_contentful_space_id_here
CONTENTFUL_PERSONAL_ACCESS_TOKEN=your_contentful_management_token_here
CONTENTFUL_ENVIRONMENT=master
```

## 🔑 Getting Your Storyblok Tokens

1. **Access Token**: 
   - Go to [Storyblok Settings](https://app.storyblok.com/#!/me/account)
   - Navigate to "My Account" → "Personal Access Tokens"
   - Create a new token or use existing one

2. **Preview Token** (Optional):
   - Go to your Space in Storyblok
   - Navigate to "Settings" → "API-Keys"
   - Copy the Preview access token

## 🏠 Content Structure

### Homepage Setup
Create a story with slug `home` in Storyblok root:
- **Name**: "Home"
- **Slug**: "home"
- **Content Type**: Use the page template
- **Body**: Add Storyblok components

### Page Structure
For other pages, create stories with their desired slugs:
- **Name**: "About Us"
- **Slug**: "about"
- **Content Type**: Page template
- **Body**: Add your components

### SEO Configuration
Add SEO fields to your pages:
```json
{
  "component": "seo",
  "title": "Page Title",
  "description": "Page description",
  "og_title": "Open Graph Title",
  "og_description": "Open Graph Description",
  "og_image": "path/to/image.jpg"
}
```

## 🧩 Available Components

## 🔄 Adding New Components

1. **Create Type Definition**:
   ```typescript
   // frontend/types/storyblok/your-component.types.ts
   export interface StoryblokYourComponent extends StoryblokComponent {
     component: 'your_component';
     title?: string;
     // ... other fields
   }
   ```

2. **Create React Component**:
   ```typescript
   // frontend/components/sections/your-component/your-component-storyblok.component.tsx
   import { StoryblokYourComponent } from 'types/storyblok';
   
   const YourComponentStoryblok: React.FC<StoryblokYourComponent> = (props) => {
     // Component implementation
   };
   ```

3. **Register Component**:
   ```typescript
   // frontend/lib/storyblok-components.ts
   export const storyblokComponents = {
     // ... existing components
     'your_component': YourComponentStoryblok,
   };
   ```

4. **Update Mapping**:
   ```typescript
   // frontend/utils/helpers/storyblok-mapping.tsx
   export const storyblokComponentMap = {
     // ... existing mappings
     'your_component': YourComponentStoryblok,
   };
   ```

## 🚀 Development Workflow

1. **Start Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Create Content in Storyblok**:
   - Create stories with appropriate slugs
   - Add components to the body field
   - Publish your stories

3. **Preview Changes**:
   - Set `STORYBLOK_VERSION=draft` for preview mode
   - Use Storyblok's Visual Editor for live editing

## 🐛 Troubleshooting

### Common Issues

1. **Component not rendering**:
   - Check component is registered in both `storyblok-components.ts` and `storyblok-mapping.tsx`
   - Verify component name matches Storyblok exactly

2. **Images not loading**:
   - Ensure `a.storyblok.com` is in Next.js `next.config.js` domains
   - Check image URL format in Storyblok

3. **SEO metadata not working**:
   - Verify SEO component is added to story
   - Check field names match exactly

4. **Pages showing 404**:
   - Ensure story slug matches URL path
   - Check story is published in Storyblok
   - Verify `STORYBLOK_ACCESS_TOKEN` is correct

### Debug Mode

Enable debug logging by adding to your component:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Storyblok story data:', storyData);
}
```

## 🚀 Available Components

### Quick Actions
**ID**: `quick_actions`  
**Description**: Section displaying quick action cards with responsive layout options

**Setup Script**: `npm run storyblok:setup-quick-actions`

**Storyblok Fields**:
- `title` (Text, required) - Section title
- `items` (Blocks, required) - List of quick action items (quick_action_item only)
- `layout` (Option, optional) - Layout style: "vertical" (3 columns) or "horizontal" (3x2 grid)
- `show_more_button` (Boolean, optional) - Show "View More" button on mobile
- `more_button_text` (Text, optional) - Button text (default: "Bekijk meer")
- `more_button_link` (Link, optional) - Button destination

**Sub-component**: `quick_action_item`
- `title` (Text, required) - Action title
- `description` (Text, required) - Action description
- `icon` (Asset, optional) - Action icon image
- `link` (Link, optional) - Action destination

**Demo Story**: Created automatically when running setup script

## 📚 Next Steps

1. **Set up environment variables** (see .env.local.example)
2. **Run component setup scripts** (e.g., `npm run storyblok:setup-quick-actions`)
3. **Create your first Storyblok story**
4. **Configure SEO fields**
5. **Set up preview mode for content editing**
6. **Create additional components as needed**

## 🔧 Manual Component Creation

If you prefer to create components manually in Storyblok, refer to the field structures above.

## 🔗 Useful Links

- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [Next.js Documentation](https://nextjs.org/docs)
