import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/Slider": {
    ...definition('Adjust one value or a range with pointer and keyboard input.', [p('getValueText', '(value, index) => string', '—', 'Text a thumb announces instead of the number, such as a level name; use it with a controlled value.'), p('value / defaultValue', 'number[]', '—', 'Controlled or initial thumb positions.'), p('onValueChange / onValueCommit', '(values: number[]) => void', '—', 'Continuous updates or the committed selection.'), p('min / max', 'number', '0 / 100', 'Allowed range.'), p('step', 'number', '1', 'Keyboard and pointer increment.'), p('orientation', 'horizontal | vertical', 'horizontal', 'Control orientation.'), p('disabled', 'boolean', 'false', 'Prevent adjustment.'), className], 'Label every thumb and provide a readable value. Use range examples when the two endpoints have different meanings.'),
    usage: "import { Slider } from '@gaudi/design-system/core/Slider';\n\n<Slider aria-label='Volume' value={volume} onValueChange={setVolume} min={0} max={100} />"
  }
};
