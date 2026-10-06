import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/Loader': {
    ...definition('An accessible loading indicator with arcs, dots, expanding rings, and an indeterminate bar. Loader replaces the former Spinner component and story.', [
      p('variant', 'arc | dual-arc | bar | beat | bounce | circle-dots | clip | puff | three-dots | triangle | two-dots', 'arc', 'Selects the motion and shape. Every variant represents an unknown wait; use Progress when completion can be measured.'),
      p('size', 'xs | sm | md | lg', 'md', '12, 16, 20, or 32px tall. The bar is three times as wide; other variants are square. Shapes keep these dimensions across spacing presets.'),
      p('label', 'string', 'Loading', 'Accessible status label describing the operation. A visible label belongs beside the indicator.'),
      p('LoaderRoot', 'component', 'currentColor, sm', 'Composition primitive with the same variants and sizing. Inherits text color and accepts aria-label rather than label. Loader adds the accent color and md default.'),
      p('loaderVariants', 'string[]', '—', 'Supported variant names for controls or a variant picker.'),
      className
    ], 'Each loader exposes role="status" and a readable label. Motion is decorative to that status. With reduced motion, rotation, travel, scaling and bouncing stop; the whole indicator breathes slowly in place. For an already-labelled button or busy region, use aria-hidden="true" to avoid duplicate announcements.', [
      'Use className="text-current" to inherit surrounding text, or a semantic tone such as text-text-muted. Explicit size utility classes can override the dimensions. Keep the bar at its natural 3:1 ratio.',
      'All animation is CSS and SVG; there are no timers or browser-only rendering dependencies. Unmount the loader when the operation finishes. Loading state, cancellation, progress and recovery belong to the host.',
      'Import Loader from the root, core, or core/Loader entry. Spinner, SpinnerRoot and core/Spinner have been renamed to Loader, LoaderRoot and core/Loader; update existing imports.',
      'The Shadix UI loader reference informed the variant family. Geometry and motion are implemented locally using Gaudi colors, density and motion conventions.'
    ]),
    usage: "import { Loader } from '@gaudi/design-system/core/Loader';\n\n<Loader variant='three-dots' size='md' label='Loading articles' />"
  }
};
