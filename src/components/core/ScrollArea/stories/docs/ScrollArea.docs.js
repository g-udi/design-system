import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Core/ScrollArea': {
    ...definition('Contained scrolling with themed scrollbars and optional smooth wheel motion for article reading.', [
      p('type', 'auto | always | scroll | hover', 'hover', 'Scrollbar visibility behavior.'),
      p('smooth', 'boolean', 'false', 'Enhances vertical mouse-wheel scrolling with Lenis. Touch, keyboard, focus, links and reduced motion retain native behavior. The engine loads only when requested and pauses when the area or page is hidden.'),
      p('fadeEdges', 'boolean', 'false', 'Blurs the top and bottom edges while more content continues past them. Decorative: hidden during keyboard focus, for reduced motion and in forced colours.'),
      p('ScrollEdges.targetRef / offsetTop / range', 'Ref<HTMLElement> / number / number', 'page / 0 / 80', 'The same edges for any scroll boundary: an element, or the page when targetRef is omitted. offsetTop keeps the page top edge below a sticky header; range is the distance in pixels at which an edge reaches full strength.'),
      p('viewportRef', 'Ref<HTMLElement>', '—', 'Ref to the actual scrolling viewport. Share with ReadingIndicator.targetRef, a heading observer or native scrollTo calls. The ordinary ref still points to the outer root.'),
      p('scrollbarClassName', '{ track?: string, thumb?: string }', '—', 'Classes for the built-in vertical scrollbar track and thumb, using Gaudi tokens.'),
      p('ScrollBar.orientation', 'horizontal | vertical', 'vertical', 'Axis of an additional scrollbar. Smooth wheel motion applies to the vertical viewport; horizontal regions remain native.'),
      p('ScrollBar.thumbClassName', 'string', '—', 'Classes for a separately composed scrollbar thumb.'),
      children, className
    ], 'Give the viewport a useful accessible name using aria-label or aria-labelledby. Constrain the area dimensions and retain keyboard access. Reduced motion skips the smooth engine entirely; native scrolling remains available before hydration or if the enhancement cannot load. Nested scrollable content keeps its own wheel behavior.'),
    usage: "import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';\n\n<ScrollArea smooth className='h-[32rem]' aria-label='Blog post content'>{article}</ScrollArea>",
    notes: [
      'A page that scrolls as a whole, such as a blog post between a site header and footer, keeps native page scrolling and uses ScrollEdges without targetRef for the same blurred edges. Use a bounded ScrollArea when the reading area is the only scroller, as in the Article examples.',
      'Smooth scrolling is an enhancement to the existing ScrollArea owner, not a second global page scroller. Bound the height, including min-h-0 when using a flex layout. Avoid stacking a second document-wide smoothing engine around it.',
      'Native fragment links, keyboard scrolling, focus, text selection and touch retain browser behavior. Pointer and keyboard intent interrupt any pending wheel inertia. Code, tables and other nested scroll regions scroll natively.',
      'Theme the track and thumb through scrollbarClassName. Keep enough contrast and an adequate hit area. Use ScrollBar with orientation="horizontal" for content that deliberately overflows horizontally.',
      'Inspired by Shadix UI Smooth Scroll Area. Gaudi composes its existing Radix viewport with the packaged Lenis engine; it does not load remote scripts or copy registry source.'
    ]
  }
};
