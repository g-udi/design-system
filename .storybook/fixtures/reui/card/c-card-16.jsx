// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-sm p-0'>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between border-b px-3 py-2'>
          <Badge variant='secondary'>
            <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
            Live
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-ui-muted-foreground'
                aria-label='More options'
              >
                <RegistryIcon lucide='MoreVerticalIcon' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-32' align='end'>
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='space-y-3 p-4'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-sm leading-tight font-medium'>
              Integration name
            </h3>
            <Badge variant='success-light' size='sm'>
              Installed
            </Badge>
          </div>
          <p className='text-ui-muted-foreground text-sm'>
            Short description of the integration and what it does in one line.
          </p>
          <AvatarGroup>
            <Avatar className='size-6'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/women/44.jpg'
                alt='User 1'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar className='size-6'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/11.jpg'
                alt='User 2'
              />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar className='size-6'>
              <AvatarImage
                src='https://randomuser.me/api/portraits/women/68.jpg'
                alt='User 3'
              />
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <AvatarGroupCount className='size-6 border text-[10px]'>
              +3
            </AvatarGroupCount>
          </AvatarGroup>
        </div>
        <div className='border-t p-3'>
          <Button variant='outline' className='w-full'>
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
