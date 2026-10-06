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
  CascaderBack,
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { default as Button } from '@gaudi/design-system/core/Button';
const menu = [
  {
    value: 'food',
    label: 'Food',
    children: [
      {
        value: 'food.mains',
        label: 'Mains',
        children: [
          { value: 'food.mains.pasta', label: 'Pasta' },
          { value: 'food.mains.curry', label: 'Curry' },
          { value: 'food.mains.risotto', label: 'Risotto' }
        ]
      },
      { value: 'food.sides', label: 'Sides' },
      { value: 'food.salads', label: 'Salads' }
    ]
  },
  {
    value: 'drinks',
    label: 'Drinks',
    children: [
      { value: 'drinks.coffee', label: 'Coffee' },
      { value: 'drinks.tea', label: 'Tea' },
      { value: 'drinks.juice', label: 'Juice' }
    ]
  },
  {
    value: 'breakfast',
    label: 'Breakfast',
    children: [
      { value: 'breakfast.pastry', label: 'Pastries' },
      { value: 'breakfast.eggs', label: 'Eggs' }
    ]
  },
  {
    value: 'desserts',
    label: 'Desserts',
    children: [
      { value: 'desserts.cake', label: 'Cake' },
      { value: 'desserts.icecream', label: 'Ice cream' }
    ]
  },
  {
    value: 'snacks',
    label: 'Snacks',
    children: [
      { value: 'snacks.crisps', label: 'Crisps' },
      { value: 'snacks.nuts', label: 'Nuts' }
    ]
  },
  {
    value: 'specials',
    label: 'Specials',
    children: [
      { value: 'specials.soup', label: 'Seasonal soup' },
      { value: 'specials.roast', label: 'Harvest pie' }
    ]
  },
  {
    value: 'kids',
    label: 'Kids menu',
    children: [
      { value: 'kids.pasta', label: 'Pasta' },
      { value: 'kids.fruit', label: 'Fruit plate' }
    ]
  },
  { value: 'water', label: 'Still water' }
];
const LABELS = new Map();
function indexLabels(nodes) {
  for (const node of nodes) {
    LABELS.set(node.value, node.label);
    if (node.children) indexLabels(node.children);
  }
}
indexLabels(menu);
export function Pattern() {
  const [value, setValue] = useState('');
  const [path, setPath] = useState([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [lastChange, setLastChange] = useState('(none yet)');
  const goTo = (next) => {
    setPath(next);
    setQuery('');
    setOpen(true);
  };
  const here = path.length
    ? path.map((entry) => LABELS.get(entry) ?? entry).join(' / ')
    : 'root';
  return (
    <div className='flex w-full flex-col items-center gap-3 p-4'>
      <Cascader
        items={menu}
        value={value}
        onValueChange={(next, details) => {
          setValue(next);
          setLastChange(
            `${details.reason}: ${details.path.map((node) => node.label).join(' / ')}`
          );
        }}
        path={path}
        onPathChange={setPath}
        inputValue={query}
        onInputValueChange={setQuery}
        open={open}
        onOpenChange={setOpen}
        revealSelected={false}
      >
        <CascaderTrigger
          aria-label='Menu item'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Choose a dish' />
        </CascaderTrigger>

        <CascaderContent className='w-72'>
          <CascaderPanel>
            <CascaderNav>
              <div className='flex items-center gap-1'>
                <CascaderBack onClick={() => setLastChange('back to parent')} />
                <CascaderInput showBack={false} />
              </div>
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

      <div className='flex flex-wrap items-center justify-center gap-2'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => goTo(['food', 'food.mains'])}
        >
          Jump to Mains
        </Button>
        <Button size='sm' variant='outline' onClick={() => goTo([])}>
          Reset to root
        </Button>
        <Button
          size='sm'
          variant='outline'
          disabled={!value}
          onClick={() => {
            setValue('');
            setLastChange('cleared from outside');
          }}
        >
          Clear selection
        </Button>
      </div>

      <dl className='text-ui-muted-foreground grid w-72 grid-cols-[3.5rem_1fr] gap-x-3 gap-y-1 font-mono text-xs'>
        <dt>path</dt>
        <dd className='text-ui-foreground truncate'>{here}</dd>
        <dt>query</dt>
        <dd className='text-ui-foreground truncate'>{query || '(empty)'}</dd>
        <dt>open</dt>
        <dd className='text-ui-foreground'>{open ? 'true' : 'false'}</dd>
        <dt>change</dt>
        <dd className='text-ui-foreground truncate'>{lastChange}</dd>
      </dl>
    </div>
  );
}
