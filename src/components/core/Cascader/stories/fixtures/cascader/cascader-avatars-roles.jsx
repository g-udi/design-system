'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
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
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
const ROLE_BADGE = {
  Director: 'primary-outline',
  Lead: 'primary-outline',
  Principal: 'info-outline',
  Staff: 'info-outline',
  Senior: 'success-outline',
  Mid: 'warning-outline'
};
function RoleBadge({ role }) {
  const variant = ROLE_BADGE[role];
  return (
    <Badge variant={variant} className='shrink-0'>
      {role}
    </Badge>
  );
}
function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}
function MemberAvatar({ member, className, fallbackClassName }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={member.data?.avatar} alt={member.label} />
      <AvatarFallback className={fallbackClassName}>
        {initials(member.label)}
      </AvatarFallback>
    </Avatar>
  );
}
const teams = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'eng.ada',
        label: 'Wren Haldane',
        data: {
          avatar:
            '/avatars/person-41.svg',
          role: 'Staff',
          status: 'online'
        }
      },
      {
        value: 'eng.marcus',
        label: 'Dorian Bellweather',
        data: {
          avatar:
            '/avatars/person-20.svg',
          role: 'Senior',
          status: 'away'
        }
      },
      {
        value: 'eng.priya',
        label: 'Priyanka Ramos',
        data: {
          avatar:
            '/avatars/person-31.svg',
          role: 'Lead',
          status: 'online'
        }
      }
    ]
  },
  {
    value: 'design',
    label: 'Design',
    children: [
      {
        value: 'design.june',
        label: 'Sunniva Okeke',
        data: {
          avatar:
            '/avatars/person-24.svg',
          role: 'Principal',
          status: 'online'
        }
      },
      {
        value: 'design.theo',
        label: 'Teodora Lindqvist-Ruiz',
        data: {
          avatar:
            '/avatars/person-45.svg',
          role: 'Mid',
          status: 'away'
        }
      }
    ]
  },
  {
    value: 'product',
    label: 'Product',
    children: [
      {
        value: 'product.samira',
        label: 'Samira Hadley',
        data: {
          avatar:
            '/avatars/person-50.svg',
          role: 'Director',
          status: 'online'
        }
      },
      {
        value: 'product.owen',
        label: 'Evren Fitzwilliam',
        data: {
          avatar:
            '/avatars/person-47.svg',
          role: 'Senior',
          status: 'away'
        }
      }
    ]
  },
  {
    value: 'marketing',
    label: 'Marketing',
    children: [
      {
        value: 'marketing.lena',
        label: 'Saskia Vellacott',
        data: {
          avatar:
            '/avatars/person-25.svg',
          role: 'Lead',
          status: 'online'
        }
      },
      {
        value: 'marketing.dmitri',
        label: 'Kasimir Lund',
        data: {
          avatar:
            '/avatars/person-07.svg',
          role: 'Mid',
          status: 'away'
        }
      }
    ]
  },
  {
    value: 'sales',
    label: 'Sales',
    children: [
      {
        value: 'sales.nadia',
        label: 'Nadira Pelletier',
        data: {
          avatar:
            '/avatars/person-23.svg',
          role: 'Lead',
          status: 'online'
        }
      },
      {
        value: 'sales.tom',
        label: 'Tamsin Ashby',
        data: {
          avatar:
            '/avatars/person-41.svg',
          role: 'Mid',
          status: 'away'
        }
      }
    ]
  },
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 'support.hana',
        label: 'Mitsuko Varnell',
        data: {
          avatar:
            '/avatars/person-20.svg',
          role: 'Senior',
          status: 'online'
        }
      },
      {
        value: 'support.felix',
        label: 'Ayo Lindgren',
        data: {
          avatar:
            '/avatars/person-45.svg',
          role: 'Mid',
          status: 'away'
        }
      }
    ]
  },
  {
    value: 'data',
    label: 'Data',
    children: [
      {
        value: 'data.ines',
        label: 'Solenne Arbour',
        data: {
          avatar:
            '/avatars/person-24.svg',
          role: 'Senior',
          status: 'online'
        }
      },
      {
        value: 'data.raj',
        label: 'Rajan Bhattacharyya',
        data: {
          avatar:
            '/avatars/person-31.svg',
          role: 'Staff',
          status: 'away'
        }
      }
    ]
  }
];
const membersByValue = new Map(
  teams
    .flatMap((team) => team.children ?? [])
    .map((member) => [member.value, member])
);
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        items={teams}
        value={value}
        onValueChange={setValue}
        renderLabel={(node, state) =>
          state.branch ? (
            <span className='w-full truncate text-start font-medium'>
              {node.label}
            </span>
          ) : (
            <span className='flex w-full min-w-0 items-center gap-2'>
              <span className='relative shrink-0'>
                <MemberAvatar
                  member={node}
                  className='size-6'
                  fallbackClassName='text-xs'
                />
                <span
                  aria-hidden='true'
                  className={`ring-ui-popover absolute -end-0.5 -bottom-0.5 size-2 rounded-full ring-2 ${node.data?.status === 'online' ? 'bg-success' : 'bg-ui-muted-foreground/40'}`}
                />
              </span>
              {/* No `flex-1`. The name takes the width it needs and gives it
         back first; the chip that follows stays glued to it and the
         leftover space - including the check gutter - lands after
         both, instead of between them. */}
              <span className='min-w-0 truncate text-start'>{node.label}</span>
              {node.data ? <RoleBadge role={node.data.role} /> : null}
            </span>
          )
        }
      >
        <CascaderTrigger
          aria-label='Assignee'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue className='gap-2'>
            {(selected) => {
              const node = selected[0];
              if (!node) {
                return (
                  <span className='text-ui-muted-foreground truncate'>
                    Assign to someone
                  </span>
                );
              }
              const member = membersByValue.get(node.value);
              return (
                <>
                  {member ? (
                    <MemberAvatar
                      member={member}
                      className='size-5'
                      fallbackClassName='text-xs'
                    />
                  ) : null}
                  <span className='truncate'>{node.label}</span>
                </>
              );
            }}
          </CascaderValue>
        </CascaderTrigger>

        <CascaderContent className='w-80'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
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
