import Link from 'next/link';
import type { ReactNode } from 'react';
import { catalogue } from '@/lib/catalogue';
import { storybookStoryUrl } from '../../../site.config';
import { IconSearch } from './IconSearch';
import { PresetGrid } from './PresetGrid';

export function Cards({ children }: { children: ReactNode }) {
  return <div className='not-prose my-6 grid gap-3 sm:grid-cols-2'>{children}</div>;
}

export function Card({ title, href, children }: { title: string; href: string; children?: ReactNode }) {
  const external = /^https?:/.test(href);
  const body = (
    <>
      <span className='font-medium'>{title}{external ? ' ↗' : ''}</span>
      {children ? <span className='text-sm text-text-muted'>{children}</span> : null}
    </>
  );
  return external
    ? <a className='site-card' href={href} target='_blank' rel='noreferrer'>{body}</a>
    : <Link className='site-card' href={href}>{body}</Link>;
}

const FAMILIES = ['accent', 'success', 'warning', 'danger', 'info', 'discovery', 'attention'];

/** Live swatches: every chip reads the current theme's CSS variable, so presets and modes apply. */
export function ColorTokens() {
  const { semanticUtilities } = catalogue.tokens.colors;
  const surfaces = ['surface', 'surface-muted', 'surface-raised', 'text', 'text-muted', 'text-subtle', 'border', 'border-muted', 'focus'];
  const charts = Array.from({ length: 8 }, (_, index) => `chart-${index + 1}`);
  const swatch = (token: string) => (
    <li key={token} className='flex min-w-0 items-center gap-2'>
      <span aria-hidden className='size-8 shrink-0 rounded-(--ds-radius-control) border border-border' style={{ background: `var(--ds-color-${token})` }} />
      <code className='truncate text-xs'>--ds-color-{token}</code>
    </li>
  );
  return (
    <div className='not-prose my-6 flex flex-col gap-6' data-docs-example>
      <section>
        <h3 className='mb-2 text-sm font-semibold'>Surfaces, text and borders</h3>
        <ul className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>{surfaces.map(swatch)}</ul>
      </section>
      <section>
        <h3 className='mb-2 text-sm font-semibold'>Accent and status families</h3>
        <div className='flex flex-col gap-2'>
          {FAMILIES.map((family) => (
            <div key={family} className='flex flex-wrap items-center gap-2'>
              <span className='w-20 shrink-0 text-xs font-medium'>{family}</span>
              <ul className='flex flex-wrap gap-1'>
                {[family, `${family}-foreground`, `${family}-muted`, `${family}-subtle`].filter((token) => semanticUtilities.includes(token) || token === family).map((token) => (
                  <li key={token} title={`--ds-color-${token}`}>
                    <span className='sr-only'>--ds-color-{token}</span>
                    <span aria-hidden className='block h-8 w-12 rounded-(--ds-radius-sm) border border-border' style={{ background: `var(--ds-color-${token})` }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className='mb-2 text-sm font-semibold'>Charts (categorical)</h3>
        <ul className='grid grid-cols-4 gap-2 sm:grid-cols-8'>
          {charts.map((token) => (
            <li key={token} className='flex flex-col items-center gap-1'>
              <span aria-hidden className='h-10 w-full rounded-(--ds-radius-sm)' style={{ background: `var(--ds-color-${token})` }} />
              <code className='text-xs'>{token}</code>
            </li>
          ))}
        </ul>
      </section>
      <p className='text-sm text-text-muted'>{catalogue.tokens.colors.usage}</p>
    </div>
  );
}

export function TypeScale() {
  const { fontFamily, lineHeight } = catalogue.tokens.typography;
  return (
    <div className='not-prose my-6 flex flex-col gap-4' data-docs-example>
      <div className='flex flex-col gap-3 rounded-(--ds-radius-card) border border-border p-4'>
        <p className='text-4xl font-extrabold leading-tight'>Display heading</p>
        <p className='text-2xl font-bold'>Section heading</p>
        <p className='text-lg font-semibold'>Sub-section heading</p>
        <p className='text-base'>Body copy uses the sans stack at 1rem with a {lineHeight.body} line height; long-form prose uses {lineHeight.prose}.</p>
        <p className='text-sm text-text-muted'>Supporting text and descriptions use the muted text token.</p>
        <p className='font-mono text-sm'>const mono = &apos;JetBrains Mono&apos;;</p>
      </div>
      <table>
        <thead><tr><th>Family</th><th>Stack</th></tr></thead>
        <tbody>
          {Object.entries(fontFamily).map(([name, stack]) => (
            <tr key={name}><td><code>{name}</code></td><td><code>{stack.join(', ')}</code></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MotionTokens() {
  const { duration, ease } = catalogue.tokens.motion;
  return (
    <table>
      <thead><tr><th>Token</th><th>Value</th></tr></thead>
      <tbody>
        {Object.entries(duration).map(([name, value]) => <tr key={name}><td><code>duration.{name}</code></td><td><code>{value}</code></td></tr>)}
        {Object.entries(ease).map(([name, value]) => <tr key={name}><td><code>ease.{name}</code></td><td><code>{value}</code></td></tr>)}
      </tbody>
    </table>
  );
}

export function RadiusAndDensity() {
  const { spacing, radius } = catalogue.tokens;
  return (
    <div className='not-prose my-6 grid gap-4 md:grid-cols-2' data-docs-example>
      <div className='rounded-(--ds-radius-card) border border-border p-4'>
        <p className='font-medium'>Corner radius</p>
        <p className='mt-1 text-sm text-text-muted'>{radius.usage}</p>
        <div className='mt-3 flex gap-3'>
          {['0px', '4px', '8px'].map((value) => (
            <span key={value} className='grid size-14 place-items-center border border-border bg-surface-muted text-xs' style={{ borderRadius: value }}>{value}</span>
          ))}
        </div>
      </div>
      <div className='rounded-(--ds-radius-card) border border-border p-4'>
        <p className='font-medium'>Density (<code>{spacing.variable}</code>)</p>
        <p className='mt-1 text-sm text-text-muted'>{spacing.usage}</p>
        <ul className='mt-3 flex flex-wrap gap-2 text-xs'>
          {Object.entries(spacing.scales).map(([name, value]) => (
            <li key={name} className='rounded-(--ds-radius-sm) border border-border px-2 py-1'><code>{name}</code> {value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function IconGallery() {
  return <IconSearch names={(catalogue as unknown as { icons: string[] }).icons || []} />;
}

export function PresetGallery() {
  return <PresetGrid />;
}

export function StorybookCard({ story, title, children }: { story: string; title: string; children?: ReactNode }) {
  return <Card title={title} href={storybookStoryUrl(story)}>{children}</Card>;
}
