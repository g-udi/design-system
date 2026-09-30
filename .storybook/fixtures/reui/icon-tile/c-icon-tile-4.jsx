// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const variants = ['outline', 'elevated', 'soft', 'solid', 'frame'];
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      {variants.map((variant) => (
        <IconTile key={variant} variant={variant} aria-hidden='true'>
          <RegistryIcon lucide='PackageIcon' />
        </IconTile>
      ))}
    </div>
  );
}
