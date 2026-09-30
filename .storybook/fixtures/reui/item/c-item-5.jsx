// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        <Item variant='outline' size='xs'>
          <ItemMedia>
            <Avatar>
              <AvatarImage
                src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80'
                alt='Sarah Chen'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Sarah Chen</ItemTitle>
            <ItemDescription>Team Lead</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant='success' size='sm'>
              Online
            </Badge>
          </ItemActions>
        </Item>
        <Item variant='outline' size='xs'>
          <ItemMedia>
            <Avatar>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt='Alex Johnson'
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Alex Johnson</ItemTitle>
            <ItemDescription>Developer</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant='warning' size='sm'>
              Away
            </Badge>
          </ItemActions>
        </Item>
        <Item variant='outline' size='xs'>
          <ItemMedia>
            <Avatar>
              <AvatarImage
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80'
                alt='David Kim'
              />
              <AvatarFallback>DK</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>David Kim</ItemTitle>
            <ItemDescription>Designer</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant='outline' size='sm'>
              Offline
            </Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  );
}
