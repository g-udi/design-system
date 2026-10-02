import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { TreemapChart } from './index.js';

// Reading time by section of the site, in hours this month.
const sections = [
  { name: 'Essays', children: [{ name: 'Engineering', value: 1240 }, { name: 'Data', value: 860 }, { name: 'Writing', value: 410 }] },
  { name: 'Notes', children: [{ name: 'Weeknotes', value: 520 }, { name: 'Links', value: 260 }] },
  { name: 'Docs', children: [{ name: 'Guides', value: 690 }, { name: 'Reference', value: 380 }] }
];

export default {
  title: 'Charts/TreemapChart',
  id: 'charts-treemapchart',
  tags: ['autodocs'],
  ...chartsMeta('TreemapChart', { component: TreemapChart, controls: { colorBy: [ 'group', 'value' ] }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Reading time by section', description: 'Hours read this month.', height: 320, colorBy: 'group', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Nested rectangles sized by value. `colorBy="group"` tints each top-level section; `"value"` shades every rectangle on the heat ramp. Leaves are points for the arrow keys.' },
      source: {
        language: 'jsx',
        code: `import { TreemapChart } from '@gaudi/design-system/charts';

<TreemapChart
  title='Reading time by section'
  ariaLabel='Hours read by section'
  data={[{ name: 'Essays', children: [{ name: 'Engineering', value: 1240 }, { name: 'Data', value: 860 }] }]}
  formatValue={(value) => \`\${value} h\`}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <TreemapChart {...args} ariaLabel='Hours read by section' data={stateData(state, sections)} formatValue={(value) => `${value} h`} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Hours read by section');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Essays · Engineering' })).toBeInTheDocument();
  }
};

export const Flat = {
  name: 'One level shaded by value',
  parameters: { docs: { description: { story: 'A flat list of dependencies by bundle size, shaded on the heat ramp so the largest stand out.' } } },
  render: () => (
    <TreemapChart
      title='JavaScript by package'
      ariaLabel='Bundle size by package'
      data={[{ name: 'react-dom', value: 132 }, { name: 'recharts', value: 98 }, { name: 'date-fns', value: 41 }, { name: 'zod', value: 27 }, { name: 'app code', value: 76 }, { name: 'other', value: 19 }]}
      colorBy='value'
      formatValue={(value) => `${value} KB`}
      height={260}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Bundle size by package')
};

export const Spend = {
  name: 'Spend by team',
  parameters: { docs: { description: { story: 'Monthly tool spend by team and service, formatted as currency.' } } },
  render: () => (
    <TreemapChart
      title='Tool spend'
      ariaLabel='Monthly tool spend by team and service'
      data={[
        { name: 'Engineering', children: [{ name: 'Hosting', value: 1840 }, { name: 'CI', value: 620 }, { name: 'Monitoring', value: 410 }] },
        { name: 'Design', children: [{ name: 'Design tools', value: 360 }, { name: 'Stock', value: 120 }] },
        { name: 'Writing', children: [{ name: 'Editor', value: 180 }, { name: 'Newsletter', value: 290 }] }
      ]}
      formatValue={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      height={280}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Monthly tool spend by team and service')
};
