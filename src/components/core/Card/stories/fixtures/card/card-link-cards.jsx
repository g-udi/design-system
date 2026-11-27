import { IconTile } from '@gaudi/design-system/core/Icon';
import Link from '@gaudi/design-system/core/Link';
import {
  CardRoot as Card,
  CardHeader, CardDescription, CardTitle, CardContent
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const linkClass = 'inline-flex items-center gap-1 text-xs font-medium text-ui-primary hover:underline';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2'>
      <Card>
        <CardContent className='flex flex-col gap-3'>
          <IconTile aria-hidden='true' size='sm' variant='solid'>
            <RegistryIcon lucide='ShoppingBagIcon' aria-hidden='true' />
          </IconTile>
          <Link href='/orders' className='text-sm leading-tight font-medium text-text hover:text-ui-primary'>
            Recent orders overview
          </Link>
          <CardDescription as='p' className='text-xs leading-relaxed'>
            Track recent purchases, updates, and status changes in one place.
          </CardDescription>
          <Link href='/orders' className={linkClass}>
            View orders
            <RegistryIcon lucide='ChevronRightIcon' aria-hidden='true' className='size-3 shrink-0' />
          </Link>
        </CardContent>
      </Card>
      <Card className='gap-0 p-0'>
        <CardHeader className='flex items-center gap-2 border-b px-4 py-3 text-text-muted [&_svg]:size-4'>
            <RegistryIcon lucide='BookOpenIcon' aria-hidden='true' />
            <CardTitle className='text-sm font-medium text-text'>Documentation</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 p-4'>
            <CardDescription as='p' className='text-sm leading-relaxed'>
              Guides, API references, and examples to integrate with the platform.
            </CardDescription>
            <Link href='/docs' className={linkClass}>
              <RegistryIcon lucide='LinkIcon' aria-hidden='true' className='size-3 shrink-0' />
              View docs
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
