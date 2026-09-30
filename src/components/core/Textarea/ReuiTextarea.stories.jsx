// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'textarea',
  import.meta.glob('../../../../.storybook/fixtures/reui/textarea/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/textarea/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Textarea', tags: ['autodocs'], ...catalogueMeta('textarea') };

export const ReuiTextarea1 = { name: 'Basic textarea', ...pattern(1) };
export const ReuiTextarea2 = { name: 'Invalid textarea', ...pattern(2) };
export const ReuiTextarea3 = { name: 'Textarea with label', ...pattern(3) };
export const ReuiTextarea4 = { name: 'Textarea with description', ...pattern(4) };
export const ReuiTextarea5 = { name: 'Disabled textarea', ...pattern(5) };
export const ReuiTextarea6 = { name: 'Auto-resize textarea with character count', ...pattern(6) };
