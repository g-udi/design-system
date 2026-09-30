import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Icon rows whose trailing slot carries a status, an action, or both.
const integrations = [
  { icon: 'DatabaseIcon', title: 'Database', description: 'Sync records from your data warehouse', status: ['Connected', 'success-light'], action: ['Configure', 'outline'] },
  { icon: 'WebhookIcon', title: 'Webhooks', description: 'Push realtime events to your endpoints', status: ['Connected', 'success-light'] },
  { icon: 'MailIcon', title: 'Email notifications', description: 'Receive a digest every morning', status: ['Paused', 'warning-light'], action: ['Resume', 'outline'] },
  { icon: 'BellIcon', title: 'Push notifications', description: 'Get notified on your devices', action: ['Enable', 'default'] },
  { icon: 'CodeIcon', title: 'API access', description: 'Build custom integrations with the REST API', action: ['Connect', 'outline'] }
];

export function Pattern() {
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
              {status ? <Badge variant={status[1]} size='sm'>{status[0]}</Badge> : null}
              {action ? <Button variant={action[1]} size='sm'>{action[0]}</Button> : null}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
