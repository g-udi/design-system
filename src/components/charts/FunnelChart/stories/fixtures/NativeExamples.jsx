import { FunnelChart } from '@gaudi/design-system/charts/FunnelChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const checkout = [
  { label: 'Viewed pricing', value: 9200 },
  { label: 'Started trial', value: 2310 },
  { label: 'Invited a teammate', value: 1180 },
  { label: 'Added a payment method', value: 640 },
  { label: 'Became a paid workspace', value: 512 }
];

export const PlaygroundExample = ({ state, ...args }) => <FunnelChart {...args} ariaLabel='Trial to paid funnel' data={stateData(state, checkout)} state={forcedState(state)} />;

export const CentredExample = () => (
    <FunnelChart
      title='Onboarding'
      ariaLabel='Onboarding completion by step'
      data={[{ label: 'Created an account', value: 1840 }, { label: 'Wrote a first draft', value: 1210 }, { label: 'Published a post', value: 690 }, { label: 'Shared it', value: 310 }]}
      align='center'
      monochrome={false}
    />
  );

export const LocalisedExample = () => (
    <FunnelChart
      title='Inscriptions à la lettre'
      ariaLabel='Newsletter signup funnel in French'
      data={[{ label: 'Lecture d’un article', value: 12400 }, { label: 'Formulaire vu', value: 6100 }, { label: 'Inscription', value: 1480 }]}
      locale='fr-FR'
      conversionLabel='depuis l’étape précédente'
    />
  );
