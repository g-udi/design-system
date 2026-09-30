import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'button-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/button-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/button-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ButtonGroup', tags: ['autodocs'], ...catalogueMeta('button-group') };

export const ButtonGroupPattern1 = { name: 'Two buttons', ...pattern(1) };
export const ButtonGroupPattern2 = { name: 'Button and input', ...pattern(2) };
export const ButtonGroupPattern3 = { name: 'Icons and a badge', ...pattern(3) };
export const ButtonGroupPattern4 = { name: 'Action with an options menu', ...pattern(4) };
export const ButtonGroupPattern5 = { name: 'Team activity toolbar', ...pattern(5) };
export const ButtonGroupPattern6 = { name: 'Icon-only actions', ...pattern(6) };
export const ButtonGroupPattern7 = { name: 'Branch menu with status', ...pattern(7) };
export const ButtonGroupPattern8 = { name: 'Like with a counter', ...pattern(8) };
export const ButtonGroupPattern9 = { name: 'Nested groups', ...pattern(9) };
export const ButtonGroupPattern10 = { name: 'Pagination with previous and next', ...pattern(10) };
export const ButtonGroupPattern11 = { name: 'Split pagination', ...pattern(11) };
export const ButtonGroupPattern12 = { name: 'Text alignment toolbar', ...pattern(12) };
export const ButtonGroupPattern13 = { name: 'Vertical orientation', ...pattern(13) };
export const ButtonGroupPattern14 = { name: 'Nested vertical tool palette', ...pattern(14) };
export const ButtonGroupPattern15 = { name: 'Star with count and menu', ...pattern(15) };
export const ButtonGroupPattern16 = { name: 'Search with filter menu and clear', ...pattern(16) };
export const ButtonGroupPattern17 = { name: 'Overflow action menu', ...pattern(17) };
export const ButtonGroupPattern18 = { name: 'Git toolbar with split commit', ...pattern(18) };
export const ButtonGroupPattern19 = { name: 'Filter input with options menu', ...pattern(19) };
export const ButtonGroupPattern20 = { name: 'Search input with menu button', ...pattern(20) };
export const ButtonGroupPattern21 = { name: 'File name input with create menu', ...pattern(21) };
export const ButtonGroupPattern22 = {
  name: 'Disabled button',
  ...pattern(22),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Folder' })).toBeDisabled();
  }
};
export const ButtonGroupPattern23 = { name: 'Separators', ...pattern(23) };
export const ButtonGroupPattern24 = { name: 'View switcher', ...pattern(24) };
export const ButtonGroupPattern25 = { name: 'Numeric rating scale', ...pattern(25) };
export const ButtonGroupPattern26 = { name: 'User select with actions', ...pattern(26) };
export const ButtonGroupPattern27 = { name: 'Status select with search', ...pattern(27) };
export const ButtonGroupPattern28 = {
  name: 'Volume stepper',
  ...pattern(28),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Volume' }));
    await userEvent.click(canvas.getByRole('button', { name: '55%' }));
    await expect(canvas.getByRole('button', { name: 'Muted' })).toBeVisible();
  }
};
export const ButtonGroupPattern29 = { name: 'Follower count', ...pattern(29) };
export const ButtonGroupPattern30 = { name: 'Active star with count', ...pattern(30) };
export const ButtonGroupPattern31 = { name: 'Share with a count label', ...pattern(31) };
export const ButtonGroupPattern32 = { name: 'Sort menu with view toggle', ...pattern(32) };
export const ButtonGroupPattern33 = { name: 'Environment and range selects', ...pattern(33) };
export const ButtonGroupPattern34 = { name: 'Segmented control with menu', ...pattern(34) };
export const ButtonGroupPattern35 = { name: 'Icon pagination with current page', ...pattern(35) };
export const ButtonGroupPattern36 = { name: 'View switcher with active view', ...pattern(36) };
export const ButtonGroupPattern37 = { name: 'Zoom controls', ...pattern(37) };
export const ButtonGroupPattern38 = { name: 'Media player controls', ...pattern(38) };
export const ButtonGroupPattern39 = { name: 'Split button', ...pattern(39) };
export const ButtonGroupPattern40 = { name: 'Vertical text buttons', ...pattern(40) };
export const ButtonGroupPattern41 = { name: 'Model selector with tier badges', ...pattern(41) };
export const ButtonGroupPattern42 = { name: 'Order type selector', ...pattern(42) };
export const ButtonGroupPattern43 = { name: 'Buy, sell, and hold toggle', ...pattern(43) };
export const ButtonGroupPattern44 = { name: 'Pipeline stage mover', ...pattern(44) };
export const ButtonGroupPattern45 = { name: 'Environment switcher', ...pattern(45) };
export const ButtonGroupPattern46 = { name: 'Time interval selector', ...pattern(46) };
export const ButtonGroupPattern47 = { name: 'Review split button', ...pattern(47) };
export const ButtonGroupPattern48 = { name: 'Filter, export, and view toggle', ...pattern(48) };
export const ButtonGroupPattern49 = { name: 'Vertical nav links with icons', ...pattern(49) };
export const ButtonGroupPattern50 = { name: 'Filter, sort, and more', ...pattern(50) };
export const ButtonGroupPattern51 = { name: 'New with create menu', ...pattern(51) };
export const ButtonGroupPattern52 = { name: 'Refresh, share, and export', ...pattern(52) };
export const ButtonGroupPattern53 = { name: 'Publish controls with overflow', ...pattern(53) };
export const ButtonGroupPattern54 = { name: 'API environment and version', ...pattern(54) };
export const ButtonGroupPattern55 = { name: 'Payout release controls', ...pattern(55) };
export const ButtonGroupPattern56 = { name: 'Attachment with download', ...pattern(56) };
export const ButtonGroupPattern57 = { name: 'Agent mode with credit cap', ...pattern(57) };
