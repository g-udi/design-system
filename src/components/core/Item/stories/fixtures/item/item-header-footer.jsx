import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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
          <Button href='/projects/website-redesign' variant='outline' size='sm'>
            Open
          </Button>
        </ItemActions>
        <ItemFooter>
          <AvatarGroup>
            <Avatar size='sm'>
              <AvatarImage
                src='/avatars/person-20.svg'
                alt='SC'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size='sm'>
              <AvatarImage
                src='/avatars/person-44.svg'
                alt='AJ'
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Avatar size='sm'>
              <AvatarImage
                src='/avatars/person-07.svg'
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
