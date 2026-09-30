// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Bubble,
  BubbleContent
} from '../../../../src/components/core/Message/parts/bubble.jsx';
import {
  Message,
  MessageAvatar,
  MessageContent
} from '../../../../src/components/core/Message/parts/message.jsx';
const MICHAEL_AVATAR =
  'https://randomuser.me/api/portraits/men/11.jpg';
const SARAH_AVATAR =
  'https://randomuser.me/api/portraits/women/44.jpg';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Message>
        {/*
      MessageAvatar is a circular clip the size of the portrait, so a badge
      in its square corner loses half of itself. Badged rows opt out of it.
    */}
        <MessageAvatar className='overflow-visible'>
          <Avatar>
            <AvatarImage src={MICHAEL_AVATAR} alt='Michael Rodriguez' />
            <AvatarFallback>MR</AvatarFallback>
            {/*
      Presence would be colour-only without the label, so the dot keeps
      its own sr-only text.
    */}
            <AvatarBadge className='bg-green-500'>
              <span className='sr-only'>Online</span>
            </AvatarBadge>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>
              eu-west checkout is timing out. It started around 14:05.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align='end'>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src={SARAH_AVATAR} alt='Sarah Chen' />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              Looking now. Is it every request or one route?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar className='overflow-visible'>
          <Avatar>
            <AvatarImage src={MICHAEL_AVATAR} alt='Michael Rodriguez' />
            <AvatarFallback>MR</AvatarFallback>
            <AvatarBadge className='bg-green-500'>
              <span className='sr-only'>Online</span>
            </AvatarBadge>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>
              Only POST /api/checkout/confirm. p95 went from 240ms to 3.1s and
              the error rate is sitting at 4.2 percent. Every other route in the
              region is flat.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align='end'>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src={SARAH_AVATAR} alt='Sarah Chen' />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              Pulling the traces for that window now.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
