// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button size='icon-xs' variant='outline' aria-label='Close'>
      <RegistryIcon lucide='XIcon' aria-hidden='true' />
    </Button>
  );
}
