import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Chat/ChatEffortSlider": {
    ...definition('How hard the assistant should think, as a stepped slider over named levels.', [p('label', 'string', 'Effort', 'Slider name.'), p('defaultValue', 'low | medium | high | max', 'medium', 'Initial level.'), p('compact', 'boolean', 'false', 'Drops step labels and the description.'), p('disabled', 'boolean', 'false', 'Locks the control.'), p('levels', 'Array<{ value, label, description? }>', 'chatEffortLevels', 'The levels.'), p('value / onValueChange', 'string / (value, level) => void', '—', 'Controlled level.'), className], 'The thumb announces the level name through aria-valuetext.'),
    usage: "import { ChatEffortSlider } from '@gaudi/design-system/chat';\n\n<ChatEffortSlider value={effort} onValueChange={setEffort} />"
  }
};
