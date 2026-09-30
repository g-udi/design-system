import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'file-upload',
  import.meta.glob('../../../../.storybook/fixtures/patterns/file-upload/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/file-upload/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/FileUpload', id: 'core-fileupload', tags: ['autodocs'], ...catalogueMeta('file-upload'), parameters: { layout: 'padded', visualAudit: { wide: 'Drop zones span the width of their container.' } } };

export const FileUploadPattern3 = {
  name: 'Drag and drop',
  ...pattern(3, 'A compact drop zone that previews up to three files with a count.'),
  play: catalogueInteractions['file-upload-3']
};
export const FileUploadPattern6 = { name: 'Upload table with progress', ...pattern(6, 'Mixed files in a table with type badges, per-row progress rings, a failed upload to retry, and status counts.') };
export const FileUploadPattern8 = { name: 'Image gallery with sorting', ...pattern(8, 'Images reorder by drag, open a zoomed preview, and new uploads show a progress card each.') };
export const FileUploadPattern2 = { name: 'Avatar upload', ...pattern(2, 'Click or drop on the avatar, or use the button; the file name replaces the size hint once picked.') };
export const FileUploadPattern10 = { name: 'Cover image upload', ...pattern(10, 'A wide cover with change and remove actions and a progress ring while it uploads.') };
