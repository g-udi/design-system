import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from './index.js';

const docs = getComponentDocs('Core/Attachment');
const file = { name: 'quarterly-report.pdf', size: '2.4 MB' };
const remove = `Remove ${file.name}`;

export default {
  title: 'Core/Attachment',
  id: 'core-attachment',
  component: Attachment,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    state: ['idle', 'uploading', 'processing', 'done', 'error'],
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
  args: { state: 'done', size: 'default', orientation: 'horizontal', onRemove: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Attachment', {
        imports: "import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        children: [
          "  <AttachmentMedia><RegistryIcon lucide='FileTextIcon' aria-hidden='true' /></AttachmentMedia>",
          '  <AttachmentContent>',
          `    <AttachmentTitle>${file.name}</AttachmentTitle>`,
          `    <AttachmentDescription>${file.size}</AttachmentDescription>`,
          '  </AttachmentContent>',
          '  <AttachmentActions>',
          `    <AttachmentAction aria-label='${remove}' onClick={onRemove}>`,
          "      <RegistryIcon lucide='XIcon' aria-hidden='true' />",
          '    </AttachmentAction>',
          '  </AttachmentActions>'
        ].join('\n')
      })
    }
  },
  render: ({ onRemove, ...args }) => (
    <Attachment {...args}>
      <AttachmentMedia><RegistryIcon lucide='FileTextIcon' aria-hidden='true' /></AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{file.size}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label={remove} onClick={onRemove}>
          <RegistryIcon lucide='XIcon' aria-hidden='true' />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const attachment = canvas.getByText(file.name).closest('[data-slot="attachment"]');
    await expect(attachment).toHaveAttribute('data-state', args.state);
    await expect(attachment).toHaveAttribute('data-orientation', args.orientation);
    await userEvent.click(canvas.getByRole('button', { name: remove }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  }
};
