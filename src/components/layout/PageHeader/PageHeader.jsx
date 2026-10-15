import Typography from '../../../foundations/Typography';
import { cn } from '../../../utilities/cn';

/**
 * Page or section introduction
 *
 * @description An optional eyebrow, a title (an h1 by default), a description and an actions slot
 * that wraps beneath the text on narrow screens. `sticky` pins it to the top of the scroll container
 * on the page background with a bottom border, for list headings that stay visible while scrolling;
 * `divider` adds the same border without pinning. Server-safe: no client state.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.actions] - Controls or meta beside the title, such as a count or filter
 * @param {React.ReactNode} [props.children] - Extra content below the description, such as filters
 * @param {string} [props.className] - Additional classes on the header element
 * @param {Object} [props.classNames] - Slot classes: { root, eyebrow, title, description, actions }
 * @param {React.ReactNode} [props.description] - Supporting text below the title
 * @param {boolean} [props.divider=false] - Bottom border separating the header from the content below
 * @param {React.ReactNode} [props.eyebrow] - Short label above the title, such as a section name
 * @param {boolean} [props.sticky=false] - Pin to the top while the content below scrolls (implies divider)
 * @param {React.ReactNode} props.title - The heading text
 * @param {React.ElementType} [props.titleAs='h1'] - Heading element; use h2 for sections within a page
 * @param {string} [props.titleId] - ID for the heading, so a region can reference it with aria-labelledby
 * @param {string} [props.titleVariant='title-md'] - Typography variant for the title
 *
 * @example
 * <PageHeader eyebrow='Archive' title='Projects' description='Things I have built.' divider />
 *
 * @example
 * <PageHeader sticky titleAs='h2' titleVariant='heading-lg' titleId='posts' title='All posts' actions={ <span>42 posts</span> } />
 */
const PageHeader = ({
  actions,
  children,
  className,
  classNames = {},
  description,
  divider = false,
  eyebrow,
  sticky = false,
  title,
  titleAs = 'h1',
  titleId,
  titleVariant = 'title-md'
}) => (
  <header
    data-slot='page-header'
    data-sticky={ sticky ? '' : undefined }
    className={ cn(
      'flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-4',
      (divider || sticky) && 'border-b border-border',
      sticky && 'sticky top-0 z-10 bg-background pt-2',
      className,
      classNames.root
    ) }
  >
    <div className='min-w-0 flex-[1_1_20rem]'>
      {eyebrow ? <Typography as='p' variant='metadata' className={ cn('mb-2 uppercase tracking-wider', classNames.eyebrow) }>{eyebrow}</Typography> : null}
      <Typography as={ titleAs } id={ titleId } variant={ titleVariant } className={ cn('tracking-tight', classNames.title) }>{title}</Typography>
      {description ? <Typography as='div' variant='paragraph-md' className={ cn('mt-2 max-w-2xl text-pretty', classNames.description) }>{description}</Typography> : null}
      {children}
    </div>
    {actions ? <div data-slot='page-header-actions' className={ cn('flex shrink-0 flex-wrap items-center gap-2', classNames.actions) }>{actions}</div> : null}
  </header>
);

export default PageHeader;
