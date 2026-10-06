import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { WindowSize, LastKey, ScrollPanel } from './fixtures/use-event-listener.jsx';
import exampleCode from './fixtures/use-event-listener.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-event-listener.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useEventListener',
  id: 'hooks-interaction-useeventlistener',
  tags: ['autodocs'],
  ...hookMeta('useEventListener')
};

export const WindowEvents = {
  name: 'Window events',
  parameters: example('Listens to `resize` on window, the default target. The handler can change on every render without re-subscribing.', exampleSource),
  render: () => <WindowSize />
};

export const DocumentEvents = {
  name: 'Document events',
  parameters: example("Pass `'document'` to listen on the document. Check `event.target` before acting so focused controls keep their keys.", exampleSource),
  render: () => <LastKey />,
  play: async ({ canvasElement }) => {
    await userEvent.keyboard('g');
    await waitFor(() => expect(within(canvasElement).getByText('g')).toBeVisible());
  }
};

export const ElementRef = {
  name: 'An element through a ref',
  parameters: example('Pass a ref to listen on an element; the listener follows the node if it re-mounts. Scroll listeners are passive so they never delay scrolling.', exampleSource),
  render: () => <ScrollPanel />,
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', { name: 'Release notes' });
    panel.scrollTop = panel.scrollHeight;
    panel.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(within(canvasElement).getByText('100%')).toBeVisible());
  }
};
