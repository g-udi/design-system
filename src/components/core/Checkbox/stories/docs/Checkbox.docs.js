export default {
  "Core/Checkbox": {
    'accessibility': 'Checkbox exposes role checkbox, aria-checked, disabled state, and a visible label when provided.',
    'description': 'Checkbox renders a token-styled binary control.',
    'props': [['id', 'string', 'generated id', 'Connects the button control to its visible label.'], ['label', 'ReactNode', '-', 'Visible label text.'], ['checked', 'boolean', '-', 'Controlled checked state.'], ['defaultChecked', 'boolean', 'false', 'Initial checked state for uncontrolled usage.'], ['disabled', 'boolean', 'false', 'Prevents changes and lowers visual emphasis.'], ['onCheckedChange', '(checked) => void', '-', 'Called with the next checked state.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { Checkbox } from '@gaudi/design-system';\n\n<Checkbox label='Include drafts' defaultChecked />"
  }
};
