import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor, within } from 'storybook/test';
import { act } from '../../support/reactAct.js';
import { ChatPersona } from '../../../src/components/chat/ChatPersona/index.js';
import { Pattern as AssistantReply } from '../../../src/components/chat/ChatMessage/stories/fixtures/message/message-assistant-reply.jsx';
import { Pattern as DraftingPost } from '../../../src/components/chat/ChatMessageList/stories/fixtures/message-scroller/message-scroller-drafting-post.jsx';
import { Pattern as WritingAssistant } from '../../../src/components/blocks/Chat/stories/fixtures/chat/chat-writing-assistant.jsx';

/** Custom host selectors must repaint artwork while explicit colour overrides stay pinned. */
export async function checkPersonaScopedTheme(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const host = document.createElement('div');
  const style = document.createElement('style');
  style.textContent = '[data-persona-palette="first"] { --ds-color-chart-6: #123456; } [data-persona-palette="second"] { --ds-color-chart-6: #654321; }';
  host.setAttribute('data-persona-palette', 'first');
  canvasElement.append(style, host);
  const root = createRoot(host);
  const colour = index => getComputedStyle(host.querySelectorAll('.ds-part-voice-circle-disc')[index]).backgroundColor;
  try {
    await act(() => root.render(<>
      <ChatPersona variant='circle' active={false} />
      <ChatPersona variant='circle' active={false} colorFrom='#abcdef' />
    </>));
    await waitFor(() => expect(colour(0)).toBe('rgb(18, 52, 86)'));
    await expect(colour(1)).toBe('rgb(171, 205, 239)');
    await act(() => host.setAttribute('data-persona-palette', 'second'));
    await waitFor(() => expect(colour(0)).toBe('rgb(101, 67, 33)'));
    await expect(colour(1)).toBe('rgb(171, 205, 239)');
  } finally {
    await act(() => root.unmount());
    host.remove();
    style.remove();
  }
}

/** Changing the OS preference completes a pending demo reply without replaying completed text. */
export async function checkStreamingMotionPreference(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const nativeMatchMedia = window.matchMedia;
  const query = '(prefers-reduced-motion: reduce)';
  const media = new EventTarget();
  media.matches = false;
  media.media = query;
  window.matchMedia = value => value === query ? media : nativeMatchMedia.call(window, value);
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const setMotion = value => act(() => {
    media.matches = value;
    media.dispatchEvent(new Event('change'));
  });
  try {
    for (const [Component, done] of [[AssistantReply, 'Reply ready'], [DraftingPost, 'Gaudi replied.'], [WritingAssistant, 'Gaudi replied.']]) {
      await setMotion(false);
      await act(() => root.render(createElement(Component)));
      const status = () => within(host).getAllByRole('status').find(element => element.textContent === done);
      await expect(status()).toBeUndefined();
      await setMotion(true);
      await waitFor(() => expect(status()).toBeInTheDocument(), { timeout: 500 });
      await setMotion(false);
      await act(() => new Promise(resolve => setTimeout(resolve, 60)));
      await expect(status()).toBeInTheDocument();
      await act(() => root.render(null));
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
    window.matchMedia = nativeMatchMedia;
  }
}
