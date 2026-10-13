import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import PostSeriesBox from '../index';

const docs = getComponentDocs('Blocks/Blog/PostSeriesBox');
// A five-part series read up to part three: finished, current, and upcoming entries all show.
const series = [
  { order: 0, series: 'Design Systems in Practice', id: 'foundations', href: '/articles/foundations', title: 'Foundations: tokens, scales, and themes' },
  { order: 2, series: 'Design Systems in Practice', id: 'components', href: '/articles/components', title: 'Components with explicit contracts' },
  { order: 3, series: 'Design Systems in Practice', id: 'documentation', href: '/articles/documentation', title: 'Documentation teams actually read' },
  { order: 4, series: 'Design Systems in Practice', id: 'accessibility', href: '/articles/accessibility', title: 'Accessibility as a release gate' },
  { order: 5, series: 'Design Systems in Practice', id: 'adoption', href: '/articles/adoption', title: 'Adoption across product teams' }
];

export default {
  id: 'post-postseriesbox',
  title: 'Blocks/Blog/PostSeriesBox',
  component: PostSeriesBox,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { series: 'object', currentId: series.map((entry) => entry.id) }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { series, currentId: 'documentation' },
  parameters: {
    docs: {
      description: { story: 'A five-part series opened on part three. The progress bar and count follow `currentId`; expand the box to see finished, current, and upcoming parts. Edit `series` to rename it or change its length; an empty `series` renders nothing, so posts outside a series need no wrapper.' },
      source: playgroundSource('PostSeriesBox', { imports: "import { PostSeriesBox } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <PostSeriesBox {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const position = args.series.findIndex((entry) => entry.id === args.currentId) + 1;
    const trigger = canvas.getByRole('button', { name: new RegExp(args.series[0].series, 'u') });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', String(position));
    await expect(progress).toHaveAttribute('aria-valuemax', String(args.series.length));
    await expect(canvas.getByText(`${position}/${args.series.length}`)).toBeVisible();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    for (const entry of args.series) {
      if (entry.order != null) await expect(canvas.getByText(`${entry.order}.`, { exact: true })).toBeVisible();
      if (entry.id === args.currentId) {
        await expect(canvas.getByText(entry.title)).toHaveAttribute('aria-current', 'step');
        await expect(canvas.queryByRole('link', { name: entry.title })).not.toBeInTheDocument();
      } else await expect(canvas.getByRole('link', { name: entry.title })).toHaveAttribute('href', entry.href);
    }
    // Left open so the preview shows the full reading path.
  }
};
