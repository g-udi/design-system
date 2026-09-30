'use client';
import { useState } from 'react';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const defaultChannels = [
  {
    id: '1',
    name: 'Email',
    description: 'Send notifications via email',
    enabled: true
  },
  {
    id: '2',
    name: 'Push Notifications',
    description: 'Browser and mobile push',
    enabled: true
  },
  { id: '3', name: 'SMS', description: 'Text message alerts', enabled: false },
  {
    id: '4',
    name: 'Slack',
    description: 'Post to Slack channels',
    enabled: true
  },
  {
    id: '5',
    name: 'Webhook',
    description: 'Send to custom endpoint',
    enabled: false
  }
];
export function Pattern() {
  const [channels, setChannels] = useState(defaultChannels);
  const toggleChannel = (id) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
    );
  };
  return (
    <div className='mx-auto w-full max-w-md'>
      <Frame spacing='sm'>
        <FrameHeader>
          <FrameTitle>Notification Priority</FrameTitle>
          <FrameDescription>
            Drag to reorder by priority. Top channels are tried first.
          </FrameDescription>
        </FrameHeader>
        <Sortable
          value={channels}
          onValueChange={setChannels}
          getItemValue={(item) => item.id}
          strategy='vertical'
          className='space-y-1'
        >
          {channels.map((channel) => (
            <SortableItem key={channel.id} value={channel.id}>
              <FramePanel className='p-0!'>
                <div className='flex items-center gap-3 px-3 py-2'>
                  <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                    <RegistryIcon
                      lucide='GripVerticalIcon'
                      className='size-4'
                    />
                  </SortableItemHandle>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium'>{channel.name}</p>
                    <p className='text-ui-muted-foreground text-xs'>
                      {channel.description}
                    </p>
                  </div>
                  <Switch
                    aria-label={channel.name}
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                </div>
              </FramePanel>
            </SortableItem>
          ))}
        </Sortable>
      </Frame>
    </div>
  );
}
