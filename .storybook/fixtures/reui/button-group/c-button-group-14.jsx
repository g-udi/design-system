// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup orientation='vertical'>
      <ButtonGroup orientation='vertical'>
        <Button variant='outline' size='icon' aria-label='Search'>
          <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
        </Button>
        <Button variant='outline' size='icon' aria-label='Copy'>
          <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
        </Button>
        <Button variant='outline' size='icon' aria-label='Share'>
          <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant='outline' size='icon' aria-label='Trash'>
          <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
