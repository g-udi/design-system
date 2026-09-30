import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button size='icon' aria-label='Search'>
      <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
    </Button>
  );
}
