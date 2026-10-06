'use client';
import {
  Tree,
  TreeItem,
  TreeItemLabel
} from '@gaudi/design-system/core/Tree';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useState } from 'react';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
const items = {
  crm: {
    name: 'CRM',
    children: ['leads', 'accounts', 'activities', 'support']
  },
  leads: {
    name: 'Pitches',
    children: ['new-lead', 'contacted-lead', 'qualified-lead']
  },
  'new-lead': { name: 'New pitch' },
  'contacted-lead': { name: 'Pitch answered' },
  'qualified-lead': { name: 'Pitch accepted' },
  accounts: {
    name: 'Accounts',
    children: ['acme-corp', 'globex-inc']
  },
  'acme-corp': {
    name: 'Gaudi Press',
    children: ['acme-contacts', 'acme-opportunities']
  },
  'acme-contacts': {
    name: 'Contacts',
    children: ['john-smith', 'jane-doe']
  },
  'john-smith': { name: 'Hollis Marten' },
  'jane-doe': { name: 'Wren Talbot' },
  'acme-opportunities': {
    name: 'Opportunities',
    children: ['website-redesign', 'annual-maintenance']
  },
  'website-redesign': { name: 'Spring cover series' },
  'annual-maintenance': { name: 'Archive upkeep' },
  'globex-inc': {
    name: 'Lantern Books',
    children: ['globex-contacts', 'globex-opportunities']
  },
  'globex-contacts': {
    name: 'Contacts',
    children: ['alice-johnson']
  },
  'alice-johnson': { name: 'Elodie Varga' },
  'globex-opportunities': {
    name: 'Opportunities',
    children: ['cloud-migration']
  },
  'cloud-migration': { name: 'Print edition' },
  activities: {
    name: 'Activities',
    children: ['calls', 'meetings', 'emails']
  },
  calls: { name: 'Calls' },
  meetings: { name: 'Meetings' },
  emails: { name: 'Emails' },
  support: {
    name: 'Support',
    children: ['open-tickets', 'closed-tickets']
  },
  'open-tickets': { name: 'Open requests' },
  'closed-tickets': { name: 'Closed requests' }
};
const indent = 20;
// Display options on one tree: indent guides, folder icons, and plus and minus toggles.
const guides =
  'relative before:absolute before:inset-0 before:-ms-1.25 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]';
const optionLabels = { guides: 'Indent guides', icons: 'Folder icons', plusMinus: 'Plus and minus' };

function ItemIcon({ item }) {
  const icon = item.isFolder() ? (item.isExpanded() ? 'FolderOpenIcon' : 'FolderIcon') : 'FileIcon';
  return <RegistryIcon lucide={icon} aria-hidden='true' className='pointer-events-none size-4 text-ui-muted-foreground' />;
}

export function Pattern() {
  const [options, setOptions] = useState({ guides: true, icons: true, plusMinus: false });
  const tree = useTree({
    initialState: {
      expandedItems: ['leads', 'accounts', 'activities']
    },
    indent,
    rootItemId: 'crm',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? []
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature]
  });
  return (
    <div className='mx-auto grid w-full max-w-sm gap-3'>
      <div className='flex flex-wrap gap-x-3 gap-y-2'>
        {Object.entries(optionLabels).map(([key, label]) => (
          <Label key={key} className='flex items-center gap-2 text-xs font-normal'>
            <Switch
              size='sm'
              checked={options[key]}
              onCheckedChange={(checked) => setOptions((current) => ({ ...current, [key]: checked }))}
            />
            {label}
          </Label>
        ))}
      </div>
      <Tree
        className={options.guides ? guides : undefined}
        indent={indent}
        tree={tree}
        toggleIconType={options.plusMinus ? 'plus-minus' : 'chevron'}
      >
        {tree.getItems().map((item) => (
          <TreeItem key={item.getId()} item={item}>
            <TreeItemLabel className='before:bg-ui-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10'>
              <span className='ms-1 flex items-center gap-2'>
                {options.icons && <ItemIcon item={item} />}
                {item.getItemName()}
              </span>
            </TreeItemLabel>
          </TreeItem>
        ))}
      </Tree>
    </div>
  );
}
