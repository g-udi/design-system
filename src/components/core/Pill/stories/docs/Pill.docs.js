export default {
  "Core/Pill": {
    'accessibility': 'Pill includes visible text so status or category meaning is not color-only.',
    'decisionRules': ['Use Pill for compact metadata, tags, filters, and status labels.', 'Keep the visible label as the source of meaning; color only supports scanning.', 'Use the Badge `discovery` variants for suggested or machine-generated labels and `attention` for items that need a person to look, such as staged or unreviewed records; each has solid, `-light` and `-outline` treatments.'],
    'description': 'Pill renders compact category and status labels.',
    'props': [['children', 'ReactNode', '-', 'Visible category, status, or tag label.'], ['size', 'xs | sm | md | lg', 'md', 'Controls padding and text size.'], ['tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'blue', 'Semantic tone alias mapped through Gaudi tokens rather than raw palette utilities.'], ['variant', 'solid | soft | outline | ghost | subtle', 'solid', 'Visual treatment.'], ['radius', 'sm | md | full', 'sm', 'Legacy aliases use the global --ds-radius setting (4px by default); none stays square where supported.'], ['href', 'string', '-', 'Renders the pill as a navigation link.'], ['icon', 'ReactNode', '-', 'Decorative leading icon.'], ['pulse', 'boolean', 'false', 'Adds a pulsing status dot.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { Pill } from '@gaudi/design-system';\n\n<Pill tone='blue' variant='solid' size='sm'>Engineering</Pill>"
  }
};
