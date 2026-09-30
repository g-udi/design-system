import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Icon from '../Icon';
import Link, { linkTones } from './Link';

const docs = getComponentDocs('Core/Link');
const variants = ['inline', 'muted', 'nav', 'bare'];
const toneClass = (tone) => (tone === 'neutral' ? 'text-text' : `text-${tone}`);
const link = (canvasElement, name) => within(canvasElement).getByRole('link', { name });

export default {
  title: 'Core/Link',
  id: 'core-link',
  component: Link,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { children: 'text', href: 'text', variant: variants, tone: [...linkTones] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <div className='flex flex-wrap items-center gap-3'><Story /></div>]
};

// Mirrors the component's own rule, so an external `href` shows its new-tab cue.
const isExternal = (href) => /^(https?:)?\/\//i.test(href || '');

export const Playground = {
  args: { children: 'Read the release notes', href: '/blog/gaudi-2', variant: 'inline', tone: 'accent' },
  // `tone` only colours inline links, so its control appears only for that variant.
  argTypes: { tone: { if: { arg: 'variant', eq: 'inline' } } },
  parameters: {
    docs: {
      description: { story: 'An article card mixing navigation, inline, external, and muted links. The inline link in the paragraph follows the controls; an external `href` adds a new-tab cue.' },
      source: playgroundSource('Link', { imports: "import { Link } from '@gaudi/design-system';" })
    }
  },
  render: ({ children, ...args }) => (
    <article className='grid w-full max-w-md gap-3 rounded-lg border border-border p-4 text-sm'>
      <nav aria-label='Sections' className='flex gap-4'>
        <Link href='/blog' variant='nav' aria-current='page' className='underline decoration-2 underline-offset-8'>Articles</Link>
        <Link href='/projects' variant='nav'>Projects</Link>
        <Link href='/about' variant='nav'>About</Link>
      </nav>
      <p className='m-0 leading-6 text-text-muted'>
        Gaudi 2 ships new tokens, 80 components, and interactive docs.{' '}
        <Link {...args}>
          {children}
          {isExternal(args.href) ? <Icon name='ArrowUpRight' decorative size='xs' className='ms-0.5 inline align-baseline' /> : null}
        </Link>
        , or browse the{' '}
        <Link href='https://github.com/ahmadassaf' tone='discovery' className='whitespace-nowrap'>
          source on GitHub<Icon name='ArrowUpRight' decorative size='xs' className='ms-0.5 inline align-baseline' />
        </Link>.
      </p>
      <p className='m-0 text-xs text-text-muted'>
        Updated 28 Sep 2026 · <Link href='#edit' variant='muted'>Edit this page</Link>
      </p>
    </article>
  ),
  play: async ({ args, canvasElement }) => {
    const element = link(canvasElement, args.children);
    await expect(element).toHaveAttribute('href', args.href);
    await expect(element).toBeVisible();
    if (args.variant === 'inline') await expect(element).toHaveClass(toneClass(args.tone));
    else if (args.tone !== 'neutral') await expect(element).not.toHaveClass(toneClass(args.tone));
    if (isExternal(args.href)) await expect(element).toHaveAttribute('target', '_blank');
    else await expect(element).not.toHaveAttribute('target');
    await expect(link(canvasElement, 'source on GitHub')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link(canvasElement, 'Articles')).toHaveClass('font-semibold');
  }
};

export const LinkTypes = {
  parameters: { docs: { description: { story: 'Internal routes and fragments stay in the tab, external URLs open safely in a new one, and a missing `href` renders plain text.' } } },
  render: () => (
    <>
      <Link href='/blog'>Internal route</Link>
      <Link href='#examples'>Page anchor</Link>
      <Link href='https://github.com/ahmadassaf'>External site</Link>
      <Link>Plain text fallback</Link>
    </>
  ),
  play: async ({ canvasElement }) => {
    await expect(link(canvasElement, 'Internal route')).toHaveAttribute('href', '/blog');
    await expect(link(canvasElement, 'Page anchor')).not.toHaveAttribute('target');
    const external = link(canvasElement, 'External site');
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    const fallback = within(canvasElement).getByText('Plain text fallback');
    await expect(fallback.tagName).toBe('SPAN');
    await expect(within(canvasElement).queryByRole('link', { name: 'Plain text fallback' })).toBeNull();
  }
};

export const Variants = {
  name: 'Variants and tones',
  parameters: { docs: { description: { story: 'Use `inline` in prose, `muted` for secondary links, `nav` in navigation, and `bare` to inherit the parent colour. Only `inline` takes a `tone`, picked by meaning.' } } },
  render: () => (
    <div className='grid gap-2 text-sm'>
      <div className='flex flex-wrap items-center gap-3'>
        {variants.map((variant) => <Link key={variant} href='/blog' variant={variant}>{variant}</Link>)}
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        {linkTones.map((tone) => <Link key={tone} href='/blog' tone={tone}>{tone}</Link>)}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(link(canvasElement, 'muted')).toHaveClass('text-text-muted');
    await expect(link(canvasElement, 'nav')).toHaveClass('font-semibold');
    await expect(link(canvasElement, 'bare')).toHaveClass('text-current');
    for (const tone of linkTones) await expect(link(canvasElement, tone)).toHaveClass(toneClass(tone));
  }
};
