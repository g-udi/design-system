import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup orientation='vertical'>
      <Button variant='outline' size='icon' aria-label='Add'>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='Subtract'>
        <RegistryIcon lucide='MinusIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
