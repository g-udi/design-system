import { useEffect, useState } from 'react';
import Input from '../../components/core/Input';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useEventCallback } from './use-event-callback.js';

export default {
  title: 'Hooks/State/useEventCallback',
  id: 'hooks-state-useeventcallback',
  tags: ['autodocs'],
  ...hookMeta('useEventCallback')
};

/** A stand-in for a socket or store subscription that is expensive to restart. */
function useTicker(onTick) {
  const [ subscriptions, setSubscriptions ] = useState(0);
  useEffect(() => {
    setSubscriptions((count) => count + 1);
    const id = setInterval(() => onTick(new Date()), 1000);
    return () => clearInterval(id);
  }, [ onTick ]);
  return subscriptions;
}

function Clock() {
  const [ label, setLabel ] = useState('Office');
  const [ last, setLast ] = useState('');
  // The callback reads the latest label without restarting the subscription.
  const onTick = useEventCallback((date) => setLast(`${label}: ${date.toLocaleTimeString()}`));
  const subscriptions = useTicker(onTick);
  return (
    <div className='grid gap-3'>
      <Field>
        <FieldLabel>Clock label</FieldLabel>
        <Input value={label} onChange={(event) => setLabel(event.target.value)} />
      </Field>
      <Readout label='Latest tick'>{last || 'waiting…'}</Readout>
      <Readout label='Subscriptions started'>{subscriptions} (typing does not restart it)</Readout>
    </div>
  );
}

export const StableSubscription = {
  name: 'Fresh state, stable subscription',
  parameters: example('The tick handler reads the label as you type, yet the subscription that depends on it starts once.', `
import { useEventCallback } from '@gaudi/design-system/hooks';

const onTick = useEventCallback((date) => setLast(\`\${label}: \${date.toLocaleTimeString()}\`));

useEffect(() => {
  const id = setInterval(() => onTick(new Date()), 1000);
  return () => clearInterval(id);
}, [onTick]);`),
  render: () => <Clock />
};
