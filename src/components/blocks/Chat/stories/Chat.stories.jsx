import { previewSource } from '../../../../docs/components/previewSource.js';
import { ChatPlayground } from './fixtures/ChatPlayground.jsx';
import ChatPlaygroundSource from './fixtures/ChatPlayground.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { ChatShell } from '../index.js';

const docs = getComponentDocs('Blocks/Chat');

const source = (args) => previewSource('ChatPlayground', args, { imports: publicSource(ChatPlaygroundSource, new URL('./fixtures/ChatPlayground.jsx', import.meta.url)) });

export default {
  title: 'Blocks/Chat',
  id: 'blocks-chat',
  component: ChatShell,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['page', 'sidebar'],
    title: 'text',
    navigation: 'boolean',
    details: 'boolean',
    welcome: 'boolean',
    streaming: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { variant: 'page', title: 'Local-first drafts post', navigation: true, details: true, welcome: false, streaming: false },
  parameters: {
    docs: {
      description: { story: 'The chat frame: `variant` page lays out navigation, thread and details side by side (they move into Sheets on narrow screens), sidebar is a narrow assistant panel. `navigation` and `details` fill the side columns, `welcome` shows the empty state of a new chat and `streaming` swaps send for stop and queue.' },
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => source(args) }
    }
  },
  render: (args) => <ChatPlayground key={String(args.welcome)} {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Add a closing line{Enter}');
    await waitFor(() => expect(canvas.getByText('Add a closing line')).toBeVisible());
    if (args.streaming) {
      await userEvent.click(canvas.getByRole('button', { name: 'Stop reply' }));
      await waitFor(() => expect(prompt).toHaveFocus());
      await expect(canvas.queryByRole('button', { name: 'Stop reply' })).not.toBeInTheDocument();
    }
    if (args.variant === 'page' && import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { page } = await import('vitest/browser');
      const body = within(canvasElement.ownerDocument.body);
      const original = { width: window.innerWidth, height: window.innerHeight };
      try {
        for (const { enabled, width, button, panel } of [
          { enabled: args.navigation, width: 768, button: 'Open chats', panel: 'Chats and files' },
          { enabled: args.details, width: 1280, button: 'Open details', panel: 'Details' }
        ]) {
          if (!enabled) continue;
          await page.viewport(width - 1, original.height);
          await userEvent.click(canvas.getByRole('button', { name: button }));
          await waitFor(() => {
            const sheet = body.getByRole('dialog', { name: panel });
            expect(sheet).toBeVisible();
            expect(getComputedStyle(sheet).opacity).toBe('1');
            expect(sheet.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
          });
          await page.viewport(width, original.height);
          await waitFor(() => expect(body.queryByRole('dialog', { name: panel })).not.toBeInTheDocument());
          await waitFor(() => expect(canvas.getByRole('complementary', { name: panel }).contains(canvasElement.ownerDocument.activeElement)).toBe(true));
        }
      } finally {
        await page.viewport(original.width, original.height);
      }
    }
  }
};
