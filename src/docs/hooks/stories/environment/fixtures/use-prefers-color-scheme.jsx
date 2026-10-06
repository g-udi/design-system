import Card from '../../../../../components/core/Card';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { usePrefersColorScheme } from '../../../../../hooks/environment/use-prefers-color-scheme.js';

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

export { SystemScheme };
