import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button
        size='sm'
        variant='default'
        aria-label='Following 2.4k'
        className='border-ui-primary'
      >
        <RegistryIcon lucide='StarIcon' />
        Star
      </Button>
      <ButtonGroupText className='border-ui-primary'>2.4k</ButtonGroupText>
    </ButtonGroup>
  );
}
