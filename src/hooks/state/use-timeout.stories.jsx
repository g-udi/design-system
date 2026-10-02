import { useState } from 'react';
import Button from '../../components/core/Button';
import { Alert, AlertDescription, AlertTitle } from '../../components/core/Banner/index.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useTimeout } from './use-timeout.js';

export default {
  title: 'Hooks/State/useTimeout',
  id: 'hooks-state-usetimeout',
  tags: ['autodocs'],
  ...hookMeta('useTimeout')
};

function SavedNotice() {
  const [ visible, setVisible ] = useState(false);
  const { clear, reset } = useTimeout(() => setVisible(false), visible ? 6000 : null);
  return (
    <div className='grid gap-3'>
      <Button className='w-fit' onClick={() => setVisible(true)}>Publish post</Button>
      <div role='status'>
        {visible ? (
          <div onPointerEnter={clear} onPointerLeave={reset} onFocus={clear} onBlur={reset}>
            <Alert variant='success' role='none'>
              <AlertTitle>Post published</AlertTitle>
              <AlertDescription className='flex flex-wrap items-center gap-2'>
                It is live for 4,180 subscribers.
                <Button size='xs' variant='ghost' tone='neutral' onClick={() => setVisible(false)}>Dismiss</Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const AutoDismiss = {
  name: 'Auto-dismiss that pauses',
  parameters: example('The notice hides after six seconds, but `clear` holds it while the reader points at or focuses it and `reset` restarts the countdown when they leave. It also has a Dismiss button.', `
import { Alert, AlertTitle, Button } from '@gaudi/design-system';
import { useTimeout } from '@gaudi/design-system/hooks';

const { clear, reset } = useTimeout(() => setVisible(false), visible ? 6000 : null);

<div role='status'>
  {visible && (
    <div onPointerEnter={clear} onPointerLeave={reset} onFocus={clear} onBlur={reset}>
      <Alert variant='success' role='none'><AlertTitle>Post published</AlertTitle></Alert>
      <Button onClick={() => setVisible(false)}>Dismiss</Button>
    </div>
  )}
</div>`),
  render: () => <SavedNotice />
};
