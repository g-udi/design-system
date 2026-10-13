import Link from 'next/link';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlockGroup } from '@gaudi/design-system/core/CodeBlock';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PresetGrid } from '@/components/docs/PresetGrid';
import { catalogue } from '@/lib/catalogue';
import { siteConfig } from '../../site.config';

const count = (category: string) => catalogue.components.filter((entry) => entry.category === category).length;
const examples = Object.keys(catalogue.patterns).length;
const blocks = Object.values(catalogue.patterns).filter((pattern) => pattern.block).length;

const audiences = [
  {
    title: 'Made for reading',
    body: 'Article layouts, a table of contents that follows the reader, post headers, series navigation, citations, code, diagrams and charts for MDX.',
    links: [
      { label: 'Article', href: '/docs/layout/article' },
      { label: 'TableOfContents', href: '/docs/layout/table-of-contents' },
      { label: 'MDX', href: '/docs/mdx' }
    ]
  },
  {
    title: 'Made for working',
    body: 'Application shells, data grids, boards, calendars, command palettes and forms with keyboard support, controlled state and responsive layouts.',
    links: [
      { label: 'App Shell', href: '/docs/blocks/app-shell' },
      { label: 'DataTable', href: '/docs/components/data-table' },
      { label: 'Blocks', href: '/docs/blocks' }
    ]
  },
  {
    title: 'Made for agents',
    body: 'Chat messages, reasoning, tools, sources and voice parts, plus llms.txt, an agent skill and an MCP server generated from the same sources.',
    links: [
      { label: 'Chat & Agents', href: '/docs/chat' },
      { label: 'AI & MCP', href: '/docs/ai' }
    ]
  }
];

const features = [
  { title: 'Themes', href: '/themes', body: `${catalogue.presets.length} WCAG AA presets, light/dark/system, and import from StyleGlide, tweakcn or shadcn.` },
  { title: 'AI & MCP', href: '/docs/ai', body: 'llms.txt, an agent skill installer and a local MCP server, generated from the same sources as the components.' },
  { title: 'Registry', href: '/docs/ai/registry', body: `${examples} copy-in patterns and blocks for the shadcn CLI that keep components as package imports.` },
  { title: 'Accessibility', href: '/docs/foundations/accessibility', body: 'Semantic elements, visible focus, keyboard support, reduced motion and named regions in every owner.' },
  { title: 'RTL', href: '/docs/foundations/accessibility#right-to-left', body: 'Logical properties and a DirectionProvider; every preview here has an RTL toggle.' },
  { title: 'Responsive', href: '/docs/blocks', body: 'Built for narrow containers: preview each example at phone, tablet and desktop widths.' }
];

const sections = [
  { title: 'Components', href: '/docs/components', meta: `${count('core')} owners` },
  { title: 'Blocks', href: '/docs/blocks', meta: `${count('blocks')} families · ${blocks} blocks` },
  { title: 'Chat & Agents', href: '/docs/chat', meta: `${count('chat')} owners` },
  { title: 'Charts', href: '/docs/charts', meta: `${count('charts')} charts` },
  { title: 'Hooks', href: '/docs/hooks', meta: `${count('hooks')} hooks` },
  { title: 'MDX, Post & Layout', href: '/docs/mdx', meta: `${count('mdx') + count('post') + count('layout')} owners` }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id='main'>
        <div className='mx-auto max-w-[90rem] px-4 pt-14 pb-8 sm:px-6 lg:pt-20'>
        <section className='grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' aria-labelledby='hero-title'>
          <div className='flex flex-col items-start gap-6'>
          <span className='rounded-(--ds-radius-pill) border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted'>
            v{catalogue.version} · {catalogue.components.length} documented owners · {examples} live examples
          </span>
          <h1 id='hero-title' className='max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
            {siteConfig.product}
          </h1>
          <p className='max-w-2xl text-lg text-text-muted text-pretty'>{siteConfig.description}</p>
          <div className='flex flex-wrap gap-3'>
            <Button href='/docs/getting-started' size='lg'>Get started</Button>
            <Button href='/docs/components' size='lg' variant='outline' tone='neutral'>Browse components</Button>
            <Button href={siteConfig.github} size='lg' variant='ghost' tone='neutral' target='_blank' rel='noreferrer'>GitHub</Button>
          </div>
          </div>
          <div className='flex min-w-0 flex-col gap-3'>
          <CodeBlockGroup
            label='Quick start'
            items={[
              { title: 'Install', language: 'bash', code: `pnpm add ${siteConfig.installSpec}` },
              { title: 'next.config.mjs', language: 'js', code: `export default {\n  transpilePackages: ['${siteConfig.packageName}']\n};` },
              { title: 'app/page.jsx', language: 'jsx', code: `import { Button } from '${siteConfig.packageName}';\nimport '${siteConfig.packageName}/global.css';\n\nexport default function Page() {\n  return <Button>Read article</Button>;\n}` }
            ]}
          />
            <Link className='text-sm text-accent underline underline-offset-2' href='/docs/getting-started/nextjs'>Set up with Next.js →</Link>
          </div>
        </section>
        </div>

        <div className='mx-auto flex max-w-[90rem] flex-col gap-20 px-4 pt-12 pb-14 sm:px-6 lg:pt-16 lg:pb-20'>

        <section aria-labelledby='audiences-title' className='flex flex-col gap-6'>
          <h2 id='audiences-title' className='text-2xl font-bold'>One system for every kind of page</h2>
          <ul className='grid gap-4 lg:grid-cols-3'>
            {audiences.map((audience) => (
              <li key={audience.title} className='site-card gap-3 p-5'>
                <span className='text-lg font-semibold'>{audience.title}</span>
                <span className='text-sm text-text-muted'>{audience.body}</span>
                <span className='mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm'>
                  {audience.links.map((link) => <Link key={link.href} className='text-accent underline underline-offset-2' href={link.href}>{link.label}</Link>)}
                </span>
              </li>
            ))}
          </ul>
        </section>


        <section aria-labelledby='features-title' className='flex flex-col gap-6'>
          <h2 id='features-title' className='text-2xl font-bold'>What you get</h2>
          <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature) => (
              <li key={feature.title}>
                <Link href={feature.href} className='site-card h-full'>
                  <span className='font-semibold'>{feature.title}</span>
                  <span className='text-sm text-text-muted'>{feature.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='presets-title' className='flex flex-col gap-2'>
          <div className='flex flex-wrap items-end justify-between gap-3'>
            <h2 id='presets-title' className='text-2xl font-bold'>Eight presets, one contract</h2>
            <Link className='text-accent underline underline-offset-2' href='/themes'>Open the themes page →</Link>
          </div>
          <PresetGrid compact />
        </section>

        <section aria-labelledby='explore-title' className='flex flex-col gap-6'>
          <h2 id='explore-title' className='text-2xl font-bold'>Explore the catalogue</h2>
          <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {sections.map((section) => (
              <li key={section.title}>
                <Link href={section.href} className='site-card h-full'>
                  <span className='font-semibold'>{section.title}</span>
                  <span className='text-sm text-text-muted'>{section.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
