'use client';

import Button from '../../core/Button';
import { useControllableState } from '../../../hooks/state/use-controllable-state';
import { cn } from '../../../utilities/cn';

const prosePadding = {
  'lg': 'pt-10 pb-8',
  'md': 'pt-8 pb-8'
};

/**
 * Article body grid with an optional aside (usually the table of contents).
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Article prose
 * @param {React.ReactNode} [props.aside] - Supporting column content
 * @param {boolean} [props.hasAside=Boolean(aside)] - Reserve the aside column
 * @param {boolean} [props.collapsibleAside=false] - Add a show/hide toggle above the aside
 * @param {boolean} [props.asideOpen] - Controlled aside visibility
 * @param {boolean} [props.defaultAsideOpen=true] - Initial visibility when uncontrolled
 * @param {Function} [props.onAsideOpenChange] - Called with the next visibility
 * @param {boolean} [props.showAsideToggleControl=true] - Render the built-in toggle
 * @param {string} [props.asideToggleLabel='Table of contents'] - Toggle accessible name suffix
 * @param {'md'|'lg'} [props.padding='md'] - Vertical prose padding
 * @param {string} [props.className] - Root classes
 * @param {string} [props.contentClassName] - Prose container classes
 * @returns {JSX.Element} Article layout
 */
const ArticleContentLayout = ({
  aside,
  asideToggleLabel = 'Table of contents',
  asideOpen,
  children,
  className,
  collapsibleAside = false,
  contentClassName,
  defaultAsideOpen = true,
  hasAside = Boolean(aside),
  onAsideOpenChange,
  padding = 'md',
  showAsideToggleControl = true
}) => {
  const [ isAsideOpen, setIsAsideOpen ] = useControllableState({
    value: asideOpen,
    defaultValue: defaultAsideOpen,
    onChange: onAsideOpenChange
  });
  const showAside = hasAside && (!collapsibleAside || isAsideOpen);
  const showAsideRail = hasAside && collapsibleAside;
  const showAsideToggle = hasAside && collapsibleAside && showAsideToggleControl;
  const reserveAsideRail = showAside || showAsideToggle;
  const standaloneAside = !showAsideRail && showAside ? aside : null;

  return (
    <div className={ cn('pb-8', className) }>
      <div
        className={ cn(
          'flex flex-col divide-y divide-border lg:grid lg:gap-x-6 lg:divide-y-0', reserveAsideRail ? 'lg:grid-cols-9' : 'lg:grid-cols-1'
        ) }
        style={{ 'gridTemplateRows': 'auto 1fr' }}
      >
        <div className={ cn('order-2 min-w-0 lg:order-none lg:row-span-2', reserveAsideRail && 'lg:col-span-6') }>
          <div className={ cn('prose max-w-none dark:prose-invert', prosePadding[padding], contentClassName) }>
            {children}
          </div>
        </div>
        {showAsideRail && reserveAsideRail ? (
          <div className='order-1 border-b border-border py-3 lg:order-none lg:col-span-3 lg:border-b-0 lg:pt-8'>
            {showAsideToggle ? (
              <Button
                variant='subtle'
                tone='neutral'
                size='xs'
                aria-expanded={ isAsideOpen }
                aria-label={ `${isAsideOpen ? 'Hide' : 'Show'} ${asideToggleLabel}` }
                className='gap-2 rounded-sm py-1 text-xs font-medium'
                onClick={ () => setIsAsideOpen(!isAsideOpen) }
              >
                <span className={ cn('size-1.5 rounded-full transition-colors', isAsideOpen ? 'bg-accent' : 'bg-border') } />
                <span>{isAsideOpen ? 'Hide contents' : 'Show contents'}</span>
              </Button>
            ) : null}
            {showAside ? aside : null}
          </div>
        ) : null}
        {standaloneAside}
      </div>
    </div>
  );
};

export default ArticleContentLayout;
