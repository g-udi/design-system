import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex w-full max-w-sm items-center justify-center'>
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
      </Item>
    </div>
  );
}
