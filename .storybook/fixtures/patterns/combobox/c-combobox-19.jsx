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
import { Field, FieldLabel } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '../../../../src/components/core/Item/parts/item.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const members = [
  { id: '1', name: 'Alex Johnson', position: 'Software Engineer', avatar: '/avatars/men/32.jpg' },
  { id: '2', name: 'Sarah Chen', position: 'Product Manager', avatar: '/avatars/women/44.jpg' },
  { id: '3', name: 'Michael Rodriguez', position: 'UX Designer', avatar: '/avatars/men/11.jpg' },
  { id: '4', name: 'Emma Wilson', position: 'Technical Lead', avatar: '/avatars/women/68.jpg' },
  { id: '5', name: 'David Kim', position: 'CTO', avatar: '/avatars/men/49.jpg' },
  { id: '6', name: 'Aron Thompson', position: 'Software Engineer', avatar: '/avatars/men/75.jpg' },
  { id: '7', name: 'Maria Garcia', position: 'Product Manager', avatar: '/avatars/women/90.jpg' },
  { id: '8', name: 'Liam Thompson', position: 'UX Designer', avatar: '/avatars/women/65.jpg' }
];

const initials = (name) => name.split(' ').map((part) => part[0]).join('');

function MemberAvatar({ member, className }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={member.avatar} alt={member.name} />
      <AvatarFallback>{initials(member.name)}</AvatarFallback>
    </Avatar>
  );
}

// `borderless` drops the field chrome so the tags read as inline content, each chip carrying its own border.
function MemberTags({ id, label, defaultValue, borderless = false }) {
  const anchor = useComboboxAnchor();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox multiple items={members} itemToStringValue={(member) => member.name} defaultValue={defaultValue}>
        <ComboboxChips
          ref={anchor}
          className={cn(
            'has-data-[slot=combobox-chip]:pl-1',
            borderless && 'border-none bg-transparent p-0 shadow-none ring-0 focus-within:ring-0'
          )}
        >
          <ComboboxValue>
            {(selected) => (
              <Fragment>
                {selected.map((member) => (
                  <ComboboxChip
                    key={member.id}
                    className={cn(
                      'gap-1.5 rounded-full',
                      borderless && 'bg-surface border-border h-auto border py-0.5 pl-1 shadow-xs'
                    )}
                  >
                    <MemberAvatar member={member} className='size-4' />
                    {member.name}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput id={id} placeholder='Add members...' className='bg-transparent' />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxEmpty>No members found.</ComboboxEmpty>
          <ComboboxList>
            {(member) => (
              <ComboboxItem key={member.id} value={member}>
                <Item size='xs' className='p-0'>
                  <MemberAvatar member={member} className='size-6' />
                  <ItemContent>
                    <ItemTitle className='whitespace-nowrap'>{member.name}</ItemTitle>
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

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xs gap-3'>
      <MemberTags id='member-tags' label='Reviewers' defaultValue={[members[0], members[1]]} />
      <MemberTags
        id='member-tags-borderless'
        label='Watchers (borderless)'
        borderless
        defaultValue={[members[5], members[7], members[3]]}
      />
    </div>
  );
}
