import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-3'>
      <IconTile variant='elevated' className='text-xs font-medium'>
        AK
      </IconTile>
      <IconTile
        variant='outline'
        radius='full'
        className='text-ui-muted-foreground text-xs font-medium'
      >
        12
      </IconTile>
    </div>
  );
}
