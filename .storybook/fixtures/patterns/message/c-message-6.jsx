import {
  Avatar,
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
  MessageContent,
  MessageGroup,
  MessageHeader
} from '../../../../src/components/core/Message/parts/message.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      {/*
      The gap inside a run belongs to MessageGroup and the gap between runs
      to this column, so the two can differ per style with nothing hardcoded.
    */}
      <MessageGroup>
        <Message>
          <MessageAvatar />
          <MessageContent>
            {/*
      Only the first row of a run carries a name. The rest inherit it,
      which is the whole reason to group them.
    */}
            <MessageHeader>Alex Johnson</MessageHeader>
            <Bubble variant='muted'>
              <BubbleContent>
                I pulled the eu-west traces for 14:00 to 14:10.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar />
          <MessageContent>
            <Bubble variant='muted'>
              <BubbleContent>
                Every slow request goes through the tax service.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarImage
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt='Alex Johnson'
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant='muted'>
              <BubbleContent>
                It is a retry loop, not the database. Two retries at 400ms each.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>

      <Message align='end'>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src='https://randomuser.me/api/portraits/women/68.jpg'
              alt='Emma Wilson'
            />
            <AvatarFallback>EW</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              That lines up with the 14:04 deploy. Rolling the tax client back.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
