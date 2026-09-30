import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PostSeriesBox from './index';

const docs = getComponentDocs('Post/PostSeriesBox');
// A five-part series read up to part three: finished, current, and upcoming entries all show.
const series = [
  { order: 1, series: 'Design Systems in Practice', slug: 'foundations', title: 'Foundations: tokens, scales, and themes' },
  { order: 2, series: 'Design Systems in Practice', slug: 'components', title: 'Components with explicit contracts' },
  { order: 3, series: 'Design Systems in Practice', slug: 'documentation', title: 'Documentation teams actually read' },
  { order: 4, series: 'Design Systems in Practice', slug: 'accessibility', title: 'Accessibility as a release gate' },
  { order: 5, series: 'Design Systems in Practice', slug: 'adoption', title: 'Adoption across product teams' }
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
  args: { series, slug: 'documentation' },
  parameters: {
    docs: {
      description: { story: 'A five-part series opened on part three. The progress bar and count follow `slug`; expand the box to see finished, current, and upcoming parts. Edit `series` to rename it or change its length.' },
      source: playgroundSource('PostSeriesBox', { imports: "import { PostSeriesBox } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <PostSeriesBox {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const position = args.series.findIndex((entry) => entry.slug === args.slug) + 1;
    const trigger = canvas.getByRole('button', { name: new RegExp(args.series[0].series, 'u') });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', String(position));
    await expect(progress).toHaveAttribute('aria-valuemax', String(args.series.length));
    await expect(canvas.getByText(`${position}/${args.series.length}`)).toBeVisible();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    for (const entry of args.series) {
      if (entry.slug === args.slug) {
        await expect(canvas.getByText(entry.title)).toHaveAttribute('aria-current', 'step');
        await expect(canvas.queryByRole('link', { name: entry.title })).not.toBeInTheDocument();
      } else await expect(canvas.getByRole('link', { name: entry.title })).toHaveAttribute('href', `/blog/${entry.slug}`);
    }
    // Left open so the preview shows the full reading path.
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
