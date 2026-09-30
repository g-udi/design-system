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
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const globeIcon = (
  <IconTile variant='outline' size='sm'>
    <RegistryIcon lucide='GlobeIcon' className='size-4' />
  </IconTile>
);
const pinIcon = (
  <IconTile variant='outline' size='sm'>
    <RegistryIcon lucide='MapPinIcon' className='size-4' />
  </IconTile>
);
const locations = [
  {
    value: 'us',
    label: 'United States',
    icon: globeIcon,
    description: '12 data centers',
    children: [
      {
        value: 'us.ca',
        label: 'California',
        icon: pinIcon,
        description: '3 regions',
        children: [
          {
            value: 'us.ca.sfo',
            label: 'San Francisco',
            icon: pinIcon,
            description: 'us-west-1'
          },
          {
            value: 'us.ca.lax',
            label: 'Los Angeles',
            icon: pinIcon,
            description: 'us-west-2'
          }
        ]
      },
      {
        value: 'us.va',
        label: 'Virginia',
        icon: pinIcon,
        description: '2 regions',
        children: [
          {
            value: 'us.va.iad',
            label: 'Ashburn',
            icon: pinIcon,
            description: 'us-east-1'
          }
        ]
      },
      {
        value: 'us.or',
        label: 'Oregon',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'us.or.pdx',
            label: 'Portland',
            icon: pinIcon,
            description: 'us-west-3'
          }
        ]
      }
    ]
  },
  {
    value: 'eu',
    label: 'European Union',
    icon: globeIcon,
    description: '8 data centers',
    children: [
      {
        value: 'eu.de',
        label: 'Germany',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'eu.de.fra',
            label: 'Frankfurt',
            icon: pinIcon,
            description: 'eu-central-1'
          }
        ]
      },
      {
        value: 'eu.ie',
        label: 'Ireland',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'eu.ie.dub',
            label: 'Dublin',
            icon: pinIcon,
            description: 'eu-west-1'
          }
        ]
      }
    ]
  },
  {
    value: 'uk',
    label: 'United Kingdom',
    icon: globeIcon,
    description: '3 data centers',
    children: [
      {
        value: 'uk.eng',
        label: 'England',
        icon: pinIcon,
        description: '2 regions',
        children: [
          {
            value: 'uk.eng.lhr',
            label: 'London',
            icon: pinIcon,
            description: 'eu-west-2'
          },
          {
            value: 'uk.eng.man',
            label: 'Manchester',
            icon: pinIcon,
            description: 'eu-west-4'
          }
        ]
      }
    ]
  },
  {
    value: 'ca',
    label: 'Canada',
    icon: globeIcon,
    description: '2 data centers',
    children: [
      {
        value: 'ca.on',
        label: 'Ontario',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'ca.on.yyz',
            label: 'Toronto',
            icon: pinIcon,
            description: 'ca-central-1'
          }
        ]
      }
    ]
  },
  {
    value: 'au',
    label: 'Australia',
    icon: globeIcon,
    description: '2 data centers',
    children: [
      {
        value: 'au.nsw',
        label: 'New South Wales',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'au.nsw.syd',
            label: 'Sydney',
            icon: pinIcon,
            description: 'ap-southeast-2'
          }
        ]
      }
    ]
  },
  {
    value: 'jp',
    label: 'Japan',
    icon: globeIcon,
    description: '4 data centers',
    children: [
      {
        value: 'jp.kanto',
        label: 'Kanto',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'jp.kanto.nrt',
            label: 'Tokyo',
            icon: pinIcon,
            description: 'ap-northeast-1'
          }
        ]
      }
    ]
  },
  {
    value: 'br',
    label: 'Brazil',
    icon: globeIcon,
    description: '1 data center',
    children: [
      {
        value: 'br.sp',
        label: 'S\xE3o Paulo state',
        icon: pinIcon,
        description: '1 region',
        children: [
          {
            value: 'br.sp.gru',
            label: 'S\xE3o Paulo',
            icon: pinIcon,
            description: 'sa-east-1'
          }
        ]
      }
    ]
  },
  {
    value: 'cn',
    label: 'China',
    icon: globeIcon,
    description: 'Requires a separate account',
    disabled: true
  }
];
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        items={locations}
        value={value}
        onValueChange={setValue}
        renderLabel={(node) => (
          <>
            <span className='w-full truncate text-start leading-tight'>
              {node.label}
            </span>
            {node.description ? (
              <span className='text-ui-muted-foreground w-full truncate text-start text-xs leading-tight'>
                {node.description}
              </span>
            ) : null}
          </>
        )}
      >
        <CascaderTrigger
          aria-label='Region'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Select a region' />
        </CascaderTrigger>

        <CascaderContent className='w-80'>
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
