// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'scrollspy',
  import.meta.glob('../../../../.storybook/fixtures/reui/scrollspy/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/scrollspy/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Scrollspy', tags: ['autodocs'], ...catalogueMeta('scrollspy') };

export const ReuiScrollspy1 = { name: 'Side navigation', ...pattern(1, 'Anchors beside a scroll area mark the section in view.') };
export const ReuiScrollspy2 = { name: 'Top navigation', ...pattern(2, 'Wrapping anchors above the content for narrow layouts.') };
