import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Frame className='w-full max-w-xs'>
      <FramePanel className='flex flex-col gap-3'>
        <IconTile variant='elevated' size='lg' aria-hidden='true'>
          <RegistryIcon lucide='LayoutDashboardIcon' />
        </IconTile>
        <div className='flex flex-col gap-1'>
          <h3 className='text-sm font-medium'>Unified dashboard</h3>
          <p className='text-ui-muted-foreground text-xs'>
            Track every project, deployment and metric from a single workspace.
          </p>
        </div>
      </FramePanel>
    </Frame>
  );
}
