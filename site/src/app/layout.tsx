import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getThemeScript } from '@gaudi/design-system/themes';
import { AskAiProvider } from '@/components/site/ask-ai-context';
import { siteUrl } from '@/lib/site-url';
import { siteConfig } from '../../site.config';
import { Providers } from './providers';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: siteConfig.product, type: 'website', title: siteConfig.product, description: siteConfig.description },
  twitter: { card: 'summary_large_image' },
  title: { default: siteConfig.product, template: `%s | ${siteConfig.product}` },
  description: siteConfig.description
};

/** Ask AI needs the /api/ask server route: off in a static export and when no OpenAI key is set. */
const askAiEnabled = process.env.STATIC_EXPORT !== '1' && Boolean(process.env.OPENAI_API_KEY);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body>
        <AskAiProvider enabled={askAiEnabled}>
          <Providers>{children}</Providers>
        </AskAiProvider>
      </body>
    </html>
  );
}
