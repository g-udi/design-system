import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const tiles = [
  {
    className: 'bg-indigo-500 text-white',
    icon: <RegistryIcon lucide='StarIcon' />
  },
  {
    className: 'bg-amber-500 text-white',
    icon: <RegistryIcon lucide='MessageSquareIcon' />
  },
  {
    className: 'bg-emerald-600 text-white',
    icon: <RegistryIcon lucide='Settings2Icon' />
  },
  {
    className: 'bg-rose-500 text-white',
    icon: <RegistryIcon lucide='CircleAlertIcon' />
  }
];
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      {tiles.map((tile) => (
        <IconTile
          key={tile.className}
          variant='elevated'
          className={tile.className}
          aria-hidden='true'
        >
          {tile.icon}
        </IconTile>
      ))}
    </div>
  );
}
