// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'scrollspy',
  import.meta.glob('../../../../.storybook/fixtures/reui/scrollspy/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/scrollspy/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Scrollspy', tags: ['autodocs'], ...catalogueMeta('scrollspy') };

export const ReuiScrollspy1 = { name: 'Basic scrollspy', ...pattern(1) };
export const ReuiScrollspy2 = { name: 'Basic scroll area', ...pattern(2) };
