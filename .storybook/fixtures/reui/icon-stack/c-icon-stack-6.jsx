// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconStack } from '../../../../src/components/core/Icon/parts/icon-stack-extended.jsx';
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
    <div className='mx-auto flex w-full max-w-md items-center justify-center p-4'>
      <Item variant='outline' className='max-w-sm'>
        <ItemMedia>
          <IconStack aria-hidden='true' className='text-ui-primary h-12 w-11'>
            <RegistryIcon
              lucide='PackageIcon'
              className='text-ui-primary size-3'
            />
          </IconStack>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Registry package ready</ItemTitle>
          <ItemDescription>
            Use IconStack as rich media inside compact shadcn items.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
