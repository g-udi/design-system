// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button size='sm' variant='outline'>
        <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
        Follow
      </Button>
      <ButtonGroupText className='text-ui-muted-foreground'>
        2.4k followers
      </ButtonGroupText>
    </ButtonGroup>
  );
}
