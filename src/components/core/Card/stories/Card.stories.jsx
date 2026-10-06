import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Button from '../../Button';
import { RegistryIcon } from '../../../../icons/RegistryIcon';
import Avatar from '../../Avatar';
import Card, { cardVariants } from '../Card';
import { CardTitle, CardDescription } from '../CardPrimitives.jsx';
import { ProgressRoot } from '../../Progress';
import Icon from '../../Icon';
import { lagoon, meadow } from '../../../../docs/fixtures/site/artwork';

const docs = getComponentDocs('Core/Card');
const variants = ['elevated', 'outline', 'soft', 'flat'];
const paddings = ['none', 'sm', 'md', 'lg'];
const subtitle = 'Reusable content frame with a title, description, and optional actions.';
const heading = (canvas, name, level = 3) => canvas.getByRole('heading', { level, name });
const Grid = ({ children }) => <div className='grid gap-3 sm:grid-cols-2'>{children}</div>;

// A dashboard pair: the article card takes the text controls; both cards share the surface, padding and radius.
const author = { name: 'Mei Castellanos', src: '/avatars/person-20.svg' };
const metric = { title: 'Weekly readers', value: '12.4k', trend: '+18% on last week', progress: 72, goal: '72% of the 17k goal' };
const cardRoot = (canvas, name) => heading(canvas, name).closest('[class*="border"]');
const articleChildren = [
  "  <div className='mt-3 flex items-center gap-2 text-xs text-ui-muted-foreground'>",
  "    <Avatar name='Mei Castellanos' src='/avatars/person-20.svg' size='sm' shape='circle' />",
  '    <span>Mei Castellanos · 6 min read</span>',
  '  </div>',
  "  <div className='mt-3 flex items-center gap-2'>",
  "    <Button href='/blog' size='sm'>Read article</Button>",
  "    <Button variant='ghost' tone='neutral' size='icon-sm' aria-label={saved ? 'Remove saved article' : 'Save for later'} aria-pressed={saved} onClick={() => setSaved((value) => !value)}>",
  "      <RegistryIcon lucide='BookmarkIcon' aria-hidden='true' />",
  '    </Button>',
  '  </div>'
].join('\n');

export default {
  title: 'Core/Card',
  id: 'core-card',
  component: Card,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    subtitle: 'text',
    variant: variants,
    padding: paddings,
    interactive: 'boolean',
    radius: ['none', 'sm', 'md', 'lg']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { title: 'Building with tokens', subtitle: 'How one set of design tokens keeps the blog, docs, and product in step.', variant: 'elevated', padding: 'md', radius: 'lg', interactive: true },
  parameters: {
    // `interactive` only adds hover elevation, so it changes the preview on pointer hover.
    controlAudit: { interaction: ['interactive'] },
    docs: {
      description: { story: 'An article card with an author, reading time, and actions beside a metric card with a goal bar. Title and subtitle drive the article; the surface controls apply to both cards, and `interactive` adds hover elevation while the actions stay real links and buttons.' },
      source: {
        type: 'dynamic', language: 'jsx',
        transform: (_source, { args }) => previewSource('Card', args, {
          imports: "import { useState } from 'react';\nimport { Avatar, Button, Card } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
          before: 'export function Example() {\n  const [saved, setSaved] = useState(false);\n  return (\n',
          children: articleChildren,
          after: '\n  );\n}'
        })
      }
    }
  },
  render: function Render({ title, subtitle, ...surface }) {
    const [saved, setSaved] = useState(false);
    return (
    <Grid>
      <Card {...surface} title={title} subtitle={subtitle}>
        <div className='mt-3 flex items-center gap-2 text-xs text-ui-muted-foreground'>
          <Avatar {...author} size='sm' shape='circle' />
          <span>{author.name} · 6 min read</span>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <Button href='/blog' size='sm'>Read article</Button>
          <Button variant='ghost' tone='neutral' size='icon-sm' aria-label={saved ? 'Remove saved article' : 'Save for later'} aria-pressed={saved} onClick={() => setSaved((value) => !value)}>
            <RegistryIcon lucide='BookmarkIcon' aria-hidden='true' />
          </Button>
        </div>
      </Card>
      <Card {...surface} title={metric.title}>
        <p className='mt-2 text-3xl font-bold tabular-nums text-ui-foreground'>{metric.value}</p>
        <p className='mt-1 text-sm font-medium text-success'>{metric.trend}</p>
        <ProgressRoot className='mt-3 h-2' value={metric.progress} aria-label={metric.goal} />
        <p className='mt-2 text-xs text-ui-muted-foreground'>{metric.goal}</p>
      </Card>
    </Grid>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const { variant, padding, radius } = args;
    await userEvent.click(canvas.getByRole('button', { name: 'Save for later' }));
    await expect(canvas.getByRole('button', { name: 'Remove saved article' })).toHaveAttribute('aria-pressed', 'true');
    const surface = cardVariants({ variant, padding, radius }).split(' ');
    await expect(canvas.getByText(args.subtitle)).toBeVisible();
    await expect(cardRoot(canvas, args.title)).toHaveClass(...surface);
    await expect(cardRoot(canvas, metric.title)).toHaveClass(...surface);
    await expect(new URL(canvas.getByRole('link', { name: 'Read article' }).href).pathname).toBe('/blog');
    await expect(canvas.getByRole('progressbar', { name: metric.goal })).toBeVisible();
    if (args.interactive) await expect(cardRoot(canvas, args.title)).toHaveClass('hover:shadow-md');
  }
};

export const Variants = {
  parameters: { docs: { description: { story: 'Elevated, outline, soft, and flat surfaces, plus `padding="none"` where the content supplies its own spacing. The Playground steps through the rest of the padding scale.' } } },
  render: () => (
    <Grid>
      {variants.map((variant) => <Card key={variant} title={variant} subtitle={subtitle} variant={variant} />)}
      <Card padding='none' title='none' variant='outline' className='sm:col-span-2' classNames={{ title: 'px-3 pt-3' }}>
        <p className='mt-3 border-t border-ui-border p-3 text-sm text-ui-muted-foreground'>Content supplies its own spacing.</p>
      </Card>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of variants) await expect(heading(canvas, variant)).toBeVisible();
    await expect(canvas.getByText('Content supplies its own spacing.')).toBeVisible();
  }
};


const gridItems = [
  { title: 'Tokens', description: 'Color, type, spacing, and shape definitions.', icon: 'Palette', media: lagoon },
  { title: 'Components', description: 'Reusable Core elements for blog and content surfaces.', icon: 'LayoutGrid', media: meadow },
  { title: 'Storybook', description: 'Interactive documentation for every public export.', icon: 'BookOpen' },
  { title: 'Accessibility', description: 'Keyboard, focus, and screen reader contracts.', icon: 'Accessibility' },
  { title: 'Motion', description: 'Animated icons that respect reduced motion.', icon: 'Sparkles' },
  { title: 'Theming', description: 'Light and dark palettes from one token set.', icon: 'Moon' }
];

export const ResponsiveGrid = {
  name: 'Responsive card grid',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Use CSS grid for the layout and Card for each surface. The cards reflow from one column to two at 640px and three at 1024px; headings, media, and icons compose directly from their existing owners.' },
      source: { code: `import { Card, CardTitle, CardDescription, Icon } from '@gaudi/design-system';

<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
  <Card variant='outline'>
    <Icon name='Palette' decorative />
    <CardTitle as='h3' className='mt-2'>Tokens</CardTitle>
    <CardDescription className='mt-1'>Color, type, spacing, and shape definitions.</CardDescription>
  </Card>
</div>` }
    }
  },
  render: () => (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {gridItems.map(({ title, description, icon, media }) => (
        <Card key={title} variant='outline' classNames={{ body: 'flex h-full flex-col gap-3' }}>
          {media && <img src={media} alt='' className='h-16 w-full rounded-md object-cover' />}
          <div>
            <Icon name={icon} decorative size='sm' />
            <CardTitle as='h3' className='mt-2'>{title}</CardTitle>
            <CardDescription className='mt-1'>{description}</CardDescription>
          </div>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const item of gridItems) {
      await expect(canvas.getByRole('heading', { name: item.title })).toBeVisible();
      await expect(canvas.getByText(item.description)).toBeVisible();
    }
  }
};
