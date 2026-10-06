import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Icon rows whose trailing slot carries a status, an action, or both.
const integrations = [
  { icon: 'DatabaseIcon', title: 'Database', description: 'Sync records from your data warehouse', status: ['Connected', 'success-light'], action: ['Configure', 'outline'] },
  { icon: 'WebhookIcon', title: 'Webhooks', description: 'Push realtime events to your endpoints', status: ['Connected', 'success-light'] },
  { icon: 'MailIcon', title: 'Email notifications', description: 'Receive a digest every morning', status: ['Paused', 'warning-light'], action: ['Resume', 'outline'] },
  { icon: 'BellIcon', title: 'Push notifications', description: 'Get notified on your devices', action: ['Enable', 'default'] },
  { icon: 'CodeIcon', title: 'API access', description: 'Build custom integrations with the REST API', action: ['Connect', 'outline'] }
];

export function Pattern() {
  const [completed, setCompleted] = useState([]);
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        {integrations.map(({ icon, title, description, status, action }) => (
          <Item key={title} variant='outline' size='xs'>
            <ItemMedia variant='icon'>
              <RegistryIcon lucide={icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              {completed.includes(title) ? <Badge variant='success-light' size='sm'>Enabled in demo</Badge> : status ? <Badge variant={status[1]} size='sm'>{status[0]}</Badge> : null}
              {action ? <Button variant={action[1]} size='sm' href={action[0] === 'Configure' ? '/settings/integrations/database' : undefined} disabled={completed.includes(title)} onClick={action[0] === 'Configure' ? undefined : () => setCompleted((values) => [...values, title])}>{action[0]}</Button> : null}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
