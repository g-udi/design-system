// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'sheet',
  import.meta.glob('../../../../.storybook/fixtures/reui/sheet/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('sheet') };

export const ReuiSheet1 = { name: 'Sheet: Sheet containing a form for editing profile information', ...pattern(1) };
export const ReuiSheet2 = { name: 'Sheet: Sheet containing a form for editing profile information', ...pattern(2) };
export const ReuiSheet3 = { name: 'Sheet: Sheets that open from any side', ...pattern(3) };
export const ReuiSheet4 = { name: 'Sheet: Sheet with scrollable content', ...pattern(4) };
