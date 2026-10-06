import { p, children, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/ButtonGroup": {
    ...definition('Group related actions with joined borders and consistent sizing.', [p('orientation', 'horizontal | vertical', 'horizontal', 'Arrangement and accessible orientation of the group.'), children, className, p('ButtonGroupSeparator.orientation', 'horizontal | vertical', 'vertical', 'Direction of a divider between actions.')], 'Buttons retain independent names and focus targets. Use ToggleGroup when the actions represent a selection.'),
    usage: "import Button from '@gaudi/design-system/core/Button';\nimport { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';\n\n<ButtonGroup aria-label='Document actions'>\n  <Button onClick={save}>Save</Button>\n  <Button variant='outline' onClick={exportDocument}>Export</Button>\n</ButtonGroup>"
  }
};
