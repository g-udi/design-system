import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button>
      Get Started
      <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
    </Button>
  );
}
