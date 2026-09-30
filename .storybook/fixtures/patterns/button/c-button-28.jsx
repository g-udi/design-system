import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='link'>
      <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' />
      Help Center
    </Button>
  );
}
