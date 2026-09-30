import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const linkClass = 'inline-flex items-center gap-1 text-xs font-medium text-ui-primary hover:underline';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2'>
      <Card>
        <CardContent className='flex flex-col gap-3'>
          <div className='flex size-9 items-center justify-center rounded-md bg-ui-primary text-ui-primary-foreground [&_svg]:size-4'>
            <RegistryIcon lucide='ShoppingBagIcon' aria-hidden='true' />
          </div>
          <a href='#' className='text-sm leading-tight font-medium text-text hover:text-ui-primary'>
            Recent orders overview
          </a>
          <p className='text-xs leading-relaxed text-text-muted'>
            Track recent purchases, updates, and status changes in one place.
          </p>
          <a href='#' className={linkClass}>
            View orders
            <RegistryIcon lucide='ChevronRightIcon' aria-hidden='true' className='size-3 shrink-0' />
          </a>
        </CardContent>
      </Card>
      <Card className='p-0'>
        <CardContent className='p-0'>
          <div className='flex items-center gap-2 border-b px-4 py-3 text-text-muted [&_svg]:size-4'>
            <RegistryIcon lucide='BookOpenIcon' aria-hidden='true' />
            <span className='text-sm font-medium text-text'>Documentation</span>
          </div>
          <div className='space-y-3 p-4'>
            <p className='text-sm leading-relaxed text-text-muted'>
              Guides, API references, and examples to integrate with the platform.
            </p>
            <a href='#' className={linkClass}>
              <RegistryIcon lucide='LinkIcon' aria-hidden='true' className='size-3 shrink-0' />
              View docs
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
