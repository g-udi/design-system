'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const defaultItems = [
  {
    id: '1',
    label: 'Dashboard',
    icon: (
      <RegistryIcon
        lucide='LayoutDashboardIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    id: '2',
    label: 'Inbox',
    icon: (
      <RegistryIcon
        lucide='InboxIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    count: 5
  },
  {
    id: '3',
    label: 'Projects',
    icon: (
      <RegistryIcon
        lucide='FolderIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    count: 12
  },
  {
    id: '4',
    label: 'Calendar',
    icon: (
      <RegistryIcon
        lucide='CalendarIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    id: '5',
    label: 'Analytics',
    icon: (
      <RegistryIcon
        lucide='BarChart3Icon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    id: '6',
    label: 'Settings',
    icon: (
      <RegistryIcon
        lucide='SettingsIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  }
];
export function Pattern() {
  const [items, setItems] = useState(defaultItems);
  return (
    <div className='mx-auto w-full max-w-xs'>
      <Frame spacing='xs'>
        <FrameHeader>
          <FrameTitle>Navigation</FrameTitle>
        </FrameHeader>
        <FramePanel className='p-2!'>
          <Sortable
            value={items}
            onValueChange={setItems}
            getItemValue={(item) => item.id}
            strategy='vertical'
            className='space-y-0.5'
          >
            {items.map((item) => (
              <SortableItem key={item.id} value={item.id}>
                <div className='hover:bg-ui-accent flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors'>
                  <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground opacity-0 transition-opacity group-hover:opacity-100 [div:hover>&]:opacity-100'>
                    <RegistryIcon
                      lucide='GripVerticalIcon'
                      className='size-3.5'
                    />
                  </SortableItemHandle>
                  {item.icon}
                  <span className='flex-1 text-sm'>{item.label}</span>
                  {item.count && (
                    <Badge variant='outline' size='sm' className='rounded-control'>
                      {item.count}
                    </Badge>
                  )}
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  );
}
