'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '@gaudi/design-system/core/Cascader';
import { CascaderItems } from '@gaudi/design-system/core/Cascader';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const accents = {
  travel: {
    hue: 'text-sky-600! **:text-sky-600! dark:text-sky-400! dark:**:text-sky-400!',
    glyph: <RegistryIcon lucide='PlaneIcon' />
  },
  software: {
    hue: 'text-indigo-600! **:text-indigo-600! dark:text-indigo-400! dark:**:text-indigo-400!',
    glyph: <RegistryIcon lucide='CodeIcon' />
  },
  marketing: {
    hue: 'text-fuchsia-600! **:text-fuchsia-600! dark:text-fuchsia-400! dark:**:text-fuchsia-400!',
    glyph: <RegistryIcon lucide='MegaphoneIcon' />
  },
  people: {
    hue: 'text-emerald-600! **:text-emerald-600! dark:text-emerald-400! dark:**:text-emerald-400!',
    glyph: <RegistryIcon lucide='UsersIcon' />
  },
  workplace: {
    hue: 'text-amber-600! **:text-amber-600! dark:text-amber-400! dark:**:text-amber-400!',
    glyph: <RegistryIcon lucide='Building2Icon' />
  },
  hardware: {
    hue: 'text-violet-600! **:text-violet-600! dark:text-violet-400! dark:**:text-violet-400!',
    glyph: <RegistryIcon lucide='LaptopIcon' />
  },
  services: {
    hue: 'text-teal-600! **:text-teal-600! dark:text-teal-400! dark:**:text-teal-400!',
    glyph: <RegistryIcon lucide='BriefcaseBusinessIcon' />
  },
  logistics: {
    hue: 'text-rose-600! **:text-rose-600! dark:text-rose-400! dark:**:text-rose-400!',
    glyph: <RegistryIcon lucide='TruckIcon' />
  }
};
const TILE_SELECTED_CLASS =
  'in-data-[selected]:border-current/45! in-data-[selected]:bg-current/10! in-data-[selected]:ring-2 in-data-[selected]:ring-current/25';
function AccountTile({ account: account2, size = 'sm', className }) {
  return (
    <IconTile
      variant='outline'
      size={size}
      className={cn(accents[account2].hue, className)}
    >
      {accents[account2].glyph}
    </IconTile>
  );
}
const tiles = {
  travel: <AccountTile account='travel' className={TILE_SELECTED_CLASS} />,
  software: <AccountTile account='software' className={TILE_SELECTED_CLASS} />,
  marketing: (
    <AccountTile account='marketing' className={TILE_SELECTED_CLASS} />
  ),
  people: <AccountTile account='people' className={TILE_SELECTED_CLASS} />,
  workplace: (
    <AccountTile account='workplace' className={TILE_SELECTED_CLASS} />
  ),
  hardware: <AccountTile account='hardware' className={TILE_SELECTED_CLASS} />,
  services: <AccountTile account='services' className={TILE_SELECTED_CLASS} />,
  logistics: <AccountTile account='logistics' className={TILE_SELECTED_CLASS} />
};
function accountOf(value) {
  const key = value.split('.')[0];
  return key in accents ? key : null;
}
function account(name, node) {
  return {
    ...node,
    icon: tiles[name],
    children: node.children?.map((child) => account(name, child))
  };
}
const accounts = [
  account('travel', {
    value: 'travel',
    label: 'Travel',
    description: '$38,900',
    data: { code: '6100' },
    children: [
      {
        value: 'travel.airfare',
        label: 'Airfare',
        description: '$19,480',
        data: { code: '6110' },
        children: [
          {
            value: 'travel.airfare.domestic',
            label: 'Domestic',
            description: '$6,400',
            data: { code: '6111' }
          },
          {
            value: 'travel.airfare.international',
            label: 'International',
            description: '$11,900',
            data: { code: '6112' }
          },
          {
            value: 'travel.airfare.changes',
            label: 'Change fees',
            description: 'Closed to new spend',
            data: { code: '6113' },
            disabled: true
          }
        ]
      },
      {
        value: 'travel.lodging',
        label: 'Lodging',
        description: '$12,350',
        data: { code: '6120' },
        children: [
          {
            value: 'travel.lodging.hotels',
            label: 'Hotels',
            description: '$9,240',
            data: { code: '6121' }
          },
          {
            value: 'travel.lodging.rentals',
            label: 'Short-term rentals',
            description: '$3,110',
            data: { code: '6122' }
          }
        ]
      },
      {
        value: 'travel.ground',
        label: 'Ground transport',
        description: '$7,070',
        data: { code: '6130' },
        children: [
          {
            value: 'travel.ground.rideshare',
            label: 'Rideshare',
            description: '$2,860',
            data: { code: '6131' }
          },
          {
            value: 'travel.ground.rail',
            label: 'Rail',
            description: '$1,940',
            data: { code: '6132' }
          },
          {
            value: 'travel.ground.rental',
            label: 'Car rental',
            description: '$2,270',
            data: { code: '6133' }
          }
        ]
      }
    ]
  }),
  account('software', {
    value: 'software',
    label: 'Software',
    description: '$22,230',
    data: { code: '6200' },
    children: [
      {
        value: 'software.design',
        label: 'Design tools',
        description: '$4,320',
        data: { code: '6210' }
      },
      {
        value: 'software.developer',
        label: 'Developer tools',
        description: '$11,760',
        data: { code: '6220' }
      },
      {
        value: 'software.analytics',
        label: 'Analytics',
        description: '$6,150',
        data: { code: '6230' }
      }
    ]
  }),
  account('marketing', {
    value: 'marketing',
    label: 'Marketing',
    description: '$58,570',
    data: { code: '6300' },
    children: [
      {
        value: 'marketing.ads',
        label: 'Paid advertising',
        description: '$35,350',
        data: { code: '6310' },
        children: [
          {
            value: 'marketing.ads.search',
            label: 'Search',
            description: '$18,400',
            data: { code: '6311' }
          },
          {
            value: 'marketing.ads.social',
            label: 'Social',
            description: '$12,650',
            data: { code: '6312' }
          },
          {
            value: 'marketing.ads.display',
            label: 'Display',
            description: '$4,300',
            data: { code: '6313' }
          }
        ]
      },
      {
        value: 'marketing.events',
        label: 'Events',
        description: '$15,800',
        data: { code: '6320' },
        children: [
          {
            value: 'marketing.events.conferences',
            label: 'Conferences',
            description: '$9,800',
            data: { code: '6321' }
          },
          {
            value: 'marketing.events.sponsorships',
            label: 'Sponsorships',
            description: '$6,000',
            data: { code: '6322' }
          }
        ]
      },
      {
        value: 'marketing.content',
        label: 'Content',
        description: '$7,420',
        data: { code: '6330' }
      }
    ]
  }),
  account('people', {
    value: 'people',
    label: 'People',
    description: '$279,950',
    data: { code: '6400' },
    children: [
      {
        value: 'people.salaries',
        label: 'Salaries',
        description: '$214,600',
        data: { code: '6410' }
      },
      {
        value: 'people.contractors',
        label: 'Contractors',
        description: '$38,900',
        data: { code: '6420' }
      },
      {
        value: 'people.benefits',
        label: 'Benefits',
        description: '$26,450',
        data: { code: '6430' }
      }
    ]
  }),
  account('workplace', {
    value: 'workplace',
    label: 'Workplace',
    description: '$38,020',
    data: { code: '6500' },
    children: [
      {
        value: 'workplace.rent',
        label: 'Rent',
        description: '$31,200',
        data: { code: '6510' }
      },
      {
        value: 'workplace.utilities',
        label: 'Utilities',
        description: '$4,180',
        data: { code: '6520' }
      },
      {
        value: 'workplace.supplies',
        label: 'Supplies',
        description: '$2,640',
        data: { code: '6530' }
      }
    ]
  }),
  account('hardware', {
    value: 'hardware',
    label: 'Hardware',
    description: '$35,070',
    data: { code: '6600' },
    children: [
      {
        value: 'hardware.laptops',
        label: 'Laptops',
        description: '$24,300',
        data: { code: '6610' }
      },
      {
        value: 'hardware.displays',
        label: 'Displays',
        description: '$7,650',
        data: { code: '6620' }
      },
      {
        value: 'hardware.peripherals',
        label: 'Peripherals',
        description: '$3,120',
        data: { code: '6630' }
      }
    ]
  }),
  account('services', {
    value: 'services',
    label: 'Professional services',
    description: '$38,550',
    data: { code: '6700' },
    children: [
      {
        value: 'services.legal',
        label: 'Legal',
        description: '$16,900',
        data: { code: '6710' }
      },
      {
        value: 'services.accounting',
        label: 'Accounting',
        description: '$12,400',
        data: { code: '6720' }
      },
      {
        value: 'services.consulting',
        label: 'Consulting',
        description: '$9,250',
        data: { code: '6730' }
      }
    ]
  }),
  account('logistics', {
    value: 'logistics',
    label: 'Logistics',
    description: '$21,410',
    data: { code: '6800' },
    children: [
      {
        value: 'logistics.freight',
        label: 'Freight',
        description: '$12,900',
        data: { code: '6810' }
      },
      {
        value: 'logistics.courier',
        label: 'Courier',
        description: '$5,240',
        data: { code: '6820' }
      },
      {
        value: 'logistics.packaging',
        label: 'Packaging',
        description: '$3,270',
        data: { code: '6830' }
      }
    ]
  })
];
export function Pattern() {
  const [value, setValue] = useState('');
  const selectedAccount = value ? accountOf(value) : null;
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        items={accounts}
        value={value}
        onValueChange={setValue}
        selectable='any'
        indicator={false}
        renderLabel={(node, state) => (
          <>
            <span
              className={cn(
                'w-full truncate text-start',
                // The second channel. A fill is geometry and a weight is
                // geometry; between them the marked row is legible without
                // anyone having to tell sky from teal.
                state.selected ? 'font-semibold' : 'font-medium'
              )}
            >
              {node.label}
            </span>
            <span className='flex w-full min-w-0 items-center gap-1.5 text-xs'>
              <span className='text-ui-muted-foreground shrink-0 tabular-nums'>
                {/* A naked four-digit number after a name is not a fact, it is
         a riddle. The row's accessible name is its text, so the one
         word that makes it a fact is said there and nowhere else. */}
                <span className='sr-only'>account code </span>
                {node.data?.code}
              </span>
              {/* A background, not a colour: the row's highlight rule repaints
         text and leaves this alone, so the two halves stay two halves
         under the pointer. */}
              <span
                aria-hidden='true'
                className='bg-ui-border h-2.5 w-px shrink-0'
              />
              <span className='truncate tabular-nums'>{node.description}</span>
            </span>
          </>
        )}
      >
        <div className='relative w-80'>
          <CascaderTrigger
            aria-label='Expense account'
            showIcon={!value}
            render={
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-between gap-2 font-normal',
                  value && 'pe-8'
                )}
              />
            }
          >
            {selectedAccount ? (
              <AccountTile account={selectedAccount} size='xs' />
            ) : null}
            {/* `showIcon={false}`: the node's own icon is the row-sized tile,
       which no style's button is tall enough to hold. `flex-1` so the
       path takes the space the tile leaves and truncates in it. */}
            <CascaderValue
              showIcon={false}
              placeholder='Assign an expense account'
              className='min-w-0 flex-1'
            />
          </CascaderTrigger>

          {value ? (
            <Button
              variant='ghost'
              size='icon-xs'
              aria-label='Clear account'
              onClick={() => setValue('')}
              className='absolute end-1 top-1/2 -translate-y-1/2'
            >
              <RegistryIcon lucide='XIcon' />
            </Button>
          ) : null}
        </div>

        <CascaderContent className='w-80'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder='Search accounts...' />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  );
}
