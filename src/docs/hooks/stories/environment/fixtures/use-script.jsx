import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useScript } from '@gaudi/design-system/hooks/environment/use-script';

// Create public/static/scripts/hook-preview.js containing:
//   // Local preview script; intentionally no side effects.
// Or replace this URL with a script explicitly configured by your application.
const source = '/static/scripts/hook-preview.js';
export function ScriptPreview() {
  const [enabled, setEnabled] = useState(false);
  const status = useScript(source, { enabled, removeOnUnmount: true });
  const sharedStatus = useScript(source, { enabled, removeOnUnmount: true });
  return <div className='grid gap-3'>
    <Readout label='Loader' live><Value>{status}</Value></Readout>
    <Readout label='Second subscriber'><Value>{sharedStatus}</Value></Readout>
    <p className='text-sm text-text-muted'>Both subscribers share one local, inert script. No remote integration is loaded.</p>
    <div><Button onClick={() => setEnabled((value) => !value)}>{enabled ? 'Release script' : 'Load preview script'}</Button></div>
  </div>;
}
