'use client';
import { useId, useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const OPERATORS = {
  en: {},
  de: {
    contains: 'enth\xE4lt',
    not_contains: 'enth\xE4lt nicht',
    starts_with: 'beginnt mit',
    ends_with: 'endet mit',
    is: 'ist',
    is_not: 'ist nicht',
    is_any_of: 'ist eines von',
    is_none_of: 'ist keines von',
    has_any_of: 'enth\xE4lt eines von',
    has_all_of: 'enth\xE4lt alle von',
    has_none_of: 'enth\xE4lt keines von',
    eq: 'ist gleich',
    neq: 'ist ungleich',
    gt: 'ist gr\xF6\xDFer als',
    gte: 'ist mindestens',
    lt: 'ist kleiner als',
    lte: 'ist h\xF6chstens',
    between: 'liegt zwischen',
    not_between: 'liegt nicht zwischen',
    empty: 'ist leer',
    not_empty: 'ist nicht leer'
  },
  ja: {
    contains: '\u3092\u542B\u3080',
    not_contains: '\u3092\u542B\u307E\u306A\u3044',
    starts_with: '\u3067\u59CB\u307E\u308B',
    ends_with: '\u3067\u7D42\u308F\u308B',
    is: '\u3068\u7B49\u3057\u3044',
    is_not: '\u3068\u7B49\u3057\u304F\u306A\u3044',
    is_any_of: '\u306E\u3044\u305A\u308C\u304B',
    is_none_of: '\u306E\u3044\u305A\u308C\u3067\u3082\u306A\u3044',
    has_any_of: '\u306E\u3044\u305A\u308C\u304B\u3092\u542B\u3080',
    has_all_of: '\u306E\u3059\u3079\u3066\u3092\u542B\u3080',
    has_none_of: '\u306E\u3044\u305A\u308C\u3082\u542B\u307E\u306A\u3044',
    eq: '\u3068\u7B49\u3057\u3044',
    neq: '\u3068\u7B49\u3057\u304F\u306A\u3044',
    gt: '\u3088\u308A\u5927\u304D\u3044',
    gte: '\u4EE5\u4E0A',
    lt: '\u3088\u308A\u5C0F\u3055\u3044',
    lte: '\u4EE5\u4E0B',
    between: '\u306E\u7BC4\u56F2\u5185',
    not_between: '\u306E\u7BC4\u56F2\u5916',
    empty: '\u304C\u7A7A',
    not_empty: '\u304C\u7A7A\u3067\u306A\u3044'
  }
};
const NEGATED_DE = {
  'beginnt mit': 'beginnt nicht mit',
  'endet mit': 'endet nicht mit',
  'enth\xE4lt alle von': 'enth\xE4lt nicht alle von'
};
const NEGATED_JA = {
  で始まる: '\u3067\u59CB\u307E\u3089\u306A\u3044',
  で終わる: '\u3067\u7D42\u308F\u3089\u306A\u3044',
  のすべてを含む: '\u306E\u3059\u3079\u3066\u306F\u542B\u307E\u306A\u3044'
};
const CHROME = {
  en: {},
  de: {
    addFilter: 'Filter hinzuf\xFCgen',
    searchFields: 'Attribute suchen...',
    searchOperators: 'Bedingungen suchen...',
    searchOptions: 'Optionen suchen...',
    fieldsLabel: 'Attribute',
    filtersLabel: 'Filter',
    chipMenu: (fieldLabel) => `Optionen f\xFCr ${fieldLabel}`,
    clear: 'Zur\xFCcksetzen',
    apply: '\xDCbernehmen',
    discard: 'Verwerfen',
    remove: 'Entfernen',
    duplicate: 'Duplizieren',
    negate: 'Umkehren',
    negated: (operatorLabel) => NEGATED_DE[operatorLabel] ?? operatorLabel,
    empty: 'Keine Ergebnisse',
    valuePlaceholder: 'Text eingeben...',
    noValue: 'kein Wert',
    incomplete: 'unvollst\xE4ndiger Filter',
    selectCondition: 'Bedingung w\xE4hlen',
    readOnly:
      'Schreibgesch\xFCtzt. Diese Filter k\xF6nnen nicht ge\xE4ndert werden.',
    valueCount: (count) => `${count} ausgew\xE4hlt`,
    valueDetail: (summary, values) => `${summary}: ${values.join(', ')}`,
    valueRange: (from, to) => `${from} bis ${to}`,
    rangeFrom: (fieldLabel) => `${fieldLabel} von`,
    rangeTo: (fieldLabel) => `${fieldLabel} bis`,
    rangeSeparator: 'bis',
    countAnnouncement: (count) =>
      count === 1 ? '1 Filter aktiv' : `${count} Filter aktiv`,
    resultsAnnouncement: (count) =>
      count === 1 ? '1 Ergebnis' : `${count} Ergebnisse`
  },
  ja: {
    addFilter: '\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u8FFD\u52A0',
    searchFields: '\u5C5E\u6027\u3092\u691C\u7D22...',
    searchOperators: '\u6761\u4EF6\u3092\u691C\u7D22...',
    searchOptions: '\u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u691C\u7D22...',
    fieldsLabel: '\u5C5E\u6027',
    filtersLabel: '\u30D5\u30A3\u30EB\u30BF\u30FC',
    chipMenu: (fieldLabel) =>
      `${fieldLabel}\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u30AA\u30D7\u30B7\u30E7\u30F3`,
    clear: '\u30AF\u30EA\u30A2',
    apply: '\u9069\u7528',
    discard: '\u7834\u68C4',
    remove: '\u524A\u9664',
    duplicate: '\u8907\u88FD',
    negate: '\u53CD\u8EE2',
    negated: (operatorLabel) => NEGATED_JA[operatorLabel] ?? operatorLabel,
    empty: '\u7D50\u679C\u304C\u3042\u308A\u307E\u305B\u3093',
    valuePlaceholder: '\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B...',
    noValue: '\u5024\u306A\u3057',
    incomplete: '\u4E0D\u5B8C\u5168\u306A\u30D5\u30A3\u30EB\u30BF\u30FC',
    selectCondition: '\u6761\u4EF6\u3092\u9078\u629E',
    readOnly:
      '\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u3067\u3059\u3002\u3053\u308C\u3089\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002',
    valueCount: (count) => `${count}\u4EF6\u9078\u629E`,
    valueDetail: (summary, values) => `${summary}: ${values.join('\u3001')}`,
    valueRange: (from, to) => `${from}\u304B\u3089${to}`,
    rangeFrom: (fieldLabel) => `${fieldLabel}\uFF08\u958B\u59CB\uFF09`,
    rangeTo: (fieldLabel) => `${fieldLabel}\uFF08\u7D42\u4E86\uFF09`,
    rangeSeparator: '\u304B\u3089',
    countAnnouncement: (count) =>
      `\u30D5\u30A3\u30EB\u30BF\u30FC${count}\u4EF6\u3092\u9069\u7528\u4E2D`,
    resultsAnnouncement: (count) => `${count}\u4EF6\u306E\u7D50\u679C`
  }
};
const FIELD_LABELS = {
  en: {
    title: 'Title',
    status: 'Status',
    priority: 'Priority',
    assignee: 'Assignee',
    score: 'Score'
  },
  de: {
    title: 'Titel',
    status: 'Status',
    priority: 'Priorit\xE4t',
    assignee: 'Bearbeiter',
    score: 'Punktzahl'
  },
  ja: {
    title: '\u30BF\u30A4\u30C8\u30EB',
    status: '\u30B9\u30C6\u30FC\u30BF\u30B9',
    priority: '\u512A\u5148\u5EA6',
    assignee: '\u62C5\u5F53\u8005',
    score: '\u30B9\u30B3\u30A2'
  }
};
const OPTION_LABELS = {
  en: {
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'In Review',
    done: 'Done',
    cancelled: 'Cancelled',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    critical: 'Critical'
  },
  de: {
    todo: 'Offen',
    'in-progress': 'In Bearbeitung',
    review: 'In Pr\xFCfung',
    done: 'Erledigt',
    cancelled: 'Abgebrochen',
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    urgent: 'Dringend',
    critical: 'Kritisch'
  },
  ja: {
    todo: '\u672A\u7740\u624B',
    'in-progress': '\u9032\u884C\u4E2D',
    review: '\u30EC\u30D3\u30E5\u30FC\u4E2D',
    done: '\u5B8C\u4E86',
    cancelled: '\u4E2D\u6B62',
    low: '\u4F4E',
    medium: '\u4E2D',
    high: '\u9AD8',
    urgent: '\u7DCA\u6025',
    critical: '\u91CD\u5927'
  }
};
const ANY_LABELS = {
  en: { status: 'any status', priority: 'any priority', assignee: 'anyone' },
  de: {
    status: 'beliebiger Status',
    priority: 'beliebige Priorit\xE4t',
    assignee: 'alle'
  },
  ja: {
    status: '\u3059\u3079\u3066\u306E\u30B9\u30C6\u30FC\u30BF\u30B9',
    priority: '\u3059\u3079\u3066\u306E\u512A\u5148\u5EA6',
    assignee: '\u5168\u54E1'
  }
};
const CHANGE_LABELS = {
  en: (count) => (count === 1 ? '1 change' : `${count} changes`),
  de: (count) => (count === 1 ? '1 \xC4nderung' : `${count} \xC4nderungen`),
  ja: (count) => `\u5909\u66F4${count}\u4EF6`
};
const TONES = {
  todo: 'bg-text-muted',
  'in-progress': 'bg-warning',
  review: 'bg-info',
  done: 'bg-success',
  cancelled: 'bg-ui-destructive',
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-attention',
  urgent: 'bg-danger',
  critical: 'bg-ui-destructive'
};
const STATUSES = ['todo', 'in-progress', 'review', 'done', 'cancelled'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent', 'critical'];
const TEAM = [
  { value: 'ada', label: 'Ada Lovelace', img: 'women/1' },
  { value: 'grace', label: 'Grace Hopper', img: 'women/2' },
  { value: 'alan', label: 'Alan Turing', img: 'men/3' },
  { value: 'katherine', label: 'Katherine Johnson', img: 'women/4' },
  { value: 'edsger', label: 'Edsger Dijkstra', img: 'men/5' },
  { value: 'barbara', label: 'Barbara Liskov', img: 'women/6' },
  { value: 'tim', label: 'Tim Berners-Lee', img: 'men/7' },
  { value: 'margaret', label: 'Margaret Hamilton', img: 'women/8' }
];
function Dot({ className }) {
  return <span className={cn('size-2 shrink-0 rounded-full', className)} />;
}
function Person({ img, name }) {
  return (
    <Avatar className='size-5'>
      <AvatarImage
        src={`https://randomuser.me/api/portraits/${img}.jpg`}
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
function StackedDots({ options, empty }) {
  if (options.length === 0) return <>{empty}</>;
  if (options.length === 1) {
    return (
      <span className='flex items-center gap-1.5'>
        <Dot className={TONES[options[0].value] ?? 'bg-ui-muted-foreground'} />
        {options[0].label}
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5'>
      <span className='flex items-center'>
        {options.slice(0, 4).map((option) => (
          <span
            key={option.value}
            className={cn(
              'ring-ui-background -ml-1 size-2.5 rounded-full ring-2 first:ml-0',
              TONES[option.value] ?? 'bg-ui-muted-foreground'
            )}
          />
        ))}
      </span>
      <span className='text-ui-muted-foreground text-xs tabular-nums'>
        {options.length}
      </span>
    </span>
  );
}
function Face({ option }) {
  const entry = TEAM.find((candidate) => candidate.value === option.value);
  return <Person img={entry?.img ?? 'men/1'} name={option.label} />;
}
function StackedPeople({ options, empty }) {
  if (options.length === 0) return <>{empty}</>;
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
          <Face key={option.value} option={option} />
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
function buildFields(locale) {
  return [
    {
      id: 'title',
      label: FIELD_LABELS[locale].title,
      type: 'text',
      icon: <RegistryIcon lucide='TypeIcon' />
    },
    {
      id: 'status',
      label: FIELD_LABELS[locale].status,
      type: 'select',
      defaultOperator: 'is_any_of',
      icon: <RegistryIcon lucide='CircleDotIcon' />,
      options: STATUSES.map((value) => ({
        value,
        label: OPTION_LABELS[locale][value],
        icon: <Dot className={TONES[value]} />
      })),
      // Five options, so the search box is more chrome than the rows under it.
      searchable: false,
      renderValue: ({ options }) => (
        <StackedDots options={options} empty={ANY_LABELS[locale].status} />
      )
    },
    {
      id: 'priority',
      label: FIELD_LABELS[locale].priority,
      type: 'multiselect',
      icon: <RegistryIcon lucide='FlagIcon' />,
      options: PRIORITIES.map((value) => ({
        value,
        label: OPTION_LABELS[locale][value],
        icon: <Dot className={TONES[value]} />
      })),
      searchable: false,
      renderValue: ({ options }) => (
        <StackedDots options={options} empty={ANY_LABELS[locale].priority} />
      )
    },
    {
      id: 'assignee',
      label: FIELD_LABELS[locale].assignee,
      type: 'multiselect',
      // Wider than the panel's own `w-48`: a face plus a full name is the
      // widest row the option menu draws, and this example runs in three
      // locales, where a name that fits in one may not in another.
      className: 'w-56',
      icon: <RegistryIcon lucide='UserRoundCheckIcon' />,
      options: TEAM.map((person) => ({
        value: person.value,
        label: person.label,
        icon: <Person img={person.img} name={person.label} />
      })),
      // A list of PEOPLE carries no semantic order, unlike Priority above.
      sortSelected: 'label',
      renderValue: ({ options }) => (
        <StackedPeople options={options} empty={ANY_LABELS[locale].assignee} />
      )
    },
    {
      id: 'score',
      label: FIELD_LABELS[locale].score,
      type: 'number',
      icon: <RegistryIcon lucide='HashIcon' />
    }
  ];
}
const SEED = createFilterQuery(
  [
    createFilterRule({
      id: 'seed-1',
      path: ['status'],
      operator: 'is_any_of',
      value: ['in-progress', 'review']
    }),
    createFilterRule({
      id: 'seed-2',
      path: ['priority'],
      operator: 'has_any_of',
      value: ['urgent']
    }),
    createFilterRule({
      id: 'seed-3',
      path: ['assignee'],
      operator: 'has_any_of',
      value: ['ada', 'grace', 'alan', 'katherine']
    }),
    createFilterRule({
      id: 'seed-4',
      path: ['score'],
      operator: 'gte',
      value: 60
    })
  ],
  'and'
);
const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '\u65E5\u672C\u8A9E' }
];
const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'default', label: 'Default' }
];
const INTERACTION_OPTIONS = [
  { value: 'editable', label: 'Editable' },
  { value: 'readOnly', label: 'Read only' },
  { value: 'disabled', label: 'Disabled' }
];
function PropControl({ prop, value, options, onValueChange }) {
  const id = useId();
  return (
    <div className='flex shrink-0 flex-col gap-1.5'>
      {/*
      A LABEL, in the page's own type. It was the prop name set in mono,
      which is how an API reference writes an identifier and not how a
      control introduces itself: `labels + operatorLabels` above three
      language names is a reader being asked to hold the implementation in
      their head to use the demo. The name of the setting goes here and the
      prop it drives is the example's own code, one tab away.
    */}
      <span id={id} className='text-ui-muted-foreground text-xs font-medium'>
        {prop}
      </span>
      <ToggleGroup
        aria-labelledby={id}
        variant='outline'
        size='sm'
        spacing={0}
        type='single'
        value={value}
        onValueChange={(next) => onValueChange(next || value)}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
export function Pattern() {
  const [locale, setLocale] = useState('en');
  const [size, setSize] = useState('default');
  const [interaction, setInteraction] = useState('editable');
  const [changes, setChanges] = useState({ fires: 0, entries: [] });
  const [query, setQuery] = useState(SEED);
  return (
    // Spacing tightens below the breakpoint the toolbar already wraps at, and
    // is restored above it. The catalog frames this example at one authored
    // height, and a phone-width frame spends 244 of it on a five-row bar and
    // the rest on a toolbar that has folded into a column, so the gaps are the
    // only budget left to give back. Nothing changes at the widths where there
    // is room.
    <div className='flex w-full flex-col gap-2.5 min-[30rem]:gap-4'>
      {/*
              `labels` and `operatorLabels` are two independent surfaces over one
              catalog, so a locale change redraws every chip and never touches the
              query.

              `readOnly` and `disabled` are not two words for one state. `disabled`
              turns the bar off natively. `readOnly` blocks every mutation while
              leaving the bar focusable, readable and navigable, carries
              `labels.readOnly` as the toolbar's description, and hands a collapsed
              value its full contents as an accessible name, because the editor that
              would have revealed them is locked shut.
            */}
      <Filters
        fields={buildFields(locale)}
        query={query}
        size={size}
        readOnly={interaction === 'readOnly'}
        disabled={interaction === 'disabled'}
        labels={CHROME[locale]}
        operatorLabels={OPERATORS[locale]}
        showClear
        className={cn(
          // Padding first, so the two states below differ in FILL alone and the
          // bar does not move when one is flipped on. The negative margin pulls
          // that padding back out, so the first chip still lines up with the
          // tray's outside edge underneath it.
          'rounded-md p-1.5 transition-colors',
          // `data-readonly` is the container hook the primitive puts on the bar
          // for exactly this, and tint is the right treatment for it: a
          // read-only control keeps full contrast, the same way a read-only
          // input does, because everything in it is still legible and every
          // control in it is still reachable.
          //
          // The ring comes with it because the tint alone is 3% of lightness in
          // the light theme, which is the difference between a state a reader
          // notices on the flip and one they do not. Inset, so it is drawn
          // inside the padding declared above and the bar still does not move.
          'data-readonly:bg-ui-muted data-readonly:inset-ring-ui-border data-readonly:inset-ring',
          // `disabled` gets no such hook, so it is painted from the flag this
          // file already holds. Dimming is the honest word for it, and the two
          // treatments have to differ or the control below has three states and
          // two appearances.
          interaction === 'disabled' && 'opacity-60'
        )}
        onQueryChange={(next, details) => {
          setQuery(next);
          setChanges((current) => {
            const field = details.field?.id ?? null;
            const [newest, ...rest] = current.entries;
            const entries =
              newest?.reason === details.reason && newest.field === field
                ? [{ ...newest, count: newest.count + 1 }, ...rest]
                : [
                    { reason: details.reason, field, count: 1 },
                    ...current.entries
                  ].slice(0, 3);
            return { fires: current.fires + 1, entries };
          });
        }}
      />

      {/*
              ONE surface for the whole API, so the bar above it reads as the subject
              rather than as the first of several stacked rows. Every prop this
              example writes sits on one toolbar line, the strip under it reads the
              callback back, and the hairline between them comes from the card's own
              `divide-y` so the two are one object.

              A ROW and not the three stacked rows this replaces. Stacked, each prop
              got a full-width line and the three controls were left hanging off the
              tray's right edge with a lane of dead space between every name and the
              group it named. Set side by side each name sits against its own control,
              the toolbar costs one line instead of three, and the whole demo fits the
              frame without the bar above it scrolling out of view.

              A `Card` and not the muted panel this replaces, and the reason is a
              collision rather than a preference: every style paints a pressed segment
              with `bg-muted`, so a muted tray would have hidden the selected value in
              each of the three groups it holds. The card's surface is what makes the
              selection legible, `gap-0 py-0` undoes the stacking spacing it ships
              with, and each part carries its own padding because `--card-spacing` is
              a per-style token that reaches 32px in sera.
            */}
      {/*
              NO CARD. The controls are the page talking about the demo, not part of
              it: boxing them made a second panel above the one this example is
              actually about, and two stacked surfaces of similar weight leave a
              reader deciding which is the subject.

              They keep their own grouping - a name over each segmented group, one
              rule under the whole strip - which is all the containment a toolbar
              needs. The bar below is the thing in a box, because it is the thing.
            */}
      <div className='w-full'>
        {/*
                The toolbar. `items-end`, so the three segmented groups sit on one
                baseline whatever their names do above them - a prop whose name wraps
                would otherwise push its own control down and break the line the row
                is made of.

                One row in seven of the eight styles, where the three controls come to
                about 590px against the 880 the catalog frame leaves inside this card.
                SERA IS THE EIGHTH and it does not fit: it sets every segment
                uppercase with 1.2px of tracking and 24px of padding a side, which
                takes a two-letter value like sm to 71px and the three groups to 856px
                of controls before a single gap between them. That is a style deciding
                how big its own controls are, not something for this file to override,
                so the row folds to two lines there and `flex-wrap` is what makes the
                fold tidy rather than a clipped third control.

                Gaps and NO separators, which is the same decision. A vertical rule
                reads as a divider BETWEEN two things on one line, so the moment sera
                or a phone folds the row, the rule that was dividing the second and
                third control is left hanging off the end of the first line pointing
                at nothing. The stacked names already group each control with its own
                segments, so `gap-x-6` says everything the rules were there to say and
                says it at every width.
              */}
        <div className='flex flex-wrap items-end gap-x-6 gap-y-3 pb-3'>
          <PropControl
            prop='Language'
            value={locale}
            options={LOCALE_OPTIONS}
            onValueChange={setLocale}
          />
          <PropControl
            prop='Size'
            value={size}
            options={SIZE_OPTIONS}
            onValueChange={setSize}
          />
          <PropControl
            prop='State'
            value={interaction}
            options={INTERACTION_OPTIONS}
            onValueChange={setInteraction}
          />
        </div>

        {/*
                The tray's status line: what `onQueryChange` handed back, most recent
                first. Three props go in through the toolbar above and one callback
                comes out here, which is why the readout belongs on this surface and
                not floating between the bar and the tray.

                Its own line rather than the end of the toolbar row, because it is the
                one part of this card whose width is not knowable: three badges naming
                a reason, a field and a repeat count are wider than the three controls
                beside them on a bad day. Trailing the toolbar it would have pushed
                the controls onto a second line and then pulled them back as the
                badges folded, so the row a reader is aiming at would move under the
                pointer every time they used it.

                The count carries the strip. It names what the badges are without a
                heading over them, it is a measurement rather than a placeholder at
                zero, and it translates, because a number the consumer renders is the
                consumer's copy. Each entry keeps the field's ID and resolves its
                label at render, so the badges retranslate with everything else. The
                reason does not: it is an API value rather than copy, and a translated
                one would be a lie about what `details.reason` holds.
              */}
        <div className='border-ui-border/60 flex flex-wrap items-center gap-1.5 border-t py-2'>
          <span className='text-ui-muted-foreground text-xs tabular-nums'>
            {CHANGE_LABELS[locale](changes.fires)}
          </span>
          {changes.entries.map((entry, index) => (
            <Badge
              key={`${entry.reason}-${entry.field}-${index}`}
              variant={index === 0 ? 'default' : 'secondary'}
              className='gap-1.5'
            >
              <span className='font-mono'>{entry.reason}</span>
              {entry.field ? (
                <span className='opacity-75'>
                  {FIELD_LABELS[locale][entry.field] ?? entry.field}
                </span>
              ) : null}
              {entry.count > 1 ? (
                <span className='tabular-nums opacity-75'>×{entry.count}</span>
              ) : null}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
