import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button size='icon-lg' aria-label='Play'>
      <RegistryIcon lucide='PlayIcon' aria-hidden='true' />
    </Button>
  );
}
