// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const noTeamOption = {
  type: 'none',
  id: 'no-team',
  label: 'No team',
  searchText: 'No team clear team remove team empty'
};
const teamOptions = [
  {
    type: 'team',
    id: 'testo-growth',
    value: 'testo-growth',
    label: 'Testo Growth',
    tone: 'lime',
    searchText: 'Testo Growth experiments lifecycle activation'
  },
  {
    type: 'team',
    id: 'atlas-platform',
    value: 'atlas-platform',
    label: 'Atlas Platform',
    tone: 'sky',
    searchText: 'Atlas Platform infrastructure systems'
  },
  {
    type: 'team',
    id: 'nova-studio',
    value: 'nova-studio',
    label: 'Nova Studio',
    tone: 'violet',
    searchText: 'Nova Studio design systems creative'
  },
  {
    type: 'team',
    id: 'pulse-support',
    value: 'pulse-support',
    label: 'Pulse Support',
    tone: 'rose',
    searchText: 'Pulse Support product health customer care'
  },
  {
    type: 'team',
    id: 'orbit-ops',
    value: 'orbit-ops',
    label: 'Orbit Ops',
    tone: 'amber',
    searchText: 'Orbit Ops operations dependencies releases'
  }
];
const teamSelectionOptions = [noTeamOption, ...teamOptions];
function EmptyTeamGlyph({ className }) {
  return (
    <RegistryIcon
      lucide='UsersIcon'
      className={cn('size-4 shrink-0', className)}
    />
  );
}
const teamToneClassName = {
  lime: 'text-lime-600! [&_*]:text-lime-600!',
  sky: 'text-sky-600! [&_*]:text-sky-600!',
  violet: 'text-violet-600! [&_*]:text-violet-600!',
  amber: 'text-amber-600! [&_*]:text-amber-600!',
  rose: 'text-rose-600! [&_*]:text-rose-600!'
};
function TeamMark({ team }) {
  const className = cn('size-4 shrink-0', teamToneClassName[team.tone]);
  switch (team.tone) {
    case 'sky':
      return <RegistryIcon lucide='LayersIcon' className={className} />;
    case 'violet':
      return (
        <RegistryIcon lucide='BriefcaseBusinessIcon' className={className} />
      );
    case 'amber':
      return <RegistryIcon lucide='GitBranchIcon' className={className} />;
    case 'rose':
      return <RegistryIcon lucide='PackageIcon' className={className} />;
    case 'lime':
    default:
      return <RegistryIcon lucide='SparklesIcon' className={className} />;
  }
}
function TeamTriggerLabel({ value, placeholder }) {
  if (!value) {
    return (
      <span className='text-ui-muted-foreground truncate'>{placeholder}</span>
    );
  }
  if (value.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <EmptyTeamGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{value.label}</span>
      </span>
    );
  }
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <TeamMark team={value} />
      <span className='truncate'>{value.label}</span>
    </span>
  );
}
function TeamOptionRow({ option }) {
  if (option.type === 'none') {
    return (
      <span className='flex min-w-0 items-center gap-2'>
        <EmptyTeamGlyph className='text-ui-muted-foreground' />
        <span className='truncate'>{option.label}</span>
      </span>
    );
  }
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <TeamMark team={option} />
      <span className='truncate'>{option.label}</span>
    </span>
  );
}
export function Pattern() {
  const [team, setTeam] = React.useState(teamOptions[0]);
  const selectedTeam = team ?? noTeamOption;
  function handleTeamChange(nextTeam) {
    setTeam(nextTeam?.type === 'team' ? nextTeam : null);
  }
  return (
    <Field className='max-w-xs'>
      <Combobox
        items={teamSelectionOptions}
        value={selectedTeam}
        onValueChange={handleTeamChange}
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
          <ComboboxValue placeholder='Select team'>
            {(selectedTeam2) => (
              <TeamTriggerLabel
                value={selectedTeam2}
                placeholder='Select team'
              />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput
            showTrigger={false}
            placeholder='Select team'
            className='mb-1'
          />
          <ComboboxEmpty>No teams found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noTeamOption}>
              <TeamOptionRow option={noTeamOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {teamOptions.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                <TeamOptionRow option={item} />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
