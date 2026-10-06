'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';

function AutomationIllustration() {
  return (
    <svg
      width='200'
      height='120'
      viewBox='0 0 200 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Left connection line with arrow */}
      <path
        d='M30 60 L68 60'
        className='stroke-ui-muted-foreground/30'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <polygon
        points='66,56 74,60 66,64'
        className='fill-ui-muted-foreground/30'
      />

      {/* Toggle body */}
      <rect
        x='76'
        y='42'
        width='56'
        height='36'
        rx='18'
        className='stroke-ui-primary/60 fill-ui-primary/5 dark:fill-ui-primary/10'
        strokeWidth='2'
      />
      {/* Toggle circle */}
      <circle cx='94' cy='60' r='12' className='fill-ui-primary/40' />
      <circle cx='94' cy='60' r='6' className='fill-ui-primary' />

      {/* Right connection line */}
      <path
        d='M134 60 Q150 60 158 48'
        className='stroke-ui-muted-foreground/30'
        strokeWidth='2'
        fill='none'
        strokeLinecap='round'
      />
      <circle cx='162' cy='44' r='3' className='fill-ui-muted-foreground/20' />

      {/* Bottom right connection */}
      <path
        d='M134 60 Q150 60 158 72'
        className='stroke-ui-muted-foreground/30'
        strokeWidth='2'
        fill='none'
        strokeLinecap='round'
      />
      <circle cx='162' cy='76' r='3' className='fill-ui-muted-foreground/20' />

      {/* Decorative dots */}
      <circle cx='22' cy='60' r='2' className='fill-ui-muted-foreground/20' />
      <circle cx='174' cy='44' r='2' className='fill-ui-muted-foreground/15' />
      <circle cx='174' cy='76' r='2' className='fill-ui-muted-foreground/15' />
    </svg>
  );
}

function StackedCardsIllustration() {
  return (
    <div className='relative h-24 w-52' aria-hidden='true'>
      {/* Back card */}
      <div className='bg-ui-muted/60 dark:bg-ui-muted/30 border-ui-border/50 absolute inset-x-6 top-0 h-6 rounded-t-lg border' />
      {/* Middle card */}
      <div className='bg-ui-muted/80 dark:bg-ui-muted/50 border-ui-border/60 absolute inset-x-3 top-3 h-6 rounded-t-lg border' />
      {/* Front card */}
      <div className='bg-ui-background border-ui-border absolute inset-x-0 top-6 flex h-16 items-center gap-3 rounded-lg border px-4 shadow-sm'>
        <div className='bg-ui-muted size-8 shrink-0 rounded' />
        <div className='flex flex-1 flex-col gap-1.5'>
          <div className='bg-ui-muted h-2.5 w-3/4 rounded' />
          <div className='bg-ui-muted/60 h-2 w-1/2 rounded' />
        </div>
      </div>
      {/* Fade overlay */}
      <div className='from-ui-background/0 via-ui-background/60 to-ui-background pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-b' />
    </div>
  );
}

function ChatIllustration() {
  return (
    <svg
      width='180'
      height='120'
      viewBox='0 0 180 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Left bubble */}
      <rect
        x='20'
        y='20'
        width='80'
        height='44'
        rx='12'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
      />
      {/* Left bubble tail */}
      <path
        d='M36 64 L32 76 L48 64'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      {/* Left bubble text lines */}
      <rect
        x='32'
        y='32'
        width='48'
        height='4'
        rx='2'
        className='fill-ui-muted-foreground/20'
      />
      <rect
        x='32'
        y='42'
        width='36'
        height='4'
        rx='2'
        className='fill-ui-muted-foreground/15'
      />
      {/* Left bubble avatar dot */}
      <circle cx='32' cy='52' r='3' className='fill-ui-muted-foreground/12' />

      {/* Right bubble */}
      <rect
        x='80'
        y='50'
        width='80'
        height='40'
        rx='12'
        className='fill-ui-primary/10 dark:fill-ui-primary/15 stroke-ui-primary/30'
        strokeWidth='1.5'
      />
      {/* Right bubble tail */}
      <path
        d='M144 90 L148 100 L132 90'
        className='fill-ui-primary/10 dark:fill-ui-primary/15 stroke-ui-primary/30'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      {/* Right bubble text lines */}
      <rect
        x='92'
        y='62'
        width='52'
        height='4'
        rx='2'
        className='fill-ui-primary/20'
      />
      <rect
        x='92'
        y='72'
        width='32'
        height='4'
        rx='2'
        className='fill-ui-primary/15'
      />

      {/* Decorative dots */}
      <circle cx='14' cy='46' r='2' className='fill-ui-muted-foreground/10' />
      <circle cx='168' cy='66' r='2' className='fill-ui-primary/15' />
      <circle
        cx='110'
        cy='16'
        r='2.5'
        className='fill-ui-muted-foreground/10'
      />
    </svg>
  );
}

function NodesIllustration() {
  return (
    <svg
      width='200'
      height='120'
      viewBox='0 0 200 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Connection lines */}
      <line
        x1='100'
        y1='60'
        x2='44'
        y2='30'
        className='stroke-ui-border'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <line
        x1='100'
        y1='60'
        x2='44'
        y2='90'
        className='stroke-ui-border'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <line
        x1='100'
        y1='60'
        x2='156'
        y2='30'
        className='stroke-ui-border'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <line
        x1='100'
        y1='60'
        x2='156'
        y2='90'
        className='stroke-ui-border'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />

      {/* Center node */}
      <circle
        cx='100'
        cy='60'
        r='18'
        className='fill-ui-primary/10 dark:fill-ui-primary/15 stroke-ui-primary/40'
        strokeWidth='1.5'
      />
      <circle cx='100' cy='60' r='6' className='fill-ui-primary/30' />
      <circle cx='100' cy='60' r='2.5' className='fill-ui-primary' />

      {/* Top-left node */}
      <circle
        cx='44'
        cy='30'
        r='14'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
      />
      <rect
        x='37'
        y='26'
        width='14'
        height='3'
        rx='1.5'
        className='fill-ui-muted-foreground/20'
      />
      <rect
        x='40'
        y='32'
        width='8'
        height='2'
        rx='1'
        className='fill-ui-muted-foreground/12'
      />

      {/* Bottom-left node */}
      <circle
        cx='44'
        cy='90'
        r='14'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
      />
      <rect
        x='37'
        y='86'
        width='14'
        height='3'
        rx='1.5'
        className='fill-ui-muted-foreground/20'
      />
      <rect
        x='40'
        y='92'
        width='8'
        height='2'
        rx='1'
        className='fill-ui-muted-foreground/12'
      />

      {/* Top-right node */}
      <circle
        cx='156'
        cy='30'
        r='14'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
      />
      <rect
        x='149'
        y='26'
        width='14'
        height='3'
        rx='1.5'
        className='fill-ui-muted-foreground/20'
      />
      <rect
        x='152'
        y='32'
        width='8'
        height='2'
        rx='1'
        className='fill-ui-muted-foreground/12'
      />

      {/* Bottom-right node */}
      <circle
        cx='156'
        cy='90'
        r='14'
        className='fill-ui-muted dark:fill-ui-muted/60 stroke-ui-border'
        strokeWidth='1.5'
      />
      <rect
        x='149'
        y='86'
        width='14'
        height='3'
        rx='1.5'
        className='fill-ui-muted-foreground/20'
      />
      <rect
        x='152'
        y='92'
        width='8'
        height='2'
        rx='1'
        className='fill-ui-muted-foreground/12'
      />

      {/* Small floating dots */}
      <circle cx='72' cy='40' r='2' className='fill-ui-primary/15' />
      <circle cx='128' cy='80' r='2' className='fill-ui-primary/15' />
      <circle cx='72' cy='80' r='1.5' className='fill-ui-muted-foreground/10' />
      <circle
        cx='128'
        cy='40'
        r='1.5'
        className='fill-ui-muted-foreground/10'
      />
    </svg>
  );
}

const scenes = {
  automations: {
    label: 'Automations',
    Illustration: AutomationIllustration,
    title: 'No automations yet',
    description: 'Hook up your favorite tools and let the workflows run themselves.',
    actions: [{ label: 'Create automation', href: '/automations/new' }]
  },
  products: {
    label: 'Products',
    Illustration: StackedCardsIllustration,
    title: 'No products',
    description: 'Nothing here yet. We will notify you when there is an update.',
    actions: []
  },
  messages: {
    label: 'Messages',
    Illustration: ChatIllustration,
    title: 'No messages yet',
    description: 'Start a conversation with your team. Messages will appear here.',
    actions: [{ label: 'Send a message', href: '/messages/new' }]
  },
  integrations: {
    label: 'Integrations',
    Illustration: NodesIllustration,
    title: 'No integrations',
    description: 'Connect your tools and services to streamline your workflow.',
    actions: [{ label: 'Browse integrations', href: '/settings/integrations' }, { label: 'Learn more', href: '/docs/integrations' }]
  }
};

export function Pattern() {
  const [scene, setScene] = useState('automations');
  const { Illustration, title, description, actions } = scenes[scene];
  return (
    <div className='mx-auto grid w-full max-w-lg justify-items-center gap-3'>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        spacing={1}
        className='flex-wrap justify-center'
        value={scene}
        onValueChange={(value) => value && setScene(value)}
        aria-label='Empty state scene'
      >
        {Object.entries(scenes).map(([key, { label }]) => (
          <ToggleGroupItem key={key} value={key}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Empty className='rounded-lg border border-solid py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <Illustration />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {actions.length ? (
          <EmptyContent>
            <div className='flex gap-2'>
              {actions.map((action, index) => (
                <Button key={action.label} href={action.href} size='sm' variant={index ? 'outline' : 'solid'}>
                  {action.label}
                </Button>
              ))}
            </div>
          </EmptyContent>
        ) : null}
      </Empty>
    </div>
  );
}
