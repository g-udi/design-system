import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>
        <RegistryIcon lucide='HeartIcon' aria-hidden='true' />
        Like
      </Button>
      <Button variant='outline' className='w-12' asChild>
        <span>1.2K</span>
      </Button>
    </ButtonGroup>
  );
}
