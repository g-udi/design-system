import { SchemaDisplay } from '@gaudi/design-system/core/SchemaDisplay';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageMarkdown } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageTool } from '@gaudi/design-system/chat/ChatTool';
import { ChatMessageCitation, ChatMessageSources } from '@gaudi/design-system/chat/ChatSources';

export const sources = [
  { title: 'Comment moderation that scales', url: 'https://example.com/guides/moderation', site: 'Community Handbook', quote: 'Holding a first comment for review stops most spam without slowing regulars down.' },
  { title: 'Designing REST APIs for content', url: 'https://docs.example.dev/rest/content', site: 'docs.example.dev', quote: 'Nest a resource under its parent when it never exists without it: /posts/{slug}/comments.' },
  { title: 'Comments API reference', url: 'https://example.com/api/comments', site: 'The blog API', kind: 'document', quote: 'POST returns the stored comment and the thread it joined, oldest first.' }
];

export const comment = {
  type: 'object',
  required: ['id', 'body', 'author'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    body: { type: 'string', description: 'Markdown, at most 2,000 characters.' },
    status: { type: 'string', enum: ['published', 'pending', 'hidden'], description: 'New readers start as pending.' },
    author: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, url: { type: 'string', format: 'uri' } } }
  }
};

export const endpoint = {
  method: 'POST',
  path: '/posts/{slug}/comments',
  description: 'Adds a comment to a published post.',
  parameters: [{ name: 'slug', in: 'path', type: 'string', description: 'The post slug.' }],
  requestBody: { type: 'object', required: ['body', 'author'], properties: { body: comment.properties.body, author: comment.properties.author } },
  responseBody: { type: 'object', required: ['comment'], properties: { comment, thread: { type: 'array', items: comment } } }
};

export function CitedAnswerExample() {
  return (
    <div className='grid w-full max-w-2xl gap-5'>
      <ChatMessage align='end'>
        <ChatMessageContent>
          <span className='sr-only'>You said</span>
          <ChatBubble align='end'><ChatBubbleContent>How should the comments API look, and is moderation worth it?</ChatBubbleContent></ChatBubble>
        </ChatMessageContent>
      </ChatMessage>
      <ChatMessage>
        <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative className='mt-0.5' />
        <ChatMessageContent className='min-w-0 flex-1'>
          <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
          <ChatMessageTool name='read_api_schema' description='POST /posts/{slug}/comments' status='done' duration='0.6s' input={{ endpoint: 'POST /posts/{slug}/comments' }} />
          <p className='m-0 text-sm leading-relaxed'>
            Nest comments under their post, since a comment never exists without one <ChatMessageCitation index={2} sources={[sources[1], sources[2]]} />. Hold a reader’s first comment for review and publish the rest straight away: it stops most spam without slowing regulars down <ChatMessageCitation index={1} source={sources[0]} />.
          </p>
          <SchemaDisplay {...endpoint} headingLevel={4} />
          <ChatMessageMarkdown sources={sources}>{'New comments come back with `status: pending` until they are approved [1], and the response includes the whole thread [3].'}</ChatMessageMarkdown>
          <ChatMessageSources sources={sources} />
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
}
