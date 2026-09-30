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
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        <Item variant='outline' size='xs'>
          <ItemMedia variant='icon'>
            <RegistryIcon lucide='DatabaseIcon' />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Database</ItemTitle>
            <ItemDescription>
              Sync records from your data warehouse
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant='success-light' size='sm'>
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant='outline' size='xs'>
          <ItemMedia variant='icon'>
            <RegistryIcon lucide='WebhookIcon' />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Webhooks</ItemTitle>
            <ItemDescription>
              Push realtime events to your endpoints
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant='success-light' size='sm'>
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant='outline' size='xs'>
          <ItemMedia variant='icon'>
            <RegistryIcon lucide='CodeIcon' />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>API access</ItemTitle>
            <ItemDescription>
              Build custom integrations with the REST API
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant='outline' size='sm'>
              Connect
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  );
}
