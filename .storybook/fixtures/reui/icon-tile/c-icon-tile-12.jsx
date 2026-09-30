// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <IconTile variant='frame' size='xl' aria-hidden='true'>
              <RegistryIcon lucide='FolderIcon' />
            </IconTile>
          </EmptyMedia>
          <EmptyTitle>No files yet</EmptyTitle>
          <EmptyDescription>
            Upload a file to get started. Everything you add shows up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
