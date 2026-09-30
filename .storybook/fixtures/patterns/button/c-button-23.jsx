import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='destructive'>
      Confirm Removal
      <RegistryIcon lucide='CircleAlertIcon' aria-hidden='true' />
    </Button>
  );
}
