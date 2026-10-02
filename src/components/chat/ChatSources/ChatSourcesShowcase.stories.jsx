import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { SchemaDisplay } from '../../core/SchemaDisplay/index.js';
import { AgentMark } from '../AgentMark/index.js';
import { Bubble, BubbleContent } from '../Bubble/index.js';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { MessageMarkdown } from '../MessageList/index.js';
import { MessageTool } from '../ChatTool/index.js';
import { MessageCitation, MessageSources } from './index.js';

/* A combined example: an answer with grouped inline citations beside a SchemaDisplay tool result. */

export default {
  title: 'Chat/ChatSources',
  id: 'chat-chatsources',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const sources = [
  { title: 'Comment moderation that scales', url: 'https://example.com/guides/moderation', site: 'Community Handbook', quote: 'Holding a first comment for review stops most spam without slowing regulars down.' },
  { title: 'Designing REST APIs for content', url: 'https://docs.example.dev/rest/content', site: 'docs.example.dev', quote: 'Nest a resource under its parent when it never exists without it: /posts/{slug}/comments.' },
  { title: 'Comments API reference', url: 'https://example.com/api/comments', site: 'The blog API', kind: 'document', quote: 'POST returns the stored comment and the thread it joined, oldest first.' }
];

const comment = {
  type: 'object',
  required: ['id', 'body', 'author'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    body: { type: 'string', description: 'Markdown, at most 2,000 characters.' },
    status: { type: 'string', enum: ['published', 'pending', 'hidden'], description: 'New readers start as pending.' },
    author: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, url: { type: 'string', format: 'uri' } } }
  }
};

const endpoint = {
  method: 'POST',
  path: '/posts/{slug}/comments',
  description: 'Adds a comment to a published post.',
  parameters: [{ name: 'slug', in: 'path', type: 'string', description: 'The post slug.' }],
  requestBody: { type: 'object', required: ['body', 'author'], properties: { body: comment.properties.body, author: comment.properties.author } },
  responseBody: { type: 'object', required: ['comment'], properties: { comment, thread: { type: 'array', items: comment } } }
};

function CitedAnswerExample() {
  return (
    <div className='grid w-full max-w-2xl gap-5'>
      <Message align='end'>
        <MessageContent>
          <span className='sr-only'>You said</span>
          <Bubble align='end'><BubbleContent>How should the comments API look, and is moderation worth it?</BubbleContent></Bubble>
        </MessageContent>
      </Message>
      <Message>
        <AgentMark size='sm' decorative className='mt-0.5' />
        <MessageContent className='min-w-0 flex-1'>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <MessageTool name='read_api_schema' description='POST /posts/{slug}/comments' status='done' duration='0.6s' input={{ endpoint: 'POST /posts/{slug}/comments' }} />
          <p className='m-0 text-sm leading-relaxed'>
            Nest comments under their post, since a comment never exists without one <MessageCitation index={2} sources={[sources[1], sources[2]]} />. Hold a reader’s first comment for review and publish the rest straight away: it stops most spam without slowing regulars down <MessageCitation index={1} source={sources[0]} />.
          </p>
          <SchemaDisplay {...endpoint} headingLevel={4} />
          <MessageMarkdown sources={sources}>{'New comments come back with `status: pending` until they are approved [1], and the response includes the whole thread [3].'}</MessageMarkdown>
          <MessageSources sources={sources} />
        </MessageContent>
      </Message>
    </div>
  );
}

export const CitedAnswer = {
  name: 'Cited answer',
  parameters: {
    docs: {
      description: {
        story:
          'An answer that shows where it came from. Inline MessageCitation pills open a card with the source’s favicon, title, site and quote: on hover for a mouse, and on click, tap or Enter. Pill 2 groups two sources, so its card pages through them in a carousel (arrow keys, buttons or swipe). The tool result is a SchemaDisplay (Core) for the endpoint the assistant read. In MessageMarkdown, `[1]` and `[1, 3]` become the same pills. Accessibility: each pill is a button named “Source n: title”; hover never takes focus, a press moves focus into the card and Escape returns it; the carousel announces “2 of 2”.'
      },
      source: {
        language: 'jsx',
        code: `import { SchemaDisplay } from '@gaudi/design-system';
import { MessageCitation, MessageMarkdown, MessageSources, MessageTool } from '@gaudi/design-system/chat';

<MessageTool name='read_api_schema' status='done' input={{ endpoint: 'POST /posts/{slug}/comments' }} />
<p>
  Nest comments under their post <MessageCitation index={2} sources={[sources[1], sources[2]]} />.
  Hold a reader’s first comment for review <MessageCitation index={1} source={sources[0]} />.
</p>
<SchemaDisplay method='POST' path='/posts/{slug}/comments' parameters={parameters} requestBody={request} responseBody={response} headingLevel={4} />
<MessageMarkdown sources={sources}>{'New comments start as pending [1], and the response includes the thread [3].'}</MessageMarkdown>
<MessageSources sources={sources} />`
      }
    }
  },
  render: () => <CitedAnswerExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await step('a grouped citation pages through its sources', async () => {
      const grouped = canvas.getByRole('button', { name: 'Source 2: Designing REST APIs for content, and 1 more' });
      await userEvent.click(grouped);
      const card = await page.findByRole('dialog');
      await waitFor(() => expect(within(card).getByText('1 of 2')).toBeVisible());
      await userEvent.click(within(card).getByRole('button', { name: 'Next source' }));
      await waitFor(() => expect(within(card).getByText('2 of 2')).toBeVisible());
      await expect(within(card).getByRole('button', { name: 'Next source' })).toBeDisabled();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expect(grouped).toHaveFocus();
    });

    await step('hovering a citation opens its card without taking focus', async () => {
      const single = canvas.getAllByRole('button', { name: 'Source 1: Comment moderation that scales' })[0];
      await userEvent.hover(single);
      const card = await page.findByRole('dialog');
      await expect(within(card).getByText(/Holding a first comment for review/)).toBeVisible();
      await expect(card).not.toContainElement(canvasElement.ownerDocument.activeElement);
      await userEvent.unhover(single);
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    });

    await step('the schema opens nested objects', async () => {
      const schema = canvasElement.querySelector('[data-slot="schema-display"]');
      await expect(within(schema).getByRole('heading', { name: 'Response' })).toBeVisible();
      const thread = within(schema).getByRole('button', { name: /thread/ });
      await userEvent.click(thread);
      await waitFor(() => expect(thread).toHaveAttribute('aria-expanded', 'false'));
    });
  }
};
