import { TreemapChart } from '@gaudi/design-system/charts/TreemapChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const sections = [
  { name: 'Essays', children: [{ name: 'Engineering', value: 1240 }, { name: 'Data', value: 860 }, { name: 'Writing', value: 410 }] },
  { name: 'Notes', children: [{ name: 'Weeknotes', value: 520 }, { name: 'Links', value: 260 }] },
  { name: 'Docs', children: [{ name: 'Guides', value: 690 }, { name: 'Reference', value: 380 }] }
];

export const PlaygroundExample = ({ state, ...args }) => <TreemapChart {...args} ariaLabel='Hours read by section' data={stateData(state, sections)} formatValue={(value) => `${value} h`} state={forcedState(state)} />;

export const FlatExample = () => (
    <TreemapChart
      title='JavaScript by package'
      ariaLabel='Bundle size by package'
      data={[{ name: 'react-dom', value: 132 }, { name: 'recharts', value: 98 }, { name: 'date-fns', value: 41 }, { name: 'zod', value: 27 }, { name: 'app code', value: 76 }, { name: 'other', value: 19 }]}
      colorBy='value'
      formatValue={(value) => `${value} KB`}
      height={260}
    />
  );

export const SpendExample = () => (
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
  );
