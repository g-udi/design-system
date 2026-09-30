// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='icon' aria-label='Grid view'>
        <RegistryIcon lucide='LayoutGridIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='List view'>
        <RegistryIcon lucide='ListIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='Table view'>
        <RegistryIcon lucide='TableIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
