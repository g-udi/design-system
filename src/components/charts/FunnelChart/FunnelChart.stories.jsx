import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { FunnelChart } from './index.js';

const checkout = [
  { label: 'Viewed pricing', value: 9200 },
  { label: 'Started trial', value: 2310 },
  { label: 'Invited a teammate', value: 1180 },
  { label: 'Added a payment method', value: 640 },
  { label: 'Became a paid workspace', value: 512 }
];

export default {
  title: 'Charts/FunnelChart',
  id: 'charts-funnelchart',
  tags: ['autodocs'],
  ...chartsMeta('FunnelChart', { component: FunnelChart, controls: { align: [ 'start', 'center' ], monochrome: 'boolean', conversionLabel: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Trial to paid', description: 'Workspaces at each step this quarter.', align: 'start', monochrome: true, conversionLabel: 'from previous', showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Steps in order with the conversion from the step before. `align` lays the bars from the left or centres them as a funnel; `monochrome` fades one hue by step instead of a colour per step.' },
      source: {
        language: 'jsx',
        code: `import { FunnelChart } from '@gaudi/design-system/charts';

<FunnelChart title='Trial to paid' ariaLabel='Trial to paid funnel' data={steps} align='center' />`
      }
    }
  },
  render: ({ state, ...args }) => <FunnelChart {...args} ariaLabel='Trial to paid funnel' data={stateData(state, checkout)} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Trial to paid funnel');
    await expect(within(canvasElement).getByText('80% from previous')).toBeVisible();
  }
};

export const Centred = {
  name: 'Centred funnel with a colour per step',
  parameters: { docs: { description: { story: 'An onboarding funnel centred as a classic funnel, each step in its own palette colour.' } } },
  render: () => (
    <FunnelChart
      title='Onboarding'
      ariaLabel='Onboarding completion by step'
      data={[{ label: 'Created an account', value: 1840 }, { label: 'Wrote a first draft', value: 1210 }, { label: 'Published a post', value: 690 }, { label: 'Shared it', value: 310 }]}
      align='center'
      monochrome={false}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Onboarding completion by step')
};

export const Localised = {
  name: 'Custom copy and locale',
  parameters: { docs: { description: { story: 'The conversion suffix and every number follow French copy and formatting, for a dashboard in another language.' } } },
  render: () => (
    <FunnelChart
      title='Inscriptions à la lettre'
      ariaLabel='Newsletter signup funnel in French'
      data={[{ label: 'Lecture d’un article', value: 12400 }, { label: 'Formulaire vu', value: 6100 }, { label: 'Inscription', value: 1480 }]}
      locale='fr-FR'
      conversionLabel='depuis l’étape précédente'
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Newsletter signup funnel in French');
    await expect(within(canvasElement).getAllByText(/depuis l’étape précédente/).length).toBeGreaterThan(0);
  }
};
