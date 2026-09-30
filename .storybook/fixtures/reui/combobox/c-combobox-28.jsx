// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
  ComboboxSeparator,
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
const noAssigneeOption = {
  type: 'none',
  id: 'no-assignee',
  value: 'none',
  label: 'No assignee',
  searchText: 'No assignee unassigned clear assignee remove assignee'
};
const teamMembers = [
  {
    type: 'member',
    id: 'member-1',
    value: 'alex-morgan',
    label: 'Alex Morgan',
    avatar:
      'static/images/art/4.svg',
    initials: 'AM',
    isCurrentUser: true,
    searchText: 'Alex Morgan current user owner'
  },
  {
    type: 'member',
    id: 'member-2',
    value: 'emma-carter',
    label: 'Emma Carter',
    avatar:
      'static/images/art/7.svg',
    initials: 'EC',
    searchText: 'Emma Carter product design'
  },
  {
    type: 'member',
    id: 'member-3',
    value: 'ryan-mitchell',
    label: 'Ryan Mitchell',
    avatar:
      'static/images/art/5.svg',
    initials: 'RM',
    searchText: 'Ryan Mitchell engineering backend'
  },
  {
    type: 'member',
    id: 'member-4',
    value: 'olivia-bennett',
    label: 'Olivia Bennett',
    avatar:
      'static/images/art/8.svg',
    initials: 'OB',
    searchText: 'Olivia Bennett growth marketing'
  },
  {
    type: 'member',
    id: 'member-5',
    value: 'ethan-brooks',
    label: 'Ethan Brooks',
    avatar:
      'static/images/art/5.svg',
    initials: 'EB',
    searchText: 'Ethan Brooks operations'
  }
];
const inviteOption = {
  type: 'invite',
  id: 'invite-user',
  value: 'invite',
  label: 'Invite...',
  searchText: 'Invite new user teammate member collaborator'
};
const assigneeOptions = [noAssigneeOption, ...teamMembers, inviteOption];
function UserGlyph({ className }) {
  return (
    <RegistryIcon
      lucide='UserIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
function PaperPlaneIcon({ className }) {
  return (
    <RegistryIcon
      lucide='SendIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
function AssigneeTriggerLabel({ option, placeholder }) {
  if (!option) {
    return (
      <span className='text-ui-muted-foreground truncate'>{placeholder}</span>
    );
  }
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
function AssigneeListRow({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <UserGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  if (option.type === 'invite') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <PaperPlaneIcon className='text-ui-muted-foreground' />
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
  const [assignee, setAssignee] = React.useState(null);
  const selectedAssignee = assignee ?? noAssigneeOption;
  function handleAssigneeChange(nextAssignee) {
    if (!nextAssignee || nextAssignee.type === 'invite') {
      return;
    }
    setAssignee(nextAssignee.type === 'member' ? nextAssignee : null);
  }
  return (
    <Field className='max-w-xs'>
      <Combobox
        items={assigneeOptions}
        value={selectedAssignee}
        onValueChange={handleAssigneeChange}
        itemToStringValue={(item) => item.searchText}
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
          <ComboboxValue placeholder='No assignee'>
            {(selectedAssignee2) => (
              <AssigneeTriggerLabel
                option={selectedAssignee2}
                placeholder='No assignee'
              />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput
            showTrigger={false}
            placeholder='Select assignee'
            className='mb-1'
          />
          <ComboboxEmpty>No assignees found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noAssigneeOption}>
              <AssigneeListRow option={noAssigneeOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>Team members</ComboboxLabel>
              <ComboboxCollection>
                {(member) => (
                  <ComboboxItem key={member.id} value={member}>
                    <AssigneeListRow option={member} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>

            <ComboboxSeparator />

            <ComboboxGroup items={[inviteOption]}>
              <ComboboxLabel>New user</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    <AssigneeListRow option={item} />
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
