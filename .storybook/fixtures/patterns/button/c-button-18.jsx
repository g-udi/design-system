import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='outline'>
      <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      Add Item
    </Button>
  );
}
