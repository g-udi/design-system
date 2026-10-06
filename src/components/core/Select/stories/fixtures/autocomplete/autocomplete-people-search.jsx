'use client';
import { useMemo, useState } from 'react';
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList
} from '@gaudi/design-system/core/Select';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
export function Pattern() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: 'base' });
  const filteredItems = useMemo(() => {
    if (!value) return groupedUsers;
    return groupedUsers
      .map((group) => ({
        ...group,
        items: (group.items || []).filter(
          (item) =>
            contains(item.name || '', value) ||
            contains(item.group || '', value) ||
            contains(item.position || '', value)
        )
      }))
      .filter((group) => group.items && group.items.length > 0);
  }, [value, contains]);
  return (
    <div className='w-full max-w-xs'>
      <Autocomplete
        items={filteredItems}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        itemToStringValue={(item) => item.name}
        filter={null}
      >
        <AutocompleteInput placeholder='e.g. Sabine, editor, Art desk' />
        {open && (
          <AutocompleteContent className='pt-0'>
            {filteredItems.length === 0 ? (
              <AutocompleteEmpty>No one matches that search.</AutocompleteEmpty>
            ) : (
              <AutocompleteList className='not-empty:py-0'>
                {(group) => (
                  <AutocompleteGroup
                    key={group.group}
                    items={group.items}
                    className='py-0'
                  >
                    <AutocompleteGroupLabel className='bg-surface text-text-muted sticky top-0 z-10 me-1.5 py-2.5 text-xs font-medium'>
                      {group.group}
                    </AutocompleteGroupLabel>
                    <AutocompleteCollection>
                      {(item) => (
                        <AutocompleteItem
                          key={item.id}
                          value={item}
                          className='flex items-center gap-2.5 rounded-lg'
                        >
                          <Avatar className='size-7'>
                            <AvatarImage
                              src={item.avatar}
                              alt={item.name || 'User'}
                            />
                            <AvatarFallback>
                              {(item.name || 'U')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0 flex-1'>
                            <div className='truncate font-medium'>
                              {item.name || 'Unknown'}
                            </div>
                            <div className='text-text-muted truncate text-xs'>
                              {item.position || 'No position available'}
                            </div>
                          </div>
                        </AutocompleteItem>
                      )}
                    </AutocompleteCollection>
                  </AutocompleteGroup>
                )}
              </AutocompleteList>
            )}
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}
const usersData = [
  // Development Team
  {
    id: 'john-doe',
    name: 'John Doe',
    group: 'Editorial desk',
    position: 'Senior editor',
    avatar: '/avatars/person-26.svg',
    status: 'Active'
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    group: 'Editorial desk',
    position: 'Staff writer',
    avatar: '/avatars/person-02.svg',
    status: 'Active'
  },
  {
    id: 'mike-wilson',
    name: 'Rafe Winslow',
    group: 'Editorial desk',
    position: 'Copy editor',
    avatar: '/avatars/person-27.svg',
    status: 'Active'
  },
  {
    id: 'sarah-johnson',
    name: 'Sabine Johansson',
    group: 'Editorial desk',
    position: 'Production editor',
    avatar: '/avatars/person-03.svg',
    status: 'Away'
  },
  {
    id: 'david-brown',
    name: 'Ottilie Brandt',
    group: 'Editorial desk',
    position: 'Newsletter editor',
    avatar: '/avatars/person-28.svg',
    status: 'Active'
  },
  {
    id: 'lisa-garcia',
    name: 'Nell Garroway',
    group: 'Editorial desk',
    position: 'Data journalist',
    avatar: '/avatars/person-04.svg',
    status: 'Active'
  },
  // Design Team
  {
    id: 'alex-martinez',
    name: 'Anouk Delacroix',
    group: 'Art desk',
    position: 'Art director',
    avatar: '/avatars/person-29.svg',
    status: 'Active'
  },
  {
    id: 'emma-davis',
    name: 'Ilse Kariuki',
    group: 'Art desk',
    position: 'Illustrator',
    avatar: '/avatars/person-05.svg',
    status: 'Active'
  },
  {
    id: 'chris-taylor',
    name: 'Teodor Rask',
    group: 'Art desk',
    position: 'Layout designer',
    avatar: '/avatars/person-30.svg',
    status: 'Active'
  },
  {
    id: 'olivia-anderson',
    name: 'Orla Andersen',
    group: 'Art desk',
    position: 'Photo editor',
    avatar: '/avatars/person-06.svg',
    status: 'Inactive'
  },
  // Marketing Team
  {
    id: 'james-moore',
    name: 'Felix Marlowe',
    group: 'Audience desk',
    position: 'Audience editor',
    avatar: '/avatars/person-31.svg',
    status: 'Active'
  },
  {
    id: 'sophia-white',
    name: 'Sorrel Whitlock',
    group: 'Audience desk',
    position: 'Social producer',
    avatar: '/avatars/person-07.svg',
    status: 'Active'
  },
  {
    id: 'william-harris',
    name: 'Wilhelmina Harte',
    group: 'Audience desk',
    position: 'Search editor',
    avatar: '/avatars/person-32.svg',
    status: 'Active'
  },
  {
    id: 'ava-martin',
    name: 'Rosalind Mbeki',
    group: 'Audience desk',
    position: 'Community editor',
    avatar: '/avatars/person-08.svg',
    status: 'Away'
  },
  // Sales Team
  {
    id: 'ethan-thompson',
    name: 'Caspian Wexford',
    group: 'Partnerships',
    position: 'Partnerships lead',
    avatar: '/avatars/person-33.svg',
    status: 'Active'
  },
  {
    id: 'mia-garcia',
    name: 'Mireille Oyama',
    group: 'Partnerships',
    position: 'Sponsorship manager',
    avatar: '/avatars/person-09.svg',
    status: 'Active'
  },
  {
    id: 'noah-martinez',
    name: 'Linnea Marquez',
    group: 'Partnerships',
    position: 'Events producer',
    avatar: '/avatars/person-34.svg',
    status: 'Active'
  },
  {
    id: 'isabella-rodriguez',
    name: 'Liesel Ortega-Holm',
    group: 'Partnerships',
    position: 'Syndication manager',
    avatar: '/avatars/person-10.svg',
    status: 'Active'
  },
  // Management Team
  {
    id: 'lucas-lee',
    name: 'Quinlan Lee-Ward',
    group: 'Masthead',
    position: 'Publisher',
    avatar: '/avatars/person-36.svg',
    status: 'Active'
  },
  {
    id: 'charlotte-walker',
    name: 'Cosima Ferreira',
    group: 'Masthead',
    position: 'Technical director',
    avatar: '/avatars/person-11.svg',
    status: 'Active'
  },
  {
    id: 'benjamin-hall',
    name: 'Ignatius Holm',
    group: 'Masthead',
    position: 'Editor-in-chief',
    avatar: '/avatars/person-37.svg',
    status: 'Active'
  },
  {
    id: 'amelia-allen',
    name: 'Rosalind Quaye',
    group: 'Masthead',
    position: 'Deputy editor',
    avatar: '/avatars/person-13.svg',
    status: 'Active'
  },
  // Support Team
  {
    id: 'henry-young',
    name: 'Hollis Akande',
    group: 'Reader services',
    position: 'Membership lead',
    avatar: '/avatars/person-39.svg',
    status: 'Active'
  },
  {
    id: 'grace-king',
    name: 'Pernille Dagher',
    group: 'Reader services',
    position: 'Reader help editor',
    avatar: '/avatars/person-15.svg',
    status: 'Active'
  },
  {
    id: 'sebastian-wright',
    name: 'Silas Wrenfield',
    group: 'Reader services',
    position: 'Letters editor',
    avatar: '/avatars/person-40.svg',
    status: 'Away'
  },
  {
    id: 'lily-lopez',
    name: 'Calla Lorne',
    group: 'Reader services',
    position: 'Corrections editor',
    avatar: '/avatars/person-16.svg',
    status: 'Active'
  }
];
function groupUsers(users) {
  const groups = {};
  users.forEach((item) => {
    (groups[item.group] ??= []).push(item);
  });
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      const statusOrder = { Active: 0, Away: 1, Inactive: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  });
  const order = [
    'Masthead',
    'Editorial desk',
    'Art desk',
    'Audience desk',
    'Partnerships',
    'Reader services'
  ];
  return order.map((group) => ({ group, items: groups[group] ?? [] }));
}
const groupedUsers = groupUsers(usersData);
