// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'attachment',
  import.meta.glob('../../../../.storybook/fixtures/reui/attachment/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/attachment/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Attachment', tags: ['autodocs'], ...catalogueMeta('attachment') };

export const ReuiAttachment1 = { name: 'Single file attachment in an assistant reply', ...pattern(1) };
export const ReuiAttachment2 = { name: 'Composer tray with removable attachments', ...pattern(2) };
export const ReuiAttachment3 = { name: 'Image thumbnails in a snapping strip', ...pattern(3) };
export const ReuiAttachment4 = { name: 'Three sizes carrying three levels of an answer', ...pattern(4) };
export const ReuiAttachment5 = { name: 'Upload queue across all five states', ...pattern(5) };
export const ReuiAttachment6 = { name: 'File picker that fills an attachment tray', ...pattern(6) };
