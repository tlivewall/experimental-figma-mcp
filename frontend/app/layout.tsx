import './[locale]/globals.css';

export default async function RootLayout({ children, params: asyncParams }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const params = await asyncParams;
  return (
    <html lang={params.locale ?? 'nl'}>
      <body>{children}</body>
    </html>
  );
}
