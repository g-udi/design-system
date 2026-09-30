import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import StatGroup from './StatGroup';

const docs = getComponentDocs('Blocks/Application/StatGroup');
const items = [
  { id: 'articles', label: 'Published articles', value: '24', detail: '3 published this month' },
  { id: 'readers', label: 'Subscribers', value: '1,280', detail: '+86 this month', tone: 'success' },
  { id: 'drafts', label: 'Open drafts', value: '6', detail: '2 awaiting review' },
  { id: 'time', label: 'Average reading time', value: '8 min', detail: 'Across published articles' }
];

export default {
  title: 'Blocks/Application/StatGroup',
  component: StatGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Editorial summary', items },
  parameters: {
    docs: { source: playgroundSource('StatGroup', { imports: "import { StatGroup } from '@gaudi/design-system';" }) }
  },
  render: (args) => <StatGroup {...args} />,
  play: async ({ args, canvasElement }) => {
    const group = canvasElement.querySelector(`dl[aria-label="${args.label}"]`);
    await expect(group.querySelectorAll('dt')).toHaveLength(items.length);
    await expect(within(group).getByText(items[1].detail)).toHaveAttribute('data-tone', 'success');
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
