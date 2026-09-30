'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className='relative w-full max-w-md gap-4 overflow-visible pb-1'>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>3 days remaining in cycle</CardTitle>
        <CardAction>
          <Button variant='outline' size='sm'>
            Billing
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent
        className={cn(
          'relative space-y-4 overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[500px]' : 'max-h-48'
        )}
      >
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
        <div className='flex flex-col gap-4'>
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
        </div>

        {/* Faded background effect for collapsed state */}
        <div
          className={cn(
            'from-ui-background pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-lg bg-linear-to-t to-transparent transition-opacity duration-300',
            isOpen ? 'opacity-0' : 'opacity-100'
          )}
        />
      </CardContent>

      {/* Toggle button */}
      <div className='absolute -bottom-4 left-1/2 -translate-x-1/2'>
        <Button
          variant='outline'
          size='icon-sm'
          className='bg-ui-background hover:bg-ui-background rounded-control shadow-sm'
          onClick={() => setIsOpen(!isOpen)}
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
      </div>
    </Card>
  );
}
