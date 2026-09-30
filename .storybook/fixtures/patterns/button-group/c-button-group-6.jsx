import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button aria-label='Flip horizontally' variant='outline' size='icon'>
        <RegistryIcon lucide='FlipHorizontalIcon' aria-hidden='true' />
      </Button>
      <Button aria-label='Flip vertically' variant='outline' size='icon'>
        <RegistryIcon lucide='FlipVerticalIcon' aria-hidden='true' />
      </Button>
      <Button aria-label='Rotate clockwise' variant='outline' size='icon'>
        <RegistryIcon lucide='RotateCwIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
