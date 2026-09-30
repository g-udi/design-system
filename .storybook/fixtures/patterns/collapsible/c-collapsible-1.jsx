import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='h-48 w-full max-w-xs'>
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

        <div className='bg-ui-muted/30 rounded-lg flex items-center justify-between border px-3 py-2 text-sm'>
          <span className='text-ui-muted-foreground'>Status</span>
          <Badge variant='success-light'>Shipped</Badge>
        </div>

        <CollapsibleContent className='flex flex-col gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            <p className='font-medium'>Shipping address</p>
            <p className='text-ui-muted-foreground'>
              100 Market St, San Francisco
            </p>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            <p className='font-medium'>Items</p>
            <p className='text-ui-muted-foreground'>2x Studio Headphones</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
