// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { Fragment } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
const users = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg',
    initials: 'MR'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'EW'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/49.jpg',
    initials: 'DK'
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'lisa@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'LT'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/54.jpg',
    initials: 'JB'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/90.jpg',
    initials: 'MG'
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/12.jpg',
    initials: 'NJ'
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'LT'
  }
];
const members = users.map((user, index) => ({
  ...user,
  position: [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Technical Lead',
    'CTO'
  ][index % 5]
}));
export function Pattern() {
  const anchor = useComboboxAnchor();
  return (
    <Field className='max-w-xs'>
      <Combobox
        multiple
        items={members}
        itemToStringValue={(member) => member.name}
        defaultValue={[members[0], members[1]]}
      >
        <ComboboxChips
          ref={anchor}
          className='has-data-[slot=combobox-chip]:pl-1'
        >
          <ComboboxValue>
            {(selectedMembers) => (
              <Fragment>
                {selectedMembers.map((member) => (
                  <ComboboxChip
                    key={member.id}
                    showRemove={true}
                    className='rounded-full gap-1.5'
                  >
                    <Avatar className='size-4'>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className='text-[8px]'>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    {member.name}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder='Add members...' />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent
          anchor={anchor}
          className='max-w-(--anchor-width) min-w-(--anchor-width)'
        >
          <ComboboxEmpty>No members found.</ComboboxEmpty>
          <ComboboxList>
            {(member) => (
              <ComboboxItem key={member.id} value={member}>
                <Item size='xs' className='p-0'>
                  <Avatar className='size-6'>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <ItemContent>
                    <ItemTitle className='whitespace-nowrap'>
                      {member.name}
                    </ItemTitle>
                    <ItemDescription>{member.position}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
