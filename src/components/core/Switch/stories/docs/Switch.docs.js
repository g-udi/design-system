export default {
  "Core/Switch": {
    'accessibility': 'Switch exposes role switch, aria-checked, disabled state, and a visible label when provided.',
    'description': 'Switch renders a token-styled boolean preference control.',
    'props': [['id', 'string', 'generated id', 'Connects the switch to its visible label.'], ['label', 'ReactNode', '-', 'Visible label text.'], ['checked', 'boolean', '-', 'Controlled checked state.'], ['defaultChecked', 'boolean', 'false', 'Initial checked state for uncontrolled usage.'], ['size', 'sm | md | lg', 'md', 'Controls track, thumb, and label scale.'], ['disabled', 'boolean', 'false', 'Prevents changes and lowers visual emphasis.'], ['onCheckedChange', '(checked) => void', '-', 'Called with the next checked state.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { Switch } from '@gaudi/design-system';\n\n<Switch label='Email notifications' defaultChecked />"
  }
};
