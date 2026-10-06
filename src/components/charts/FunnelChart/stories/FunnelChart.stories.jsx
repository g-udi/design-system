import { PlaygroundExample, CentredExample, LocalisedExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { FunnelChart } from '../index.js';

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/FunnelChart',
  id: 'charts-funnelchart',
  tags: ['autodocs'],
  ...chartsMeta('FunnelChart', { component: FunnelChart, controls: { align: [ 'start', 'center' ], monochrome: 'boolean', conversionLabel: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Trial to paid', description: 'Workspaces at each step this quarter.', align: 'start', monochrome: true, conversionLabel: 'from previous', showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Steps in order with the conversion from the step before. `align` lays the bars from the left or centres them as a funnel; `monochrome` fades one hue by step instead of a colour per step.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Trial to paid funnel');
    await expect(within(canvasElement).getByText('80% from previous')).toBeVisible();
  }
};

export const Centred = {
  name: 'Centred funnel with a colour per step',
  parameters: { docs: { description: { story: 'An onboarding funnel centred as a classic funnel, each step in its own palette colour.' } } },
  render: CentredExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Onboarding completion by step')
};

export const Localised = {
  name: 'Custom copy and locale',
  parameters: { docs: { description: { story: 'The conversion suffix and every number follow French copy and formatting, for a dashboard in another language.' } } },
  render: LocalisedExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Newsletter signup funnel in French');
    await expect(within(canvasElement).getAllByText(/depuis l’étape précédente/).length).toBeGreaterThan(0);
  }
};
