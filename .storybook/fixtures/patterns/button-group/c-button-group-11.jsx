import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button aria-label='Previous' variant='outline' size='icon-sm'>
          <RegistryIcon lucide='ArrowLeftIcon' aria-hidden='true' />
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
        <Button aria-label='Next' variant='outline' size='icon-sm'>
          <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
