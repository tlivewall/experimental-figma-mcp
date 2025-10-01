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

---

### Card Slider
**ID**: `card_slider`  
**Description**: Horizontal card carousel component with navigation. Desktop shows 3 cards with step-based scrolling, mobile has horizontal scroll with pagination dots.

**Setup Script**: `npm run storyblok:setup-card-slider`

**Storyblok Fields**:
- `title` (Text, required) - Section title (e.g., "Visdocumenten & Toestemmingen")
- `cards` (Blocks, required) - List of USP cards (content_card_usp only)
- `paddingTop` (Option, optional) - Desktop top padding: none, small (48px), medium (112px), large (168px)
- `paddingBottom` (Option, optional) - Desktop bottom padding: none, small (48px), medium (112px), large (168px)
- `paddingTopMobile` (Option, optional) - Mobile top padding (defaults to desktop value)
- `paddingBottomMobile` (Option, optional) - Mobile bottom padding (defaults to desktop value)

**Sub-component**: `content_card_usp`
- `title` (Text, required) - Card title (e.g., "JeugdVISpas")
- `title_highlight` (Text, optional) - Part of title to highlight (e.g., "VIS")
- `title_highlight_color` (Text, optional) - Hex color for highlight (e.g., #fc4d16, #3053f9)
- `image` (Asset, required) - Card image
- `usps` (Textarea, required) - USP items, one per line (max 3 displayed)
- `primary_button_text` (Text, required) - Primary CTA text (default: "Aanvragen")
- `primary_button_href` (Text, optional) - Primary CTA link URL
- `secondary_button_text` (Text, required) - Secondary CTA text (default: "Meer info")
- `secondary_button_href` (Text, optional) - Secondary CTA link URL

**Demo Story**: Created automatically at `/demo-card-slider`  
**Demo URL**: View in Storyblok after running setup script

**Features**:
- **Desktop**: Shows 3 cards, scrolls 3 cards at a time (or remaining cards)
- **Mobile**: Horizontal scroll with snap points, pagination dots
- **Navigation**: Left/Right arrows (desktop), disabled state when at boundaries
- **Responsive**: Different card sizes and layouts for desktop/mobile
- **Accessibility**: Proper button labels and disabled states

---

### Form Builder
**ID**: `form_builder`  
**Description**: Flexible multi-step form builder with various field types, responsive layout, and progress tracking. Perfect for contact forms, surveys, applications, and complex multi-step forms.

**Setup Script**: `npm run storyblok:setup-form-builder`

**Storyblok Fields**:
- `title` (Text, optional) - Form title
- `description` (Textarea, optional) - Form description
- `steps` (Blocks, required) - Form steps (use 1 step for single-page forms)
- `submit_button_text` (Text, optional) - Submit button text (default: "Submit")
- `submit_button_href` (Text, optional) - Redirect URL after submission
- `show_progress_bar` (Boolean, optional) - Show progress bar for multi-step forms (default: true)
- `allow_save_draft` (Boolean, optional) - Allow users to save draft (default: false)
- `success_message` (Text, optional) - Success message after submission
- `success_redirect_url` (Text, optional) - Redirect URL after success
- `paddingTop` (Option, optional) - Desktop top padding: none, small (48px), medium (112px), large (168px)
- `paddingBottom` (Option, optional) - Desktop bottom padding: none, small (48px), medium (112px), large (168px)
- `paddingTopMobile` (Option, optional) - Mobile top padding (defaults to desktop value)
- `paddingBottomMobile` (Option, optional) - Mobile bottom padding (defaults to desktop value)

**Sub-components**:

**1. Form Step** (`form_step`)
- `title` (Text, optional) - Step title
- `description` (Textarea, optional) - Step description
- `field_groups` (Blocks, required) - Field groups for this step
- `show_step_number` (Boolean, optional) - Show step number (default: true)

**2. Form Field Group** (`form_field_group`)
- `fields` (Blocks, required) - Form fields in this group
- `columns` (Option, optional) - Number of columns: 1, 2, or 3 (default: 1)
- `gap` (Number, optional) - Gap between fields in pixels (default: 24)

**3. Form Field Text** (`form_field_text`)
- `field_type` (Option, required) - Type: text, email, tel, number, url, password
- `name` (Text, required) - Field name (used for form submission)
- `label` (Text, optional) - Field label
- `placeholder` (Text, optional) - Placeholder text
- `helper_text` (Text, optional) - Helper text below the field
- `required` (Boolean, optional) - Is this field required?
- `disabled` (Boolean, optional) - Is this field disabled?
- `max_length` (Number, optional) - Maximum character length
- `min_length` (Number, optional) - Minimum character length
- `pattern` (Text, optional) - Regex pattern for validation

**4. Form Field Textarea** (`form_field_textarea`)
- `name` (Text, required) - Field name
- `label` (Text, optional) - Field label
- `placeholder` (Text, optional) - Placeholder text
- `helper_text` (Text, optional) - Helper text
- `required` (Boolean, optional) - Is required?
- `disabled` (Boolean, optional) - Is disabled?
- `rows` (Number, optional) - Number of visible text rows (default: 4)
- `max_length` (Number, optional) - Maximum character length
- `min_length` (Number, optional) - Minimum character length

**5. Form Field Select** (`form_field_select`)
- `name` (Text, required) - Field name
- `label` (Text, optional) - Field label
- `placeholder` (Text, optional) - Placeholder text
- `helper_text` (Text, optional) - Helper text
- `required` (Boolean, optional) - Is required?
- `disabled` (Boolean, optional) - Is disabled?
- `options` (Blocks, required) - Select options (form_field_option)
- `multiple` (Boolean, optional) - Allow multiple selections?

**6. Form Field Checkbox** (`form_field_checkbox`)
- `name` (Text, required) - Field name
- `label` (Text, required) - Checkbox label
- `helper_text` (Text, optional) - Helper text
- `required` (Boolean, optional) - Is required?
- `disabled` (Boolean, optional) - Is disabled?

**7. Form Field Radio** (`form_field_radio`)
- `name` (Text, required) - Field name
- `label` (Text, optional) - Field label
- `helper_text` (Text, optional) - Helper text
- `required` (Boolean, optional) - Is required?
- `disabled` (Boolean, optional) - Is disabled?
- `options` (Blocks, required) - Radio options (form_field_option)

**8. Form Field File** (`form_field_file`)
- `name` (Text, required) - Field name
- `label` (Text, optional) - Field label
- `helper_text` (Text, optional) - Helper text
- `required` (Boolean, optional) - Is required?
- `disabled` (Boolean, optional) - Is disabled?
- `accept` (Text, optional) - Accepted file types (e.g., .pdf,.doc or image/*)
- `multiple` (Boolean, optional) - Allow multiple file uploads?
- `max_size` (Number, optional) - Maximum file size in bytes

**9. Form Field Option** (`form_field_option`)
- `label` (Text, required) - Option label (visible to user)
- `value` (Text, required) - Option value (submitted with form)

**Demo Story**: Created automatically at `/demo-form-builder`  
**Demo URL**: View in Storyblok after running setup script

**Features**:
- **Single-page Forms**: Use 1 step for simple forms (contact, newsletter, etc.)
- **Multi-step Forms**: Use multiple steps with progress bar and navigation
- **Flexible Layout**: Use Field Groups with 1-3 columns to create side-by-side fields
- **Field Types**: Text, Email, Phone, Number, Textarea, Select, Checkbox, Radio, File
- **Validation**: Built-in validation with required fields and error messages
- **Responsive**: Mobile-first design with optimized layouts
- **Accessibility**: ARIA labels, proper error messaging, keyboard navigation
- **Success States**: Custom success messages and optional redirects

**Usage Tips**:
1. **Single-page Contact Form**: Create 1 Form Step with Field Groups containing your fields
2. **Multi-step Application**: Create multiple Form Steps, each with its own Field Groups
3. **Side-by-side Fields**: Use Field Group with 2 columns for Name (First Name + Last Name)
4. **Consistent Field Names**: Ensure all field names are unique within the form
5. **Required Fields**: Mark important fields as required for validation

**Example Structure**:
```
Form Builder
└── Step 1: Personal Information
    ├── Field Group (2 columns)
    │   ├── Text Field: First Name (required)
    │   └── Text Field: Last Name (required)
    └── Field Group (1 column)
        ├── Text Field: Email (type: email, required)
        └── Text Field: Phone (type: tel)
└── Step 2: Your Message
    └── Field Group (1 column)
        ├── Select: Subject (required, with options)
        ├── Textarea: Message (required)
        └── Checkbox: Newsletter opt-in
```

---

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
