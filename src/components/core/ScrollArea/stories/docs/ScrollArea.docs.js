import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Core/ScrollArea': {
    ...definition('Contained scrolling with themed scrollbars and optional smooth wheel motion for article reading.', [
      p('type', 'auto | always | scroll | hover', 'hover', 'Scrollbar visibility behavior.'),
      p('smooth', 'boolean', 'false', 'Enhances vertical mouse-wheel scrolling with Lenis. Touch, keyboard, focus, links and reduced motion retain native behavior. The engine loads only when requested and pauses when the area or page is hidden.'),
      p('viewportRef', 'Ref<HTMLElement>', '—', 'Ref to the actual scrolling viewport. Share with ReadingIndicator.targetRef, a heading observer or native scrollTo calls. The ordinary ref still points to the outer root.'),
      p('scrollbarClassName', '{ track?: string, thumb?: string }', '—', 'Classes for the built-in vertical scrollbar track and thumb, using Gaudi tokens.'),
      p('ScrollBar.orientation', 'horizontal | vertical', 'vertical', 'Axis of an additional scrollbar. Smooth wheel motion applies to the vertical viewport; horizontal regions remain native.'),
      p('ScrollBar.thumbClassName', 'string', '—', 'Classes for a separately composed scrollbar thumb.'),
      children, className
    ], 'Give the viewport a useful accessible name using aria-label or aria-labelledby. Constrain the area dimensions and retain keyboard access. Reduced motion skips the smooth engine entirely; native scrolling remains available before hydration or if the enhancement cannot load. Nested scrollable content keeps its own wheel behavior.'),
    usage: "import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';\n\n<ScrollArea smooth className='h-[32rem]' aria-label='Blog post content'>{article}</ScrollArea>",
    notes: [
      'Blog migration decision: use ScrollArea with smooth enabled as the main area hosting blog post content. Keep one article viewport, and pass its viewportRef to reading progress and heading navigation. Adapt the consuming layout, table of contents and route scroll restoration during that migration; this component does not migrate the blog shell itself.',
      'Smooth scrolling is an enhancement to the existing ScrollArea owner, not a second global page scroller. Bound the height, including min-h-0 when using a flex layout. Avoid stacking a second document-wide smoothing engine around it.',
      'Native fragment links, keyboard scrolling, focus, text selection and touch retain browser behavior. Pointer and keyboard intent interrupt any pending wheel inertia. Code, tables and other nested scroll regions scroll natively.',
      'Theme the track and thumb through scrollbarClassName. Keep enough contrast and an adequate hit area. Use ScrollBar with orientation="horizontal" for content that deliberately overflows horizontally.',
      'Inspired by Shadix UI Smooth Scroll Area. Gaudi composes its existing Radix viewport with the packaged Lenis engine; it does not load remote scripts or copy registry source.'
    ]
  }
};
