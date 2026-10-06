'use client';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
    <Card className='relative w-full max-w-md gap-4 overflow-visible pb-1'>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>3 days remaining in cycle</CardTitle>
        <CardAction>
          <Button href='/settings/billing' variant='outline' size='sm'>
            Billing
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {/* Usage Details */}
        <div className='bg-ui-muted/60 rounded-lg space-y-3 p-4'>
          <div className='text-ui-muted-foreground flex justify-between text-xs font-medium'>
            <span>Included Credit</span>
            <span>On-Demand Charges</span>
          </div>
          <div className='flex justify-between text-lg font-bold'>
            <span>$18.08 / $20</span>
            <span>$0</span>
          </div>
          <Progress value={90} className='h-2' />
        </div>

        {/* Additional Usage Details */}
        <CollapsibleContent className='flex flex-col gap-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-ui-foreground font-medium'>Requests</span>
            <span className='text-ui-muted-foreground'>$210.84</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-ui-foreground font-medium'>Active CPU</span>
            <span className='text-ui-muted-foreground'>$21.95</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-ui-foreground font-medium'>Events</span>
            <span className='text-ui-muted-foreground'>$21.20</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-ui-foreground font-medium'>
              Storage Usage
            </span>
            <span className='text-ui-muted-foreground'>$20.45</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-ui-foreground font-medium'>Bandwidth</span>
            <span className='text-ui-muted-foreground'>$0.00</span>
          </div>
        </CollapsibleContent>
      </CardContent>

      {/* Toggle button */}
      <div className='absolute -bottom-4 left-1/2 -translate-x-1/2'>
        <CollapsibleTrigger asChild>
        <Button
          variant='outline'
          size='icon-sm'
          className='bg-ui-background hover:bg-ui-background rounded-control shadow-sm'
        >
          <RegistryIcon
            lucide='ChevronDownIcon'
            aria-hidden='true'
            className={cn(
              'transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
          />
          <span className='sr-only'>Toggle card</span>
        </Button>
        </CollapsibleTrigger>
      </div>
    </Card>
    </Collapsible>
  );
}
