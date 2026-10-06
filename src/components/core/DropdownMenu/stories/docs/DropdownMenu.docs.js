import { p, children, open, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Core/DropdownMenu": {
    ...definition('Action menus with keyboard navigation, checkbox choices and destructive actions.', [p('trigger', 'ReactElement', '—', 'Ref-forwarding button that opens the menu.'), p('align', 'start | center | end', 'end', 'Horizontal alignment of the popup.'), ...open, children, p('DropdownMenuItem.onSelect', '(event: Event) => void', '—', 'Action invoked by keyboard or pointer selection.'), p('DropdownMenuItem.destructive / disabled', 'boolean', '—', 'Destructive styling or unavailable action.'), p('DropdownMenuCheckboxItem.checked / onCheckedChange', 'boolean | indeterminate / function', '—', 'Controlled checkbox menu item.')], 'Arrow keys navigate items; Escape closes and returns focus. Use menu items for actions and links for navigation.'),
    usage: "import DropdownMenu, { DropdownMenuItem } from '@gaudi/design-system/core/DropdownMenu';\nimport Button from '@gaudi/design-system/core/Button';\n\n<DropdownMenu trigger={<Button variant='outline'>Document actions</Button>}>\n  <DropdownMenuItem onSelect={duplicate}>Duplicate</DropdownMenuItem>\n  <DropdownMenuItem onSelect={archive}>Archive</DropdownMenuItem>\n</DropdownMenu>"
  }
};
