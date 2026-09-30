import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='outline'>
      Options
      <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
    </Button>
  );
}
