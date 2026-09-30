/**
 * Aside Component
 *
 * @description Supplementary article content. Reads as a muted note in the column and moves into the
 * left margin on very wide screens. Colours come from theme tokens, so it needs no dark-mode overrides.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { cn } from '../../../utilities/cn';

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
      'my-4 rounded-md border border-border bg-surface-muted px-4 py-3 text-sm leading-6 text-text-muted',
      '2xl:absolute 2xl:left-[-20%] 2xl:w-[250px] 2xl:border-0 2xl:bg-transparent 2xl:py-2',
      className
    ) }
  >
    {children}
  </aside>
);

export default Aside;
