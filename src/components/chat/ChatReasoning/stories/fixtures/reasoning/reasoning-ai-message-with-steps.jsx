'use client';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageMarkdown } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageReasoning, ChatMessageReasoningImage, ChatMessageReasoningResults, ChatMessageReasoningStep } from '@gaudi/design-system/chat/ChatReasoning';

const cover = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1e3a5f'/><stop offset='1' stop-color='#f59e0b'/></linearGradient></defs><rect width='320' height='180' fill='url(#g)'/><rect x='40' y='40' width='240' height='100' rx='4' fill='none' stroke='#fff' stroke-opacity='.6' stroke-width='3'/><line x1='160' y1='40' x2='160' y2='140' stroke='#fff' stroke-opacity='.6' stroke-width='3'/></svg>")}`;

function UserTurn({ children }) {
  return (
    <ChatMessage align='end'>
      <ChatMessageContent>
        <span className='sr-only'>You said</span>
        <ChatBubble align='end'><ChatBubbleContent>{children}</ChatBubbleContent></ChatBubble>
      </ChatMessageContent>
    </ChatMessage>
  );
}

function AssistantTurn({ children }) {
  return (
    <ChatMessage>
      <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative className='mt-0.5' />
      <ChatMessageContent className='min-w-0 flex-1'>
        <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
        {children}
      </ChatMessageContent>
    </ChatMessage>
  );
}

export function Pattern() {
  return (
    <div className='ds-touch-controls grid w-full max-w-2xl gap-5'>
      <UserTurn>Which of my posts should I update first?</UserTurn>
      <AssistantTurn>
        <ChatMessageReasoning variant='steps' label='Worked through 4 steps'>
          <ChatMessageReasoningStep status='done' icon='Search' label='Searched your archive' meta='42 posts'>
            <ChatMessageReasoningResults max={3} results={[{ title: 'Local-first drafts', url: 'https://example.com/posts/local-first-drafts', site: 'The blog' }, { title: 'Writing on the train', url: 'https://example.com/posts/writing-on-the-train', site: 'The blog' }, { title: 'A year of drafts', url: 'https://example.com/posts/a-year-of-drafts', site: 'The blog' }, { title: 'Offline first', url: 'https://example.com/posts/offline-first', site: 'The blog' }]} />
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='done' icon='BookOpen' label='Read 3 sources' meta='2 min'>
            <p className='m-0'>Analytics for the last 90 days, the comment threads, and the newsletter replies.</p>
            <ChatMessageReasoningImage src={cover} alt='Reading-time chart: Local-first drafts holds readers longest' caption='Reading time, last 90 days' />
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='done' icon='ChartLine' label='Analysed traffic and replies' description='Local-first drafts gets the most search traffic and the most open questions.' />
          <ChatMessageReasoningStep status='done' icon='SquarePen' label='Wrote the answer' />
        </ChatMessageReasoning>
        <ChatMessageMarkdown>{'Update **Local-first drafts** first. It brings in the most search traffic, and six readers asked for an example repo. Add the repo link and a short section on the sync fix.'}</ChatMessageMarkdown>
      </AssistantTurn>
      <UserTurn>Draft the update.</UserTurn>
      <AssistantTurn>
        <ChatMessageReasoning variant='steps' streaming>
          <ChatMessageReasoningStep status='done' icon='BookOpen' label='Read the post' meta='1,840 words' />
          <ChatMessageReasoningStep status='running' icon='SquarePen' label='Drafting the new section…'>
            <p className='m-0'>The sync fix, in three short paragraphs, after “Where drafts live”.</p>
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='pending' icon='Check' label='Check links and headings' />
        </ChatMessageReasoning>
      </AssistantTurn>
    </div>
  );
}
