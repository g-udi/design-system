// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-2'>
      <Item variant='outline'>
        <ItemMedia variant='icon'>
          <RegistryIcon lucide='MailIcon' />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Email Notifications</ItemTitle>
          <ItemDescription>Receive updates via email</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant='outline' size='sm'>
            Configure
          </Button>
        </ItemActions>
      </Item>
      <Item variant='outline'>
        <ItemMedia variant='icon'>
          <RegistryIcon lucide='BellIcon' />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Push Notifications</ItemTitle>
          <ItemDescription>Get notified on your device</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size='sm'>Enable</Button>
        </ItemActions>
      </Item>
    </div>
  );
}
