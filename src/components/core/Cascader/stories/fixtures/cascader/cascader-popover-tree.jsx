'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection
} from '@gaudi/design-system/core/Cascader';
import { CascaderItems } from '@gaudi/design-system/core/Cascader';
import {
  CascaderInput,
  CascaderNav
} from '@gaudi/design-system/core/Cascader';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const globeIcon = <RegistryIcon lucide='GlobeIcon' className='size-4' />;
const compassIcon = <RegistryIcon lucide='CompassIcon' className='size-4' />;
function flagOf(iso2) {
  return String.fromCodePoint(
    ...[...iso2].map((letter) => letter.charCodeAt(0) + 127397)
  );
}
function flagIcon(iso2) {
  return (
    <span aria-hidden='true' className='w-5 text-center text-base leading-none'>
      {flagOf(iso2)}
    </span>
  );
}
const CONTINENTS = [
  [
    'europe',
    'Europe',
    [
      [
        'western',
        'Western Europe',
        [
          ['DE', 'Germany'],
          ['FR', 'France'],
          ['NL', 'Netherlands'],
          ['BE', 'Belgium'],
          ['AT', 'Austria'],
          ['CH', 'Switzerland']
        ]
      ],
      [
        'northern',
        'Northern Europe',
        [
          ['GB', 'United Kingdom'],
          ['IE', 'Ireland'],
          ['SE', 'Sweden'],
          ['NO', 'Norway'],
          ['DK', 'Denmark'],
          ['FI', 'Finland']
        ]
      ],
      [
        'southern',
        'Southern Europe',
        [
          ['IT', 'Italy'],
          ['ES', 'Spain'],
          ['PT', 'Portugal'],
          ['GR', 'Greece']
        ]
      ],
      [
        'central',
        'Central Europe',
        [
          ['PL', 'Poland'],
          ['CZ', 'Czechia'],
          ['HU', 'Hungary'],
          ['RO', 'Romania']
        ]
      ]
    ]
  ],
  [
    'americas',
    'Americas',
    [
      [
        'north',
        'North America',
        [
          ['US', 'United States'],
          ['CA', 'Canada'],
          ['MX', 'Mexico']
        ]
      ],
      [
        'south',
        'South America',
        [
          ['BR', 'Brazil'],
          ['AR', 'Argentina'],
          ['CL', 'Chile'],
          ['CO', 'Colombia'],
          ['PE', 'Peru']
        ]
      ],
      [
        'central',
        'Central America',
        [
          ['CR', 'Costa Rica'],
          ['PA', 'Panama'],
          ['GT', 'Guatemala'],
          ['DO', 'Dominican Republic']
        ]
      ]
    ]
  ],
  [
    'apac',
    'Asia Pacific',
    [
      [
        'east',
        'East Asia',
        [
          ['JP', 'Japan'],
          ['KR', 'South Korea'],
          ['CN', 'China'],
          ['TW', 'Taiwan'],
          ['HK', 'Hong Kong']
        ]
      ],
      [
        'southeast',
        'Southeast Asia',
        [
          ['SG', 'Singapore'],
          ['MY', 'Malaysia'],
          ['TH', 'Thailand'],
          ['VN', 'Vietnam'],
          ['ID', 'Indonesia'],
          ['PH', 'Philippines']
        ]
      ],
      [
        'south',
        'South Asia',
        [
          ['IN', 'India'],
          ['PK', 'Pakistan'],
          ['BD', 'Bangladesh'],
          ['LK', 'Sri Lanka']
        ]
      ]
    ]
  ],
  [
    'mideast',
    'Middle East',
    [
      [
        'gulf',
        'Gulf States',
        [
          ['AE', 'United Arab Emirates'],
          ['SA', 'Saudi Arabia'],
          ['QA', 'Qatar'],
          ['KW', 'Kuwait'],
          ['BH', 'Bahrain'],
          ['OM', 'Oman']
        ]
      ],
      [
        'levant',
        'Levant',
        [
          ['IL', 'Israel'],
          ['JO', 'Jordan'],
          ['LB', 'Lebanon']
        ]
      ]
    ]
  ],
  [
    'africa',
    'Africa',
    [
      [
        'north',
        'North Africa',
        [
          ['MA', 'Morocco'],
          ['EG', 'Egypt'],
          ['TN', 'Tunisia'],
          ['DZ', 'Algeria']
        ]
      ],
      [
        'west',
        'West Africa',
        [
          ['NG', 'Nigeria'],
          ['GH', 'Ghana'],
          ['SN', 'Senegal'],
          ['CI', "Cote d'Ivoire"]
        ]
      ],
      [
        'east',
        'East Africa',
        [
          ['KE', 'Kenya'],
          ['TZ', 'Tanzania'],
          ['ET', 'Ethiopia'],
          ['UG', 'Uganda']
        ]
      ],
      [
        'south',
        'Southern Africa',
        [
          ['ZA', 'South Africa'],
          ['BW', 'Botswana'],
          ['NA', 'Namibia']
        ]
      ]
    ]
  ],
  [
    'oceania',
    'Oceania',
    [
      [
        'anz',
        'Australia and New Zealand',
        [
          ['AU', 'Australia'],
          ['NZ', 'New Zealand']
        ]
      ],
      [
        'pacific',
        'Pacific Islands',
        [
          ['FJ', 'Fiji'],
          ['PG', 'Papua New Guinea'],
          ['NC', 'New Caledonia'],
          ['PF', 'French Polynesia']
        ]
      ]
    ]
  ]
];
const zones = CONTINENTS.map(([continent, continentLabel, regions]) => ({
  value: continent,
  label: continentLabel,
  icon: globeIcon,
  children: regions.map(([region, regionLabel, countries]) => ({
    value: `${continent}.${region}`,
    label: regionLabel,
    icon: compassIcon,
    children: countries.map(([iso2, name]) => ({
      // Exactly three dot separated segments, and no segment carries a dot of
      // its own. That is what lets the summary below tell a country apart
      // from the region and the continent above it by counting separators.
      value: `${continent}.${region}.${iso2.toLowerCase()}`,
      label: name,
      icon: flagIcon(iso2),
      // So the search field finds Germany on "DE" as well as on the name.
      keywords: [iso2]
    }))
  }))
}));
function ZoneValue() {
  const { selected, paths, isEmpty } = useCascaderSelection();
  const committed = new Set(selected.map((node) => node.value));
  const chains = paths.filter((path) => path.length > 0);
  if (isEmpty || chains.length === 0) {
    return (
      <span className='text-ui-muted-foreground truncate'>
        Select shipping destinations
      </span>
    );
  }
  const countries = chains.filter(
    (path) => !path[path.length - 1].children?.length
  ).length;
  const covering = chains
    .filter((path) => {
      const parent = path[path.length - 2];
      return !parent || !committed.has(parent.value);
    })
    .map((path) => path[path.length - 1].label);
  return (
    <span className='flex min-w-0 flex-1 items-center gap-1.5 text-start'>
      <span className='min-w-0 truncate'>{covering.join(', ')}</span>
      <span className='text-ui-muted-foreground shrink-0'>
        · {countries} {countries === 1 ? 'country' : 'countries'}
      </span>
    </span>
  );
}
export function Pattern() {
  const [value, setValue] = useState([]);
  const [expanded, setExpanded] = useState(['europe', 'europe.western']);
  return (
    <div className='flex w-full justify-center p-4'>
      <div className='w-full max-w-sm'>
        <Cascader
          multiple
          cascade
          selectable='any'
          mode='tree'
          items={zones}
          value={value}
          onValueChange={setValue}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <CascaderTrigger
            aria-label='Shipping destinations'
            render={
              <Button
                variant='outline'
                className='w-full justify-between gap-2 font-normal'
              />
            }
          >
            <ZoneValue />
          </CascaderTrigger>

          {/* Extra room for deeply indented labels; the popup remains viewport-bounded. */}
          <CascaderContent className='w-[26rem]'>
            <CascaderPanel>
              <CascaderNav>
                {/* Tree mode never drills, so there is no level to go back to. */}
                <CascaderInput showBack={false} />
              </CascaderNav>
              <CascaderEmpty />
              <CascaderList>
                <CascaderItems />
              </CascaderList>
              <CascaderStatus />
            </CascaderPanel>
          </CascaderContent>
        </Cascader>
      </div>
    </div>
  );
}
