import Avatar from '@gaudi/design-system/core/Avatar';
import { ChatBubble, ChatBubbleContent, ChatBubbleReactions } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageFooter, ChatMessageGroup, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';

export const sarah = { name: 'Sabine Okafor', src: '/avatars/person-20.svg' };

export const michael = { name: 'Rafe Okonkwo', src: '/avatars/person-31.svg' };

export const reply = 'Found it: the legend overlaps the last bar. Moving it under the axis.';

export const Portrait = ({ person }) => (
  <ChatMessageAvatar>
    <Avatar src={person.src} name={person.name} size='sm' shape='circle' alt='' />
  </ChatMessageAvatar>
);

export const MessageExample = ({ align, variant }) => (
    <div className='mx-auto flex w-full max-w-md flex-col gap-4'>
      <ChatMessageGroup>
        <ChatMessage>
          <ChatMessageAvatar />
          <ChatMessageContent>
            <ChatMessageHeader>{sarah.name} · 10:38</ChatMessageHeader>
            <ChatBubble variant='muted'>
              <ChatBubbleContent>The quarterly export finished.</ChatBubbleContent>
            </ChatBubble>
          </ChatMessageContent>
        </ChatMessage>
        <ChatMessage>
          <Portrait person={sarah} />
          <ChatMessageContent>
            <ChatBubble variant='muted'>
              <ChatBubbleContent>But the chart on page 3 looks off. Can you check it?</ChatBubbleContent>
            </ChatBubble>
          </ChatMessageContent>
        </ChatMessage>
      </ChatMessageGroup>
      <ChatMessage align={align}>
        <Portrait person={michael} />
        <ChatMessageContent>
          <ChatBubble variant={variant} align={align}>
            <ChatBubbleContent>{reply}</ChatBubbleContent>
            <ChatBubbleReactions align={align === 'end' ? 'start' : 'end'}>
              <span role='img' aria-label='2 thumbs up reactions'>👍 2</span>
            </ChatBubbleReactions>
          </ChatBubble>
          <ChatMessageFooter>Read 10:42</ChatMessageFooter>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  );
