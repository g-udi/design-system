// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Filters } from '../../../../src/components/core/FilterBar/parts/filters-extended.jsx';
import {
  createFilterQuery,
  createFilterRule
} from '../../../../src/components/core/FilterBar/parts/filters-query-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const TYPE_ICON = {
  text: <RegistryIcon lucide='TypeIcon' />,
  number: <RegistryIcon lucide='HashIcon' />,
  select: <RegistryIcon lucide='ListIcon' />,
  multiselect: <RegistryIcon lucide='TagsIcon' />,
  boolean: <RegistryIcon lucide='SquareCheckIcon' />
};
const slugify = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const toOptions = (labels) =>
  labels.map((label) => ({ value: slugify(label), label }));
function toField([label, type, options], copy = 1) {
  const name = copy > 1 ? `${label} ${copy}` : label;
  return {
    id: slugify(name),
    label: name,
    type,
    icon: TYPE_ICON[type],
    options: options && toOptions(options)
  };
}
const CORE = [
  {
    id: 'record-id',
    label: 'Record ID',
    type: 'text',
    keywords: ['uuid', 'primary key', 'identifier'],
    placeholder: '8f14e45f',
    icon: <RegistryIcon lucide='HashIcon' />
  },
  {
    id: 'name',
    label: 'Name',
    icon: <RegistryIcon lucide='UserIcon' />,
    fields: [
      { id: 'first', label: 'First', type: 'text', icon: TYPE_ICON.text },
      { id: 'last', label: 'Last', type: 'text', icon: TYPE_ICON.text },
      {
        id: 'full',
        label: 'Full',
        type: 'text',
        icon: TYPE_ICON.text,
        keywords: ['display name', 'whole name']
      }
    ]
  },
  {
    id: 'team',
    label: 'Team',
    icon: <RegistryIcon lucide='UsersIcon' />,
    fields: [
      {
        id: 'lead',
        label: 'Lead',
        type: 'text',
        icon: TYPE_ICON.text,
        keywords: ['manager', 'owner', 'reports to']
      },
      {
        id: 'size',
        label: 'Size',
        type: 'number',
        icon: TYPE_ICON.number,
        keywords: ['headcount', 'seats']
      },
      {
        id: 'department',
        label: 'Department',
        type: 'select',
        icon: TYPE_ICON.select,
        keywords: ['function', 'discipline'],
        options: toOptions([
          'Engineering',
          'Design',
          'Sales',
          'Marketing',
          'Support',
          'Finance'
        ])
      },
      {
        id: 'region',
        label: 'Region',
        type: 'select',
        icon: TYPE_ICON.select,
        keywords: ['territory', 'market'],
        options: toOptions(['North America', 'EMEA', 'APAC', 'LATAM'])
      }
    ]
  },
  {
    id: 'location',
    label: 'Primary location',
    icon: <RegistryIcon lucide='MapPinIcon' />,
    fields: [
      {
        id: 'city',
        label: 'City',
        type: 'text',
        icon: TYPE_ICON.text,
        keywords: ['town']
      },
      {
        id: 'country',
        label: 'Country',
        type: 'text',
        icon: TYPE_ICON.text,
        keywords: ['market']
      },
      {
        id: 'postcode',
        label: 'Postcode',
        type: 'text',
        icon: TYPE_ICON.text,
        placeholder: 'SW1A',
        keywords: ['zip', 'postal code', 'zip code']
      }
    ]
  }
];
const ATTRIBUTES_PER_OBJECT = 250;
const GENERIC = [
  ['Owner', 'text'],
  ['Source', 'select', ['Organic', 'Paid', 'Referral', 'Event', 'Outbound']],
  ['Health score', 'number'],
  ['Tags', 'multiselect', ['Beta', 'Churn risk', 'Expansion', 'VIP']],
  ['External ID', 'text'],
  ['Archived', 'boolean']
];
const OBJECTS = {
  Person: [
    [
      'Lifecycle stage',
      'select',
      ['Subscriber', 'Lead', 'Qualified', 'Opportunity', 'Customer', 'Churned']
    ],
    ['Job title', 'text'],
    ['Lead score', 'number'],
    ['Email opt in', 'boolean']
  ],
  Company: [
    [
      'Industry',
      'select',
      ['Software', 'Retail', 'Finance', 'Healthcare', 'Manufacturing']
    ],
    ['Employees', 'number'],
    ['Domain', 'text'],
    ['Publicly listed', 'boolean']
  ],
  Deal: [
    [
      'Stage',
      'select',
      ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Won', 'Lost']
    ],
    ['Amount', 'number'],
    ['Close quarter', 'select', ['Q1', 'Q2', 'Q3', 'Q4']],
    ['Forecast committed', 'boolean']
  ],
  Ticket: [
    ['Severity', 'select', ['Sev 1', 'Sev 2', 'Sev 3', 'Sev 4']],
    ['Queue', 'select', ['Billing', 'Onboarding', 'Bugs', 'How to']],
    ['First response minutes', 'number'],
    ['Breached SLA', 'boolean']
  ],
  Invoice: [
    ['Status', 'select', ['Draft', 'Open', 'Paid', 'Overdue', 'Void']],
    ['Total', 'number'],
    ['Currency', 'select', ['USD', 'EUR', 'GBP', 'JPY']],
    ['Auto charge', 'boolean']
  ],
  Campaign: [
    [
      'Channel',
      'select',
      ['Email', 'Paid search', 'Paid social', 'Webinar', 'Field event']
    ],
    ['Budget', 'number'],
    ['Audience', 'multiselect', ['Trial', 'Free', 'Paid', 'Partner']],
    ['Running', 'boolean']
  ],
  Product: [
    ['Category', 'select', ['Hardware', 'Software', 'Service', 'Add on']],
    ['Price', 'number'],
    ['SKU', 'text'],
    ['In catalogue', 'boolean']
  ],
  Workspace: [
    ['Plan', 'select', ['Free', 'Pro', 'Business', 'Enterprise']],
    ['Seats', 'number'],
    ['Data region', 'select', ['US east', 'EU west', 'AP south']],
    ['SSO enforced', 'boolean']
  ]
};
function buildCustomFields() {
  const entries = Object.entries(OBJECTS);
  return {
    id: 'custom',
    label: 'Custom fields',
    count: entries.length * ATTRIBUTES_PER_OBJECT,
    icon: <RegistryIcon lucide='LayersIcon' />,
    fields: entries.map(([object, own]) => ({
      id: slugify(object),
      label: object,
      count: ATTRIBUTES_PER_OBJECT,
      fields: Array.from({ length: ATTRIBUTES_PER_OBJECT }, (_, index) => {
        if (index < own.length) return toField(own[index]);
        const position = index - own.length;
        return toField(
          GENERIC[position % GENERIC.length],
          Math.floor(position / GENERIC.length) + 1
        );
      })
    }))
  };
}
const FIELDS = [...CORE, buildCustomFields()];
export function Pattern() {
  const [query, setQuery] = useState(() =>
    createFilterQuery([
      createFilterRule({
        id: 'seed-1',
        path: ['custom', 'person', 'lifecycle-stage'],
        operator: 'is',
        value: 'customer'
      })
    ])
  );
  return (
    <Filters fields={FIELDS} query={query} onQueryChange={setQuery} showClear />
  );
}
