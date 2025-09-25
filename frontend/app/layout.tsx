import './[locale]/globals.css';
import { StoryblokProvider } from '../components/storyblok/StoryblokProvider';

export default async function RootLayout({ children, params: asyncParams }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const params = await asyncParams;
  return (
    <html lang={params.locale ?? 'nl'}>
      <body>
        <StoryblokProvider>
          {children}
        </StoryblokProvider>
      </body>
    </html>
  );
}
