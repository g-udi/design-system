/* eslint-disable @next/next/no-img-element -- ImageResponse (satori) renders plain <img>, not next/image. */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { catalogue } from '@/lib/catalogue';
import type { DocsPage } from '@/lib/source';
import { source } from '@/lib/source';

/** Shared social-preview (Open Graph / Twitter) card for the site and every docs page. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const svgDataUri = async (file: string) => {
  const svg = await readFile(path.join(process.cwd(), 'public/brand', file), 'utf8');
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Brand assets do not depend on the request: read them once.
const [iconSrc, wordmarkSrc] = await Promise.all([svgDataUri('gaudi-icon-dark.svg'), svgDataUri('gaudi-wordmark-dark.svg')]);

const ink = '#18191b';
const muted = '#5b5e66';
const faint = '#e7e7ea';

const clamp = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** The page's section (top-level folder title) plus, for generated pages, the catalogue category. */
export function pageEyebrow(page: DocsPage): string {
  const top = page.slugs[0];
  if (!top) return 'Documentation';
  const folder = source.pageTree.children.find(
    (node) => node.type === 'folder' && (node.index?.url === `/docs/${top}` || node.children.some((child) => 'url' in child && child.url.startsWith(`/docs/${top}/`)))
  );
  const section = folder && typeof folder.name === 'string' ? folder.name : null;
  const entry = page.data.component ? catalogue.components.find((item) => item.id === page.data.component) : undefined;
  const category = entry ? catalogue.categories.find((item) => item.key === entry.category)?.label : undefined;
  const parts = [section ?? (entry ? null : 'Documentation'), category && !section?.toLowerCase().includes(category.toLowerCase()) ? category : null, entry?.group ?? null].filter(Boolean);
  return parts.length ? parts.join('  /  ') : 'Documentation';
}

export function ogImage({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string | null }) {
  const heading = clamp(title, 60);
  const titleSize = heading.length > 36 ? 64 : heading.length > 20 ? 80 : 96;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', color: ink, padding: '64px 72px', position: 'relative' }}>
        {/* Oversized, faint G as a background motif. */}
        <svg width='520' height='520' viewBox='0 0 312 300' style={{ position: 'absolute', right: -110, bottom: -120 }}>
          <path fill='#f5f5f7' d='M0 0H228L294 66H66V234H246V188H194L132 122H312V300H66L0 234Z' />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <img src={iconSrc} width={72} height={72} alt='' />
          <img src={wordmarkSrc} width={159} height={40} alt='' />
          <div style={{ display: 'flex', marginLeft: 'auto', fontSize: 24, color: muted, letterSpacing: 2, textTransform: 'uppercase' }}>Design System</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', maxWidth: 980 }}>
          <div style={{ display: 'flex', fontSize: 26, color: muted, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>{clamp(eyebrow, 70)}</div>
          <div style={{ display: 'flex', fontSize: titleSize, lineHeight: 1.05, letterSpacing: -2, color: ink }}>{heading}</div>
          {description ? (
            <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.4, color: muted, marginTop: 28, maxWidth: 940 }}>{clamp(description, 150)}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 48, paddingTop: 24, borderTop: `2px solid ${faint}`, fontSize: 22, color: muted }}>
          <div style={{ display: 'flex' }}>{catalogue.package}</div>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>{`v${catalogue.version}`}</div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
