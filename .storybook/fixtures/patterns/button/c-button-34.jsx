import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button>
      <RegistryIcon lucide='MailIcon' aria-hidden='true' />
      Login with Email
    </Button>
  );
}
