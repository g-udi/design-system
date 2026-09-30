// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs gap-2 pt-5'>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>Need a help in Claim?</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label='More actions' variant='ghost' size='icon'>
              <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                <span>Manage members</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                <span>Team preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
              <span>Open dashboard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='mb-2'>
        <p>
          Go to this step by step guideline process on how to certify for your
          weekly benefits:
        </p>
      </CardContent>
      <CardFooter>
        <Button size='sm'>
          <Avatar className='size-5'>
            <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <span className='text-xs'>@alexjohnson</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
