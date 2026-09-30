// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup className='**:data-[slot=button]:border-0'>
      <Button aria-label='Files'>
        <RegistryIcon lucide='FileIcon' aria-hidden='true' />
        Files
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary/72' />
      <Button aria-label='Folder'>
        <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
        Folder
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary/72' />
      <Button aria-label='Trash'>
        <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
        Media
      </Button>
    </ButtonGroup>
  );
}
