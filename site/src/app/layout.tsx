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

/** Records the last input type on <html data-input> so global.css can hide focus rings after pointer presses. */
const inputModalityScript = `(()=>{const r=document.documentElement,s=v=>()=>{r.dataset.input=v};addEventListener('pointerdown',s('pointer'),true);addEventListener('keydown',e=>{if(!e.metaKey&&!e.ctrlKey&&!e.altKey)s('keyboard')()},true)})()`;

/** Ask AI needs the /api/ask server route: off in a static export and when no OpenAI key is set. */
const askAiEnabled = process.env.STATIC_EXPORT !== '1' && Boolean(process.env.OPENAI_API_KEY);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <script dangerouslySetInnerHTML={{ __html: inputModalityScript }} />
      </head>
      <body>
        <AskAiProvider enabled={askAiEnabled}>
          <Providers>{children}</Providers>
        </AskAiProvider>
      </body>
    </html>
  );
}
