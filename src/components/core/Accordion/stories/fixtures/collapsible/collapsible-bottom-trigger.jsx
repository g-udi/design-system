import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='mx-auto h-72 w-full max-w-xs'>
      <Collapsible className='relative'>
        <Card>
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='text-sm'>3 days remaining in cycle</CardTitle>
            <CardAction>
              <Button href='/settings/billing' variant='outline' size='sm'>
                Billing
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='bg-surface-muted/60 border-border rounded-lg space-y-2 border p-3'>
              <div className='flex justify-between text-sm font-medium'>
                <span>$18.08 / $20</span>
                <span>$200</span>
              </div>
              <Progress value={90} className='bg-accent/20 h-1.5' />
            </div>

            <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
              <div className='flex flex-col gap-2.5 pt-2'>
                {[
                  { label: 'Requests', value: '$210.84' },
                  { label: 'Active CPU', value: '$21.95' },
                  { label: 'Events', value: '$21.20' },
                  { label: 'Storage Usage', value: '$20.45' }
                ].map((item) => (
                  <div
                    key={item.label}
                    className='flex justify-between text-xs'
                  >
                    <span className='text-text-muted font-medium'>
                      {item.label}
                    </span>
                    <span className='font-medium'>{item.value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>

        <div className='absolute -bottom-3.5 left-1/2 -translate-x-1/2'>
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              size='icon-sm'
              className='bg-surface! rounded-control shadow-sm'
            >
              <RegistryIcon
                lucide='ChevronDownIcon'
                aria-hidden='true'
                className='size-3.5 transition-transform in-data-panel-open:rotate-180'
              />
              <span className='sr-only'>Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}
