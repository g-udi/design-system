import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>
        <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
        <Badge variant='warning-light'>Draft</Badge>
      </Button>

      <Button variant='outline'>
        <RegistryIcon lucide='PencilIcon' aria-hidden='true' />
        <span>Edit</span>
      </Button>

      <Button aria-label='Upload' variant='outline' size='icon'>
        <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
