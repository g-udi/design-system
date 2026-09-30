import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button variant='link' asChild>
      <a href='#'>
        <RegistryIcon
          lucide='ChevronLeftIcon'
          data-icon='inline-start'
          aria-hidden='true'
        />
        Go back
      </a>
    </Button>
  );
}
