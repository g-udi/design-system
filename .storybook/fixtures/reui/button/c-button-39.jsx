// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Button
      variant='outline'
      className='relative gap-2'
      aria-label='Inbox (8 unread)'
    >
      <RegistryIcon lucide='MailIcon' aria-hidden='true' />
      Inbox
      <Badge
        variant='destructive'
        size='sm'
        className='absolute -top-1.5 -right-2 rounded-full px-1'
        aria-hidden='true'
      >
        8
      </Badge>
    </Button>
  );
}
