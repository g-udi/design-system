import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { Attachment } from '../index.js';
import { AttachmentQueue, controlled, states, statusOf, dismissLabel } from './fixtures/AttachmentQueueExample.jsx';
import queueSource from './fixtures/AttachmentQueueExample.jsx?raw';
import { dusk } from '../../../../docs/fixtures/site/artwork.js';

const copyableQueueSource = queueSource.replace(/^import \{ dusk \} from .*;$/m, `const dusk = ${JSON.stringify(dusk)};`);
const docs = getComponentDocs('Core/Attachment');
export default {
  title: 'Core/Messaging/Attachment',
  id: 'core-attachment',
  component: Attachment,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    state: Object.keys(states),
    size: ['default', 'sm', 'xs'],
    orientation: ['horizontal', 'vertical']
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { state: 'uploading', size: 'default', orientation: 'horizontal', onRemove: fn(), onRetry: fn() },
  parameters: {
    docs: {
      description: { story: 'An upload queue with a settled photo, a failed spreadsheet, and a report driven by the controls. Each state changes the media, status line, and actions: retry on failure, cancel while in flight, remove when settled. Retry and removal update this local example; Reset restores the queue.' },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('AttachmentQueue', args, { before: `${publicSource(copyableQueueSource, new URL('./fixtures/AttachmentQueueExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  render: (args) => <AttachmentQueue key={args.state} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const file = controlled;
    const attachment = canvas.getByText(file.name).closest('[data-slot="attachment"]');
    await expect(attachment).toHaveAttribute('data-state', args.state);
    await expect(attachment).toHaveAttribute('data-orientation', args.orientation);
    await expect(within(attachment).getByText(statusOf(file, args.state))).toBeVisible();
    if (args.state === 'error') {
      await userEvent.click(canvas.getByRole('button', { name: `Retry ${file.name}` }));
      await expect(args.onRetry).toHaveBeenCalledWith(file.name);
    }
    await userEvent.click(canvas.getByRole('button', { name: dismissLabel(file, args.state === 'error' ? 'done' : args.state) }));
    await expect(args.onRemove).toHaveBeenCalledWith(file.name);
    await expect(canvas.queryByText(file.name)).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
    await expect(canvas.getByText(file.name)).toBeVisible();
  }
};
