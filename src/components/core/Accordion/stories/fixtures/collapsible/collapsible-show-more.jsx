import { Item } from '@gaudi/design-system/core/Item';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='mx-auto h-48 w-full max-w-xs'>
      <Collapsible className='flex w-full flex-col gap-2'>
        <div className='flex items-center justify-between gap-4 px-2'>
          <h4 className='text-sm font-semibold'>Order #4189</h4>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8'>
              <RegistryIcon
                lucide='ChevronsUpDownIcon'
                aria-hidden='true'
                className='size-4'
              />
              <span className='sr-only'>Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <Item variant='outline' size='sm' className='bg-surface-muted/30 rounded-lg flex items-center justify-between px-3 py-2 text-sm'>
          <span className='text-text-muted'>Status</span>
          <Badge variant='success-light'>Shipped</Badge>
        </Item>

        <CollapsibleContent className='flex flex-col gap-2'>
          <Item variant='outline' size='sm' className='rounded-lg px-3 py-2 text-sm'>
            <p className='font-medium'>Shipping address</p>
            <p className='text-text-muted'>
              100 Market St, San Francisco
            </p>
          </Item>
          <Item variant='outline' size='sm' className='rounded-lg px-3 py-2 text-sm'>
            <p className='font-medium'>Items</p>
            <p className='text-text-muted'>2x Studio Headphones</p>
          </Item>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
