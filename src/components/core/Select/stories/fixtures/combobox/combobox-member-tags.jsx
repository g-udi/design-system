'use client';
import { Fragment, useId } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
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
} from '@gaudi/design-system/core/Select';
import { FieldRoot as Field, FieldLabelPrimitive as FieldLabel } from '@gaudi/design-system/core/Field';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { cn } from '@gaudi/design-system/utilities/cn';

const members = [
  { id: '1', name: 'Anouk Varga', position: 'Software Engineer', avatar: '/avatars/person-41.svg' },
  { id: '2', name: 'Sabine Okafor', position: 'Product Manager', avatar: '/avatars/person-20.svg' },
  { id: '3', name: 'Rafe Okonkwo', position: 'UX Designer', avatar: '/avatars/person-31.svg' },
  { id: '4', name: 'Ilse Valtonen', position: 'Technical Lead', avatar: '/avatars/person-24.svg' },
  { id: '5', name: 'Ottilie Nakamura', position: 'CTO', avatar: '/avatars/person-45.svg' },
  { id: '6', name: 'Aurelio Brandt', position: 'Software Engineer', avatar: '/avatars/person-50.svg' },
  { id: '7', name: 'Mireille Gaspard', position: 'Product Manager', avatar: '/avatars/person-25.svg' },
  { id: '8', name: 'Quentin Hale', position: 'UX Designer', avatar: '/avatars/person-23.svg' }
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
function MemberTags({ label, defaultValue, borderless = false }) {
  const id = useId();
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
        <ComboboxContent anchor={anchor}>
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
      <MemberTags label='Reviewers' defaultValue={[members[0], members[1]]} />
      <MemberTags
        label='Watchers (borderless)'
        borderless
        defaultValue={[members[5], members[7], members[3]]}
      />
    </div>
  );
}
