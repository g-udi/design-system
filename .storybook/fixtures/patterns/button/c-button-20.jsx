import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='ghost'>
      <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
      Settings
    </Button>
  );
}
