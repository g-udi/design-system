/**
 * Callout Component
 *
 * @description Simple callout boxes for highlighting different types of content.
 * Supports three types: info (blue), warning (yellow), and error (red).
 * Clean design without icons. Used within MDX content to draw attention to important information.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

/**
 * Renders a styled callout box with type-specific styling
 *
 * @param {Object} props - Component props
 * @param {('info'|'warning'|'error')} props.type - The callout type that determines styling (default: 'info')
 * @param {React.ReactNode} [props.title] - Optional label above the body, such as "Note" or "Warning"
 * @param {React.ReactNode} props.children - The content to display within the callout
 * @returns {JSX.Element} A div containing the styled callout
 *
 * @example
 * // In MDX content - Info callout:
 * <Callout type="info">
 *   This is important information for readers to note.
 * </Callout>
 *
 * @example
 * // In MDX content - Warning callout:
 * <Callout type="warning">
 *   Be careful when following these steps!
 * </Callout>
 *
 * @example
 * // In MDX content - Error callout:
 * <Callout type="error">
 *   This action cannot be undone!
 * </Callout>
 */
import { cn } from '../../../utilities/cn';
import { Alert, AlertDescription, AlertTitle } from '../../core/Banner';

const variants = { error: 'destructive', info: 'info', warning: 'warning' };

const Callout = ({ children, className, classNames = {}, title, type = 'info' }) => {
  return (
    <Alert role='note' variant={ variants[type] || variants.info } className={ cn('mb-6', className, classNames.root) }>
      {title ? <AlertTitle className={ cn('text-sm font-semibold text-text', classNames.title) }>{title}</AlertTitle> : null}
      <AlertDescription className={ cn('block text-base text-text [&>p]:m-0 [&>p:not(:last-child)]:mb-2', classNames.body) }>
        {children}
      </AlertDescription>
    </Alert>
  );
};

export default Callout;
