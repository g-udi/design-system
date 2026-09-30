// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <Button aria-label='Updates (new)'>
      Updates
      <Badge variant='success' size='xs' aria-hidden='true'>
        New
      </Badge>
    </Button>
  );
}
