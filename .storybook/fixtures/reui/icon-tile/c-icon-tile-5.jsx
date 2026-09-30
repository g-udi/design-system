// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const sizes = ['xs', 'sm', 'default', 'lg', 'xl'];
export function Pattern() {
  return (
    <div className='flex items-end justify-center gap-4'>
      {sizes.map((size) => (
        <IconTile key={size} variant='elevated' size={size} aria-hidden='true'>
          <RegistryIcon lucide='PackageIcon' />
        </IconTile>
      ))}
    </div>
  );
}
