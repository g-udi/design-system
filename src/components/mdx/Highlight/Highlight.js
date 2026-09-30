
/**
 * Highlight Component
 *
 * @description A simple text highlighting component that renders strong text with the core TextHighlight marker styles.
 * Used within MDX content to emphasize important text with visual highlighting styles.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { textHighlightVariants } from '../../core/TextHighlight';

const Highlight = ({ children }) => (
  <strong className={ textHighlightVariants({ className: 'font-bold', tone: 'blue' }) }>{children}</strong>
);

export default Highlight;
