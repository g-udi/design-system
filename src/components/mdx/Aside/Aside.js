/**
 * Aside Component
 *
 * @description Supplementary article content that stays in its reading column at every width.
 * Colours come from theme tokens, so it needs no dark-mode overrides.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { cn } from '../../../utilities/cn';
import { cardVariants } from '../../core/Card';

/**
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The supplementary content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A styled aside element
 *
 * @example
 * <Aside>This is supplementary information about the topic.</Aside>
 */
const Aside = ({ children, className }) => (
  <aside
    className={ cn(
      cardVariants({ variant: 'soft', padding: 'md', fill: false }),
      'my-4 text-sm leading-6 text-text-muted',
      className
    ) }
  >
    {children}
  </aside>
);

export default Aside;
