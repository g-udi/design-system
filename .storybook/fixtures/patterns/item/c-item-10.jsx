import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-3'>
      <Item variant='outline'>
        <ItemHeader>
          <div className='flex items-center gap-2'>
            <RegistryIcon
              lucide='FolderIcon'
              className='text-ui-muted-foreground size-3.5'
              aria-hidden='true'
            />
            <span className='text-ui-muted-foreground text-xs'>Project</span>
          </div>
          <Badge variant='info-light' size='xs'>
            In Progress
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Website Redesign</ItemTitle>
          <ItemDescription>
            Complete overhaul of the marketing site with a focus on conversion
            optimization and modern design patterns.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant='outline' size='sm'>
            Open
          </Button>
        </ItemActions>
        <ItemFooter>
          <AvatarGroup>
            <Avatar size='sm'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt='SC'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size='sm'>
              <AvatarImage
                src='static/images/art/10.svg'
                alt='AJ'
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Avatar size='sm'>
              <AvatarImage
                src='static/images/art/1.svg'
                alt='EP'
              />
              <AvatarFallback>EP</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <div className='flex items-center gap-2'>
            <Progress value={65} className='w-20' />
            <span className='text-ui-muted-foreground text-xs'>65%</span>
          </div>
        </ItemFooter>
      </Item>
    </div>
  );
}
