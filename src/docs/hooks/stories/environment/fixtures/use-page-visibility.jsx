import { useState } from 'react';
import { useInterval } from '../../../../../hooks/state/use-interval.js';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { usePageVisibility } from '../../../../../hooks/environment/use-page-visibility.js';

function PausedPolling() {
  const visible = usePageVisibility();
  const [ checks, setChecks ] = useState(0);
  const [ log, setLog ] = useState([]);
  useInterval(() => setChecks((count) => count + 1), visible ? 1000 : null);
  const [ last, setLast ] = useState(visible);
  if (last !== visible) {
    setLast(visible);
    setLog((current) => [ `${new Date().toLocaleTimeString()}: tab ${visible ? 'visible, polling resumed' : 'hidden, polling paused'}`, ...current ].slice(0, 4));
  }
  return (
    <div className='grid gap-2'>
      <Readout label='Tab visible'><Value>{visible}</Value></Readout>
      <Readout label='Checks for new comments'>{checks}</Readout>
      <p className='text-sm text-text-muted'>Switch to another tab and back: the counter stops while the page is hidden.</p>
      {log.length ? <ul className='grid gap-1 text-xs text-text-muted'>{log.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null}
    </div>
  );
}

export { PausedPolling };
