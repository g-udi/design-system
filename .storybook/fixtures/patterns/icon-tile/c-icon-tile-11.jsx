import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-3'>
      <Frame>
        <FramePanel className='flex flex-col gap-3'>
          <IconTile variant='elevated' size='lg' aria-hidden='true'>
            <RegistryIcon lucide='LayoutDashboardIcon' />
          </IconTile>
          <div className='flex flex-col gap-1'>
            <h3 className='text-sm font-medium'>Unified dashboard</h3>
            <p className='text-text-muted text-xs'>
              Track every project, deployment and metric from a single workspace.
            </p>
          </div>
        </FramePanel>
      </Frame>
      <Item variant='outline'>
        <ItemMedia>
          <IconTile variant='elevated' size='sm' aria-hidden='true'>
            <RegistryIcon lucide='FileTextIcon' />
          </IconTile>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Quarterly report</ItemTitle>
          <ItemDescription>Updated 2 hours ago by Anna</ItemDescription>
        </ItemContent>
        <ItemActions>
          <IconTile
            asChild
            size='sm'
            className='hover:bg-ui-accent focus-visible:ring-ui-ring focus-visible:ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          >
            <a href='#' aria-label='Open settings'>
              <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
            </a>
          </IconTile>
        </ItemActions>
      </Item>
      <Empty className='rounded-lg border border-dashed py-8'>
        <EmptyHeader>
          <EmptyMedia>
            <IconTile variant='frame' size='xl' aria-hidden='true'>
              <RegistryIcon lucide='FolderIcon' />
            </IconTile>
          </EmptyMedia>
          <EmptyTitle>No files yet</EmptyTitle>
          <EmptyDescription>
            Upload a file to get started. Everything you add shows up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
