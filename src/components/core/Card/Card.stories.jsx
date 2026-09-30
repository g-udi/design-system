import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import { RegistryIcon } from '../../../icons/RegistryIcon';
import Avatar from '../Avatar';
import Card, { cardVariants } from './Card';

const docs = getComponentDocs('Core/Card');
const variants = ['elevated', 'outline', 'soft', 'flat'];
const paddings = ['none', 'sm', 'md', 'lg'];
const subtitle = 'Reusable content frame with a title, description, and optional actions.';
const heading = (canvas, name, level = 3) => canvas.getByRole('heading', { level, name });
const Grid = ({ children }) => <div className='grid gap-3 sm:grid-cols-2'>{children}</div>;

// A dashboard pair: the article card takes the text controls; both cards share the surface, padding and radius.
const author = { name: 'Maya Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg' };
const metric = { title: 'Weekly readers', value: '12.4k', trend: '+18% on last week', progress: 72, goal: '72% of the 17k goal' };
const cardRoot = (canvas, name) => heading(canvas, name).closest('[class*="border"]');
const articleChildren = [
  "  <div className='mt-3 flex items-center gap-2 text-xs text-ui-muted-foreground'>",
  "    <Avatar name='Maya Chen' src='https://randomuser.me/api/portraits/women/44.jpg' size='sm' shape='circle' />",
  '    <span>Maya Chen · 6 min read</span>',
  '  </div>',
  "  <div className='mt-3 flex items-center gap-2'>",
  "    <Button href='/blog' size='sm'>Read article</Button>",
  "    <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Save for later'>",
  "      <RegistryIcon lucide='BookmarkIcon' aria-hidden='true' />",
  '    </Button>',
  '  </div>'
].join('\n');

export default {
  title: 'Core/Layout & Containers/Card',
  id: 'core-card',
  component: Card,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    subtitle: 'text',
    variant: variants,
    padding: paddings,
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
  args: { title: 'Building with tokens', subtitle: 'How one set of design tokens keeps the blog, docs, and product in step.', variant: 'elevated', padding: 'md', radius: 'lg' },
  parameters: {
    docs: {
      description: { story: 'An article card with an author, reading time, and actions beside a metric card with a goal bar. Title and subtitle drive the article; variant and padding apply to both cards.' },
      source: playgroundSource('Card', {
        imports: "import { Avatar, Button, Card } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        children: articleChildren
      })
    }
  },
  render: ({ title, subtitle, ...surface }) => (
    <Grid>
      <Card {...surface} title={title} subtitle={subtitle}>
        <div className='mt-3 flex items-center gap-2 text-xs text-ui-muted-foreground'>
          <Avatar {...author} size='sm' shape='circle' />
          <span>{author.name} · 6 min read</span>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <Button href='/blog' size='sm'>Read article</Button>
          <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Save for later'>
            <RegistryIcon lucide='BookmarkIcon' aria-hidden='true' />
          </Button>
        </div>
      </Card>
      <Card {...surface} title={metric.title}>
        <p className='mt-2 text-3xl font-bold tabular-nums text-ui-foreground'>{metric.value}</p>
        <p className='mt-1 text-sm font-medium text-green-700 dark:text-green-400'>{metric.trend}</p>
        <div className='mt-3 h-2 overflow-hidden rounded-control bg-ui-border' role='img' aria-label={metric.goal}>
          <div className='h-full rounded-control bg-accent' style={{ width: `${metric.progress}%` }} />
        </div>
        <p className='mt-2 text-xs text-ui-muted-foreground'>{metric.goal}</p>
      </Card>
    </Grid>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const { variant, padding, radius } = args;
    const surface = cardVariants({ variant, padding, radius }).split(' ');
    await expect(canvas.getByText(args.subtitle)).toBeVisible();
    await expect(cardRoot(canvas, args.title)).toHaveClass(...surface);
    await expect(cardRoot(canvas, metric.title)).toHaveClass(...surface);
    await expect(new URL(canvas.getByRole('link', { name: 'Read article' }).href).pathname).toBe('/blog');
    await expect(canvas.getByRole('img', { name: metric.goal })).toBeVisible();
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

export const Interactive = {
  parameters: { docs: { description: { story: '`interactive` adds hover elevation as a visual hint only; the action inside stays a real link.' } } },
  render: () => (
    <Card interactive title='Interactive card' subtitle={subtitle}>
      <Button href='/blog' size='sm' className='mt-4'>Open article</Button>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = heading(canvas, 'Interactive card').parentElement.parentElement;
    const link = canvas.getByRole('link', { name: 'Open article' });
    await expect(card).toHaveClass('hover:shadow-md');
    await expect(card).toContainElement(link);
    await expect(new URL(link.href).pathname).toBe('/blog');
  }
};
