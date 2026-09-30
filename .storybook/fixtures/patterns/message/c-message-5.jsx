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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const HERO_ARTWORK =
  'static/images/art/0.svg';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Message align='end'>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src='https://randomuser.me/api/portraits/women/44.jpg'
              alt='Sarah Chen'
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          {/*
      The tile is 120px wide by default, and a plain w-full beats that:
      the style sheets sit in the base layer, utilities in the utilities
      layer, and layer order outranks specificity.
    */}
          <Attachment orientation='vertical' className='w-full max-w-56'>
            <AttachmentMedia variant='image'>
              <img
                src={HERO_ARTWORK}
                alt='Gradient artwork for the release banner'
                width={448}
                height={448}
                loading='lazy'
                decoding='async'
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>hero-gradient.png</AttachmentTitle>
              <AttachmentDescription>PNG, 212 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Bubble>
            <BubbleContent>
              Here is the new release banner. Can you send the palette over?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src='https://randomuser.me/api/portraits/men/11.jpg'
              alt='Michael Rodriguez'
            />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant='muted'>
            <BubbleContent>Exported, one row per token.</BubbleContent>
          </Bubble>
          <Attachment>
            <AttachmentMedia>
              <RegistryIcon lucide='FileSpreadsheetIcon' aria-hidden='true' />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>palette-tokens.csv</AttachmentTitle>
              <AttachmentDescription>CSV, 184 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              {/*
      The label names the file. A thread of identical download glyphs
      is otherwise a list of buttons all called "Download".
    */}
              <AttachmentAction
                type='button'
                variant='secondary'
                size='icon-sm'
                aria-label='Download palette-tokens.csv'
                title='Download'
              >
                <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </MessageContent>
      </Message>
    </div>
  );
}
