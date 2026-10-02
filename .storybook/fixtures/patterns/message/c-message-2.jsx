import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '../../../../src/components/core/Attachment/parts/attachment.jsx';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from '../../../../src/components/chat/Message/parts/message.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// An incident thread between two people: align picks the side, avatars flip
// with the row, a run of messages shares one avatar in a MessageGroup, headers
// carry identity, footers carry status, and files stack with the bubble.
const MICHAEL = { name: 'Michael Rodriguez', initials: 'MR', src: 'https://randomuser.me/api/portraits/men/11.jpg' };
const SARAH = { name: 'Sarah Chen', initials: 'SC', src: 'https://randomuser.me/api/portraits/women/44.jpg' };

function Dot() {
  return <span aria-hidden='true' className='bg-ui-muted-foreground/40 size-1 shrink-0 rounded-full' />;
}

function Portrait({ person, online }) {
  return (
    // MessageAvatar clips to a circle, so a row with a presence badge opts out of the clip.
    <MessageAvatar className={online ? 'overflow-visible' : undefined}>
      <Avatar>
        <AvatarImage src={person.src} alt={person.name} />
        <AvatarFallback>{person.initials}</AvatarFallback>
        {online ? (
          // Presence would be colour-only without the label.
          <AvatarBadge className='bg-success'>
            <span className='sr-only'>Online</span>
          </AvatarBadge>
        ) : null}
      </Avatar>
    </MessageAvatar>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      {/* The gap inside a run belongs to MessageGroup, the gap between runs to this column. */}
      <MessageGroup>
        <Message>
          {/* An empty MessageAvatar keeps the column aligned; only the last row of a run shows the portrait. */}
          <MessageAvatar />
          <MessageContent>
            {/* A header built from several nodes supplies its own gap. */}
            <MessageHeader className='gap-1.5'>
              {MICHAEL.name}
              <Dot />
              <span className='tabular-nums'>14:06</span>
            </MessageHeader>
            <Bubble variant='muted'>
              <BubbleContent>eu-west checkout is timing out. It started around 14:05.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <Portrait person={MICHAEL} online />
          <MessageContent>
            <Bubble variant='muted'>
              <BubbleContent>Only POST /api/checkout/confirm. p95 went from 240ms to 3.1s.</BubbleContent>
            </Bubble>
            <Attachment>
              <AttachmentMedia>
                <RegistryIcon lucide='FileSpreadsheetIcon' aria-hidden='true' />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>latency-14h.csv</AttachmentTitle>
                <AttachmentDescription>CSV, 184 KB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                {/* The label names the file, so a thread of download buttons stays distinguishable. */}
                <AttachmentAction type='button' variant='secondary' size='icon-sm' aria-label='Download latency-14h.csv' title='Download'>
                  <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </MessageContent>
        </Message>
      </MessageGroup>

      {/* Side alone is lost when a thread is read aloud, so the bubble variant carries it too. */}
      <Message align='end'>
        <Portrait person={SARAH} />
        <MessageContent>
          {/* The tile is 120px wide by default; a plain utility widens it. */}
          <Attachment orientation='vertical' className='w-full max-w-56'>
            <AttachmentMedia variant='image'>
              <img src='static/images/art/0.svg' alt='Trace waterfall for the slow confirm call' width={448} height={448} loading='lazy' decoding='async' />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>trace-waterfall.png</AttachmentTitle>
              <AttachmentDescription>PNG, 212 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Bubble>
            <BubbleContent>Every slow request goes through the tax service. Rolling its client back.</BubbleContent>
          </Bubble>
          <MessageFooter>Read 14:09</MessageFooter>
        </MessageContent>
      </Message>

      <Message>
        <Portrait person={MICHAEL} online />
        <MessageContent>
          <MessageHeader className='gap-1.5'>
            {MICHAEL.name}
            <Dot />
            <span className='tabular-nums'>14:12</span>
          </MessageHeader>
          <Bubble variant='muted'>
            <BubbleContent>p95 is back to 260ms. I will write up the retry loop.</BubbleContent>
          </Bubble>
          <MessageFooter className='gap-1.5'>
            <span>Edited</span>
            <Dot />
            <span className='tabular-nums'>14:13</span>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
