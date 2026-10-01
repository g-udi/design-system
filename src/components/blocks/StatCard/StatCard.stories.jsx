import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import StatCard, { StatMeter, statTones } from './StatCard';

const docs = getComponentDocs('Blocks/Stat Cards');
const segments = [
  { label: 'Starter', value: 1120, tone: 'info' },
  { label: 'Team', value: 784, tone: 'warning' },
  { label: 'Business', value: 244, tone: 'discovery' }
];

export default {
  title: 'Blocks/Stat Cards',
  id: 'blocks-stat-cards',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    value: 'text',
    delta: 'text',
    invert: 'boolean',
    icon: ['UsersIcon', 'DollarSignIcon', 'ActivityIcon', 'ShieldCheckIcon'],
    tone: statTones,
    variant: ['default', 'tinted', 'inverse'],
    description: 'text',
    footer: 'text',
    meter: 'boolean'
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
  args: {
    label: 'Active subscriptions',
    value: '2,148',
    delta: '5.3%',
    invert: false,
    icon: 'UsersIcon',
    tone: 'info',
    variant: 'default',
    description: 'vs 2,040 last month',
    footer: 'Sep 1 – Sep 30, 2026',
    meter: true
  },
  parameters: {
    docs: {
      description: { story: 'A subscriptions card with an icon tile, a change badge and a plan breakdown. `delta` keeps your formatting and its sign sets the direction; `invert` turns a rise red for metrics where up is bad. `variant` switches between the card, a `tinted` colour block in `tone` and the dark `inverse` surface, and `meter` adds the segmented StatMeter.' },
      source: playgroundSource('StatCard', {
        imports: `import { StatCard, StatMeter } from '@gaudi/design-system/blocks/StatCard';\n\nconst segments = ${JSON.stringify(segments, null, 2)};`
      })
    }
  },
  render: ({ meter, ...args }) => (
    <StatCard {...args} className='w-full max-w-sm'>
      {meter ? <StatMeter label='By plan' segments={segments} /> : null}
    </StatCard>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.value)).toBeVisible();
    // The change badge names its direction for screen readers.
    if (args.delta) await expect(canvasElement.querySelector('[data-slot=stat-delta]')).toHaveTextContent(/^(Up|Down|Unchanged)/);
  }
};
