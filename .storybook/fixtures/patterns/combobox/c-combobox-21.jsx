'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Each option carries `searchText`, so typing a synonym ("defect", "infra") still finds it.
const statuses = [
  { id: 'backlog', label: 'Backlog', icon: 'CircleDashedIcon', tone: 'text-text-muted' },
  { id: 'planned', label: 'Planned', icon: 'CircleIcon', tone: 'text-text' },
  { id: 'in-progress', label: 'In progress', icon: 'CircleDotIcon', tone: 'text-info' },
  { id: 'paused', label: 'Paused', icon: 'CirclePauseIcon', tone: 'text-warning' },
  { id: 'completed', label: 'Completed', icon: 'CircleCheckIcon', tone: 'text-success' },
  { id: 'cancelled', label: 'Cancelled', icon: 'CircleXIcon', tone: 'text-text-muted' }
];

const priorities = [
  { id: 'none', label: 'No priority', bars: 0 },
  { id: 'low', label: 'Low', bars: 1 },
  { id: 'medium', label: 'Medium', bars: 2 },
  { id: 'high', label: 'High', bars: 3 },
  { id: 'urgent', label: 'Urgent', urgent: true }
];

const noTeam = { id: 'no-team', label: 'No team', icon: 'UsersIcon', tone: 'text-text-muted', searchText: 'No team clear' };
const teams = [
  { id: 'growth', label: 'Growth', icon: 'SparklesIcon', tone: 'text-success', searchText: 'Growth experiments activation' },
  { id: 'platform', label: 'Platform', icon: 'LayersIcon', tone: 'text-info', searchText: 'Platform infrastructure infra systems' },
  { id: 'studio', label: 'Studio', icon: 'PaletteIcon', tone: 'text-discovery', searchText: 'Studio design creative' },
  { id: 'support', label: 'Support', icon: 'LifeBuoyIcon', tone: 'text-danger', searchText: 'Support customer care' },
  { id: 'ops', label: 'Ops', icon: 'GitBranchIcon', tone: 'text-warning', searchText: 'Ops operations releases' }
];

const people = [
  { id: 'alex', label: 'Alex Morgan', role: 'Engineering lead', you: true, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'emma', label: 'Emma Carter', role: 'Product designer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'ryan', label: 'Ryan Mitchell', role: 'Backend engineer' },
  { id: 'olivia', label: 'Olivia Bennett', role: 'Growth marketer', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'ethan', label: 'Ethan Brooks', role: 'Operations', avatar: 'https://randomuser.me/api/portraits/men/49.jpg' },
  { id: 'sophia', label: 'Sophia Reed', role: 'Data analyst', avatar: 'https://randomuser.me/api/portraits/women/90.jpg' }
].map((person) => ({ ...person, searchText: `${person.label} ${person.role}` }));
const noAssignee = { id: 'no-assignee', label: 'No assignee', searchText: 'No assignee unassigned clear' };
const invite = { id: 'invite', label: 'Invite teammate', searchText: 'Invite new user teammate' };
const noMembers = { id: 'no-members', label: 'No members', searchText: 'No members clear' };

const noLabel = { id: 'no-label', label: 'No label', searchText: 'No label clear' };
const labels = [
  { id: 'feature', label: 'Feature', dot: 'bg-info', searchText: 'Feature enhancement' },
  { id: 'bug', label: 'Bug', dot: 'bg-danger', searchText: 'Bug defect problem' },
  { id: 'improvement', label: 'Improvement', dot: 'bg-success', searchText: 'Improvement polish' },
  { id: 'design', label: 'Design', dot: 'bg-discovery', searchText: 'Design ui ux' }
];

const sameId = (item, value) => item.id === value.id;
const initials = (name) => name.split(' ').map((part) => part[0]).join('');

function Row({ children, className }) {
  return <span className={cn('flex min-w-0 items-center gap-2', className)}>{children}</span>;
}

function Glyph({ icon, className }) {
  return <RegistryIcon lucide={icon} className={cn('size-4 shrink-0', className)} />;
}

function PriorityBars({ bars }) {
  return (
    <svg aria-hidden='true' viewBox='0 0 16 16' className='size-4 shrink-0'>
      {[0, 1, 2].map((bar) => (
        <rect
          key={bar}
          x={3 + bar * 4}
          y={9 - bar * 3}
          width='2.5'
          height={4 + bar * 3}
          rx='1'
          fill='currentColor'
          opacity={bar < bars ? 1 : 0.28}
        />
      ))}
    </svg>
  );
}

function PriorityLabel({ priority }) {
  if (priority.urgent) {
    return (
      <Row className='text-warning'>
        <Glyph icon='TriangleAlertIcon' />
        <span className='truncate'>{priority.label}</span>
      </Row>
    );
  }
  return (
    <Row>
      {priority.bars ? <PriorityBars bars={priority.bars} /> : <Glyph icon='MoreHorizontalIcon' className='text-text-muted' />}
      <span className='truncate'>{priority.label}</span>
    </Row>
  );
}

function IconLabel({ option }) {
  return (
    <Row>
      <Glyph icon={option.icon} className={option.tone} />
      <span className='truncate'>{option.label}</span>
    </Row>
  );
}

function PersonAvatar({ person, className = 'size-5' }) {
  return (
    <Avatar className={className}>
      {person.avatar ? <AvatarImage src={person.avatar} alt={person.label} /> : null}
      <AvatarFallback className='text-xs'>{initials(person.label)}</AvatarFallback>
    </Avatar>
  );
}

function PersonRow({ person }) {
  return (
    <Item size='xs' className='p-0'>
      <ItemMedia>
        <PersonAvatar person={person} className='size-6' />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='gap-1 whitespace-nowrap'>
          {person.label}
          {person.you ? <span className='text-text-muted font-normal'>(You)</span> : null}
        </ItemTitle>
        <ItemDescription>{person.role}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function LabelDot({ label }) {
  return <span aria-hidden='true' className={cn('size-2.5 shrink-0 rounded-full', label.dot)} />;
}

function MembersSummary({ members }) {
  if (!members.length) {
    return (
      <Row>
        <Glyph icon='UsersIcon' className='text-text-muted' />
        <span className='text-text-muted truncate'>Add members</span>
      </Row>
    );
  }
  const visible = members.slice(0, 3);
  const hidden = members.length - visible.length;
  return (
    <Row>
      <span className='sr-only'>Selected members: {members.map((m) => m.label).join(', ')}</span>
      <AvatarGroup className='-space-x-1'>
        {visible.map((member) => (
          <PersonAvatar key={member.id} person={member} />
        ))}
      </AvatarGroup>
      <span className='truncate'>
        {hidden > 0 ? `+${hidden} more` : `${members.length} ${members.length === 1 ? 'member' : 'members'}`}
      </span>
    </Row>
  );
}

function LabelsSummary({ selected }) {
  if (!selected.length) {
    return (
      <Row>
        <Glyph icon='TagIcon' className='text-text-muted' />
        <span className='text-text-muted truncate'>Add label</span>
      </Row>
    );
  }
  if (selected.length === 1) {
    return (
      <Row>
        <LabelDot label={selected[0]} />
        <span className='truncate'>{selected[0].label}</span>
      </Row>
    );
  }
  return (
    <Row className='gap-1'>
      <span className='sr-only'>Selected labels: {selected.map((l) => l.label).join(', ')}</span>
      {selected.slice(0, 3).map((label) => (
        <LabelDot key={label.id} label={label} />
      ))}
      <span className='text-text-muted ml-1 text-xs tabular-nums'>{selected.length} labels</span>
    </Row>
  );
}

// One picker shape for every property: a button trigger showing the value, search inside the popup.
function Picker({ label, items, value, onValueChange, multiple, search, renderValue, children }) {
  return (
    <>
      <span className='text-text-muted text-sm'>{label}</span>
      <Combobox
        items={items}
        value={value}
        onValueChange={onValueChange}
        multiple={multiple}
        itemToStringValue={(item) => item.searchText ?? item.label}
        isItemEqualToValue={sameId}
        autoHighlight
      >
        <ComboboxTrigger
          aria-label={label}
          render={<Button type='button' variant='outline' tone='neutral' className='w-full justify-between font-normal' />}
        >
          <ComboboxValue>{renderValue}</ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput showTrigger={false} placeholder={search} className='mb-1' />
          <ComboboxEmpty>No matches.</ComboboxEmpty>
          <ComboboxList>{children}</ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
}

// "None" options clear the property; in multiple mode they empty the whole set.
const clearsWith = (none, set) => (next) => set(next.some((item) => item.id === none.id) ? [] : next);

export function Pattern() {
  const [status, setStatus] = useState(statuses[2]);
  const [priority, setPriority] = useState(priorities[3]);
  const [team, setTeam] = useState(teams[1]);
  const [assignee, setAssignee] = useState(people[0]);
  const [members, setMembers] = useState(people.slice(1, 5));
  const [selectedLabels, setSelectedLabels] = useState(labels.slice(0, 2));

  return (
    <div className='border-border bg-surface mx-auto grid w-full max-w-sm grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-lg border p-3'>
      <Picker
        label='Status'
        items={statuses}
        value={status}
        onValueChange={(next) => next && setStatus(next)}
        search='Change status'
        renderValue={(item) => <IconLabel option={item} />}
      >
        {(item) => (
          <ComboboxItem key={item.id} value={item}>
            <IconLabel option={item} />
          </ComboboxItem>
        )}
      </Picker>

      <Picker
        label='Priority'
        items={priorities}
        value={priority}
        onValueChange={(next) => next && setPriority(next)}
        search='Change priority'
        renderValue={(item) => <PriorityLabel priority={item} />}
      >
        {(item) => (
          <ComboboxItem key={item.id} value={item}>
            <PriorityLabel priority={item} />
          </ComboboxItem>
        )}
      </Picker>

      <Picker
        label='Team'
        items={[noTeam, ...teams]}
        value={team ?? noTeam}
        onValueChange={(next) => setTeam(next?.id === noTeam.id ? null : next)}
        search='Select team'
        renderValue={(item) => <IconLabel option={item} />}
      >
        <ComboboxItem value={noTeam}>
          <IconLabel option={noTeam} />
        </ComboboxItem>
        <ComboboxSeparator />
        {teams.map((item) => (
          <ComboboxItem key={item.id} value={item}>
            <IconLabel option={item} />
          </ComboboxItem>
        ))}
      </Picker>

      <Picker
        label='Assignee'
        items={[noAssignee, ...people, invite]}
        value={assignee ?? noAssignee}
        onValueChange={(next) => {
          if (!next || next.id === invite.id) return;
          setAssignee(next.id === noAssignee.id ? null : next);
        }}
        search='Select assignee'
        renderValue={(item) =>
          item.id === noAssignee.id ? (
            <Row>
              <Glyph icon='UserIcon' className='text-text-muted' />
              <span className='truncate'>{item.label}</span>
            </Row>
          ) : (
            <Row>
              <PersonAvatar person={item} />
              <span className='truncate'>{item.label}</span>
            </Row>
          )
        }
      >
        <ComboboxItem value={noAssignee}>
          <Row>
            <Glyph icon='UserIcon' className='text-text-muted' />
            {noAssignee.label}
          </Row>
        </ComboboxItem>
        <ComboboxSeparator />
        <ComboboxGroup items={people}>
          <ComboboxLabel>Team members</ComboboxLabel>
          <ComboboxCollection>
            {(person) => (
              <ComboboxItem key={person.id} value={person}>
                <PersonRow person={person} />
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxGroup>
        <ComboboxSeparator />
        <ComboboxItem value={invite}>
          <Row>
            <Glyph icon='SendIcon' className='text-text-muted' />
            {invite.label}
          </Row>
        </ComboboxItem>
      </Picker>

      <Picker
        label='Members'
        multiple
        items={[noMembers, ...people]}
        value={members}
        onValueChange={clearsWith(noMembers, setMembers)}
        search='Select members'
        renderValue={(selected) => <MembersSummary members={selected ?? []} />}
      >
        <ComboboxItem value={noMembers}>
          <Row>
            <Glyph icon='UsersIcon' className='text-text-muted' />
            {noMembers.label}
          </Row>
        </ComboboxItem>
        <ComboboxSeparator />
        {people.map((person) => (
          <ComboboxItem key={person.id} value={person}>
            <PersonRow person={person} />
          </ComboboxItem>
        ))}
      </Picker>

      <Picker
        label='Labels'
        multiple
        items={[noLabel, ...labels]}
        value={selectedLabels}
        onValueChange={clearsWith(noLabel, setSelectedLabels)}
        search='Select labels'
        renderValue={(selected) => <LabelsSummary selected={selected ?? []} />}
      >
        <ComboboxItem value={noLabel}>{noLabel.label}</ComboboxItem>
        <ComboboxSeparator />
        {labels.map((label) => (
          <ComboboxItem key={label.id} value={label}>
            <Row>
              <LabelDot label={label} />
              {label.label}
            </Row>
          </ComboboxItem>
        ))}
      </Picker>
    </div>
  );
}
