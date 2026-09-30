// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <ToggleGroup
        type='multiple'
        defaultValue={['email', 'push']}
        variant='outline'
        spacing={1}
      >
        <ToggleGroupItem value='email' aria-label='Email notifications'>
          <RegistryIcon lucide='MailIcon' />
          Email
        </ToggleGroupItem>
        <ToggleGroupItem value='sms' aria-label='SMS notifications'>
          <RegistryIcon lucide='PhoneIcon' />
          SMS
        </ToggleGroupItem>
        <ToggleGroupItem value='push' aria-label='Push notifications'>
          <RegistryIcon lucide='BellIcon' />
          Push
        </ToggleGroupItem>
        <ToggleGroupItem value='slack' aria-label='Slack notifications'>
          <RegistryIcon lucide='MessageSquareIcon' />
          Slack
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
