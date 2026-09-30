import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button aria-label='Previous' variant='outline' size='icon'>
        <RegistryIcon lucide='ChevronLeftIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon'>
        1
      </Button>
      <Button variant='outline' size='icon'>
        2
      </Button>
      <Button
        variant='default'
        size='icon'
        className='border-ui-primary border'
      >
        3
      </Button>
      <Button variant='outline' size='icon'>
        4
      </Button>
      <Button variant='outline' size='icon'>
        5
      </Button>
      <Button aria-label='Next' variant='outline' size='icon'>
        <RegistryIcon lucide='ChevronRightIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
