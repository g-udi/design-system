import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/Pointer': {
    ...definition('A pointer effect scoped to its container, with direct, spring and lazy tracking, hover feedback, and native input fallbacks.', [
      p('variant', 'dot | ring | frame | label', 'frame', 'Follower appearance. Ring and frame keep a precise dot at the actual pointer; label places a hint beside it.'),
      p('tracking', 'direct | spring | lazy', 'lazy', 'Immediate movement, a responsive spring, or a slower trailing frame.'),
      p('tone', 'neutral | accent', 'neutral', 'Theme-aware foreground or accent color.'),
      p('label', 'string', 'Explore', 'Default label for the label variant. A descendant data-pointer-label overrides it while hovered.'),
      p('hideCursor', 'boolean', 'true', 'Hides the native cursor only while the effect is active inside this container.'),
      p('disabled', 'boolean', 'false', 'Turns off the decorative effect. Descendant controls stay usable.'),
      p('data-pointer-native', 'HTML attribute on descendants', '—', 'Opt any subtree into the native cursor, for example selectable article text.'),
      children, className
    ], 'The overlay is aria-hidden and never captures pointer events. Touch, pen, reduced motion, editable fields, keyboard use, and disabled effects retain the native cursor. Give every action its normal visible label; pointer text is supplementary. No global cursor styles are changed.'),
    usage: "import { Pointer, Button } from '@gaudi/design-system';\n\n<Pointer variant='frame' tracking='lazy' className='min-h-80 p-8'>\n  <Button>Explore work</Button>\n</Pointer>"
  }
};
