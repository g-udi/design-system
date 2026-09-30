// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='sm'>
        <RegistryIcon lucide='ArrowLeftIcon' aria-hidden='true' />
        Previous
      </Button>
      <Button variant='outline' size='sm'>
        1
      </Button>
      <Button variant='outline' size='sm'>
        2
      </Button>
      <Button variant='outline' size='sm'>
        3
      </Button>
      <Button variant='outline' size='sm'>
        Next
        <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
