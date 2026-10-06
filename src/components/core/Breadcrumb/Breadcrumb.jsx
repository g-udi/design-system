import Link from '../Link';
import { cn } from '../../../utilities/cn';
import {
  Breadcrumb as BreadcrumbPart,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkPart,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './BreadcrumbPrimitives.jsx';

// The convenience API is the composition parts with a labelled landmark and router-aware links.
export const Breadcrumb = ({ label = 'Breadcrumb', ...props }) => <BreadcrumbPart aria-label={ label } { ...props } />;

export const BreadcrumbLink = ({ children, className, href, ...props }) => (
  <BreadcrumbLinkPart asChild>
    <Link href={ href } variant='bare' className={ cn('hover:text-text', className) } { ...props }>{children}</Link>
  </BreadcrumbLinkPart>
);

export { BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };

export const BreadcrumbTrail = ({ items = [], className, label }) => (
  <Breadcrumb className={ className } label={ label }>
    <BreadcrumbList>
      {items.map((item, index) => {
        const current = item.current || index === items.length - 1;

        return [
          index > 0 ? <BreadcrumbSeparator key={ `${item.href || item.label}-separator` } /> : null,
          <BreadcrumbItem key={ item.href || item.label }>
            {current ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : <BreadcrumbLink href={ item.href }>{item.label}</BreadcrumbLink>}
          </BreadcrumbItem>
        ];
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export default BreadcrumbTrail;
