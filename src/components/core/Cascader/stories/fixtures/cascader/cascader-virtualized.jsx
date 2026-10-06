'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '@gaudi/design-system/core/Cascader';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { CascaderVirtualItems } from '@gaudi/design-system/core/Cascader';
import { default as Button } from '@gaudi/design-system/core/Button';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const globeIcon = <RegistryIcon lucide='GlobeIcon' className='size-4' />;
const REGIONS = [
  [
    'europe',
    'Europe',
    612,
    [
      ['DE', 'Germany', 'Berlin,Munich,Hamburg,Cologne'],
      ['FR', 'France', 'Paris,Lyon,Marseille,Toulouse'],
      ['GB', 'United Kingdom', 'London,Manchester,Birmingham,Glasgow'],
      ['IT', 'Italy', 'Rome,Milan,Naples,Turin'],
      ['ES', 'Spain', 'Madrid,Barcelona,Valencia,Seville'],
      ['PL', 'Poland', 'Warsaw,Krakow,Gdansk,Wroclaw'],
      ['NL', 'Netherlands', 'Amsterdam,Rotterdam,Utrecht,Eindhoven'],
      ['BE', 'Belgium', 'Brussels,Antwerp,Ghent,Liege'],
      ['SE', 'Sweden', 'Stockholm,Gothenburg,Malmo,Uppsala'],
      ['PT', 'Portugal', 'Lisbon,Porto,Braga,Coimbra']
    ]
  ],
  [
    'americas',
    'Americas',
    528,
    [
      ['US', 'United States', 'New York,Chicago,Los Angeles,Miami'],
      ['BR', 'Brazil', 'Sao Paulo,Rio de Janeiro,Belo Horizonte,Recife'],
      ['MX', 'Mexico', 'Mexico City,Guadalajara,Monterrey,Puebla'],
      ['CO', 'Colombia', 'Bogota,Medellin,Cali,Barranquilla'],
      ['AR', 'Argentina', 'Buenos Aires,Cordoba,Rosario,Mendoza'],
      ['CA', 'Canada', 'Toronto,Montreal,Vancouver,Calgary'],
      ['PE', 'Peru', 'Lima,Arequipa,Trujillo,Cusco'],
      ['VE', 'Venezuela', 'Caracas,Maracaibo,Valencia,Barquisimeto'],
      ['CL', 'Chile', 'Santiago,Valparaiso,Concepcion,Antofagasta'],
      ['EC', 'Ecuador', 'Quito,Guayaquil,Cuenca,Ambato']
    ]
  ],
  [
    'apac',
    'Asia Pacific',
    674,
    [
      ['IN', 'India', 'Mumbai,Delhi,Bengaluru,Chennai'],
      ['CN', 'China', 'Shanghai,Beijing,Shenzhen,Chengdu'],
      ['ID', 'Indonesia', 'Jakarta,Surabaya,Bandung,Medan'],
      ['PK', 'Pakistan', 'Karachi,Lahore,Islamabad,Faisalabad'],
      ['JP', 'Japan', 'Tokyo,Osaka,Nagoya,Fukuoka'],
      ['PH', 'Philippines', 'Manila,Cebu,Davao,Quezon City'],
      ['VN', 'Vietnam', 'Hanoi,Ho Chi Minh City,Da Nang,Can Tho'],
      ['TH', 'Thailand', 'Bangkok,Chiang Mai,Phuket,Khon Kaen'],
      ['KR', 'South Korea', 'Seoul,Busan,Incheon,Daegu'],
      ['MY', 'Malaysia', 'Kuala Lumpur,Penang,Johor Bahru,Ipoh']
    ]
  ],
  [
    'africa',
    'Africa',
    431,
    [
      ['NG', 'Nigeria', 'Lagos,Abuja,Kano,Port Harcourt'],
      ['ET', 'Ethiopia', 'Addis Ababa,Dire Dawa,Mekelle,Hawassa'],
      ['EG', 'Egypt', 'Cairo,Alexandria,Giza,Luxor'],
      ['CD', 'DR Congo', 'Kinshasa,Lubumbashi,Goma,Kisangani'],
      ['TZ', 'Tanzania', 'Dar es Salaam,Dodoma,Mwanza,Arusha'],
      ['ZA', 'South Africa', 'Johannesburg,Cape Town,Durban,Pretoria'],
      ['KE', 'Kenya', 'Nairobi,Mombasa,Kisumu,Nakuru'],
      ['SD', 'Sudan', 'Khartoum,Omdurman,Port Sudan,Nyala'],
      ['MA', 'Morocco', 'Casablanca,Rabat,Marrakesh,Tangier'],
      ['GH', 'Ghana', 'Accra,Kumasi,Tamale,Takoradi']
    ]
  ],
  [
    'mideast',
    'Middle East',
    386,
    [
      ['TR', 'Turkiye', 'Istanbul,Ankara,Izmir,Bursa'],
      ['IR', 'Iran', 'Tehran,Mashhad,Isfahan,Shiraz'],
      ['IQ', 'Iraq', 'Baghdad,Basra,Mosul,Erbil'],
      ['SA', 'Saudi Arabia', 'Riyadh,Jeddah,Dammam,Mecca'],
      ['YE', 'Yemen', 'Sanaa,Aden,Taiz,Hodeidah'],
      ['SY', 'Syria', 'Damascus,Aleppo,Homs,Latakia'],
      ['JO', 'Jordan', 'Amman,Zarqa,Irbid,Aqaba'],
      ['IL', 'Israel', 'Tel Aviv,Jerusalem,Haifa,Beersheba'],
      ['AE', 'United Arab Emirates', 'Dubai,Abu Dhabi,Sharjah,Al Ain'],
      ['OM', 'Oman', 'Muscat,Salalah,Sohar,Nizwa']
    ]
  ],
  [
    'oceania',
    'Oceania',
    317,
    [
      ['AU', 'Australia', 'Sydney,Melbourne,Brisbane,Perth'],
      ['NZ', 'New Zealand', 'Auckland,Wellington,Christchurch,Hamilton'],
      ['PG', 'Papua New Guinea', 'Port Moresby,Lae,Mount Hagen,Madang'],
      ['FJ', 'Fiji', 'Suva,Nadi,Lautoka,Labasa'],
      ['SB', 'Solomon Islands', 'Honiara,Auki,Gizo,Munda'],
      ['NC', 'New Caledonia', 'Noumea,Mont-Dore,Dumbea,Paita'],
      ['PF', 'French Polynesia', 'Papeete,Faaa,Punaauia,Pirae'],
      ['VU', 'Vanuatu', 'Port Vila,Luganville,Isangel,Lakatoro'],
      ['WS', 'Samoa', 'Apia,Vaitele,Faleasiu,Salelologa'],
      ['TO', 'Tonga', "Nuku'alofa,Neiafu,Haveluloto,Vaini"]
    ]
  ]
];
function flagOf(iso2) {
  return String.fromCodePoint(
    ...[...iso2].map((letter) => letter.charCodeAt(0) + 127397)
  );
}
const MARKET_ZONES = [
  '',
  'Metro',
  'North',
  'South',
  'East',
  'West',
  'Central',
  'Northeast',
  'Northwest',
  'Southeast',
  'Southwest',
  'Ring',
  'Corridor',
  'Inner Ring',
  'Outer Ring',
  'North Ring',
  'South Ring',
  'Outskirts'
];
const TOTAL_MARKETS = REGIONS.reduce(
  (total, [, , markets]) => total + markets,
  0
);
const REGION_SIZES = REGIONS.map(([, , markets]) => markets);
const SMALLEST_REGION = Math.min(...REGION_SIZES);
const LARGEST_REGION = Math.max(...REGION_SIZES);
const COUNTRY_COUNT = REGIONS.reduce(
  (total, [, , , countries]) => total + countries.length,
  0
);
const REACH_TIERS = [
  {
    floor: 750,
    variant: 'success-light'
  },
  {
    floor: 500,
    variant: 'info-light'
  },
  {
    floor: 250,
    variant: 'primary-light'
  },
  {
    floor: 0,
    variant: 'warning-light'
  }
];
function reachTier(subscribers) {
  return (
    REACH_TIERS.find((tier) => subscribers >= tier.floor) ??
    REACH_TIERS[REACH_TIERS.length - 1]
  );
}
function mix(n) {
  let h = (n ^ 2654435769) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}
function buildDirectory() {
  return REGIONS.map(([regionId, regionLabel, markets, countries], r) => {
    const flags = countries.map(([iso2]) => (
      <span key={iso2} aria-hidden='true' className='text-base leading-none'>
        {flagOf(iso2)}
      </span>
    ));
    const cities = countries.map(([, , list]) => list.split(','));
    return {
      value: regionId,
      label: regionLabel,
      icon: globeIcon,
      children: Array.from({ length: markets }, (_, i) => {
        const c = i % countries.length;
        const [iso2, country] = countries[c];
        const list = cities[c];
        const k = Math.floor(i / countries.length);
        const zone =
          MARKET_ZONES[Math.floor(k / list.length) % MARKET_ZONES.length];
        const city = list[k % list.length];
        const area = zone ? `${city} ${zone}` : city;
        return {
          value: `${regionId}.${iso2.toLowerCase()}.${k}`,
          label: country,
          icon: flags[c],
          // Typing "Munich" or "DE" finds the row even though neither word is
          // its label: keywords are matched alongside it.
          keywords: [area, iso2],
          data: {
            area,
            // The region index is folded into the seed as well as the row's, or
            // the same ordinal in two regions whose countries happen to share a
            // first letter would report the same reach.
            subscribers:
              40 + (mix(r * 7919 + i * 31 + iso2.charCodeAt(0)) % 960)
          }
        };
      })
    };
  });
}
export function Pattern() {
  const [items, setItems] = useState(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    const frame = requestAnimationFrame(() => setItems(buildDirectory()));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className='flex w-full flex-col items-center gap-2 p-4'>
      <Cascader
        items={items ?? []}
        value={value}
        onValueChange={setValue}
        disabled={items === null}
        estimateRowSize={36}
        renderLabel={(node, state) => {
          if (state.branch) {
            return (
              <span className='w-full truncate text-start font-medium'>
                {node.label}
              </span>
            );
          }
          const subscribers = node.data?.subscribers ?? 0;
          const tier = reachTier(subscribers);
          return (
            <span className='flex w-full min-w-0 items-center gap-2'>
              <span className='min-w-0 flex-1 truncate text-start'>
                {node.label}
              </span>
              <span className='text-ui-muted-foreground min-w-0 truncate text-xs'>
                {node.data?.area}
              </span>
              <Badge
                variant={tier.variant}
                className='shrink-0 tabular-nums'
              >
                {subscribers}k
                {/* The row's accessible name is its text, and a bare "612k"
           read out after a country name means nothing. */}
                <span className='sr-only'> subscribers</span>
              </Badge>
            </span>
          );
        }}
      >
        <CascaderTrigger
          aria-label='Market'
          render={
            <Button
              variant='outline'
              className='w-80 justify-between gap-2 font-normal'
            />
          }
        >
          {items === null ? (
            <span className='text-ui-muted-foreground flex items-center gap-2'>
              <Loader className='size-4' />
              Loading {TOTAL_MARKETS.toLocaleString()} markets...
            </span>
          ) : (
            /* The default trigger renders the whole path, which here would say
       "Europe > Germany": the region again, then a country that dozens
       of rows share. So it names what was actually picked instead, on
       the row's own terms - country first, territory after it. */
            <CascaderValue className='gap-2'>
              {(selected) => {
                const node = selected[0];
                if (!node) {
                  return (
                    <span className='text-ui-muted-foreground truncate'>
                      Select a market
                    </span>
                  );
                }
                return (
                  <>
                    {node.icon}
                    <span className='min-w-0 truncate'>{node.label}</span>
                    <span className='text-ui-muted-foreground min-w-0 truncate text-xs'>
                      {node.data?.area}
                    </span>
                  </>
                );
              }}
            </CascaderValue>
          )}
        </CascaderTrigger>

        <CascaderContent className='w-80'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            {/* Kept deliberately. The windowing IS the subject here, and a
       windowed list needs a scrollport with a height it can divide
       into rows - so the cap is part of the demonstration rather than
       a stand-in for one. */}
            <CascaderList maxHeight={288}>
              <CascaderVirtualItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className='text-ui-muted-foreground text-xs'>
        {TOTAL_MARKETS.toLocaleString()} markets in {COUNTRY_COUNT} countries,{' '}
        {SMALLEST_REGION.toLocaleString()} to {LARGEST_REGION.toLocaleString()}{' '}
        per region across {REGIONS.length} regions.
      </p>
    </div>
  );
}
