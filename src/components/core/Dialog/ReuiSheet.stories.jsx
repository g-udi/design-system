// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'sheet',
  import.meta.glob('../../../../.storybook/fixtures/reui/sheet/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('sheet') };

export const ReuiSheet1 = { name: 'Sheet with profile form', ...pattern(1) };
export const ReuiSheet2 = { name: 'Sheet without a close button', ...pattern(2) };
export const ReuiSheet3 = { name: 'Sheet sides', ...pattern(3) };
export const ReuiSheet4 = { name: 'Sheet with scrollable content', ...pattern(4) };
