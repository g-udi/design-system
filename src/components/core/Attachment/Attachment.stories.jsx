import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { SpinnerRoot } from '../Spinner';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from './index.js';
import { dusk } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('Core/Attachment');
// A realistic queue: the report follows the `state` control; its neighbours stay settled and failed.
const files = [
  { name: 'cover-photo.jpg', size: '1.8 MB', image: dusk, state: 'done' },
  { name: 'quarterly-report.pdf', size: '2.4 MB', icon: 'FileTextIcon' },
  { name: 'subscribers.csv', size: '640 KB', icon: 'SheetIcon', state: 'error' }
];
const [, controlled] = files;
// What each state shows: the media, the status line, and whether the upload is still in flight.
const states = {
  idle: { icon: 'ClockIcon', status: 'Ready to upload' },
  uploading: { spinner: true, status: 'Uploading · 62%', inFlight: true },
  processing: { icon: 'ScanSearchIcon', status: 'Scanning for sensitive data', inFlight: true },
  done: {},
  error: { icon: 'TriangleAlertIcon', status: 'Failed · connection dropped' }
};
const statusOf = (file, state) => states[state].status || file.size;
const dismissLabel = (file, state) => `${states[state].inFlight ? 'Cancel upload of' : 'Remove'} ${file.name}`;

function FileAttachment({ file, state, onRemove, onRetry, ...props }) {
  const { spinner, icon = file.icon } = states[state];
  return (
    <Attachment state={state} {...props}>
      {file.image && state === 'done' ? (
        <AttachmentMedia variant='image'><img src={file.image} alt='' /></AttachmentMedia>
      ) : (
        <AttachmentMedia>{spinner ? <SpinnerRoot /> : <RegistryIcon lucide={icon} aria-hidden='true' />}</AttachmentMedia>
      )}
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{statusOf(file, state)}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {state === 'error' ? (
          <AttachmentAction aria-label={`Retry ${file.name}`} onClick={() => onRetry(file.name)}>
            <RegistryIcon lucide='RotateCwIcon' aria-hidden='true' />
          </AttachmentAction>
        ) : null}
        <AttachmentAction aria-label={dismissLabel(file, state)} onClick={() => onRemove(file.name)}>
          <RegistryIcon lucide='XIcon' aria-hidden='true' />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

export default {
  title: 'Core/Attachment',
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
      description: { story: 'An upload queue with a settled photo, a failed spreadsheet, and a report driven by the controls. Each state changes the media, status line, and actions: retry on failure, cancel while in flight, remove when settled.' },
      source: playgroundSource('Attachment', {
        imports: "import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        attributes: ['key={file.name}'],
        before: '{files.map((file) => (\n',
        after: '\n))}',
        children: [
          "  <AttachmentMedia><RegistryIcon lucide={file.icon} aria-hidden='true' /></AttachmentMedia>",
          '  <AttachmentContent>',
          '    <AttachmentTitle>{file.name}</AttachmentTitle>',
          '    <AttachmentDescription>{file.status}</AttachmentDescription>',
          '  </AttachmentContent>',
          '  <AttachmentActions>',
          '    <AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => onRemove(file)}>',
          "      <RegistryIcon lucide='XIcon' aria-hidden='true' />",
          '    </AttachmentAction>',
          '  </AttachmentActions>'
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'flex flex-wrap justify-center gap-2' : 'mx-auto grid max-w-md gap-2'}>
      {files.map((file) => <FileAttachment key={file.name} file={file} {...args} state={file.state || args.state} className={args.orientation === 'vertical' ? undefined : 'w-full'} />)}
    </div>
  ),
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
    await userEvent.click(canvas.getByRole('button', { name: dismissLabel(file, args.state) }));
    await expect(args.onRemove).toHaveBeenCalledWith(file.name);
  }
};
