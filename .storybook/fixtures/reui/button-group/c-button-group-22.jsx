// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' aria-label='Files'>
        <RegistryIcon lucide='FileIcon' aria-hidden='true' />
        Files
      </Button>
      <Button variant='outline' disabled aria-label='Folder'>
        <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
        Folder
      </Button>
      <Button variant='outline' aria-label='Trash'>
        <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
        Trash
      </Button>
    </ButtonGroup>
  );
}
