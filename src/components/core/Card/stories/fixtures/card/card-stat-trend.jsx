import { useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Separator } from '@gaudi/design-system/core/Separator';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { copy } = useCopyToClipboard({ onCopy: () => setNotice('Report link copied.'), onError: () => setNotice('Copy failed. Try again.') });
  const title = 'Revenue';
  const value = '$12.4k';
  const delta = 12.5;
  const positive = true;
  const lastMonth = '$11.0k';
  if (removed) return <Button variant='outline' onClick={() => { setRemoved(false); setNotice('Card restored.'); }}>Restore revenue card</Button>;
  return (
    <Card className='w-full max-w-xs'>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-ui-muted-foreground text-sm font-medium'>
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='-me-1.5'
                aria-label='More options'
              >
                <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link variant='bare' href='/reports/revenue/settings'>
                  <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                  Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setNotice('Revenue alert enabled in this demo.')} >
                  <RegistryIcon lucide='TriangleAlertIcon' aria-hidden='true' />
                  Add Alert
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setPinned((value) => !value); setNotice(pinned ? 'Card unpinned in this demo.' : 'Card pinned in this demo.'); }}>
                  <RegistryIcon lucide='PinIcon' aria-hidden='true' />
                  {pinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => copy('/reports/revenue')}>
                  <RegistryIcon lucide='Share2Icon' aria-hidden='true' />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive' onSelect={() => setRemoved(true)}>
                  <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='space-y-2.5'>
          <div className='flex items-center gap-2.5'>
            <span className='text-ui-foreground text-2xl font-medium tracking-tight tabular-nums'>
              {value}
            </span>
            <Badge variant={positive ? 'success-light' : 'destructive-light'}>
              {positive ? (
                <RegistryIcon lucide='ArrowUpIcon' aria-hidden='true' />
              ) : (
                <RegistryIcon lucide='ArrowDownIcon' aria-hidden='true' />
              )}
              {delta}%
            </Badge>
          </div>
          <Separator />
          <div className='text-ui-muted-foreground text-xs'>
            Vs last month:{' '}
            <span className='text-ui-foreground font-medium tabular-nums'>
              {lastMonth}
            </span>
          </div>
        </div>
        <p role='status' className='text-xs text-text-muted'>{notice}</p>
      </CardContent>
    </Card>
  );
}
