import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Card from './Card';

const docs = getComponentDocs('Core/Card');
const variants = ['elevated', 'outline', 'soft', 'flat'];
const paddings = ['none', 'sm', 'md', 'lg'];
const subtitle = 'Reusable content frame with a title, description, and optional actions.';
const heading = (canvas, name, level = 3) => canvas.getByRole('heading', { level, name });
const Grid = ({ children }) => <div className='grid gap-4 sm:grid-cols-2'>{children}</div>;

export default {
  title: 'Core/Card',
  id: 'core-card',
  component: Card,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    subtitle: 'text',
    titleLevel: [2, 3, 4, 5, 6],
    variant: variants,
    padding: paddings,
    radius: ['none', 'sm', 'md', 'lg'],
    interactive: 'boolean'
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
  args: { title: 'Building with tokens', subtitle, titleLevel: 3, variant: 'elevated', padding: 'md', radius: 'md', interactive: false },
  parameters: { docs: { source: playgroundSource('Card', { imports: "import { Card } from '@gaudi/design-system';" }) } },
  render: (args) => <Card {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(heading(canvas, args.title, args.titleLevel)).toBeVisible();
    await expect(canvas.getByText(args.subtitle)).toBeVisible();
  }
};

export const Variants = {
  parameters: { docs: { description: { story: 'Elevated, outline, soft, and flat surfaces.' } } },
  render: () => <Grid>{variants.map((variant) => <Card key={variant} title={variant} subtitle={subtitle} variant={variant} />)}</Grid>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of variants) await expect(heading(canvas, variant)).toBeVisible();
  }
};

export const Padding = {
  parameters: { docs: { description: { story: 'The padding scale; with `none`, the content supplies its own spacing.' } } },
  render: () => (
    <Grid>
      {paddings.map((padding) => (
        <Card key={padding} padding={padding} title={padding} variant='outline'>
          {padding === 'none' ? <p className='mt-3 border-t border-ui-border p-4 text-sm text-ui-muted-foreground'>Content supplies its own spacing.</p> : null}
        </Card>
      ))}
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const padding of paddings) await expect(heading(canvas, padding)).toBeVisible();
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
