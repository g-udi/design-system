import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useWindowSize } from '@gaudi/design-system/hooks/environment/use-window-size';

export function ViewportReadout() {
  const { width, height } = useWindowSize();
  return <div className='grid gap-3'>
    <Readout label='Viewport'><Value>{`${width} × ${height}`}</Value> CSS pixels</Readout>
    <p className='text-sm text-text-muted'>Resize the preview to update these dimensions. Use CSS or useMediaQuery for layout breakpoints.</p>
  </div>;
}
