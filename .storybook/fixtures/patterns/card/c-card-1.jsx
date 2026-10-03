'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const options = [
  { key: 'headerBorder', label: 'Header divider' },
  { key: 'footerBorder', label: 'Footer divider' },
  { key: 'menu', label: 'Header menu' },
  { key: 'stacked', label: 'Stacked' }
];

export function Pattern() {
  const [layout, setLayout] = useState({ headerBorder: true, footerBorder: true, menu: true, stacked: false });
  return (
    <div className='mx-auto grid w-full max-w-sm gap-3'>
      <div role='group' aria-label='Card options' className='flex flex-wrap gap-x-4 gap-y-2'>
        {options.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={layout[option.key]}
              onCheckedChange={(checked) => setLayout((current) => ({ ...current, [option.key]: checked }))}
            />
            {option.label}
          </Label>
        ))}
      </div>
      <div className={cn('relative', layout.stacked && 'pb-3')}>
        <Card className='relative z-1'>
          <CardHeader className={cn(layout.headerBorder && 'border-b')}>
            <CardTitle>Weekly benefits claim</CardTitle>
            <CardDescription>Certify each week to keep payments on schedule.</CardDescription>
            {layout.menu ? (
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label='More actions' variant='ghost' size='icon-sm'>
                      <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-48'>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Claim</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                        Assign caseworker
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                        Reminders
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
                      Open dashboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent className='grid gap-2'>
            <p>Follow the step by step guideline to certify for this week before Friday.</p>
            <Button variant='link' size='sm' className='w-fit px-0'>
              See the guideline
              <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
            </Button>
          </CardContent>
          <CardFooter className={cn('justify-between gap-2', layout.footerBorder && 'border-t')}>
            <Button variant='ghost' size='sm' className='gap-1.5 ps-1'>
              <Avatar className='size-5'>
                <AvatarImage src='/avatars/men/32.jpg' alt='' />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className='text-xs'>@alexjohnson</span>
            </Button>
            <Button variant='outline' size='sm'>Certify</Button>
          </CardFooter>
        </Card>
        {layout.stacked ? (
          <>
            <div aria-hidden='true' className='absolute inset-x-4 top-4 bottom-0 z-0 rounded-lg border bg-ui-card shadow-sm' />
            <div aria-hidden='true' className='absolute inset-x-2 top-2 bottom-1.5 z-0 rounded-lg border bg-ui-card shadow-sm' />
          </>
        ) : null}
      </div>
    </div>
  );
}
