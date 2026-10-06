export default {
  "Core/TextHighlight": {
    'accessibility': 'TextHighlight is inline text emphasis. It must keep the original text readable and must not be the only way meaning is conveyed.',
    'description': 'TextHighlight emphasizes short inline phrases inside prose.',
    'overview': 'Use TextHighlight sparingly inside article copy or compact editorial headings when a phrase needs emphasis without becoming a link, button, or badge.',
    'props': [['children', 'ReactNode', '-', 'Inline text to emphasize.'], ['variant', 'marker | soft | underline', 'marker', 'Highlight treatment.'], ['tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'blue', 'Color family.'], ['animate', 'boolean', 'true', 'Enables the marker draw animation.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { TextHighlight } from '@gaudi/design-system';\n\n<p>Design systems make <TextHighlight>consistency visible</TextHighlight>.</p>"
  }
};
