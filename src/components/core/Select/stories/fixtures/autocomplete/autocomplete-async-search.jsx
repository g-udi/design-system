'use client';
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus
} from '@gaudi/design-system/core/Select';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import Loader from '@gaudi/design-system/core/Loader';
export function Pattern() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: 'base' });
  useEffect(() => {
    if (!searchValue) {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      return void 0;
    }
    setIsLoading(true);
    setError(null);
    let ignore = false;
    async function fetchDevelopers() {
      try {
        const results = await searchDevelopers(searchValue, contains);
        if (!ignore) {
          setSearchResults(results);
        }
      } catch {
        if (!ignore) {
          setError('Could not load contributors. Try again.');
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    const timeoutId = setTimeout(fetchDevelopers, 300);
    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [searchValue, contains]);
  let status = '';
  if (isLoading) {
    status = (
      <div className='flex items-center gap-2'>
        <Loader size='sm' aria-hidden='true' />
        Searching contributors...
      </div>
    );
  } else if (error) {
    status = error;
  } else if (searchResults.length === 0 && searchValue) {
    status = `No contributors match "${searchValue}"`;
  } else if (searchResults.length > 0) {
    status = `${searchResults.length} contributor${searchResults.length === 1 ? '' : 's'} found`;
  } else if (!searchValue) {
    status = 'Type a name, role or city...';
  }
  const shouldRenderPopup = searchValue !== '';
  return (
    <div className='w-full max-w-xs'>
      <Autocomplete
        items={searchResults}
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={(item) => item.name}
        filter={null}
      >
        <AutocompleteInput
          placeholder='e.g. Bram, illustrator, Lisbon'
          showTrigger
          showClear
        />
        {shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(developer) => (
                <AutocompleteItem
                  key={developer.id}
                  value={developer}
                  className='rounded-lg'
                >
                  <div className='flex items-center gap-2.5 truncate'>
                    <Avatar className='size-7'>
                      <AvatarImage
                        src={developer.avatar}
                        alt={developer.name}
                      />
                      <AvatarFallback>
                        {developer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <div className='truncate font-medium'>
                        {developer.name}
                      </div>
                      <div className='text-text-muted truncate text-xs'>
                        {developer.role} • {developer.location}
                      </div>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}
async function searchDevelopers(query, filter) {
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });
  if (query === 'error') {
    throw new Error('Network error');
  }
  return topDevelopers.filter(
    (developer) =>
      filter(developer.name, query) ||
      filter(developer.role, query) ||
      filter(developer.location, query) ||
      developer.skills.some((skill) => filter(skill, query))
  );
}
const topDevelopers = [
  {
    id: '1',
    name: 'Bram Ellery',
    role: 'Features editor',
    location: 'Lisbon, PT',
    skills: ['Long reads', 'Interviews', 'Editing', 'Research', 'Archives'],
    experience: 8,
    rating: 4.9,
    avatar: '/avatars/person-26.svg'
  },
  {
    id: '2',
    name: 'Sabine Johansson',
    role: 'Art director',
    location: 'Ghent, BE',
    skills: ['Typography', 'Layout', 'Colour', 'Covers', 'Print'],
    experience: 10,
    rating: 4.8,
    avatar: '/avatars/person-02.svg'
  },
  {
    id: '3',
    name: 'Rafe Okonkwo',
    role: 'Copy editor',
    location: 'Oaxaca, MX',
    skills: ['House style', 'Grammar', 'Headlines', 'Fact checking', 'Captions'],
    experience: 6,
    rating: 4.7,
    avatar: '/avatars/person-27.svg'
  },
  {
    id: '4',
    name: 'Juno Iwasaki',
    role: 'Photo editor',
    location: 'Bergen, NO',
    skills: ['Photography', 'Picture desks', 'Captions', 'Archives', 'Licensing'],
    experience: 7,
    rating: 4.9,
    avatar: '/avatars/person-03.svg'
  },
  {
    id: '5',
    name: 'Ottilie Nakamura',
    role: 'Staff writer',
    location: 'Accra, GH',
    skills: ['Essays', 'Reporting', 'Interviews', 'Profiles', 'Research'],
    experience: 5,
    rating: 4.6,
    avatar: '/avatars/person-28.svg'
  },
  {
    id: '6',
    name: 'Nell Thorsen',
    role: 'Data journalist',
    location: 'Kyoto, JP',
    skills: ['Charts', 'Spreadsheets', 'Maps', 'Statistics', 'Reporting'],
    experience: 9,
    rating: 4.8,
    avatar: '/avatars/person-04.svg'
  },
  {
    id: '7',
    name: 'Felix Wainwright',
    role: 'Illustrator',
    location: 'Porto, PT',
    skills: ['Drawing', 'Spot art', 'Covers', 'Lettering', 'Colour'],
    experience: 12,
    rating: 4.9,
    avatar: '/avatars/person-29.svg'
  },
  {
    id: '8',
    name: 'Mireille Gaspard',
    role: 'Newsletter editor',
    location: 'Leipzig, DE',
    skills: ['Newsletters', 'Scheduling', 'Headlines', 'Audience', 'Editing'],
    experience: 4,
    rating: 4.5,
    avatar: '/avatars/person-05.svg'
  },
  {
    id: '9',
    name: 'Rufus Tamura',
    role: 'Audio producer',
    location: 'Hobart, AU',
    skills: ['Sound', 'Interviews', 'Scripting', 'Editing', 'Music'],
    experience: 6,
    rating: 4.7,
    avatar: '/avatars/person-30.svg'
  },
  {
    id: '10',
    name: 'Maren Takahashi',
    role: 'Fact checker',
    location: 'Valparaíso, CL',
    skills: ['Research', 'Sources', 'Verification', 'Archives', 'Statistics'],
    experience: 5,
    rating: 4.6,
    avatar: '/avatars/person-06.svg'
  },
  {
    id: '11',
    name: 'Leander Moyo',
    role: 'Type designer',
    location: 'Tallinn, EE',
    skills: ['Long reads', 'Interviews', 'Editing', 'Research', 'Archives'],
    experience: 8,
    rating: 4.8,
    avatar: '/avatars/person-31.svg'
  },
  {
    id: '12',
    name: 'Saskia Tormé',
    role: 'Sub-editor',
    location: 'Galway, IE',
    skills: ['Typography', 'Layout', 'Colour', 'Covers', 'Print'],
    experience: 7,
    rating: 4.7,
    avatar: '/avatars/person-07.svg'
  },
  {
    id: '13',
    name: 'Kenji Hallström',
    role: 'Podcast host',
    location: 'Kraków, PL',
    skills: ['House style', 'Grammar', 'Headlines', 'Fact checking', 'Captions'],
    experience: 6,
    rating: 4.9,
    avatar: '/avatars/person-32.svg'
  },
  {
    id: '14',
    name: 'Romilly Greene',
    role: 'Picture researcher',
    location: 'Montréal, CA',
    skills: ['Photography', 'Picture desks', 'Captions', 'Archives', 'Licensing'],
    experience: 5,
    rating: 4.6,
    avatar: '/avatars/person-08.svg'
  },
  {
    id: '15',
    name: 'Matthias Ilunga',
    role: 'Proofreader',
    location: 'Nairobi, KE',
    skills: ['Essays', 'Reporting', 'Interviews', 'Profiles', 'Research'],
    experience: 10,
    rating: 4.8,
    avatar: '/avatars/person-33.svg'
  },
  {
    id: '16',
    name: 'Seraphine Anders',
    role: 'Managing editor',
    location: 'Bologna, IT',
    skills: ['Charts', 'Spreadsheets', 'Maps', 'Statistics', 'Reporting'],
    experience: 8,
    rating: 4.7,
    avatar: '/avatars/person-09.svg'
  },
  {
    id: '17',
    name: 'Torvald Thorne',
    role: 'Archivist',
    location: 'Tbilisi, GE',
    skills: ['Drawing', 'Spot art', 'Covers', 'Lettering', 'Colour'],
    experience: 11,
    rating: 4.9,
    avatar: '/avatars/person-34.svg'
  },
  {
    id: '18',
    name: 'Tamsin Oyelowo',
    role: 'Book reviewer',
    location: 'Edinburgh, UK',
    skills: ['Newsletters', 'Scheduling', 'Headlines', 'Audience', 'Editing'],
    experience: 6,
    rating: 4.5,
    avatar: '/avatars/person-10.svg'
  },
  {
    id: '19',
    name: 'Tibor Anand',
    role: 'Science writer',
    location: 'Seville, ES',
    skills: ['Sound', 'Interviews', 'Scripting', 'Editing', 'Music'],
    experience: 7,
    rating: 4.8,
    avatar: '/avatars/person-36.svg'
  },
  {
    id: '20',
    name: 'Celestine Talley',
    role: 'Culture critic',
    location: 'Busan, KR',
    skills: ['Research', 'Sources', 'Verification', 'Archives', 'Statistics'],
    experience: 4,
    rating: 4.6,
    avatar: '/avatars/person-11.svg'
  },
  {
    id: '21',
    name: 'Rhian Murtagh',
    role: 'Travel writer',
    location: 'Cork, IE',
    skills: ['Long reads', 'Interviews', 'Editing', 'Research', 'Archives'],
    experience: 6,
    rating: 4.7,
    avatar: '/avatars/person-37.svg'
  },
  {
    id: '22',
    name: 'Stellan Lewin',
    role: 'Columnist',
    location: 'Lyon, FR',
    skills: ['Typography', 'Layout', 'Colour', 'Covers', 'Print'],
    experience: 5,
    rating: 4.6,
    avatar: '/avatars/person-13.svg'
  },
  {
    id: '23',
    name: 'Corentin Abara',
    role: 'Translator',
    location: 'Utrecht, NL',
    skills: ['House style', 'Grammar', 'Headlines', 'Fact checking', 'Captions'],
    experience: 8,
    rating: 4.8,
    avatar: '/avatars/person-39.svg'
  },
  {
    id: '24',
    name: 'Fenna Castellan',
    role: 'Layout designer',
    location: 'Mysore, IN',
    skills: ['Photography', 'Picture desks', 'Captions', 'Archives', 'Licensing'],
    experience: 6,
    rating: 4.7,
    avatar: '/avatars/person-15.svg'
  },
  {
    id: '25',
    name: 'Tavish Young',
    role: 'Commissioning editor',
    location: 'Dunedin, NZ',
    skills: ['Essays', 'Reporting', 'Interviews', 'Profiles', 'Research'],
    experience: 4,
    rating: 4.5,
    avatar: '/avatars/person-40.svg'
  }
];
