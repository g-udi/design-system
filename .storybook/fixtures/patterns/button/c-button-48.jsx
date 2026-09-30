import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button
      size='icon'
      variant='outline'
      className='relative'
      aria-label='Notifications (8)'
    >
      <RegistryIcon lucide='BellIcon' aria-hidden='true' />
      <Badge
        variant='destructive'
        size='xs'
        className='absolute -top-1 -right-1 rounded-control px-1'
        aria-hidden='true'
      >
        8
      </Badge>
    </Button>
  );
}
