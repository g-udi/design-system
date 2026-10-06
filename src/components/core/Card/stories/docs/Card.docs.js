export default {
  "Core/Card": {
    'accessibility': 'Card is a structural container. Put links or buttons inside it rather than making the whole card a fake control.',
    'decisionRules': ['Use Card to frame one reusable content unit, not as page scaffolding.', 'Put real links and buttons inside the card instead of turning the whole surface into a fake control.', 'Avoid nested cards; separate sections with spacing or a table/list pattern instead.'],
    'description': 'Card frames reusable content with title, subtitle, and optional children.',
    'props': [['title', 'ReactNode', '-', 'Optional card heading.'], ['titleLevel', '2 | 3 | 4 | 5 | 6', '3', 'Semantic level for the optional card heading.'], ['subtitle', 'ReactNode', '-', 'Supporting description under the title.'], ['children', 'ReactNode', '-', 'Body content, actions, or nested composition.'], ['variant', 'elevated | outline | soft | flat', 'elevated', 'Container surface treatment.'], ['padding', 'none | sm | md | lg', 'md', 'Internal spacing.'], ['radius', 'none | sm | md | lg', 'md', 'Legacy aliases use the global --ds-radius setting (4px by default); none stays square where supported.'], ['interactive', 'boolean', 'false', 'Adds hover elevation for cards containing a real link or button.'], ['className', 'string', '-', 'Root class override.'], ['classNames', '{ root, body, title, subtitle }', '-', 'Slot-level class overrides.']],
    usage: "import { Card } from '@gaudi/design-system';\n\n<Card title='Building with tokens' subtitle='Cards frame reusable content.' />"
  }
};
