// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Bubble,
  BubbleContent
} from '../../../../src/components/core/Message/parts/bubble.jsx';
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader
} from '../../../../src/components/core/Message/parts/message.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Message>
        <MessageContent>
          {/*
      The primitive ships no gap, so a header built from more than one
      node supplies its own. The separator is a decorative dot rather than a
      typographic interpunct, and aria-hidden so the row is announced as
      "Emma Wilson 09:38".
    */}
          <MessageHeader className='gap-1.5'>
            Emma Wilson
            <span
              aria-hidden='true'
              className='bg-ui-muted-foreground/40 size-1 shrink-0 rounded-full'
            />
            <span className='tabular-nums'>09:38</span>
          </MessageHeader>
          <Bubble variant='muted'>
            <BubbleContent>
              The invoice template is missing the VAT line on EU orders.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align='end'>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              Fixed on the 4.2 branch. It ships with tonight&apos;s release.
            </BubbleContent>
          </Bubble>
          <MessageFooter>Read 09:41</MessageFooter>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          <MessageHeader className='gap-1.5'>
            Emma Wilson
            <span
              aria-hidden='true'
              className='bg-ui-muted-foreground/40 size-1 shrink-0 rounded-full'
            />
            <span className='tabular-nums'>09:42</span>
          </MessageHeader>
          <Bubble variant='muted'>
            <BubbleContent>
              Then I will re-run the January batch once it is out.
            </BubbleContent>
          </Bubble>
          <MessageFooter className='gap-1.5'>
            <span>Edited</span>
            <span
              aria-hidden='true'
              className='bg-ui-muted-foreground/40 size-1 shrink-0 rounded-full'
            />
            <span className='tabular-nums'>09:44</span>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
