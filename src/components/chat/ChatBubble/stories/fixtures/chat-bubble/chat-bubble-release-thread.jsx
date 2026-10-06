import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
const turns = [
  {
    id: 't1',
    variant: 'secondary',
    align: 'start',
    text: 'Publishing the spring issue is queued behind two image jobs.'
  },
  {
    id: 't2',
    variant: 'default',
    align: 'end',
    text: 'Go ahead. I will keep an eye on the preview.'
  },
  {
    id: 't3',
    variant: 'muted',
    align: 'start',
    text: 'Image job 2 of 2 finished in 41s.'
  },
  // The destructive turn names the failure in its own words. A variant that
  // signals an error only by colour fails every reader who cannot see it.
  {
    id: 't4',
    variant: 'destructive',
    align: 'start',
    text: 'Step 5 failed. The search indexer did not come back after the restart.'
  },
  {
    id: 't5',
    variant: 'outline',
    align: 'start',
    text: 'search-index.ts returned 500 on post.published, 41 updates queued'
  },
  {
    id: 't6',
    variant: 'tinted',
    align: 'end',
    text: 'Restart the indexer and retry step 5.'
  },
  // ghost is the assistant rung: it drops the frame and the 80% cap, which is
  // why this turn is the only one reaching the full width of the row.
  {
    id: 't7',
    variant: 'ghost',
    align: 'start',
    text: 'The indexer came back and step 5 replayed all 41 queued updates without a second failure. I have left the retry window at 60 seconds so a slow rebuild cannot drop another post.'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-3'>
      {turns.map((turn) => (
        <ChatBubble key={turn.id} variant={turn.variant} align={turn.align}>
          {/* Nothing is set on ChatBubbleContent, so each style resolves its own
       radius, padding and font size. One stray text-sm here would pin
       all eight to it. */}
          <ChatBubbleContent>{turn.text}</ChatBubbleContent>
        </ChatBubble>
      ))}
    </div>
  );
}
