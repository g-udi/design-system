// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'dialog',
  import.meta.glob('../../../../.storybook/fixtures/reui/dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('dialog') };

export const ReuiDialog1 = {
  name: 'Basic dialog',
  ...pattern(1),
  play: catalogueInteractions['dialog-1']
};
export const ReuiDialog2 = { name: 'Scrollable content', ...pattern(2) };
export const ReuiDialog3 = { name: 'Scrollable content with sticky footer', ...pattern(3) };
export const ReuiDialog4 = { name: 'Without a close button', ...pattern(4) };
export const ReuiDialog5 = { name: 'Custom close button', ...pattern(5) };
export const ReuiDialog6 = { name: 'Full-screen with sticky header and footer', ...pattern(6) };
export const ReuiDialog7 = { name: 'Destructive confirmation', ...pattern(7) };
export const ReuiDialog8 = { name: 'Cookie consent', ...pattern(8) };
export const ReuiDialog9 = { name: 'Keyboard shortcuts list', ...pattern(9) };
export const ReuiDialog10 = { name: 'Full-width button', ...pattern(10) };
