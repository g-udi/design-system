import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'file-upload',
  import.meta.glob('../../../../.storybook/fixtures/patterns/file-upload/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/file-upload/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/FileUpload', tags: ['autodocs'], ...catalogueMeta('file-upload'), parameters: { layout: 'padded', visualAudit: { wide: 'Drop zones span the width of their container.' } } };

export const FileUploadPattern1 = { name: 'Basic file upload', ...pattern(1) };
export const FileUploadPattern2 = { name: 'Avatar upload', ...pattern(2) };
export const FileUploadPattern3 = {
  name: 'Drag and drop',
  ...pattern(3),
  play: catalogueInteractions['file-upload-3']
};
export const FileUploadPattern4 = { name: 'Upload gallery', ...pattern(4) };
export const FileUploadPattern5 = { name: 'Upload progress', ...pattern(5) };
export const FileUploadPattern6 = { name: 'Upload table', ...pattern(6) };
export const FileUploadPattern7 = { name: 'Image upload', ...pattern(7) };
export const FileUploadPattern8 = { name: 'Image upload with sorting', ...pattern(8) };
export const FileUploadPattern9 = { name: 'Upload card', ...pattern(9) };
export const FileUploadPattern10 = { name: 'Cover image upload', ...pattern(10) };
