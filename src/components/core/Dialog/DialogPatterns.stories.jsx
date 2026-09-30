import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'dialog',
  import.meta.glob('../../../../.storybook/fixtures/patterns/dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('dialog') };

export const DialogPattern1 = {
  name: 'Basic dialog',
  ...pattern(1),
  play: catalogueInteractions['dialog-1']
};
export const DialogPattern2 = { name: 'Scrollable content', ...pattern(2) };
export const DialogPattern3 = { name: 'Scrollable content with sticky footer', ...pattern(3) };
export const DialogPattern4 = { name: 'Without a close button', ...pattern(4) };
export const DialogPattern5 = { name: 'Custom close button', ...pattern(5) };
export const DialogPattern6 = { name: 'Full-screen with sticky header and footer', ...pattern(6) };
export const DialogPattern7 = { name: 'Destructive confirmation', ...pattern(7) };
export const DialogPattern8 = { name: 'Cookie consent', ...pattern(8) };
export const DialogPattern9 = { name: 'Keyboard shortcuts list', ...pattern(9) };
export const DialogPattern10 = { name: 'Full-width button', ...pattern(10) };
