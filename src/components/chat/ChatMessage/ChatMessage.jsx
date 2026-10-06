import { cn } from '../../../utilities/cn/index.js';
function ChatMessageGroup({ className, ...props }) {
  return (
    <div
      data-slot='message-group'
      className={cn('ds-part-message-group flex min-w-0 flex-col', className)}
      {...props}
    />
  );
}
function ChatMessage({ className, align = 'start', ...props }) {
  return (
    <div
      data-slot='message'
      data-align={align}
      className={cn(
        'ds-part-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse',
        className
      )}
      {...props}
    />
  );
}
function ChatMessageAvatar({ className, ...props }) {
  return (
    <div
      data-slot='message-avatar'
      className={cn(
        'ds-part-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-ui-muted',
        className
      )}
      {...props}
    />
  );
}
function ChatMessageContent({ className, ...props }) {
  return (
    <div
      data-slot='message-content'
      className={cn(
        'ds-part-message-content flex w-full min-w-0 flex-col wrap-break-word',
        className
      )}
      {...props}
    />
  );
}
function ChatMessageHeader({ className, ...props }) {
  return (
    <div
      data-slot='message-header'
      className={cn(
        'ds-part-message-header flex max-w-full min-w-0 items-center',
        className
      )}
      {...props}
    />
  );
}
function ChatMessageFooter({ className, ...props }) {
  return (
    <div
      data-slot='message-footer'
      className={cn(
        'ds-part-message-footer flex max-w-full min-w-0 items-center group-data-[align=end]/message:justify-end',
        className
      )}
      {...props}
    />
  );
}
export {
  ChatMessageGroup,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageFooter,
  ChatMessageHeader
};
