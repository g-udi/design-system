import { useEffect, useState } from 'react';
import Input from '../../../../../components/core/Input';
import { Field, FieldLabel } from '../../../../../components/core/Field/index.js';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useEventCallback } from '../../../../../hooks/state/use-event-callback.js';

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

export { useTicker, Clock };
