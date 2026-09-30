import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <IconTile
        asChild
        variant='elevated'
        className='hover:bg-ui-accent focus-visible:ring-ui-ring focus-visible:ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
      >
        <a href='#' aria-label='Open settings'>
          <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
        </a>
      </IconTile>
    </div>
  );
}
