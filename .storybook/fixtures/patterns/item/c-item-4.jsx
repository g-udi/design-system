import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from '../../../../src/components/core/Item/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup className='gap-0'>
        <Item asChild size='xs'>
          <a href='#'>
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
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size='xs'>
          <a href='#'>
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
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size='xs'>
          <a href='#'>
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
          </a>
        </Item>
      </ItemGroup>
    </div>
  );
}
