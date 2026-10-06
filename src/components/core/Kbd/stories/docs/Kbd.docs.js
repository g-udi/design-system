export default {
  "Core/Kbd": {
    'accessibility': 'Keyboard shortcuts expose readable aria-label text such as Command plus K while keeping visual symbols compact.',
    'description': 'Kbd renders keyboard keys and multi-key shortcuts.',
    'props': [['children', 'ReactNode', '-', 'Single visible key when keys is not provided.'], ['keys', 'string | string[]', '-', 'Shortcut list such as "command,shift,k".'], ['size', 'xs | sm | md | lg', 'md', 'Controls key dimensions and text size.'], ['variant', 'raised | outline | flat', 'raised', 'Visual keycap treatment.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { Kbd } from '@gaudi/design-system';\n\n<Kbd keys='command,shift,k' size='sm' variant='raised' />"
  }
};
