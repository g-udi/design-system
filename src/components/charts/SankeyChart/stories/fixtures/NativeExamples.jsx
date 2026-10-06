import { SankeyChart } from '@gaudi/design-system/charts/SankeyChart';
import { forcedState } from '../../../stories/chartExamples.js';

const tickets = [
  { source: 'Email', target: 'Billing', value: 420 },
  { source: 'Email', target: 'Technical', value: 610 },
  { source: 'Chat', target: 'Technical', value: 880 },
  { source: 'Chat', target: 'Account', value: 290 },
  { source: 'Forum', target: 'Technical', value: 340 },
  { source: 'Billing', target: 'Solved', value: 390 },
  { source: 'Billing', target: 'Escalated', value: 30 },
  { source: 'Technical', target: 'Solved', value: 1520 },
  { source: 'Technical', target: 'Escalated', value: 310 },
  { source: 'Account', target: 'Solved', value: 270 },
  { source: 'Account', target: 'Escalated', value: 20 }
];

export const PlaygroundExample = ({ state, ...args }) => <SankeyChart {...args} ariaLabel='Support tickets from channel to queue to outcome' links={state === 'empty' ? [] : tickets} state={forcedState(state) || (state === 'invalid' ? 'invalid' : undefined)} />;

export const BudgetExample = () => (
    <SankeyChart
      title='Studio budget'
      ariaLabel='Monthly income by source flowing to spend'
      nodes={[ 'Client work', 'Sponsorships', 'Newsletter', 'Salaries', 'Tools', 'Savings' ]}
      links={[
        { source: 'Client work', target: 'Salaries', value: 14000 },
        { source: 'Client work', target: 'Savings', value: 2400 },
        { source: 'Sponsorships', target: 'Salaries', value: 2000 },
        { source: 'Sponsorships', target: 'Tools', value: 900 },
        { source: 'Newsletter', target: 'Tools', value: 600 },
        { source: 'Newsletter', target: 'Savings', value: 1100 }
      ]}
      formatValue={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      height={300}
    />
  );

export const OnboardingExample = () => (
    <SankeyChart
      title='First week of new writers'
      ariaLabel='New writers moving through onboarding'
      links={[
        { source: 'Signed up', target: 'Wrote a draft', value: 820 },
        { source: 'Signed up', target: 'Left', value: 380 },
        { source: 'Wrote a draft', target: 'Published', value: 510 },
        { source: 'Wrote a draft', target: 'Left', value: 310 }
      ]}
      height={260}
    />
  );
