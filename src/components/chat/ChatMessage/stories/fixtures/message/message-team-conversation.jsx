import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '@gaudi/design-system/core/Attachment';
import {
  AvatarRoot as Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageFooter, ChatMessageGroup, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// An incident thread between two people: align picks the side, avatars flip
// with the row, a run of messages shares one avatar in a ChatMessageGroup, headers
// carry identity, footers carry status, and files stack with the bubble.
const MICHAEL = { name: 'Rafe Okonkwo', initials: 'RO', src: '/avatars/person-31.svg' };
const SARAH = { name: 'Sabine Okafor', initials: 'SO', src: '/avatars/person-20.svg' };

function Dot() {
  return <span aria-hidden='true' className='bg-ui-muted-foreground/40 size-1 shrink-0 rounded-full' />;
}

function Portrait({ person, online }) {
  return (
    // ChatMessageAvatar clips to a circle, so a row with a presence badge opts out of the clip.
    <ChatMessageAvatar className={online ? 'overflow-visible' : undefined}>
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
    </ChatMessageAvatar>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      {/* The gap inside a run belongs to ChatMessageGroup, the gap between runs to this column. */}
      <ChatMessageGroup>
        <ChatMessage>
          {/* An empty ChatMessageAvatar keeps the column aligned; only the last row of a run shows the portrait. */}
          <ChatMessageAvatar />
          <ChatMessageContent>
            {/* A header built from several nodes supplies its own gap. */}
            <ChatMessageHeader className='gap-1.5'>
              {MICHAEL.name}
              <Dot />
              <span className='tabular-nums'>14:06</span>
            </ChatMessageHeader>
            <ChatBubble variant='muted'>
              <ChatBubbleContent>eu-west checkout is timing out. It started around 14:05.</ChatBubbleContent>
            </ChatBubble>
          </ChatMessageContent>
        </ChatMessage>
        <ChatMessage>
          <Portrait person={MICHAEL} online />
          <ChatMessageContent>
            <ChatBubble variant='muted'>
              <ChatBubbleContent>Only POST /api/checkout/confirm. p95 went from 240ms to 3.1s.</ChatBubbleContent>
            </ChatBubble>
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
          </ChatMessageContent>
        </ChatMessage>
      </ChatMessageGroup>

      {/* Side alone is lost when a thread is read aloud, so the bubble variant carries it too. */}
      <ChatMessage align='end'>
        <Portrait person={SARAH} />
        <ChatMessageContent>
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
          <ChatBubble>
            <ChatBubbleContent>Every slow request goes through the tax service. Rolling its client back.</ChatBubbleContent>
          </ChatBubble>
          <ChatMessageFooter>Read 14:09</ChatMessageFooter>
        </ChatMessageContent>
      </ChatMessage>

      <ChatMessage>
        <Portrait person={MICHAEL} online />
        <ChatMessageContent>
          <ChatMessageHeader className='gap-1.5'>
            {MICHAEL.name}
            <Dot />
            <span className='tabular-nums'>14:12</span>
          </ChatMessageHeader>
          <ChatBubble variant='muted'>
            <ChatBubbleContent>p95 is back to 260ms. I will write up the retry loop.</ChatBubbleContent>
          </ChatBubble>
          <ChatMessageFooter className='gap-1.5'>
            <span>Edited</span>
            <Dot />
            <span className='tabular-nums'>14:13</span>
          </ChatMessageFooter>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
}
