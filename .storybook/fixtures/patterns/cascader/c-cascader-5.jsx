'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
const ROLE_BADGE = {
  Director: { variant: 'primary-outline', pin: 'text-ui-primary!' },
  Lead: { variant: 'primary-outline', pin: 'text-ui-primary!' },
  Principal: { variant: 'info-outline', pin: 'text-info-foreground!' },
  Staff: { variant: 'info-outline', pin: 'text-info-foreground!' },
  Senior: { variant: 'success-outline', pin: 'text-success-foreground!' },
  Mid: { variant: 'warning-outline', pin: 'text-warning-foreground!' }
};
function RoleBadge({ role }) {
  const { variant, pin } = ROLE_BADGE[role];
  return (
    <Badge variant={variant} className={cn('shrink-0', pin)}>
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
        label: 'Ada Whitfield',
        data: {
          avatar:
            '/avatars/men/32.jpg',
          role: 'Staff',
          status: 'online'
        }
      },
      {
        value: 'eng.marcus',
        label: 'Marcus Bell',
        data: {
          avatar:
            '/avatars/women/44.jpg',
          role: 'Senior',
          status: 'away'
        }
      },
      {
        value: 'eng.priya',
        label: 'Priya Raman',
        data: {
          avatar:
            '/avatars/men/11.jpg',
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
        label: 'June Okafor',
        data: {
          avatar:
            '/avatars/women/68.jpg',
          role: 'Principal',
          status: 'online'
        }
      },
      {
        value: 'design.theo',
        label: 'Theo Lindqvist',
        data: {
          avatar:
            '/avatars/men/49.jpg',
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
        label: 'Samira Haddad',
        data: {
          avatar:
            '/avatars/men/75.jpg',
          role: 'Director',
          status: 'online'
        }
      },
      {
        value: 'product.owen',
        label: 'Owen Fitzgerald',
        data: {
          avatar:
            '/avatars/men/54.jpg',
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
        label: 'Lena Vasquez',
        data: {
          avatar:
            '/avatars/women/90.jpg',
          role: 'Lead',
          status: 'online'
        }
      },
      {
        value: 'marketing.dmitri',
        label: 'Dmitri Sokolov',
        data: {
          avatar:
            '/avatars/women/12.jpg',
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
        label: 'Nadia Petrova',
        data: {
          avatar:
            '/avatars/women/65.jpg',
          role: 'Lead',
          status: 'online'
        }
      },
      {
        value: 'sales.tom',
        label: 'Tom Ashworth',
        data: {
          avatar:
            '/avatars/men/32.jpg',
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
        label: 'Hana Yoshida',
        data: {
          avatar:
            '/avatars/women/44.jpg',
          role: 'Senior',
          status: 'online'
        }
      },
      {
        value: 'support.felix',
        label: 'Felix Nkemelu',
        data: {
          avatar:
            '/avatars/men/49.jpg',
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
        label: 'Ines Moreau',
        data: {
          avatar:
            '/avatars/women/68.jpg',
          role: 'Senior',
          status: 'online'
        }
      },
      {
        value: 'data.raj',
        label: 'Raj Bhatia',
        data: {
          avatar:
            '/avatars/men/11.jpg',
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
