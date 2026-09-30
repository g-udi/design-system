import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-2'>
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
          <ItemDescription>Senior Software Engineer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant='outline' size='sm'>
            Follow
          </Button>
        </ItemActions>
      </Item>
      <Item variant='outline' size='xs'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='static/images/art/7.svg'
              alt='Sarah Chen'
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sarah Chen</ItemTitle>
          <ItemDescription>Product Designer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size='sm'>Following</Button>
        </ItemActions>
      </Item>
    </div>
  );
}
