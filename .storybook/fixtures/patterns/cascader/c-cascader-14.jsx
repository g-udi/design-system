'use client';
import { useMemo, useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderActions,
  useCascaderState
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import {
  CascaderGroup,
  CascaderItem,
  CascaderLabel,
  CascaderSeparator
} from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const spaceIcon = <RegistryIcon lucide='BookIcon' className='size-4' />;
const folderIcon = <RegistryIcon lucide='FolderIcon' className='size-4' />;
const spaces = [
  {
    value: 'engineering',
    label: 'Engineering',
    icon: spaceIcon,
    children: [
      { value: 'engineering.rfcs', label: 'RFCs', icon: folderIcon },
      {
        value: 'engineering.runbooks',
        label: 'Runbooks',
        icon: folderIcon,
        keywords: ['oncall']
      },
      {
        value: 'engineering.postmortems',
        label: 'Postmortems',
        icon: folderIcon
      },
      {
        value: 'engineering.architecture',
        label: 'Architecture',
        icon: folderIcon
      }
    ]
  },
  {
    value: 'design',
    label: 'Design',
    icon: spaceIcon,
    children: [
      { value: 'design.system', label: 'Design system', icon: folderIcon },
      { value: 'design.research', label: 'Research', icon: folderIcon },
      { value: 'design.brand', label: 'Brand', icon: folderIcon }
    ]
  },
  {
    value: 'product',
    label: 'Product',
    icon: spaceIcon,
    children: [
      { value: 'product.roadmap', label: 'Roadmap', icon: folderIcon },
      { value: 'product.specs', label: 'Specs', icon: folderIcon },
      { value: 'product.launches', label: 'Launch plans', icon: folderIcon }
    ]
  },
  {
    value: 'marketing',
    label: 'Marketing',
    icon: spaceIcon,
    children: [
      { value: 'marketing.campaigns', label: 'Campaigns', icon: folderIcon },
      {
        value: 'marketing.calendar',
        label: 'Content calendar',
        icon: folderIcon
      },
      { value: 'marketing.seo', label: 'Search', icon: folderIcon }
    ]
  },
  {
    value: 'sales',
    label: 'Sales',
    icon: spaceIcon,
    children: [
      { value: 'sales.playbooks', label: 'Playbooks', icon: folderIcon },
      { value: 'sales.pricing', label: 'Pricing', icon: folderIcon },
      { value: 'sales.stories', label: 'Customer stories', icon: folderIcon }
    ]
  },
  {
    value: 'support',
    label: 'Support',
    icon: spaceIcon,
    children: [
      { value: 'support.macros', label: 'Macros', icon: folderIcon },
      { value: 'support.escalations', label: 'Escalations', icon: folderIcon },
      {
        value: 'support.known-issues',
        label: 'Known issues',
        icon: folderIcon
      }
    ]
  },
  {
    value: 'people',
    label: 'People',
    icon: spaceIcon,
    children: [
      {
        value: 'people.handbook',
        label: 'Handbook',
        icon: folderIcon,
        keywords: ['policy']
      },
      { value: 'people.onboarding', label: 'Onboarding', icon: folderIcon },
      { value: 'people.reviews', label: 'Reviews', icon: folderIcon }
    ]
  },
  {
    value: 'finance',
    label: 'Finance',
    icon: spaceIcon,
    children: [
      { value: 'finance.budgets', label: 'Budgets', icon: folderIcon },
      { value: 'finance.forecasts', label: 'Forecasts', icon: folderIcon },
      { value: 'finance.invoices', label: 'Invoices', icon: folderIcon }
    ]
  },
  {
    value: 'legal',
    label: 'Legal',
    icon: spaceIcon,
    children: [
      { value: 'legal.contracts', label: 'Contracts', icon: folderIcon },
      { value: 'legal.compliance', label: 'Compliance', icon: folderIcon },
      { value: 'legal.trademarks', label: 'Trademarks', icon: folderIcon }
    ]
  },
  {
    value: 'personal',
    label: 'Personal',
    icon: spaceIcon,
    children: [
      { value: 'personal.drafts', label: 'Drafts', icon: folderIcon },
      { value: 'personal.scratch', label: 'Scratchpad', icon: folderIcon }
    ]
  }
];
const RECENT_LIMIT = 3;
const spaceByValue = new Map(spaces.map((space) => [space.value, space]));
const folderIndex = new Map(
  spaces.flatMap((space) =>
    (space.children ?? []).map((folder) => [
      folder.value,
      { space: space.value, name: `${space.label} / ${folder.label}` }
    ])
  )
);
function DestinationItems({ recentCount }) {
  const { isBranch, isSelectable, isSelected, isIndeterminate } =
    useCascaderActions();
  const { renderedItems, currentParent, query, deepResults } =
    useCascaderState();
  const row = (node, index) => (
    <CascaderItem
      key={node.value}
      node={node}
      showPath={deepResults !== null}
      branch={isBranch(node)}
      selectable={isSelectable(node)}
      selected={isSelected(node)}
      indeterminate={isIndeterminate(node)}
      aria-setsize={renderedItems.length}
      aria-posinset={index + 1}
    />
  );
  if (currentParent !== null || query !== '') {
    return <>{renderedItems.map(row)}</>;
  }
  return (
    <>
      {/* `CascaderGroup`, not a `<div>` with a heading in it. A listbox drops a
       bare heading from the accessibility tree entirely - it looks right and
       reads as if it were not there - whereas the group is what carries the
       name, so the run is announced as "Recently used, group". */}
      <CascaderGroup>
        <CascaderLabel>Recently used</CascaderLabel>
        {renderedItems.slice(0, recentCount).map(row)}
      </CascaderGroup>

      {/* Decorative, and deliberately so: the two runs are already separated
       for a screen reader by the groups around them. */}
      <CascaderSeparator />

      <CascaderGroup>
        <CascaderLabel>All spaces</CascaderLabel>
        {renderedItems
          .slice(recentCount)
          .map((node, index) => row(node, index + recentCount))}
      </CascaderGroup>
    </>
  );
}
export function Pattern() {
  const [value, setValue] = useState('');
  const [recent, setRecent] = useState(['product', 'engineering', 'design']);
  const [log, setLog] = useState('');
  const items = useMemo(() => {
    const pinned = recent
      .map((entry) => spaceByValue.get(entry))
      .filter((space) => space != null);
    const rest = spaces.filter((space) => !recent.includes(space.value));
    return [...pinned, ...rest];
  }, [recent]);
  const handleValueChange = (next) => {
    setValue(next);
    const destination = folderIndex.get(next);
    if (!destination) return;
    setRecent((previous) =>
      [
        destination.space,
        ...previous.filter((entry) => entry !== destination.space)
      ].slice(0, RECENT_LIMIT)
    );
    setLog(`Moved to ${destination.name}`);
  };
  return (
    <div className='flex w-full flex-col items-center gap-3 p-4'>
      <Cascader
        items={items}
        value={value}
        onValueChange={handleValueChange}
        revealSelected={false}
        searchScope='deep'
      >
        <CascaderTrigger
          aria-label='Destination'
          render={
            <Button
              variant='outline'
              className='w-72 justify-between gap-2 font-normal'
            />
          }
        >
          <CascaderValue placeholder='Move page to' maxSegments={2} />
        </CascaderTrigger>

        <CascaderContent className='w-72'>
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput placeholder='Search spaces and folders...' />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <DestinationItems recentCount={recent.length} />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>

      <p className='text-ui-muted-foreground min-h-4 text-xs' role='status'>
        {log}
      </p>
    </div>
  );
}
