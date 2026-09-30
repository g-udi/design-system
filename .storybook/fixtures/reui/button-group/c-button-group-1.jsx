// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>Button</Button>
      <Button variant='outline'>Another Button</Button>
    </ButtonGroup>
  );
}
