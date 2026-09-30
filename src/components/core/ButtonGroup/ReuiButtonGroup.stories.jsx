// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'button-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/button-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/button-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ButtonGroup', tags: ['autodocs'], ...catalogueMeta('button-group') };

export const ReuiButtonGroup1 = { name: 'Basic button group with two buttons', ...pattern(1) };
export const ReuiButtonGroup2 = { name: 'Button group with button followed by input', ...pattern(2) };
export const ReuiButtonGroup3 = { name: 'Button group with buttons and badge', ...pattern(3) };
export const ReuiButtonGroup4 = { name: 'Button group with dropdown menu', ...pattern(4) };
export const ReuiButtonGroup5 = { name: 'Team activity and collaboration group', ...pattern(5) };
export const ReuiButtonGroup6 = { name: 'Button group using icons for visual actions', ...pattern(6) };
export const ReuiButtonGroup7 = { name: 'Dropdown menu with status indicator', ...pattern(7) };
export const ReuiButtonGroup8 = { name: 'Button group styled as a like button with a counter', ...pattern(8) };
export const ReuiButtonGroup9 = { name: 'Nested button groups for complex action sets', ...pattern(9) };
export const ReuiButtonGroup10 = { name: 'Button group used for standard pagination', ...pattern(10) };
export const ReuiButtonGroup11 = { name: 'Pagination split into page numbers and navigation arrows', ...pattern(11) };
export const ReuiButtonGroup12 = { name: 'Button group for editor text alignment controls', ...pattern(12) };
export const ReuiButtonGroup13 = { name: 'Vertical button group orientation', ...pattern(13) };
export const ReuiButtonGroup14 = { name: 'Nested vertical button group for complex tool palettes', ...pattern(14) };
export const ReuiButtonGroup15 = { name: 'Star button group with count and dropdown', ...pattern(15) };
export const ReuiButtonGroup16 = { name: 'Search input with filter menu and clear button', ...pattern(16) };
export const ReuiButtonGroup17 = { name: 'Button group with comprehensive action menu', ...pattern(17) };
export const ReuiButtonGroup18 = { name: 'Advanced git toolbar with branch selection and split commit button', ...pattern(18) };
export const ReuiButtonGroup19 = { name: 'Button group with dropdown menu and input group', ...pattern(19) };
export const ReuiButtonGroup20 = { name: 'Button group with input group and button', ...pattern(20) };
export const ReuiButtonGroup21 = { name: 'Button group with dropdown menu and input group', ...pattern(21) };
export const ReuiButtonGroup22 = { name: 'Basic button group with disabled button', ...pattern(22) };
export const ReuiButtonGroup23 = { name: 'Button group buttons with separators', ...pattern(23) };
export const ReuiButtonGroup24 = { name: 'View switcher for dashboard layouts', ...pattern(24) };
export const ReuiButtonGroup25 = { name: 'Rating scale using numerical buttons', ...pattern(25) };
export const ReuiButtonGroup26 = { name: 'Button group with user selection select', ...pattern(26) };
export const ReuiButtonGroup27 = { name: 'Button group with select status addon', ...pattern(27) };
export const ReuiButtonGroup28 = { name: 'Volume controller with plus/minus actions', ...pattern(28) };
export const ReuiButtonGroup29 = { name: 'Button group with follower count', ...pattern(29) };
export const ReuiButtonGroup30 = { name: 'Active state button group with count', ...pattern(30) };
export const ReuiButtonGroup31 = { name: 'Horizontal button group with primary and secondary labels', ...pattern(31) };
export const ReuiButtonGroup32 = { name: 'Button group with dropdown menu and view toggle', ...pattern(32) };
export const ReuiButtonGroup33 = { name: 'Button group with select controls', ...pattern(33) };
export const ReuiButtonGroup34 = { name: 'Segmented control with dropdown inside button group', ...pattern(34) };
export const ReuiButtonGroup35 = { name: 'Pagination button group', ...pattern(35) };
export const ReuiButtonGroup36 = { name: 'View switcher button group', ...pattern(36) };
export const ReuiButtonGroup37 = { name: 'Zoom controls button group', ...pattern(37) };
export const ReuiButtonGroup38 = { name: 'Media player controls button group', ...pattern(38) };
export const ReuiButtonGroup39 = { name: 'Split button with dropdown trigger', ...pattern(39) };
export const ReuiButtonGroup40 = { name: 'Vertical button group', ...pattern(40) };
export const ReuiButtonGroup41 = { name: 'Model selector with tier badges', ...pattern(41) };
export const ReuiButtonGroup42 = { name: 'Segmented order type selector', ...pattern(42) };
export const ReuiButtonGroup43 = { name: 'Buy sell hold toggle group', ...pattern(43) };
export const ReuiButtonGroup44 = { name: 'Pipeline stage mover with dropdown', ...pattern(44) };
export const ReuiButtonGroup45 = { name: 'Environment switcher with indicator', ...pattern(45) };
export const ReuiButtonGroup46 = { name: 'Compact time interval selector', ...pattern(46) };
export const ReuiButtonGroup47 = { name: 'Review actions split button', ...pattern(47) };
export const ReuiButtonGroup48 = { name: 'Toolbar filter with export and view toggle', ...pattern(48) };
export const ReuiButtonGroup49 = { name: 'Vertical nav links with icons', ...pattern(49) };
export const ReuiButtonGroup50 = { name: 'Toolbar filter sort and more', ...pattern(50) };
export const ReuiButtonGroup51 = { name: 'New button with create dropdown', ...pattern(51) };
export const ReuiButtonGroup52 = { name: 'Refresh share and export dropdown', ...pattern(52) };
export const ReuiButtonGroup53 = { name: 'Publish controls with split button and overflow', ...pattern(53) };
export const ReuiButtonGroup54 = { name: 'API service environment and version selectors', ...pattern(54) };
export const ReuiButtonGroup55 = { name: 'Payout release controls with amount context', ...pattern(55) };
export const ReuiButtonGroup56 = { name: 'Attachment button group with download action', ...pattern(56) };
export const ReuiButtonGroup57 = { name: 'Agent mode selector with credit cap dropdown', ...pattern(57) };
