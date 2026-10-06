import { WaterfallChart } from '@gaudi/design-system/charts/WaterfallChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const subscribers = [
  { label: 'September', value: 4180, total: true },
  { label: 'Organic', value: 620 },
  { label: 'Referrals', value: 240 },
  { label: 'Imports', value: 180 },
  { label: 'Unsubscribed', value: -310 },
  { label: 'Bounced', value: -95 },
  { label: 'October', total: true }
];

const pageWeight = [
  { label: 'Before', value: 1840, total: true },
  { label: 'Images to AVIF', value: -620 },
  { label: 'Font subsetting', value: -180 },
  { label: 'Analytics script', value: 45 },
  { label: 'Code splitting', value: -310 },
  { label: 'After', total: true }
];

export const PlaygroundExample = ({ state, ...args }) => <WaterfallChart {...args} ariaLabel='Change in subscribers from September to October' data={stateData(state, subscribers)} state={forcedState(state)} />;

export const BudgetExample = () => (
    <WaterfallChart
      title='Where the page weight went'
      ariaLabel='Change in page weight by optimisation'
      data={pageWeight}
      changeLabel='Saved or added'
      totalLabel='Page weight'
      formatValue={(value) => `${value} KB`}
    />
  );

export const SubtotalsExample = () => (
    <WaterfallChart
      title='Active workspaces this quarter'
      ariaLabel='Active workspaces with monthly subtotals'
      data={[
        { label: 'Start', value: 1200, total: true },
        { label: 'Jul new', value: 140 }, { label: 'Jul lost', value: -60 }, { label: 'End of Jul', total: true },
        { label: 'Aug new', value: 90 }, { label: 'Aug lost', value: -110 }, { label: 'End of Aug', total: true },
        { label: 'Sep new', value: 210 }, { label: 'Sep lost', value: -70 }, { label: 'End of Sep', total: true }
      ]}
      height={280}
    />
  );
