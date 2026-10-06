import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { attachmentExamples } from '../../../../docs/fixtures/attachments.js';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { previewSource } from '../../../../docs/components/previewSource';
import { MediaExamples, selectionLabel } from './fixtures/AttachmentMediaExamples.jsx';
import mediaSource from './fixtures/AttachmentMediaExamples.jsx?raw';

const copyableMediaSource = mediaSource.replace(/^import \{ attachmentExamples \} from .*;$/m, `const attachmentExamples = ${JSON.stringify(attachmentExamples, null, 2)};`);

const source = (layout) => previewSource('MediaExamples', { layout }, { before: `${publicSource(copyableMediaSource, new URL('./fixtures/AttachmentMediaExamples.jsx', import.meta.url))}\n\n` });

const removeAndReset = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const cover = attachmentExamples[0];
  await userEvent.click(canvas.getByRole('button', { name: selectionLabel(cover) }));
  await expect(args.onSelect).toHaveBeenLastCalledWith(cover);
  await expect(within(canvas.getByRole('region', { name: 'Selected attachment' })).getByRole('img')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: `Remove ${cover.name}` }));
  await expect(args.onRemove).toHaveBeenLastCalledWith(cover.id);
  await expect(canvas.queryByRole('button', { name: selectionLabel(cover) })).not.toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: 'Reset attachments' })).toHaveFocus();
  await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
  await expect(canvas.getByRole('button', { name: selectionLabel(cover) })).toBeVisible();
};

export default {
  title: 'Core/Messaging/Attachment',
  id: 'core-attachment',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const MixedMedia = {
  name: 'Mixed media · detailed rows',
  args: { onSelect: fn(), onRemove: fn() },
  parameters: { docs: { description: { story: 'Images, PDF, audio, video, a supplied video poster, a website link, code and a spreadsheet reuse the same Attachment parts. File metadata chooses the icon; supplied previewUrl creates a thumbnail. Only local images have previews here; selecting other entries shows their sample metadata. Removal and Reset update the list.' }, source: { language: 'jsx', code: source('rows') } } },
  render: (args) => <MediaExamples layout='rows' {...args} />,
  play: async (context) => {
    await removeAndReset(context);
    const canvas = within(context.canvasElement);
    const audio = attachmentExamples.find((file) => file.id === 'audio');
    await userEvent.click(canvas.getByRole('button', { name: selectionLabel(audio) }));
    await expect(context.args.onSelect).toHaveBeenLastCalledWith(audio);
    await expect(canvas.getByRole('region', { name: 'Selected attachment' })).toHaveTextContent('Sample metadata only.');
    await expect(context.canvasElement.querySelector('audio, video')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
    // Simulate a failed local preview without fetching a deliberately broken URL.
    const cover = canvas.getByText(attachmentExamples[0].name).closest('[data-slot="attachment"]');
    const media = cover.querySelector('[data-slot="attachment-media"]');
    await expect(media).toHaveAttribute('data-variant', 'image');
    await fireEvent.error(media.querySelector('img'));
    await waitFor(() => expect(media).toHaveAttribute('data-variant', 'icon'));
    await expect(media.querySelector('img')).toBeNull();
    await expect(media.querySelector('svg')).toBeInTheDocument();
    await expect(within(cover).getByText(attachmentExamples[0].name)).toBeVisible();
    await userEvent.click(within(cover).getByRole('button', { name: `Remove ${attachmentExamples[0].name}` }));
    await expect(context.args.onRemove).toHaveBeenLastCalledWith(attachmentExamples[0].id);
    await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
  }
};

export const CompactPills = {
  name: 'Mixed media · wrapping pills',
  args: { onSelect: fn(), onRemove: fn() },
  parameters: { docs: { description: { story: 'The xs size creates compact inline attachments. A flex-wrapped list keeps every item and remove action inside narrow composer or message widths. Full names remain in the trigger label and title; selecting an image reveals its local preview.' }, source: { language: 'jsx', code: source('pills') } } },
  render: (args) => <MediaExamples layout='pills' {...args} />,
  play: removeAndReset
};

export const ImageGrid = {
  name: 'Images · thumbnail grid',
  args: { onSelect: fn(), onRemove: fn() },
  parameters: { docs: { description: { story: 'Vertical Attachment tiles form a two-column image grid, expanding to three columns at sm. The full-card trigger selects the local preview; its sibling remove action remains independently focusable.' }, source: { language: 'jsx', code: source('grid') } } },
  render: (args) => <MediaExamples layout='grid' {...args} />,
  play: removeAndReset
};
