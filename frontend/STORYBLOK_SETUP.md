# 🚀 Storyblok Integration Setup

Deze handleiding legt uit hoe je de Storyblok connectie opzet en gebruikt.

## 📋 Vereisten

1. **Storyblok Account**: Zorg dat je een Storyblok space hebt
2. **API Tokens**: Preview en Public tokens uit je Storyblok settings
3. **Environment Variabelen**: Configuratie in `.env.local`

## 🔧 Environment Setup

Maak een `.env.local` bestand in de `frontend/` directory:

```bash
# Storyblok Configuration  
STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_public_token_here  
STORYBLOK_SPACE_ID=your_space_id_here

# Optional: Management API (voor programmatisch content maken)
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here
```

### 🔑 Tokens Vinden in Storyblok

1. **Preview Token**: Settings → Access Tokens → "Preview" token
2. **Public Token**: Settings → Access Tokens → "Public" token  
3. **Space ID**: Te vinden in de URL van je space
4. **Management Token**: Settings → Access Tokens → "Management" token

## 📦 Component Schema's Importeren

### Optie 1: Handmatig in Storyblok UI

1. Ga naar **Components** in je Storyblok space
2. Klik **+ New** → **Import from JSON**
3. Gebruik het schema bestand: `frontend/storyblok/schemas/quick-actions-schema.json`

### Optie 2: Via Management API (automatisch)

```bash
# In de frontend directory
npm run storyblok:import-schemas
```

## 🎯 Component Configuratie

De volgende componenten zijn beschikbaar:

### 1. **Quick Actions** (`quick_actions`)
- **Title**: Section titel  
- **Variant**: Grid layout type (auto/horizontal/grid)
- **Layout**: Card style (horizontal/vertical)
- **Items**: Array van quick action items (1-6 stuks)
- **CTA**: Optionele call-to-action button

### 2. **Quick Action Item** (`quick_action_item`)  
- **Title**: Actie titel
- **Description**: Korte beschrijving (max 150 chars)
- **Link**: Bestemmings URL
- **Icon**: Optionele afbeelding (SVG aanbevolen)

### 3. **CTA Button** (`cta_button`)
- **Text**: Button tekst
- **Link**: Button bestemmings URL

## 🌐 Routes en Pages

### Automatische Route Handling

Alle Storyblok content is beschikbaar via:
- `/storyblok/[slug]` - Dynamische Storyblok pages
- `/storyblok-test` - Test pagina voor ontwikkeling

### Visual Editor

1. **Preview URL instellen** in Storyblok:
   ```
   https://your-domain.com/storyblok/
   ```

2. **Real-time editing** wordt automatisch geactiveerd via de Storyblok bridge

## 🧪 Testen

### Lokale Test

1. Start je development server: `npm run dev`
2. Ga naar: `http://localhost:3000/storyblok-test`
3. Controleer of componenten correct renderen

### Storyblok Visual Editor Test

1. Maak een nieuwe Story in Storyblok
2. Voeg het **Quick Actions** component toe
3. Configureer de velden
4. Open de **Visual Editor** tab
5. Controleer real-time updates

## 🔄 Deployment

### Vercel/Netlify

Voeg environment variabelen toe aan je hosting platform:

```bash
STORYBLOK_ACCESS_TOKEN=your_token
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_public_token
STORYBLOK_SPACE_ID=your_space_id
```

### Webhook Setup (Optioneel)

Voor automatische cache invalidation:

1. **Storyblok Settings** → **Webhooks**
2. **Add webhook**: `https://your-domain.com/api/revalidate`
3. **Events**: Published, Unpublished, Deleted

## 📚 Gebruiksvoorbeelden

### In Storyblok CMS

1. **Nieuwe Story maken**
2. **Component toevoegen**: Quick Actions
3. **Configureren**:
   - Title: "Snel naar"
   - Variant: "Auto Detection"  
   - Layout: "Horizontal"
4. **Items toevoegen** (1-6 stuks)
5. **Publiceren**

### In Code (Custom Implementation)

```typescript
import { StoryblokQuickActions } from '@components/storyblok/QuickActions';

const mockData = {
  title: "Custom Quick Actions",
  variant: "grid",
  layout: "vertical",
  quick_action_items: [
    {
      title: "Documenten",
      description: "Bekijk alle documenten",
      link: { url: "/documents" }
    }
  ]
};

<StoryblokQuickActions blok={mockData} />
```

## 🐛 Troubleshooting

### Componenten Laden Niet

1. ✅ Check environment variabelen
2. ✅ Controleer component registratie in `StoryblokProvider.tsx`
3. ✅ Verify schema import in Storyblok

### Visual Editor Werkt Niet

1. ✅ Check preview URL configuratie
2. ✅ Ensure `storyblokEditable` is toegevoegd aan componenten  
3. ✅ Test met fresh browser session

### API Errors

1. ✅ Validate token permissions
2. ✅ Check region settings (EU vs US)
3. ✅ Verify space ID is correct

## 📞 Support

Voor vragen over deze setup:
1. Check Storyblok documentatie: https://storyblok.com/docs
2. Bekijk component code in `frontend/components/storyblok/`
3. Test met de test pagina: `/storyblok-test`
