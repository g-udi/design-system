import { MessageExample, reply } from './fixtures/MessageExample.jsx';
import MessageExampleSource from './fixtures/MessageExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { ChatMessage } from '../index.js';

const docs = getComponentDocs('Chat/ChatMessage');

export default {
  title: 'Chat/ChatMessage',
  id: 'chat-message',
  component: ChatMessage,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    align: ['start', 'end'],
    variant: ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive']
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
  args: { align: 'end', variant: 'default' },
  parameters: {
    docs: {
      description: { story: 'A short review thread: two messages from Sarah share one avatar in a ChatMessageGroup, and the last reply follows the controls. `align` moves it to either side and `variant` changes its bubble surface.' },
      source: playgroundSource('MessageExample', { imports: publicSource(MessageExampleSource, new URL('./fixtures/MessageExample.jsx', import.meta.url)) })
    }
  },
  render: (args) => <MessageExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const bubble = within(canvasElement).getByText(reply).closest('[data-slot="bubble"]');
    await expect(bubble).toHaveAttribute('data-variant', args.variant);
    await expect(bubble.closest('[data-slot="message"]')).toHaveAttribute('data-align', args.align);
    await expect(within(canvasElement).getByLabelText('2 thumbs up reactions')).toBeVisible();
  }
};
