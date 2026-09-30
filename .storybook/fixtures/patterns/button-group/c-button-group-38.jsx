import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='icon' aria-label='Skip back'>
        <RegistryIcon lucide='SkipBackIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='Play'>
        <RegistryIcon lucide='PlayIcon' aria-hidden='true' />
      </Button>
      <Button variant='outline' size='icon' aria-label='Skip forward'>
        <RegistryIcon lucide='SkipForwardIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
