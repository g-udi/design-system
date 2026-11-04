'use client';
import { ChatCitedAnswer } from '@gaudi/design-system/chat/ChatSources';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';

const sources = [
  {
    id: 'reader-notes', title: 'What readers asked for in the September issue', site: 'Reader interviews',
    kind: 'document', date: '28 September 2026', url: 'https://example.com/editorial/reader-notes',
    quote: 'Readers wanted the practical example before the background. Several said they saved the issue to return to the checklist, rather than reading it in one sitting.',
    highlights: ['the practical example before the background', 'return to the checklist']
  },
  {
    id: 'style-guide', title: 'Writing an opening that earns the next paragraph', site: 'Editorial handbook',
    kind: 'document', date: '2 October 2026', url: 'https://example.com/editorial/style-guide',
    quote: 'Lead with the decision a reader needs to make. Give one concrete example, then explain the trade-off. Keep the checklist near the conclusion so it is easy to find again.',
    highlights: ['one concrete example', 'Keep the checklist near the conclusion']
  },
  {
    id: 'issue-review', title: 'September issue: editorial review', site: 'Issue review', kind: 'document', date: '4 October 2026',
    quote: 'We have feedback from eight interviews, not a controlled comparison. Treat the new opening as an editorial experiment; the available evidence does not establish that it will improve completion.',
    highlights: ['not a controlled comparison', 'does not establish that it will improve completion']
  }
];
const segments = [
  { id: 'recommendation', text: 'Open the next issue with a practical example, then explain the background. ', sourceIds: ['reader-notes', 'style-guide'] },
  { id: 'checklist', text: 'Keep the checklist near the end so returning readers can find it quickly. ', sourceIds: ['reader-notes', 'style-guide'] },
  { id: 'limit', paragraph: true, text: 'Treat this as an editorial experiment, not a proven way to improve completion. The feedback comes from interviews, not a controlled comparison. ', sourceIds: ['issue-review'] },
  { id: 'next', paragraph: true, text: 'For the next draft: lead with one worked example, keep the supporting context, and give the checklist a clear heading.' }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-5'>
      <h2 className='m-0 text-lg font-semibold'>How should we open the next issue?</h2>
      <ChatMessage>
        <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative className='mt-0.5' />
        <ChatMessageContent className='min-w-0 flex-1'>
          <ChatMessageHeader className='px-0'>Gaudi · 3 sources</ChatMessageHeader>
          <ChatCitedAnswer segments={segments} sources={sources} />
        </ChatMessageContent>
      </ChatMessage>
      <p className='text-text-muted m-0 text-xs leading-relaxed'>Illustrative answer and source passages. No pages were fetched; links use example.com.</p>
    </div>
  );
}
