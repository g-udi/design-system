import Icon from '../Icon';
import Link from '../Link';
import { cn } from '../../../utilities/cn';

export const Breadcrumb = ({ children, className, label = 'Breadcrumb' }) => (
  <nav aria-label={ label } className={ cn('flex', className) }>{children}</nav>
);

export const BreadcrumbList = ({ children, className }) => (
  <ol className={ cn('flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400', className) }>{children}</ol>
);

export const BreadcrumbItem = ({ children, className }) => <li className={ cn('inline-flex items-center gap-1.5', className) }>{children}</li>;

export const BreadcrumbLink = ({ children, className, href }) => (
  <Link href={ href } variant='muted' className={ cn('hover:text-gray-950 dark:hover:text-white', className) }>{children}</Link>
);

export const BreadcrumbPage = ({ children, className }) => (
  <span aria-current='page' className={ cn('font-medium text-gray-950 dark:text-white', className) }>{children}</span>
);

export const BreadcrumbSeparator = ({ children, className }) => (
  <span aria-hidden='true' className={ cn('inline-flex items-center text-gray-500 dark:text-gray-300', className) }>{children || <Icon name='ChevronRight' decorative size='xs' />}</span>
);

export const BreadcrumbEllipsis = ({ className }) => (
  <span role='img' aria-label='More pages' className={ cn('inline-flex items-center text-gray-500 dark:text-gray-400', className) }><Icon name='MoreHorizontal' decorative size='xs' /></span>
);

export const BreadcrumbTrail = ({ items = [], className, label }) => (
  <Breadcrumb className={ className } label={ label }>
    <BreadcrumbList>
      {items.map((item, index) => (
        <BreadcrumbItem key={ item.href || item.label }>
          {index > 0 ? <BreadcrumbSeparator /> : null}
          {item.current || index === items.length - 1 ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : <BreadcrumbLink href={ item.href }>{item.label}</BreadcrumbLink>}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

export default BreadcrumbTrail;
