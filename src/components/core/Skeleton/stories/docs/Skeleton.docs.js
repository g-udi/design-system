export default {
  "Core/Skeleton": {
    'accessibility': 'Skeleton is aria-hidden and should be paired with loading text or a labelled busy region when content loading needs announcement. Shimmer keeps its words as real text; put it in a status region when the change should be announced. Both hold still for reduced motion.',
    'description': 'Skeleton renders non-semantic loading placeholders on the theme border token, so blocks read clearly in light and dark themes. Shimmer is the text counterpart: a highlight that sweeps across a label such as Thinking… while work is in progress.',
    'props': [['className', 'string', '-', 'Defines shape, width, height, radius, and layout placement.'], ['Shimmer.children', 'ReactNode', '-', 'Text that shimmers while work is in progress, such as Thinking… or Searching the web…; it stays real, readable text.'], ['Shimmer.active / duration / spread', 'boolean / number / number', 'true / 2 / 2', 'Run or rest the sweep, seconds per sweep, and band width in pixels per character.'], ['Shimmer.as', 'ElementType', 'span', 'Element to render, such as p or h3.']],
    usage: "import { Shimmer, Skeleton } from '@gaudi/design-system';\n\n<>\n<Skeleton className='h-4 w-40' />\n<p role='status'><Shimmer>Searching the web…</Shimmer></p>\n</>"
  }
};
