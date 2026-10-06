import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'file-upload', import.meta.url,
  import.meta.glob('./fixtures/file-upload/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/file-upload/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Advanced Inputs/FileUpload', id: 'core-fileupload', tags: ['autodocs'], ...catalogueMeta('file-upload'), parameters: { layout: 'padded', visualAudit: { wide: 'Drop zones span the width of their container.' } } };

export const DragDrop = {
  name: 'Drag and drop',
  ...pattern('drag-drop', 'A compact drop zone that previews up to three files with a count.'),
  play: catalogueInteractions['file-upload-drag-drop']
};
export const ProgressTable = {
  name: 'Upload table with progress',
  ...pattern('progress-table', 'Mixed files in a table with type badges, per-row progress rings, a failed upload to retry, and status counts.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spreadsheetRow = canvas.getByText('conclusion.xlsx').closest('tr');
    await expect(within(spreadsheetRow).getByText('Excel')).toBeVisible();
    await expect(within(spreadsheetRow).queryByText('Word')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /^Download/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry intro.zip' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Retry intro.zip' })).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove intro.zip' }));
    await expect(canvas.queryByText('intro.zip')).not.toBeInTheDocument();
  }
};
export const SortableGallery = { name: 'Image gallery with sorting', ...pattern('sortable-gallery', 'Images reorder by drag and open a zoomed preview. New files use the shared upload selection hook; progress is simulated locally.'), play: async (context) => {
  const canvas = within(context.canvasElement);
  const input = canvas.getByLabelText('Choose gallery images');
  const invalid = new DataTransfer();
  invalid.items.add(new File(['not an image'], 'notes.txt', { type: 'text/plain' }));
  await fireEvent.change(input, { target: { files: invalid.files } });
  await expect(canvas.getByRole('alert')).toHaveTextContent('not an accepted file type');
  const filename = 'long-gallery-image-with-an-explicit-prepared-description.svg';
  const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="blue"/></svg>'], filename, { type: 'image/svg+xml' });
  await userEvent.upload(input, file);
  await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: `Preview ${filename}` })).toBeInTheDocument();
  await waitFor(() => expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100'));
  if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
    const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
    await auditStoryLayout({ ...context, id: `${context.id}--uploaded` });
  }
  const preview = canvas.getByRole('button', { name: `Preview ${filename}` });
  preview.focus();
  await waitFor(() => expect(getComputedStyle(preview.parentElement).opacity).toBe('1'));
  await userEvent.click(preview);
  const dialog = await within(context.canvasElement.ownerDocument.body).findByRole('dialog');
  await expect(dialog).toHaveAccessibleName(filename);
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await userEvent.click(canvas.getByRole('button', { name: `Remove ${filename}` }));
  await expect(canvas.queryByRole('button', { name: `Preview ${filename}` })).not.toBeInTheDocument();
} };
export const Avatar = { name: 'Profile photo picker', ...pattern('avatar', 'Click or drop on the avatar, or use the button; the file name replaces the size hint once picked.') };
export const CoverImage = {
  name: 'Banner image for a page',
  ...pattern('cover-image', 'A wide cover with touch and keyboard actions. Progress is simulated: the first attempt fails and retry completes locally. Removing or replacing a file cancels its timer.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const change = canvas.getByRole('button', { name: 'Change Cover' });
    change.focus();
    await expect(change).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(change.parentElement.parentElement).opacity).toBe('1'));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Remove', exact: true })).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(change.parentElement.parentElement).opacity).toBe('1'));
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--keyboard-actions` });
    }
    const input = canvas.getByLabelText('Choose cover image');
    const png = new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jrWQAAAAASUVORK5CYII='), (char) => char.charCodeAt(0))], 'new-cover.png', { type: 'image/png' });
    await userEvent.upload(input, png);
    await expect(canvas.getByRole('progressbar', { name: 'Uploading new-cover.png' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove', exact: true }));
    await expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Browse Files' })).toBeVisible();
    await userEvent.upload(input, png);
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Simulated interruption'), { timeout: 2500 });
    await userEvent.click(canvas.getByRole('button', { name: 'Retry Upload' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Cover image ready locally.'), { timeout: 2500 });
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  }
};
