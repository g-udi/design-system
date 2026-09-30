import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import StatGroup from './StatGroup';

const docs = getComponentDocs('Blocks/Application/StatGroup');
const label = 'September performance';
// A month of mixed results: growth, a regression, a steady figure and a slower read.
const items = [
  { id: 'readers', label: 'Monthly readers', value: '48.2k', detail: '▲ 12.4% vs August', tone: 'success' },
  { id: 'subscribers', label: 'New subscribers', value: '1,284', detail: '▲ 86 this month', tone: 'success' },
  { id: 'bounce', label: 'Bounce rate', value: '38.6%', detail: '▲ 4.1 pts vs August', tone: 'danger' },
  { id: 'reading', label: 'Avg. reading time', value: '6m 12s', detail: '▼ 18s vs August', tone: 'danger' },
  { id: 'drafts', label: 'Open drafts', value: '6', detail: '2 awaiting review' }
];

export default {
  title: 'Blocks/Application/StatGroup',
  component: StatGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { items: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { items },
  parameters: {
    docs: {
      description: { story: 'A monthly summary with rising, falling, and steady figures. Edit `items` to change the values, and set `tone` to `success`, `danger`, or leave it out for a neutral detail line.' },
      source: playgroundSource('StatGroup', { imports: "import { StatGroup } from '@gaudi/design-system';", attributes: [`label='${label}'`] })
    }
  },
  render: (args) => <StatGroup label={label} {...args} />,
  play: async ({ args, canvasElement }) => {
    const list = canvasElement.querySelector(`dl[aria-label="${label}"]`);
    const group = within(list);
    await expect(list.querySelectorAll('dt')).toHaveLength(args.items.length);
    for (const item of args.items) {
      await expect(group.getByText(item.value)).toBeVisible();
      if (item.detail) await expect(group.getByText(item.detail)).toHaveAttribute('data-tone', item.tone || 'neutral');
    }
  }
};

export const QuietPeriod = {
  name: 'Sparse data',
  parameters: { docs: { description: { story: 'Zero and unavailable values are passed as prepared text; the detail line explains them instead of colour.' } } },
  render: () => (
    <StatGroup
      items={[
        { id: 'articles', label: 'Published this week', value: '0', detail: 'Your next piece can take its time.' },
        { id: 'readers', label: 'New subscribers', value: '—', detail: 'Data is not available.' }
      ]}
    />
  )
};
