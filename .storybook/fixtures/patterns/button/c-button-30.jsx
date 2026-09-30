import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button size='lg'>
      <RegistryIcon lucide='ZapIcon' aria-hidden='true' />
      Upgrade Now
    </Button>
  );
}
