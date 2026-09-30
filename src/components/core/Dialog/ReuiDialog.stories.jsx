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
export const ReuiDialog2 = { name: 'Dialog with scrollable content', ...pattern(2) };
export const ReuiDialog3 = { name: 'Dialog with scrollable content and sticky footer', ...pattern(3) };
export const ReuiDialog4 = { name: 'Dialog without a close button', ...pattern(4) };
export const ReuiDialog5 = { name: 'Dialog with custom close button', ...pattern(5) };
export const ReuiDialog6 = { name: 'Full-screen fluid dialog with sticky header and footer', ...pattern(6) };
export const ReuiDialog7 = { name: 'Confirmation dialog with destructive action', ...pattern(7) };
export const ReuiDialog8 = { name: 'Cookie consent dialog', ...pattern(8) };
export const ReuiDialog9 = { name: 'Dialog with keyboard shortcuts list', ...pattern(9) };
export const ReuiDialog10 = { name: 'Dialog with full width button', ...pattern(10) };
