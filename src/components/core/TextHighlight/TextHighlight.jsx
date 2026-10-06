import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases } from '../Button/buttonTones';

// One class set per semantic colour; the named tones resolve through the shared Button tone aliases.
const semanticClasses = {
  'accent': { 'marker': 'from-accent-muted to-info-border', 'soft': 'bg-accent-muted', 'underline': 'decoration-info-border' },
  'attention': { 'marker': 'from-attention-muted to-attention-border', 'soft': 'bg-attention-muted', 'underline': 'decoration-attention-border' },
  'danger': { 'marker': 'from-danger-muted to-danger-border', 'soft': 'bg-danger-muted', 'underline': 'decoration-danger-border' },
  'discovery': { 'marker': 'from-discovery-muted to-discovery-border', 'soft': 'bg-discovery-muted', 'underline': 'decoration-discovery-border' },
  'info': { 'marker': 'from-info-muted to-info-border', 'soft': 'bg-info-muted', 'underline': 'decoration-info-border' },
  'neutral': { 'marker': 'from-surface-muted to-border', 'soft': 'bg-border/60', 'underline': 'decoration-text-muted/40' },
  'success': { 'marker': 'from-success-muted to-success-border', 'soft': 'bg-success-muted', 'underline': 'decoration-success-border' },
  'warning': { 'marker': 'from-warning-muted to-warning-border', 'soft': 'bg-warning-muted', 'underline': 'decoration-warning-border' }
};

const toneNames = [ 'amber', 'blue', 'gray', 'green', 'indigo', 'neutral', 'red', 'rose', 'teal', 'yellow' ];
const variantNames = [ 'marker', 'soft', 'underline' ];

export const textHighlightVariants = createVariants({
  'base': 'relative inline box-decoration-clone rounded-none bg-[length:100%_100%] bg-left bg-no-repeat [-webkit-box-decoration-break:clone]',
  'compoundVariants': toneNames.flatMap((tone) => variantNames.map((variant) => ({
    'className': semanticClasses[buttonToneAliases[tone] || tone][variant],
    tone,
    variant
  }))),
  'defaultVariants': {
    'tone': 'blue',
    'variant': 'marker'
  },
  'variants': {
    'tone': Object.fromEntries(toneNames.map((tone) => [ tone, '' ])),
    'variant': {
      'marker': 'bg-linear-to-r px-1 pb-0.5',
      'soft': 'px-1 text-text',
      'underline': 'bg-none px-0 pb-0 underline decoration-4 underline-offset-2 [text-decoration-skip-ink:none]'
    }
  }
});

/**
 * Emphasises a phrase inside running text. The entrance sweep is pure CSS (ds-text-highlight-animate in
 * styles.css), honours prefers-reduced-motion, and keeps this a server component.
 */
export const TextHighlight = ({ animate = true, children, className, tone, variant }) => {
  const classes = textHighlightVariants({ className, tone, variant });

  return <span className={ animate ? `${classes} ds-text-highlight-animate` : classes }>{children}</span>;
};
