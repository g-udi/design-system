'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

function ImageCard({ bleed }) {
  return (
    <Card className={cn('w-full', bleed && 'overflow-hidden p-0')}>
      <CardContent className={cn('flex flex-col gap-3', bleed && 'p-0')}>
        <div className={cn('h-40 w-full overflow-hidden', !bleed && 'rounded-lg')}>
          <img src='static/images/art/4.svg' alt='' width={1e3} height={800} className='size-full object-cover' />
        </div>
        <div className={cn('flex flex-col gap-3', bleed && 'px-4 pb-4')}>
          <div className='flex items-center justify-between gap-2'>
            <Badge variant='outline'>
              <RegistryIcon lucide='BellIcon' aria-hidden='true' />
              Trending
            </Badge>
            <span className='flex items-center gap-1 text-xs font-medium text-text-muted'>
              <RegistryIcon lucide='SparklesIcon' aria-hidden='true' className='size-3.5' />
              Featured
            </span>
          </div>
          <p className='text-sm text-text'>Manage tasks, projects, and your team in one place from day one.</p>
          <Button size='sm'>
            Get started
            <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OverlayCard() {
  return (
    <Card className='group/media relative h-full min-h-80 w-full overflow-hidden border-0 p-0'>
      <img
        src='static/images/art/5.svg'
        alt=''
        width={1e3}
        height={800}
        className='absolute inset-0 size-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover/media:scale-110'
      />
      <div className='absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/60 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover/media:from-black/70' />
      <div className='relative flex items-center gap-2 p-4'>
        <div className='relative'>
          <Avatar>
            <AvatarImage src='https://randomuser.me/api/portraits/men/75.jpg' alt='' />
            <AvatarFallback>NJ</AvatarFallback>
          </Avatar>
          <RegistryIcon lucide='BadgeCheckIcon' aria-label='Verified' className='absolute -top-1 -right-1 size-4 fill-info text-info-foreground' />
        </div>
        <div className='min-w-0 flex-1 text-sm'>
          <a href='#' className='block font-medium text-white'>Nick Johnson</a>
          <span className='block truncate text-xs text-white/80'>6 min read</span>
        </div>
        <Badge variant='success'>New</Badge>
      </div>
      <div className='absolute inset-x-0 bottom-0 space-y-1 p-4'>
        <h3 className='text-lg font-semibold text-white'>Designing with tokens</h3>
        <p className='text-sm text-white/90'>The image scales and the fade deepens on hover.</p>
      </div>
    </Card>
  );
}

export function Pattern() {
  const [bleed, setBleed] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <Label className='gap-2 text-sm font-normal'>
        <Switch size='sm' checked={bleed} onCheckedChange={setBleed} />
        Full-bleed image
      </Label>
      <div className='grid gap-3 sm:grid-cols-2'>
        <ImageCard bleed={bleed} />
        <OverlayCard />
      </div>
    </div>
  );
}
