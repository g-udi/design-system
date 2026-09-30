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
      <Button size='sm' className='border-ui-primary'>
        <RegistryIcon lucide='Share2Icon' />
        Share
      </Button>
      <ButtonGroupText className='text-ui-muted-foreground bg-transparent px-2'>
        128 Shares
      </ButtonGroupText>
    </ButtonGroup>
  );
}
