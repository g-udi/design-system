import { useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardHeader, CardFooter, CardTitle, CardDescription, CardContent
} from '@gaudi/design-system/core/Card';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [notice, setNotice] = useState('');
  const { copy } = useCopyToClipboard({ onCopy: () => setNotice('Integration link copied.'), onError: () => setNotice('Copy failed. Try again.') });
  return (
    <Card className='w-full max-w-sm gap-0 p-0'>
      <CardHeader className='flex items-center justify-between border-b px-3 py-2'>
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
                <DropdownMenuItem asChild><Link href='/settings/integrations/github' variant='bare'>Edit</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => copy('/integrations/github')}>Copy link</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
      <CardContent className='space-y-3 p-4'>
          <div className='flex items-start justify-between gap-2'>
            <CardTitle as='h3' className='text-sm leading-tight font-medium'>
              Integration name
            </CardTitle>
            <Badge variant='success-light' size='sm'>
              Installed
            </Badge>
          </div>
          <CardDescription as='p'>
            Short description of the integration and what it does in one line.
          </CardDescription>
          <AvatarGroup>
            <Avatar className='size-6'>
              <AvatarImage
                src='/avatars/person-20.svg'
                alt='User 1'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar className='size-6'>
              <AvatarImage
                src='/avatars/person-31.svg'
                alt='User 2'
              />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar className='size-6'>
              <AvatarImage
                src='/avatars/person-24.svg'
                alt='User 3'
              />
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <AvatarGroupCount className='size-6 border text-xs'>
              +3
            </AvatarGroupCount>
          </AvatarGroup>
      </CardContent>
      <CardFooter className='flex-col items-stretch border-t p-3'>
          <Button href='/integrations/github' variant='outline' className='w-full'>
            Open
          </Button>
          <p role='status' className='text-xs text-text-muted'>{notice}</p>
      </CardFooter>
    </Card>
  );
}
