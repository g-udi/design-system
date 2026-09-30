// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <IconTile aria-hidden='true'>
        <RegistryIcon lucide='FolderIcon' />
      </IconTile>
    </div>
  );
}
