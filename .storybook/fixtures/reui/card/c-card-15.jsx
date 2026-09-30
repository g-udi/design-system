// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const title = 'Revenue';
  const value = '$12.4k';
  const delta = 12.5;
  const positive = true;
  const lastMonth = '$11.0k';
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
                <DropdownMenuItem>
                  <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='TriangleAlertIcon' aria-hidden='true' />
                  Add Alert
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='PinIcon' aria-hidden='true' />
                  Pin to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Share2Icon' aria-hidden='true' />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive'>
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
      </CardContent>
    </Card>
  );
}
