// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='icon-sm' aria-label='Align left'>
        <RegistryIcon lucide='AlignLeftIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon-sm' aria-label='Align center'>
        <RegistryIcon lucide='AlignCenterIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon-sm' aria-label='Align right'>
        <RegistryIcon lucide='AlignRightIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon-sm' aria-label='Align justify'>
        <RegistryIcon lucide='MenuIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
