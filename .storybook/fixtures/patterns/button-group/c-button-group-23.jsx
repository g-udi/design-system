import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup className='**:data-[slot=button]:border-0'>
      <Button>
        <RegistryIcon lucide='FileIcon' aria-hidden='true' />
        Files
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary/72' />
      <Button>
        <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
        Folder
      </Button>
      <ButtonGroupSeparator className='bg-ui-primary/72' />
      <Button>
        <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
        Media
      </Button>
    </ButtonGroup>
  );
}
