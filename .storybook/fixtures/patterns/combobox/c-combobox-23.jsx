'use client';
import * as React from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const noLeadOption = {
  type: 'none',
  value: 'none',
  label: 'No lead'
};
const teamMembers = [
  {
    type: 'member',
    id: 'member-1',
    value: 'shuhrat-saipov',
    label: 'Shuhrat Saipov',
    avatar:
      'static/images/art/4.svg',
    initials: 'SS',
    isCurrentUser: true
  },
  {
    type: 'member',
    id: 'member-2',
    value: 'nadia-karimova',
    label: 'Nadia Karimova',
    avatar:
      'static/images/art/7.svg',
    initials: 'NK'
  },
  {
    type: 'member',
    id: 'member-3',
    value: 'bekzod-rakhimov',
    label: 'Bekzod Rakhimov',
    avatar:
      'static/images/art/5.svg',
    initials: 'BR'
  },
  {
    type: 'member',
    id: 'member-4',
    value: 'lina-bauer',
    label: 'Lina Bauer',
    avatar:
      'static/images/art/8.svg',
    initials: 'LB'
  },
  {
    type: 'member',
    id: 'member-5',
    value: 'omar-haddad',
    label: 'Omar Haddad',
    avatar:
      'static/images/art/5.svg',
    initials: 'OH'
  },
  {
    type: 'member',
    id: 'member-6',
    value: 'priya-nand',
    label: 'Priya Nand',
    avatar:
      'static/images/art/11.svg',
    initials: 'PN'
  },
  {
    type: 'member',
    id: 'member-7',
    value: 'kenji-watan',
    label: 'Kenji Watan',
    avatar:
      'static/images/art/10.svg',
    initials: 'KW'
  },
  {
    type: 'member',
    id: 'member-8',
    value: 'ava-sinclair',
    label: 'Ava Sinclair',
    avatar:
      'static/images/art/6.svg',
    initials: 'AS'
  },
  {
    type: 'member',
    id: 'member-9',
    value: 'nia-okafor',
    label: 'Nia Okafor',
    avatar:
      'static/images/art/11.svg',
    initials: 'NO'
  },
  {
    type: 'member',
    id: 'member-10',
    value: 'matteo-sosa',
    label: 'Matteo Sosa',
    avatar:
      'static/images/art/10.svg',
    initials: 'MS'
  },
  {
    type: 'member',
    id: 'member-11',
    value: 'salma-rahman',
    label: 'Salma Rahman',
    avatar:
      'static/images/art/5.svg',
    initials: 'SR'
  },
  {
    type: 'member',
    id: 'member-12',
    value: 'jonas-meyer',
    label: 'Jonas Meyer',
    avatar:
      'static/images/art/4.svg',
    initials: 'JM'
  }
];
const leadOptions = [noLeadOption, ...teamMembers];
function UserGlyph({ className }) {
  return (
    <RegistryIcon
      lucide='UserIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
function LeadTriggerLabel({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <UserGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <Avatar className='size-5'>
        <AvatarImage src={option.avatar} alt={option.label} />
        <AvatarFallback className='text-xs'>
          {option.initials}
        </AvatarFallback>
      </Avatar>
      <span className='truncate'>{option.label}</span>
    </span>
  );
}
function LeadListRow({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <UserGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  return (
    <Item size='xs' className='p-0'>
      <ItemMedia>
        <Avatar className='size-5'>
          <AvatarImage src={option.avatar} alt={option.label} />
          <AvatarFallback className='text-xs'>
            {option.initials}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='gap-1 whitespace-nowrap'>
          <span>{option.label}</span>
          {option.isCurrentUser ? (
            <span className='text-ui-muted-foreground font-normal'>(You)</span>
          ) : null}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}
export function Pattern() {
  const [lead, setLead] = React.useState(noLeadOption);
  return (
    <Field className='max-w-xs'>
      <Combobox
        items={leadOptions}
        value={lead}
        onValueChange={setLead}
        itemToStringValue={(item) => item.label}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type='button'
              variant='outline'
              className='w-full justify-between font-normal'
            />
          }
        >
          <ComboboxValue placeholder='No lead'>
            {(selectedLead) =>
              selectedLead ? (
                <LeadTriggerLabel option={selectedLead} />
              ) : (
                <span className='text-ui-muted-foreground'>No lead</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput
            showTrigger={false}
            placeholder='Select lead'
            className='mb-1'
          />
          <ComboboxEmpty>No team members found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noLeadOption}>
              <LeadListRow option={noLeadOption} />
            </ComboboxItem>

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>Team members</ComboboxLabel>
              <ComboboxCollection>
                {(member) => (
                  <ComboboxItem key={member.id} value={member}>
                    <LeadListRow option={member} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
