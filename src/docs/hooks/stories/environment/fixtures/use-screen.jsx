import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useScreen } from '@gaudi/design-system/hooks/environment/use-screen';

export function ScreenReadout() {
  const screen = useScreen();
  if (!screen) return <Readout>Waiting for display information.</Readout>;
  return <div className='grid gap-3'>
    <Readout label='Display'><Value>{`${screen.width} × ${screen.height}`}</Value> CSS pixels</Readout>
    <Readout label='Available space'><Value>{`${screen.availWidth} × ${screen.availHeight}`}</Value></Readout>
    <Readout label='Orientation'><Value>{screen.orientation ?? 'Unavailable'}</Value></Readout>
    <p className='text-sm text-text-muted'>The display can be larger than this window. This reading does not control the layout.</p>
  </div>;
}
