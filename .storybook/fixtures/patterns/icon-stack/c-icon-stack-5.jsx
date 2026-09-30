import { IconStack } from '../../../../src/components/core/Icon/parts/icon-stack-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='max-w-md py-10'>
        <EmptyHeader>
          <EmptyMedia>
            <IconStack aria-hidden='true' className='text-ui-primary h-24 w-22'>
              <RegistryIcon
                lucide='InboxIcon'
                className='text-ui-primary size-5'
              />
            </IconStack>
          </EmptyMedia>
          <EmptyTitle>Workspace is ready</EmptyTitle>
          <EmptyDescription>
            Invite teammates or connect a data source to start filling this
            view.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className='flex-row justify-center gap-2'>
          <Button size='sm'>
            <RegistryIcon lucide='UserPlusIcon' data-icon='inline-start' />
            Invite team
          </Button>
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='DatabaseIcon' data-icon='inline-start' />
            Connect source
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
