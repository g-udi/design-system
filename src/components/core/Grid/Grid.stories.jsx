import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { previewSource } from '../../../../.storybook/stories/previewSource';
import Icon from '../Icon';
import { Grid, GridItem, gridItemVariants } from './Grid';
import { lagoon, meadow } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('Core/Grid');
// A product overview: every card carries an icon, and the first two lead with header media.
const items = [
  { title: 'Tokens', description: 'Color, type, spacing, and shape definitions.', icon: 'Palette', media: lagoon },
  { title: 'Components', description: 'Reusable Core elements for blog and content surfaces.', icon: 'LayoutGrid', media: meadow },
  { title: 'Storybook', description: 'Interactive documentation for every public export.', icon: 'BookOpen' },
  { title: 'Accessibility', description: 'Keyboard, focus, and screen reader contracts.', icon: 'Accessibility' },
  { title: 'Motion', description: 'Animated icons that respect reduced motion.', icon: 'Sparkles' },
  { title: 'Theming', description: 'Light and dark palettes from one token set.', icon: 'Moon' }
];
const cardIcon = (name) => <span className='inline-flex rounded-md bg-surface-muted p-2'><Icon name={name} decorative size='sm' color='primary' /></span>;
const cardMedia = (media) => <img src={media} alt='' className='h-16 w-full rounded-md object-cover' />;
// Grid props print on the Grid; item props print on each GridItem so the snippet stays copyable.
const gridSource = ({ columns, gap, variant, padding, radius }) => previewSource('Grid', { columns, gap }, {
  imports: "import { Grid, GridItem, Icon } from '@gaudi/design-system';",
  children: [
    ['Palette', 'Tokens', 'Color, type, spacing, and shape definitions.'],
    ['BookOpen', 'Storybook', 'Interactive documentation for every public export.']
  ].map(([icon, title, description]) => `  <GridItem variant='${variant}' padding='${padding}' radius='${radius}' icon={<Icon name='${icon}' decorative />} title='${title}' description='${description}' />`).join('\n')
});

export default {
  title: 'Core/Grid',
  id: 'core-grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    columns: ['2', '3', '4'],
    gap: ['sm', 'md', 'lg'],
    variant: ['elevated', 'outline', 'soft'],
    padding: ['sm', 'md', 'lg'],
    radius: ['sm', 'md', 'lg']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { columns: '3', gap: 'md', variant: 'elevated', padding: 'md', radius: 'lg' },
  parameters: {
    docs: {
      description: { story: 'A product overview: six cards with icons, two with header media. `columns` and `gap` shape the grid; `variant` and `padding` restyle every `GridItem`.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => gridSource(args) }
    }
  },
  render: ({ columns, gap, ...item }) => (
    <Grid columns={columns} gap={gap}>
      {items.map(({ icon, media, ...card }) => (
        <GridItem key={card.title} {...item} {...card} icon={cardIcon(icon)} header={media ? cardMedia(media) : undefined} />
      ))}
    </Grid>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvasElement.querySelector('.grid');
    const gaps = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' };
    await expect(grid.children).toHaveLength(items.length);
    await expect(grid).toHaveClass('grid-cols-1', gaps[args.gap], args.columns === '4' ? 'lg:grid-cols-4' : `md:grid-cols-${args.columns}`);
    const surface = gridItemVariants({ variant: args.variant, padding: args.padding, radius: args.radius }).split(' ');
    for (const card of grid.children) await expect(card).toHaveClass(...surface);
    for (const item of items) await expect(canvas.getByText(item.description)).toBeVisible();
  }
};
