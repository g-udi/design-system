'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const statuses = [
  { value: 'available', label: 'Available', color: 'bg-green-500' },
  { value: 'away', label: 'Away', color: 'bg-amber-500' },
  { value: 'busy', label: 'Busy', color: 'bg-red-500' },
  { value: 'offline', label: 'Offline', color: 'bg-gray-400' }
];
export function Pattern() {
  const [status, setStatus] = useState('available');
  const [theme, setTheme] = useState('light');
  const activeStatus = statuses.find((s) => s.value === status) || statuses[0];
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-40'>
            <Avatar className='size-4'>
              <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className='text-sm font-medium'>Alex Johnson</span>

            <RegistryIcon
              lucide='ChevronsUpDownIcon'
              className='ml-auto opacity-60'
              aria-hidden='true'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-60' align='start' sideOffset={8}>
          <div className='flex items-center gap-3 px-1 pt-1.5'>
            <Avatar className='size-8'>
              <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-ui-foreground text-sm font-medium'>
                Alex Johnson
              </span>
              <span className='text-ui-muted-foreground text-xs'>
                ui@alexjohnson.com
              </span>
            </div>
          </div>
          <div className='py-2.5'>
            <Tabs value={theme} onValueChange={setTheme}>
              <TabsList className='w-full'>
                <TabsTrigger value='light' className='h-6 flex-1'>
                  <RegistryIcon
                    lucide='SunIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                </TabsTrigger>
                <TabsTrigger value='dark' className='h-6 flex-1'>
                  <RegistryIcon
                    lucide='MoonIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                </TabsTrigger>
                <TabsTrigger value='system' className='h-6 flex-1'>
                  <RegistryIcon
                    lucide='MonitorIcon'
                    className='size-4'
                    aria-hidden='true'
                  />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className='justify-between'
            >
              <span className='flex items-center gap-2'>
                <RegistryIcon lucide='BuildingIcon' aria-hidden='true' />
                Your Companies
              </span>
              <Badge
                variant='secondary'
                size='sm'
                className='rounded-control px-1.5'
              >
                12
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className='justify-between'
            >
              <span className='flex items-center gap-2'>
                <RegistryIcon lucide='PhoneIcon' aria-hidden='true' />
                Your Numbers
              </span>
              <Badge
                variant='secondary'
                size='sm'
                className='rounded-control px-1.5'
              >
                2
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className='flex items-center gap-2'>
                <span
                  className={cn('size-2 rounded-full', activeStatus.color)}
                />
                {activeStatus.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='w-40'>
              {statuses.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className='justify-between'
                >
                  <span className='flex items-center gap-2'>
                    <span className={`size-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  {status === s.value && (
                    <RegistryIcon
                      lucide='CheckIcon'
                      className='text-ui-muted-foreground size-4'
                      aria-hidden='true'
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='LifeBuoyIcon' aria-hidden='true' />
              Help Center
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
