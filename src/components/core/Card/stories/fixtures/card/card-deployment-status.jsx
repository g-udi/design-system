import { Item, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const stats = [
  { label: 'Environment', value: 'Production' },
  { label: 'Region', value: 'us-east-1' },
  { label: 'Version', value: 'v2.4.0' },
  { label: 'Status', value: 'Healthy' }
];
export function Pattern() {
  return (
    <Card className='mx-auto w-full max-w-xs overflow-hidden p-0'>
      <CardContent className='flex flex-col items-center p-0'>
        {/* Header with gradient */}
        <div className='flex w-full flex-col items-center justify-center bg-linear-to-b from-fuchsia-50/80 to-transparent dark:from-fuchsia-500/15 py-12'>
          <div className='relative mb-6'>
            <div className='absolute inset-0 scale-150 rounded-full bg-fuchsia-400/10 blur-2xl' />
            <RegistryIcon
              lucide='SquareTerminalIcon'
              aria-hidden='true'
              className='relative size-16 text-fuchsia-600'
              strokeWidth={1.5}
            />
          </div>
          <h3 className='text-ui-foreground text-lg font-semibold'>
            Deployment Successful
          </h3>
          <p className='text-ui-muted-foreground text-sm'>
            Your app is now live
          </p>
        </div>

        {/* Status Rows */}
        <ItemGroup className='gap-1 px-4 pb-6'>
          {stats.map((item, index) => (
            <Item size='sm'
              key={item.label}
              className={cn(
                'justify-between',
                index % 2 === 0 && 'bg-ui-muted/40'
              )}
            >
              <ItemTitle>
                {item.label}
              </ItemTitle>
              <span className='text-ui-muted-foreground text-sm'>
                {item.value}
              </span>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
