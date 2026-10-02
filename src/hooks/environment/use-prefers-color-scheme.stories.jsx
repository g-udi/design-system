import Card from '../../components/core/Card';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { usePrefersColorScheme } from './use-prefers-color-scheme.js';

export default {
  title: 'Hooks/Environment/usePrefersColorScheme',
  id: 'hooks-environment-usepreferscolorscheme',
  tags: ['autodocs'],
  ...hookMeta('usePrefersColorScheme')
};

function SystemScheme() {
  const scheme = usePrefersColorScheme();
  return (
    <div className='grid gap-3'>
      <Readout label='System colour scheme'><Value>{scheme}</Value></Readout>
      <Card variant='outline' padding='sm' title='Embedded map' titleLevel={4}>
        Third-party embeds that cannot read the site theme can start from the system scheme: this one would load the {scheme} map style.
      </Card>
    </div>
  );
}

export const SystemDefault = {
  name: 'System default for an embed',
  parameters: example('Reads the operating system preference. The site theme can differ (the reader may pick light on a dark system), so use the theme provider for site styling.', `
import { usePrefersColorScheme } from '@gaudi/design-system/hooks';

const scheme = usePrefersColorScheme();
<MapEmbed style={scheme === 'dark' ? 'night' : 'day'} />`),
  render: () => <SystemScheme />
};
