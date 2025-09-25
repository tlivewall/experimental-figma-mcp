import type { NextPage } from 'next';
import Container from '@components/ui/container/container.component';
import { Typography } from '@components/ui';
import { QuickActions } from '@components/sections';
import { QuickActionItem } from 'types/figma/quick-actions.types';

type Props = {
  params: Promise<{ locale: string }>;
};

// Sample data for demonstrations
const threeItems: QuickActionItem[] = [
  {
    title: 'Alle VISdocumenten',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/documents'
  },
  {
    title: 'Viswateren',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/waters'
  },
  {
    title: 'Jaarverslagen',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/reports'
  }
];

const sixItems: QuickActionItem[] = [
  ...threeItems,
  {
    title: 'Verenigingsondersteuning',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/support'
  },
  {
    title: 'Wedstrijden &amp; events',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/events'
  },
  {
    title: 'Vissoorten',
    description: 'Egestas pellentesque ac malesuada consectetur feugiat eu rutrum.',
    href: '/species'
  }
];

const ComponentPlayground: NextPage<Props> = async () => {
  await new Promise(resolve => setTimeout(resolve, 0)); // Await the params promise

  return (
    <Container>
      <div className="py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Typography type="h1" size="h1" weight="bold">
              Quick Actions Component Playground
            </Typography>
            <Typography type="p" size="default" color="gray">
              Showcase van alle variaties gebaseerd op Figma designs met correcte custom Tailwind spacing.
            </Typography>
          </div>

          {/* Layout Variants Section */}
          <div className="space-y-8">
            <div className="border-t border-gray-200 pt-8">
              <Typography type="h2" size="h2" weight="bold" className="mb-3">
                Layout Variaties
              </Typography>
              <Typography type="p" size="default" color="gray" className="mb-6">
                Verschillende card layouts: horizontal (icon naast tekst) vs vertical (icon boven tekst).
              </Typography>
            </div>

            {/* Horizontal Layout (Default) */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Horizontal Layout (Default)
              </Typography>
              <QuickActions
                title="Icon naast tekst - compact design"
                items={threeItems}
                layout="horizontal"
                variant="horizontal"
              />
            </div>

            {/* Vertical Layout */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Vertical Layout (Card Style)
              </Typography>
              <QuickActions
                title="Icon boven tekst - showcase design"
                items={threeItems}
                layout="vertical"
                variant="horizontal"
              />
            </div>
          </div>

          {/* Grid Variants Section */}
          <div className="space-y-8">
            <div className="border-t border-gray-200 pt-8">
              <Typography type="h2" size="h2" weight="bold" className="mb-3">
                Grid Variaties
              </Typography>
              <Typography type="p" size="default" color="gray" className="mb-6">
                Flex-wrap vs CSS Grid layouts voor verschillende aantallen items.
              </Typography>
            </div>

            {/* Horizontal Grid (Flex-wrap) */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Horizontal Grid (≤3 items)
              </Typography>
              <QuickActions
                title="Flex-wrap layout voor 3 items"
                items={threeItems}
                variant="horizontal"
                layout="horizontal"
              />
            </div>

            {/* CSS Grid Layout */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                CSS Grid Layout (&gt;3 items)
              </Typography>
              <QuickActions
                title="3×2 grid voor 6 items"
                items={sixItems}
                variant="grid"
                layout="horizontal"
              />
            </div>

            {/* CSS Grid with Vertical Cards */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Grid + Vertical Cards
              </Typography>
              <QuickActions
                title="Grid layout met vertical card style"
                items={sixItems}
                variant="grid"
                layout="vertical"
              />
            </div>
          </div>

          {/* Auto-Detection Section */}
          <div className="space-y-8">
            <div className="border-t border-gray-200 pt-8">
              <Typography type="h2" size="h2" weight="bold" className="mb-3">
                Auto-Detection
              </Typography>
              <Typography type="p" size="default" color="gray" className="mb-6">
                Automatische detectie van optimale layout gebaseerd op aantal items.
              </Typography>
            </div>

            {/* Auto: 3 Items */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Auto-Detection: 3 Items &rarr; Horizontal
              </Typography>
              <QuickActions
                title="Automatisch gedetecteerde layout"
                items={threeItems}
                variant="auto"
                layout="horizontal"
              />
            </div>

            {/* Auto: 6 Items */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Auto-Detection: 6 Items &rarr; Grid
              </Typography>
              <QuickActions
                title="Automatisch gedetecteerde layout"
                items={sixItems}
                variant="auto"
                layout="horizontal"
              />
            </div>
          </div>

          {/* CTA Examples Section */}
          <div className="space-y-8">
            <div className="border-t border-gray-200 pt-8">
              <Typography type="h2" size="h2" weight="bold" className="mb-3">
                Met Call-to-Action
              </Typography>
              <Typography type="p" size="default" color="gray" className="mb-6">
                Voorbeelden met optionele CTA button in Figma stijl.
              </Typography>
            </div>

            {/* With CTA */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Horizontal Layout + CTA
              </Typography>
              <QuickActions
                title="Snel naar"
                items={threeItems}
                variant="horizontal"
                layout="horizontal"
                ctaText="Bekijk meer"
                ctaHref="/all-actions"
              />
            </div>

            {/* Grid with CTA */}
            <div>
              <Typography type="h3" size="default" weight="bold" className="mb-3">
                Grid Layout + CTA
              </Typography>
              <QuickActions
                title="Alle categorieën"
                items={sixItems}
                variant="grid"
                layout="vertical"
                ctaText="Alle acties"
                ctaHref="/all-categories"
              />
            </div>
          </div>

          {/* Technical Info Section */}
          <div className="border-t border-gray-200 pt-8">
            <Typography type="h2" size="h2" weight="bold" className="mb-3">
              Technische Features
            </Typography>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <Typography type="h4" size="default" weight="bold" className="mb-3">
                  🎨 Design Features
                </Typography>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pixel-perfect Figma to code conversie</li>
                  <li>• Custom Tailwind spacing scale (24px = w-3)</li>
                  <li>• Responsive icons (32px mobile, 48px/64px desktop)</li>
                  <li>• Hover states en smooth transitions</li>
                  <li>• Typography system met Inter Tight font</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <Typography type="h4" size="default" weight="bold" className="mb-3">
                  ⚡ Technical Features
                </Typography>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• TypeScript types voor alle props</li>
                  <li>• Auto-detection van optimale layouts</li>
                  <li>• Mobile-first responsive design</li>
                  <li>• Semantic HTML met accessibility</li>
                  <li>• Performance optimized rendering</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Props Documentation */}
          <div className="border-t border-gray-200 pt-8">
            <Typography type="h2" size="h2" weight="bold" className="mb-3">
              Component Props
            </Typography>
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`interface QuickActionsProps {
  title: string;                    // Section title
  items: QuickActionItem[];         // Array of action items
  ctaText?: string;                 // Optional CTA button text
  ctaHref?: string;                 // Optional CTA button URL
  variant?: 'horizontal' | 'grid' | 'auto';  // Grid layout
  layout?: 'horizontal' | 'vertical';        // Card style
  view?: 'desktop' | 'mobile' | 'auto';      // Responsive mode
}

interface QuickActionItem {
  title: string;       // Action title
  description: string; // Action description  
  href: string;        // Link URL
  icon?: string;       // Optional icon
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ComponentPlayground;