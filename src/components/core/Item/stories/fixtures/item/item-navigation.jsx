import Link from '@gaudi/design-system/core/Link';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup className='gap-0'>
        <Item asChild size='xs'>
          <Link variant='bare' href='/settings/profile'>
            <ItemMedia variant='icon'>
              <RegistryIcon lucide='UserIcon' />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Profile</ItemTitle>
              <ItemDescription>Manage your account details</ItemDescription>
            </ItemContent>
            <ItemActions>
              <RegistryIcon
                lucide='ChevronRightIcon'
                className='text-ui-muted-foreground size-4'
              />
            </ItemActions>
          </Link>
        </Item>
        <ItemSeparator />
        <Item asChild size='xs'>
          <Link variant='bare' href='/settings/security'>
            <ItemMedia variant='icon'>
              <RegistryIcon lucide='ShieldIcon' />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Security</ItemTitle>
              <ItemDescription>Password and two-factor auth</ItemDescription>
            </ItemContent>
            <ItemActions>
              <RegistryIcon
                lucide='ChevronRightIcon'
                className='text-ui-muted-foreground size-4'
              />
            </ItemActions>
          </Link>
        </Item>
        <ItemSeparator />
        <Item asChild size='xs'>
          <Link variant='bare' href='/settings/billing'>
            <ItemMedia variant='icon'>
              <RegistryIcon lucide='CreditCardIcon' />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Billing</ItemTitle>
              <ItemDescription>Plans, invoices, and payment</ItemDescription>
            </ItemContent>
            <ItemActions>
              <RegistryIcon
                lucide='ChevronRightIcon'
                className='text-ui-muted-foreground size-4'
              />
            </ItemActions>
          </Link>
        </Item>
      </ItemGroup>
    </div>
  );
}
