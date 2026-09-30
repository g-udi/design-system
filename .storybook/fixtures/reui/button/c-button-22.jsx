// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='destructive'>
      <RegistryIcon lucide='Trash2Icon' aria-hidden='true' />
      Delete Account
    </Button>
  );
}
