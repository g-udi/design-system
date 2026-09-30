import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { Grid, GridItem } from './Grid';

const docs = getComponentDocs('Core/Grid');
const items = [
  { title: 'Tokens', description: 'Color, type, spacing, and shape definitions.' },
  { title: 'Components', description: 'Reusable Core elements for blog and content surfaces.' },
  { title: 'Storybook', description: 'Interactive documentation for every public export.' }
];
const itemSource = items.map((item) => `  <GridItem title='${item.title}' description='${item.description}' />`).join('\n');

export default {
  title: 'Core/Grid',
  id: 'core-grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { columns: ['2', '3', '4'], gap: ['sm', 'md', 'lg'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { columns: '3', gap: 'md' },
  parameters: {
    docs: {
      source: playgroundSource('Grid', { imports: "import { Grid, GridItem } from '@gaudi/design-system';", children: itemSource })
    }
  },
  render: (args) => (
    <Grid {...args}>
      {items.map((item) => <GridItem key={item.title} {...item} />)}
    </Grid>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvasElement.querySelector('.grid');
    await expect(grid.children).toHaveLength(items.length);
    await expect(grid).toHaveClass('grid-cols-1', args.columns === '4' ? 'lg:grid-cols-4' : `md:grid-cols-${args.columns}`);
    for (const item of items) await expect(canvas.getByText(item.description)).toBeVisible();
  }
};

const variants = ['elevated', 'outline', 'soft'];
export const ItemVariants = {
  parameters: { docs: { description: { story: '`GridItem` takes an `elevated`, `outline`, or `soft` surface.' } } },
  render: () => (
    <Grid columns='3'>
      {variants.map((variant) => <GridItem key={variant} variant={variant} title={variant} description={`The ${variant} surface.`} />)}
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const [elevated, outline, soft] = canvasElement.querySelector('.grid').children;
    await expect(elevated).toHaveClass('bg-white', 'shadow-sm');
    await expect(outline).toHaveClass('bg-white');
    await expect(outline).not.toHaveClass('shadow-sm');
    await expect(soft).toHaveClass('bg-gray-50');
  }
};
