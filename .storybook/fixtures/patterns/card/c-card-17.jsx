import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const item = {
  title: 'Recent Orders Overview',
  description:
    'Track and review all recent purchases, updates, and status changes in one place.',
  link: 'View Orders',
  icon: <RegistryIcon lucide='ShoppingBagIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardContent className='flex flex-col gap-3'>
        <div className='bg-ui-primary rounded-md [&_svg]:text-ui-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5'>
          {item.icon}
        </div>
        <a
          href='#'
          className='text-ui-foreground hover:text-ui-primary block text-sm leading-tight font-medium'
        >
          {item.title}
        </a>
        <p className='text-ui-muted-foreground text-xs leading-relaxed'>
          {item.description}
        </p>
        <a
          href='#'
          className='text-ui-primary inline-flex items-center gap-1 text-xs font-medium hover:underline'
        >
          {item.link}
          <RegistryIcon
            lucide='ChevronRightIcon'
            aria-hidden='true'
            className='size-2.5 shrink-0'
          />
        </a>
      </CardContent>
    </Card>
  );
}
