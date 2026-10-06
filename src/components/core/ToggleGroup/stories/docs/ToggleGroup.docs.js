import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/ToggleGroup": {
    ...definition('Single or multiple pressed choices for view modes and compact formatting controls.', [p('label', 'string', '—', 'Accessible name of the group.'), p('options', 'Array<{ value, label, disabled? }>', '[]', 'Available choices.'), p('type', 'single | multiple', 'single', 'Selection model.'), p('variant / size / spacing', 'outline | default / sm | default | lg / number', 'outline / default / 0', 'Attached outline items by default; spacing separates them.'), p('value / defaultValue / onValueChange', 'string | string[] / function', '—', 'Controlled or initial selection matching type.'), p('disabled / loop', 'boolean', 'false / true', 'Group availability and keyboard wrapping.'), className], 'Each item communicates its pressed state. Choose radio controls when a form requires exactly one persistent choice.'),
    usage: "import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';\n\n<ToggleGroup type='single' label='Display' value={view} onValueChange={setView}\n  options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />"
  }
};
