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
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderInput,
  CascaderNav
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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

          {/* WIDER THAN THE TRIGGER, on purpose, and the one measurement that
                  fixes the deepest level.

                  Where a country row's width goes, in nova, with the popup at the
                  trigger's own 384px: 8px of list padding, then a 6px start inset
                  plus 32px of indent (two levels at the row's default 16), a 6px
                  end inset, an 18px expander slot the leaf reserves but cannot
                  use, a 16px checkbox, a 20px flag and three 8px gaps. 130px of
                  the 384 is gone before the country name starts, and in a narrow
                  embed - a catalog card, a phone - the popup falls back to its own
                  floor and the name is down to about 190px.

                  `w-80` was that floor, and at this demo's width it was INERT:
                  320px never beats the `min-w-(--anchor-width)` the popup already
                  takes from a 384px trigger, so the class changed no pixel anyone
                  ever saw. `CascaderContent` deliberately does not clamp to the
                  anchor - a cascade is routinely wider than the control that opens
                  it - so the fix is to name a width ABOVE the anchor. 416px puts
                  every one of those 32px into the label column at every depth and
                  raises the narrow-embed floor by the same amount. It stays
                  bounded: `max-w-(--available-width)` still clamps it on a small
                  viewport.

                  Three alternatives were rejected. A smaller per-depth `indent` is
                  the tempting one, but `CascaderItem` only takes it from a row you
                  render yourself, and `CascaderItems`' tree-mode render prop hands
                  back a node and an index - no `expanded`, no `aria-setsize` or
                  `aria-posinset`. `depth` still resolves itself off the tree
                  index, `expanded` has no such fallback, so every branch would
                  draw a collapsed chevron and the tree would lose its position
                  metadata. That is accessibility traded for 8px a level. Trimming
                  the row has nothing left to take: the flag IS the icon slot, the
                  name IS the label, and the empty expander slot and the leading
                  checkbox are per-list decisions that keep one label column per
                  depth. And widening the CONTROL to `max-w-md` buys the same
                  pixels by changing what the example is about - a normal-width
                  field with a big tree behind it. */}
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
