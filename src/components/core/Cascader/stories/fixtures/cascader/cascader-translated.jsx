'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '@gaudi/design-system/core/Cascader';
import { CascaderItems } from '@gaudi/design-system/core/Cascader';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { default as Button } from '@gaudi/design-system/core/Button';
function flagIcon(flag) {
  return (
    <span aria-hidden='true' className='w-5 text-center text-base leading-none'>
      {flag}
    </span>
  );
}
const laender = [
  {
    value: 'europa',
    label: 'Europa',
    icon: flagIcon('\u{1F30D}'),
    children: [
      {
        value: 'europa.de',
        label: 'Deutschland',
        icon: flagIcon('\u{1F1E9}\u{1F1EA}')
      },
      {
        value: 'europa.fr',
        label: 'Frankreich',
        icon: flagIcon('\u{1F1EB}\u{1F1F7}')
      },
      {
        value: 'europa.it',
        label: 'Italien',
        icon: flagIcon('\u{1F1EE}\u{1F1F9}')
      },
      {
        value: 'europa.nl',
        label: 'Niederlande',
        icon: flagIcon('\u{1F1F3}\u{1F1F1}')
      },
      {
        value: 'europa.at',
        label: '\xD6sterreich',
        icon: flagIcon('\u{1F1E6}\u{1F1F9}')
      },
      {
        value: 'europa.pl',
        label: 'Polen',
        icon: flagIcon('\u{1F1F5}\u{1F1F1}')
      },
      {
        value: 'europa.pt',
        label: 'Portugal',
        icon: flagIcon('\u{1F1F5}\u{1F1F9}')
      },
      {
        value: 'europa.se',
        label: 'Schweden',
        icon: flagIcon('\u{1F1F8}\u{1F1EA}')
      },
      {
        value: 'europa.ch',
        label: 'Schweiz',
        icon: flagIcon('\u{1F1E8}\u{1F1ED}')
      },
      {
        value: 'europa.es',
        label: 'Spanien',
        icon: flagIcon('\u{1F1EA}\u{1F1F8}')
      }
    ]
  },
  {
    value: 'asien',
    label: 'Asien',
    icon: flagIcon('\u{1F30F}'),
    children: [
      {
        value: 'asien.cn',
        label: 'China',
        icon: flagIcon('\u{1F1E8}\u{1F1F3}')
      },
      {
        value: 'asien.in',
        label: 'Indien',
        icon: flagIcon('\u{1F1EE}\u{1F1F3}')
      },
      {
        value: 'asien.id',
        label: 'Indonesien',
        icon: flagIcon('\u{1F1EE}\u{1F1E9}')
      },
      {
        value: 'asien.jp',
        label: 'Japan',
        icon: flagIcon('\u{1F1EF}\u{1F1F5}')
      },
      {
        value: 'asien.kr',
        label: 'S\xFCdkorea',
        icon: flagIcon('\u{1F1F0}\u{1F1F7}')
      },
      {
        value: 'asien.th',
        label: 'Thailand',
        icon: flagIcon('\u{1F1F9}\u{1F1ED}')
      },
      {
        value: 'asien.vn',
        label: 'Vietnam',
        icon: flagIcon('\u{1F1FB}\u{1F1F3}')
      }
    ]
  },
  {
    value: 'afrika',
    label: 'Afrika',
    icon: flagIcon('\u{1F30D}'),
    children: [
      {
        value: 'afrika.eg',
        label: '\xC4gypten',
        icon: flagIcon('\u{1F1EA}\u{1F1EC}')
      },
      {
        value: 'afrika.gh',
        label: 'Ghana',
        icon: flagIcon('\u{1F1EC}\u{1F1ED}')
      },
      {
        value: 'afrika.ke',
        label: 'Kenia',
        icon: flagIcon('\u{1F1F0}\u{1F1EA}')
      },
      {
        value: 'afrika.ma',
        label: 'Marokko',
        icon: flagIcon('\u{1F1F2}\u{1F1E6}')
      },
      {
        value: 'afrika.ng',
        label: 'Nigeria',
        icon: flagIcon('\u{1F1F3}\u{1F1EC}')
      },
      {
        value: 'afrika.za',
        label: 'S\xFCdafrika',
        icon: flagIcon('\u{1F1FF}\u{1F1E6}')
      }
    ]
  },
  {
    value: 'nordamerika',
    label: 'Nordamerika',
    icon: flagIcon('\u{1F30E}'),
    children: [
      {
        value: 'nordamerika.ca',
        label: 'Kanada',
        icon: flagIcon('\u{1F1E8}\u{1F1E6}')
      },
      {
        value: 'nordamerika.mx',
        label: 'Mexiko',
        icon: flagIcon('\u{1F1F2}\u{1F1FD}')
      },
      {
        value: 'nordamerika.us',
        label: 'Vereinigte Staaten',
        icon: flagIcon('\u{1F1FA}\u{1F1F8}')
      }
    ]
  },
  {
    value: 'mittelamerika',
    label: 'Mittelamerika',
    icon: flagIcon('\u{1F30E}'),
    children: [
      {
        value: 'mittelamerika.bz',
        label: 'Belize',
        icon: flagIcon('\u{1F1E7}\u{1F1FF}')
      },
      {
        value: 'mittelamerika.cr',
        label: 'Costa Rica',
        icon: flagIcon('\u{1F1E8}\u{1F1F7}')
      },
      {
        value: 'mittelamerika.gt',
        label: 'Guatemala',
        icon: flagIcon('\u{1F1EC}\u{1F1F9}')
      },
      {
        value: 'mittelamerika.pa',
        label: 'Panama',
        icon: flagIcon('\u{1F1F5}\u{1F1E6}')
      }
    ]
  },
  {
    value: 'suedamerika',
    label: 'S\xFCdamerika',
    icon: flagIcon('\u{1F30E}'),
    children: [
      {
        value: 'suedamerika.ar',
        label: 'Argentinien',
        icon: flagIcon('\u{1F1E6}\u{1F1F7}')
      },
      {
        value: 'suedamerika.br',
        label: 'Brasilien',
        icon: flagIcon('\u{1F1E7}\u{1F1F7}')
      },
      {
        value: 'suedamerika.cl',
        label: 'Chile',
        icon: flagIcon('\u{1F1E8}\u{1F1F1}')
      },
      {
        value: 'suedamerika.co',
        label: 'Kolumbien',
        icon: flagIcon('\u{1F1E8}\u{1F1F4}')
      },
      {
        value: 'suedamerika.pe',
        label: 'Peru',
        icon: flagIcon('\u{1F1F5}\u{1F1EA}')
      },
      {
        value: 'suedamerika.uy',
        label: 'Uruguay',
        icon: flagIcon('\u{1F1FA}\u{1F1FE}')
      }
    ]
  },
  {
    value: 'ozeanien',
    label: 'Ozeanien',
    icon: flagIcon('\u{1F30F}'),
    children: [
      {
        value: 'ozeanien.au',
        label: 'Australien',
        icon: flagIcon('\u{1F1E6}\u{1F1FA}')
      },
      {
        value: 'ozeanien.fj',
        label: 'Fidschi',
        icon: flagIcon('\u{1F1EB}\u{1F1EF}')
      },
      {
        value: 'ozeanien.nz',
        label: 'Neuseeland',
        icon: flagIcon('\u{1F1F3}\u{1F1FF}')
      },
      {
        value: 'ozeanien.pg',
        label: 'Papua-Neuguinea',
        icon: flagIcon('\u{1F1F5}\u{1F1EC}')
      }
    ]
  }
];
const labels = {
  search: (parentLabel) =>
    parentLabel ? `${parentLabel} durchsuchen...` : 'Land suchen...',
  back: 'Zur\xFCck',
  empty: 'Keine Ergebnisse gefunden.',
  loading: 'Wird geladen...',
  selectedCount: (count) => `${count} ausgew\xE4hlt`,
  breadcrumbLabel: 'Navigationspfad',
  panelLabel: 'L\xE4nderauswahl',
  rootLevel: 'Alle Regionen',
  itemCount: (count) => `${count} ${count === 1 ? 'Land' : 'L\xE4nder'}`,
  branchAffordance: 'Untermen\xFC',
  keyboardHint: (mode) =>
    mode === 'tree'
      ? 'Mit der Pfeiltaste nach rechts aufklappen, mit der Pfeiltaste nach links zuklappen.'
      : mode === 'columns'
        ? 'Mit der Pfeiltaste nach rechts die n\xE4chste Spalte \xF6ffnen, mit der Pfeiltaste nach links zur\xFCck.'
        : 'Mit der Pfeiltaste nach rechts eine Ebene \xF6ffnen, mit der Pfeiltaste nach links zur\xFCck.',
  rootAnnouncement: (count) =>
    `Alle Regionen, ${count} ${count === 1 ? 'Region' : 'Regionen'}`,
  levelAnnouncement: (parentLabel, depth, count) =>
    `${parentLabel}, Ebene ${depth}, ${count} ${count === 1 ? 'Land' : 'L\xE4nder'}`,
  resultsAnnouncement: (count) =>
    count === 1 ? '1 Ergebnis' : `${count} Ergebnisse`
};
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        items={laender}
        value={value}
        onValueChange={setValue}
        labels={labels}
      >
        <CascaderTrigger
          aria-label='Land'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Land wählen' />
        </CascaderTrigger>

        <CascaderContent className='w-72'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  );
}
