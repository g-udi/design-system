'use client';
import { useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const options = [
  { key: 'headerBorder', label: 'Header divider' },
  { key: 'footerBorder', label: 'Footer divider' },
  { key: 'menu', label: 'Header menu' },
  { key: 'stacked', label: 'Stacked' }
];

export function Pattern() {
  const [notice, setNotice] = useState('');
  const [certified, setCertified] = useState(false);
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
                      <DropdownMenuItem onSelect={() => setNotice('Anouk Varga assigned in this demo.')} >
                        <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                        Assign caseworker
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setNotice('Reminders enabled in this demo.')} >
                        <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                        Reminders
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button href='/claims' variant='ghost'>
                      <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
                      Open dashboard
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent className='grid gap-2'>
            <p>Follow the step by step guideline to certify for this week before Friday.</p>
            <Button href='/claims/guide' variant='link' size='sm' className='w-fit px-0'>
              See the guideline
              <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
            </Button>
            <p role='status' className='text-xs text-text-muted'>{notice}</p>
          </CardContent>
          <CardFooter className={cn('justify-between gap-2', layout.footerBorder && 'border-t')}>
            <Button href='/team/alex-johnson' variant='ghost' size='sm' className='gap-1.5 ps-1'>
              <Avatar className='size-5'>
                <AvatarImage src='/avatars/person-41.svg' alt='' />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className='text-xs'>@alexjohnson</span>
            </Button>
            <Button variant='outline' size='sm' disabled={certified} onClick={() => { setCertified(true); setNotice('Claim certified in this demo. No claim was submitted.'); }}>Certify</Button>
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
