import { IconStack } from '@gaudi/design-system/core/Icon';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@gaudi/design-system/core/EmptyState';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-3'>
      <Empty className='rounded-lg border border-dashed py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <IconStack aria-hidden='true' className='text-ui-primary h-24 w-22'>
              <RegistryIcon lucide='InboxIcon' className='text-ui-primary size-5' />
            </IconStack>
          </EmptyMedia>
          <EmptyTitle>Workspace is ready</EmptyTitle>
          <EmptyDescription>
            Invite teammates or connect a data source to start filling this view.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className='flex-row justify-center gap-2'>
          <Button size='sm' href='/settings/team/invite'>
            <RegistryIcon lucide='UserPlusIcon' data-icon='inline-start' />
            Invite team
          </Button>
          <Button variant='outline' size='sm' href='/settings/integrations'>
            <RegistryIcon lucide='DatabaseIcon' data-icon='inline-start' />
            Connect source
          </Button>
        </EmptyContent>
      </Empty>
      <Item variant='outline'>
        <ItemMedia>
          <IconStack aria-hidden='true' className='text-ui-primary h-12 w-11'>
            <RegistryIcon lucide='PackageIcon' className='text-ui-primary size-3' />
          </IconStack>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Registry package ready</ItemTitle>
          <ItemDescription>Three components were published to the team registry.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
