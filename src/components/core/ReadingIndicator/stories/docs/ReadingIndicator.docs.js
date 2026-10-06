import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/ReadingIndicator': {
    ...definition('Reading progress as a classic top bar, a vertical ruler with a moving percentage, or a movable circular meter.', [
      p('variant', 'bar | ruler | ring', 'bar', 'A thin horizontal bar, a vertical tick scale, or a compact circular meter.'),
      p('position', 'fixed | absolute | inline', 'fixed', 'Fixed to the viewport, anchored inside a positioned parent, or placed in normal layout. Bar sits at the top; ruler at the end edge; ring at the bottom end.'),
      p('targetRef', 'Ref<HTMLElement>', 'window', 'Ref to a scrolling element or a Gaudi ScrollArea root. Omit to track the document.'),
      p('contentRef', 'Ref<HTMLElement>', 'whole scroll range', 'Optional article inside the scroll target. Starts when its top reaches the viewport top; finishes when its bottom comes into view.'),
      p('value', 'number (0–100)', 'automatic', 'Supply an external reading percentage to bypass scroll tracking. Clamped to 0–100; non-finite values become 0.'),
      p('tone', 'accent | neutral', 'accent', 'Accent or foreground marks, adapted to the current theme.'),
      p('showValue', 'boolean', 'false for bar; true otherwise', 'Shows the percentage next to the indicator.'),
      p('label', 'string', 'Reading progress', 'Accessible name for the progressbar. aria-labelledby can name it from an existing heading.'),
      p('draggable', 'boolean', 'false', 'Adds a movement handle to a fixed or absolute ring. Arrow keys move it; Home or Escape resets it.'),
      p('dragBoundsRef', 'Ref<HTMLElement>', 'viewport', 'Constrains the movable ring to this container. Set it for a ring positioned inside a panel.'),
      className
    ], 'Exposes a named progressbar without live announcements on every scroll. The indicator does not capture scrolling or text selection; only the optional ring handle receives input. Reduced motion removes the number transition. Progress measures scroll position, not comprehension.', [
      'Resizes and content growth are measured automatically. A non-scrollable document is complete (100%); an unresolved target starts at 0%.',
      'Reserve a side gutter for the ruler and room for the ring so they do not cover reading text. Set style.top to place a fixed bar below a site header. For a top bar with no extra configuration, render <ReadingIndicator /> once in the page.',
      'The ruler and ring are independently implemented interpretations of the Skiper UI scroll progress references; no remote assets or registry code are loaded.'
    ]),
    usage: "import { ReadingIndicator } from '@gaudi/design-system/core/ReadingIndicator';\n\n// Render once near the page root.\n<ReadingIndicator />"
  }
};
