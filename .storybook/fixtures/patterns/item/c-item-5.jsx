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
                src='https://randomuser.me/api/portraits/men/32.jpg'
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
                src='static/images/art/10.svg'
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
                src='static/images/art/5.svg'
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
