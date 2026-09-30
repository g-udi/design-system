// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'file-upload',
  import.meta.glob('../../../../.storybook/fixtures/reui/file-upload/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/file-upload/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/FileUpload', tags: ['autodocs'], ...catalogueMeta('file-upload'), parameters: { layout: 'padded', visualAudit: { wide: 'Drop zones span the width of their container.' } } };

export const ReuiFileUpload1 = { name: 'Basic file upload', ...pattern(1) };
export const ReuiFileUpload2 = { name: 'Avatar upload', ...pattern(2) };
export const ReuiFileUpload3 = {
  name: 'Drag and drop',
  ...pattern(3),
  play: catalogueInteractions['file-upload-3']
};
export const ReuiFileUpload4 = { name: 'Upload gallery', ...pattern(4) };
export const ReuiFileUpload5 = { name: 'Upload progress', ...pattern(5) };
export const ReuiFileUpload6 = { name: 'Upload table', ...pattern(6) };
export const ReuiFileUpload7 = { name: 'Image upload', ...pattern(7) };
export const ReuiFileUpload8 = { name: 'Image upload with sorting', ...pattern(8) };
export const ReuiFileUpload9 = { name: 'Upload card', ...pattern(9) };
export const ReuiFileUpload10 = { name: 'Cover image upload', ...pattern(10) };
