import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostSeriesBox from './index';

const docs = getComponentDocs('Post/PostSeriesBox');
const series = [
  { order: 1, series: 'Design Systems', slug: 'foundations', title: 'Foundations' },
  { order: 2, series: 'Design Systems', slug: 'components', title: 'Components' },
  { order: 3, series: 'Design Systems', slug: 'documentation', title: 'Documentation' }
];

export default {
  title: 'Post/PostSeriesBox',
  component: PostSeriesBox,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { series: 'object', slug: series.map((entry) => entry.slug) }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { series, slug: 'components' },
  parameters: {
    docs: { source: playgroundSource('PostSeriesBox', { imports: "import { PostSeriesBox } from '@gaudi/design-system';" }) }
  },
  render: (args) => <PostSeriesBox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Design Systems/i });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', '2');
    await expect(progress).toHaveAttribute('aria-valuemax', String(series.length));
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Components')).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'Components' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Foundations' })).toHaveAttribute('href', '/blog/foundations');
    await expect(canvas.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/blog/documentation');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};

export const NoSeries = {
  args: { series: [], slug: 'components' },
  parameters: { docs: { description: { story: 'An empty `series` renders nothing, so posts outside a series need no conditional wrapper.' } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
    await expect(within(canvasElement).queryByRole('progressbar')).not.toBeInTheDocument();
  }
};
