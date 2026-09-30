import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='secondary'>
      Open Project
      <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
    </Button>
  );
}
