'use client';
import { useState } from 'react';
import { Filters } from '@gaudi/design-system/core/FilterBar';
import {
  createFilterQuery,
  createFilterRule
} from '@gaudi/design-system/core/FilterBar';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
function Dot({ className }) {
  return <span className={cn('size-2 shrink-0 rounded-full', className)} />;
}
function Star({ className }) {
  return (
    <RegistryIcon
      lucide='StarIcon'
      className={cn('shrink-0 **:text-inherit!', className)}
    />
  );
}
function Person({ img, name }) {
  return (
    <Avatar className='size-5'>
      <AvatarImage
        src={`/avatars/${img}.svg`}
        alt={name}
      />
      <AvatarFallback>
        {name
          .split(' ')
          .map((part) => part[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );
}
function Unassigned() {
  return (
    <Avatar className='size-5'>
      <AvatarFallback className='text-ui-muted-foreground [&_svg]:size-3'>
        <RegistryIcon lucide='UserMinusIcon' />
      </AvatarFallback>
    </Avatar>
  );
}
const STATUSES = [
  { value: 'todo', label: 'To Do', dot: 'bg-text-muted', badge: 'secondary' },
  { value: 'in-progress', label: 'In Progress', dot: 'bg-warning', badge: 'warning-light' },
  { value: 'review', label: 'In Review', dot: 'bg-info', badge: 'info-light' },
  { value: 'done', label: 'Done', dot: 'bg-success', badge: 'success-light' },
  { value: 'cancelled', label: 'Cancelled', dot: 'bg-ui-destructive', badge: 'destructive-light' }
];
const ROLES = ['Engineering', 'Research', 'Platform', 'Design'];
const PRIORITIES = [
  { value: 'low', label: 'Low', star: 'text-success!' },
  { value: 'medium', label: 'Medium', star: 'text-warning!' },
  { value: 'high', label: 'High', star: 'text-attention!' },
  { value: 'urgent', label: 'Urgent', star: 'text-danger!' }
];
const TEAM = [
  { value: 'ada', label: 'Odile Marchetti', img: 'person-01' },
  { value: 'grace', label: 'Edda Quilliam', img: 'person-02' },
  { value: 'alan', label: 'Casimir Oduya', img: 'person-27' },
  { value: 'katherine', label: 'Hortense Abiola', img: 'person-03' },
  { value: 'edsger', label: 'Pim Valtonen', img: 'person-28' },
  { value: 'barbara', label: 'Hedda Kowalczyk', img: 'person-04' },
  { value: 'tim', label: 'Tim Berners-Lee', img: 'person-29' },
  { value: 'margaret', label: 'Elspeth Varley', img: 'person-05' },
  { value: 'donald', label: 'Evander Quist', img: 'person-30' },
  { value: 'radia', label: 'Rania Pellegrini', img: 'person-06' },
  { value: 'linus', label: 'Ingmar Rautio', img: 'person-31' },
  { value: 'anita', label: 'Clio Fenwick', img: 'person-07' },
  { value: 'ken', label: 'Ivo Ferrand', img: 'person-32' },
  { value: 'frances', label: 'Marisol Achterberg', img: 'person-08' },
  { value: 'dennis', label: 'Ruairi Achebe', img: 'person-33' },
  { value: 'shafi', label: 'Sigrid Goldberg', img: 'person-09' },
  { value: 'vint', label: 'Viggo Cerezo', img: 'person-34' },
  { value: 'carol', label: 'Philippa Rourke', img: 'person-10' },
  { value: 'guido', label: 'Wendell Achterberg', img: 'person-36' },
  { value: 'jean', label: 'Beatrix Olander', img: 'person-11' }
];
const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Ecuador',
  'Egypt',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Rwanda',
  'Senegal',
  'Serbia',
  'Singapore'
].map((name) => ({
  value: name.toLowerCase().replace(/\s+/g, '-'),
  label: name
}));
const DIRECTORY = Array.from({ length: 4e3 }, (_, index) => ({
  value: `u-${index}`,
  label: `Contact ${index + 1}`
}));
function searchDirectory(query, signal, cursor) {
  const needle = query.trim().toLowerCase();
  const matches = DIRECTORY.filter((option) =>
    option.label.toLowerCase().includes(needle)
  );
  const start = cursor ? Number(cursor) : 0;
  const page = matches.slice(start, start + 25);
  const next = start + 25;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve({
          items: page,
          nextCursor: next < matches.length ? String(next) : void 0
        }),
      260
    );
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
function fetchContacts(ids) {
  const wanted = new Set(ids);
  return new Promise((resolve) => {
    setTimeout(() => resolve(DIRECTORY.filter((option) => wanted.has(option.value))), 240);
  });
}
function StackedDots({ options }) {
  if (options.length === 0) return <>any status</>;
  if (options.length === 1) {
    const only = STATUSES.find((entry) => entry.value === options[0].value);
    return (
      <span className='flex items-center gap-1.5'>
        <Dot className={only?.dot ?? 'bg-ui-muted-foreground'} />
        {options[0].label}
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => {
          const entry = STATUSES.find(
            (candidate) => candidate.value === option.value
          );
          return (
            <span
              key={option.value}
              className={cn(
                'ring-ui-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0',
                entry?.dot ?? 'bg-ui-muted-foreground'
              )}
            />
          );
        })}
      </span>
      <span className='text-ui-muted-foreground text-xs tabular-nums'>
        {options.length}
      </span>
    </span>
  );
}
// Up to two picks read as coloured badges; past that the chip falls back to the dot stack.
const BADGE_LIMIT = 2;
function BadgesOrStack({ options }) {
  if (options.length === 0 || options.length > BADGE_LIMIT) return <StackedDots options={options} />;
  return (
    <span className='flex items-center gap-1'>
      {options.map((option) => (
        <Badge key={option.value} size='sm' variant={STATUSES.find((entry) => entry.value === option.value)?.badge ?? 'secondary'}>
          {option.label}
        </Badge>
      ))}
    </span>
  );
}
function StackedStars({ options }) {
  if (options.length === 0) return <>any priority</>;
  if (options.length === 1) {
    const only = PRIORITIES.find((entry) => entry.value === options[0].value);
    return (
      <span className='flex items-center gap-1.5'>
        <Star
          className={cn('size-3.5', only?.star ?? 'text-ui-muted-foreground')}
        />
        {options[0].label}
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => {
          const entry = PRIORITIES.find(
            (candidate) => candidate.value === option.value
          );
          return (
            <Star
              key={option.value}
              className={cn(
                '-ml-0.5 size-3.5 first:ml-0',
                entry?.star ?? 'text-ui-muted-foreground'
              )}
            />
          );
        })}
      </span>
      <span className='text-ui-muted-foreground text-xs tabular-nums'>
        {options.length}
      </span>
    </span>
  );
}
function Face({ option }) {
  const entry = TEAM.find((candidate) => candidate.value === option.value);
  return entry ? <Person img={entry.img} name={entry.label} /> : <Unassigned />;
}
function StackedPeople({ options }) {
  if (options.length === 0) return <>anyone</>;
  if (options.length === 1) {
    return (
      <span className='flex items-center gap-1.5'>
        <Face option={options[0]} />
        {options[0].label}
      </span>
    );
  }
  const overflow = options.length - 3;
  return (
    <span className='flex items-center gap-1.5'>
      <AvatarGroup className='-space-x-1 *:data-[slot=avatar]:size-4'>
        {options.slice(0, 3).map((option) => (
          <Face key={String(option.value)} option={option} />
        ))}
      </AvatarGroup>
      {overflow > 0 ? (
        <span className='text-ui-muted-foreground text-xs tabular-nums'>
          +{overflow}
        </span>
      ) : null}
    </span>
  );
}
const fields = [
  {
    id: 'description',
    label: 'Description',
    type: 'text',
    icon: <RegistryIcon lucide='TypeIcon' />
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    defaultOperator: 'is_any_of',
    icon: <RegistryIcon lucide='CircleDotIcon' />,
    options: STATUSES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Dot className={entry.dot} />
    })),
    // The one field here that turns its search box off, so the treatment is
    // visible next to the two that keep theirs. The input is still rendered,
    // only visually hidden: it is what owns focus and `aria-activedescendant`,
    // so removing it would take the keyboard with it, and typing still narrows
    // exactly as it does in a native select. Priority below keeps its box, and
    // Country needs one, because 120 rows are not scanned by eye.
    searchable: false,
    // Stack the picks at the top, with a rule under them. Off by default in
    // the primitive, because a list short enough to read whole should not
    // reorder itself under the reader; this example turns it on across every
    // option field so the treatment can be compared on a five row status, a
    // people list with an exclusive row, 120 countries and a paged directory.
    pinSelected: true,
    renderValue: ({ options }) => <BadgesOrStack options={options} />
  },
  {
    id: 'priority',
    label: 'Priority',
    // A task has ONE priority, so this is a select - and `is`, the SINGLE-valued
    // operator, is what says so. `is any of` is a question about a set, which
    // reads oddly against a rank a row can only hold one of; it is still in the
    // menu for anyone filtering on two of them at once. Assignee below is the
    // real multiselect, because a task can genuinely carry several people.
    type: 'select',
    defaultOperator: 'is',
    // The value menu's search box, named for the list under it instead of the
    // generic "Search...".
    //
    // The primitive will not compose this for you, on purpose: a built in
    // `Search ${label}...` is hardcoded English that no `labels` override can
    // reach, and lowercasing a label is locale hostile besides (Turkish dotted
    // i, German nouns). So the wording is the schema's to give, and every
    // searchable field here gives it.
    placeholder: 'Search priority...',
    // A star, matching the glyph its options wear. The field icon rides in the
    // chip and in the attribute list, so a flag here would announce one thing
    // and the menu under it another.
    icon: <RegistryIcon lucide='StarIcon' />,
    options: PRIORITIES.map((entry) => ({
      value: entry.value,
      label: entry.label,
      icon: <Star className={cn('size-3.5', entry.star)} />
    })),
    pinSelected: true,
    renderValue: ({ options }) => <StackedStars options={options} />
  },
  {
    id: 'assignee',
    label: 'Assignee',
    type: 'multiselect',
    placeholder: 'Search people...',
    icon: <RegistryIcon lucide='UserRoundCheckIcon' />,
    options: [
      ...TEAM.map((person, index) => ({
        value: person.value,
        label: person.label,
        // Each row carries the person's group beneath the name.
        description: ROLES[index % ROLES.length],
        icon: <Person img={person.img} name={person.label} />
      })),
      // "Nobody" is a real filter, not the absence of one, and `exclusive` is
      // what makes it behave like one: it clears the other picks, they clear
      // it, and it sits under a rule of its own below the people.
      {
        value: 'unassigned',
        label: 'Unassigned',
        icon: <Unassigned />,
        exclusive: true
      }
    ],
    pinSelected: true,
    // Inside each group the order is the schema's by default, because option
    // order is usually semantic - Priority reads Low to Urgent above and
    // sorting it would destroy that. A list of PEOPLE carries no such order,
    // so this one opts into alphabetical. "Unassigned" sits outside both
    // groups either way: it is grouped by role, not by whether it is ticked.
    sortSelected: 'label',
    // BIGGER on both axes than the defaults, because this is the one field where
    // the stack has to be readable and the rows are the widest the primitive
    // draws: an avatar, then a full name. At the panel's own `w-48` a name like
    // "Hortense Abiola" truncates, and at the default height the rule under
    // the pinned picks lands near the bottom edge with barely a row of "the
    // rest" below it. Both land on the panel after the primitive's own, so a
    // `w-*` and the height variable simply win.
    className: 'w-64 [--cascader-max-height:26rem]',
    renderValue: ({ options }) => <StackedPeople options={options} />
  },
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    defaultOperator: 'is_any_of',
    placeholder: 'Search countries...',
    // 120 options, so the editor shows its search box and the list scrolls.
    // This is the length the stack is actually for: without it a pick made an
    // hour ago is somewhere behind a scrollbar.
    options: COUNTRIES,
    pinSelected: true,
    icon: <RegistryIcon lucide='GlobeIcon' />
  },
  {
    id: 'contact',
    label: 'Contact',
    type: 'select',
    defaultOperator: 'is_any_of',
    placeholder: 'Search contacts...',
    // Paged over the wire, with abort and a Load more row.
    loadOptions: (query, { signal, cursor }) =>
      searchDirectory(query, signal, cursor),
    // Load more APPENDS, so without the stack a pick made on the first page
    // sinks a little further with every page fetched after it. Pinning holds
    // it at the top of whatever has been loaded. It cannot do more than that:
    // an async list only ever shows the pages it has, so a pick that is in no
    // loaded page is not a row here at all, stacked or otherwise. The chip
    // still draws it, off the resolved-option cache.
    pinSelected: true,
    // A restored view holds ids the loader has never returned, so the
    // primitive asks for exactly those values and caches the answer for
    // every chip; until it arrives the chip shows a count.
    resolveValues: (ids) => fetchContacts(ids),
    renderValue: ({ values, options, labels }) =>
      options.length === 1 ? options[0].label : labels.valueCount(values.length),
    icon: <RegistryIcon lucide='BookUserIcon' />
  },
  {
    id: 'company',
    label: 'Company',
    icon: <RegistryIcon lucide='Building2Icon' />,
    // Nested. A branch NAVIGATES: pressing it opens its attributes, which is
    // what its chevron and its count promise, and it never commits a filter on
    // itself. Filtering on the company as a whole is the explicit leaf below.
    fields: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'domain', label: 'Domain', type: 'text' },
      {
        id: 'team',
        label: 'Team',
        count: 26,
        fields: [
          { id: 'lead', label: 'Lead', type: 'text' },
          { id: 'size', label: 'Size', type: 'number' }
        ]
      },
      {
        id: 'location',
        label: 'Primary location',
        count: 3,
        fields: [
          { id: 'city', label: 'City', type: 'text' },
          { id: 'country', label: 'Country', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'score',
    label: 'Score',
    type: 'number',
    icon: <RegistryIcon lucide='HashIcon' />
  },
  {
    id: 'archived',
    label: 'Archived',
    type: 'boolean',
    icon: <RegistryIcon lucide='ArchiveIcon' />
  }
];
// Stacked people, a two-pick status on badges, a single priority star, and
// "is not empty", whose arity is none, so its chip draws no value at all.
const SEED = createFilterQuery([
  createFilterRule({ id: 'seed-1', path: ['assignee'], operator: 'has_any_of', value: ['ada', 'grace', 'alan', 'katherine'] }),
  createFilterRule({ id: 'seed-2', path: ['status'], operator: 'is_any_of', value: ['in-progress', 'review'] }),
  createFilterRule({ id: 'seed-3', path: ['priority'], operator: 'is', value: ['urgent'] }),
  createFilterRule({ id: 'seed-4', path: ['description'], operator: 'not_empty' })
]);
// A saved view restores contacts from pages that were never loaded.
const SAVED_VIEW = createFilterQuery([
  createFilterRule({ id: 'saved-1', path: ['assignee'], operator: 'has_any_of', value: ['edsger', 'barbara', 'tim'] }),
  createFilterRule({ id: 'saved-2', path: ['contact'], operator: 'is_any_of', value: ['u-41', 'u-1200', 'u-3311'] })
]);
export function Pattern() {
  const [query, setQuery] = useState(SEED);
  return (
    <div className='flex w-full flex-col gap-3'>
      <Filters
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        showClear
      />
      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='outline' size='sm' onClick={() => setQuery(SAVED_VIEW)}>
          Restore saved view
        </Button>
        <Button variant='ghost' size='sm' onClick={() => setQuery(SEED)}>
          Reset
        </Button>
      </div>


      <pre
        tabIndex={0}
        aria-label='Filter query'
        className='bg-ui-muted dark:bg-ui-muted/60 max-h-80 w-full overflow-auto rounded-md border p-3 text-xs'
      >
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}
