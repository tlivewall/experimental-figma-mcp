import Container from '@components/ui/container/container.component';
import { Typography } from '@components/ui';
import { StoryblokQuickActions } from '@components/storyblok/QuickActions';

/**
 * Storyblok Test Page
 * Test page to verify Storyblok components work correctly
 */
export default function StoryblokTestPage() {
  // Mock Storyblok data structure
  const mockStoryblokData = {
    _uid: 'test-uid-123',
    component: 'quick_actions' as const,
    title: 'Test Storyblok Quick Actions',
    variant: 'auto' as const,
    layout: 'horizontal' as const,
    quick_action_items: [
      {
        _uid: 'item-1',
        component: 'quick_action_item' as const,
        title: 'Storyblok Test Item 1',
        description: 'Dit is een test item uit Storyblok CMS.',
        link: { url: '/test-1' },
      },
      {
        _uid: 'item-2', 
        component: 'quick_action_item' as const,
        title: 'Storyblok Test Item 2',
        description: 'Nog een test item om de functionaliteit te controleren.',
        link: { url: '/test-2' },
      },
      {
        _uid: 'item-3',
        component: 'quick_action_item' as const,
        title: 'Storyblok Test Item 3',
        description: 'Derde test item voor de volledige demo.',
        link: { url: '/test-3' },
      },
    ],
    cta_section: [
      {
        _uid: 'cta-1',
        component: 'cta_button' as const,
        text: 'Bekijk alles',
        link: { url: '/all-tests' },
      },
    ],
  };

  return (
    <Container>
      <div className="py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Typography type="h1" size="h1" weight="bold">
              Storyblok Integration Test
            </Typography>
            <Typography type="p" size="default" color="gray">
              Deze pagina test de Storyblok component integratie.
            </Typography>
          </div>

          {/* Connection Status */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <Typography type="h3" size="default" weight="bold" className="mb-3">
              📡 Connectie Status
            </Typography>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <Typography type="p" size="default">
                  Storyblok SDK geïnstalleerd
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <Typography type="p" size="default">
                  Component mapping geconfigureerd
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <Typography type="p" size="default">
                  Environment variabelen: {process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN ? '✅ Geconfigureerd' : '❌ Ontbreekt'}
                </Typography>
              </div>
            </div>
          </div>

          {/* Test Component */}
          <div className="space-y-4">
            <Typography type="h2" size="h2" weight="bold">
              🧪 Component Test
            </Typography>
            <Typography type="p" size="default" color="gray">
              Deze Quick Actions component wordt gerenderd met mock Storyblok data:
            </Typography>
            
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <StoryblokQuickActions blok={mockStoryblokData} />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <Typography type="h3" size="default" weight="bold" className="mb-3">
              🔧 Volgende Stappen
            </Typography>
            <ol className="space-y-2 text-sm">
              <li>1. Voeg environment variabelen toe aan <code>.env.local</code></li>
              <li>2. Maak component schemas in Storyblok CMS</li>
              <li>3. Test de visual editor op <code>/storyblok/test-story</code></li>
              <li>4. Configureer webhooks voor cache invalidation</li>
            </ol>
          </div>

          {/* Environment Guide */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography type="h3" size="default" weight="bold" className="mb-3">
              📝 Environment Variabelen
            </Typography>
            <Typography type="p" size="default" className="mb-3">
              Maak een <code>.env.local</code> bestand in de frontend directory:
            </Typography>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Storyblok Configuration
STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_public_token_here
STORYBLOK_SPACE_ID=your_space_id_here

# Optional: Management API
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here`}
            </pre>
          </div>
        </div>
      </div>
    </Container>
  );
}
