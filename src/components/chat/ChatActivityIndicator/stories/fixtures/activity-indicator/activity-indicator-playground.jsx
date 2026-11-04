import { ChatActivityIndicator } from '@gaudi/design-system/chat/ChatActivityIndicator';

export function Pattern({ state = 'thinking', variant = 'inline', showLabel = true }) {
  return <ChatActivityIndicator state={state} variant={variant} showLabel={showLabel} />;
}
