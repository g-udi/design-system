import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import NewsletterForm from '../../../../src/components/layout/NewsletterForm/index.js';

export async function checkNewsletterLifecycle(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const originalFetch = window.fetch;
  const requests = [];
  window.fetch = (url, options) => String(url).startsWith('/test-newsletter/')
    ? new Promise((resolve) => requests.push({ url, options, resolve }))
    : originalFetch(url, options);
  const render = (endpoint) => act(() => root.render(<StrictMode><NewsletterForm endpoint={endpoint} /></StrictMode>));
  const canvas = within(host);
  let mounted = true;
  const respond = (index, status = 200) => act(async () => {
    requests[index].resolve(new Response('{}', { status }));
    await Promise.resolve();
  });
  try {
    await render('/test-newsletter/first');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email address' }), 'reader@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(requests).toHaveLength(1));
    await expect(canvas.getByRole('textbox', { name: 'Email address' })).toBeDisabled();
    await render('/test-newsletter/second');
    await expect(requests[0].options.signal.aborted).toBe(true);
    await respond(0);
    await expect(canvas.queryByRole('status')).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Sign up' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(requests).toHaveLength(2));
    await respond(1, 500);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('We could not subscribe you. Please try again.');
    await expect(canvas.getByRole('textbox', { name: 'Email address' })).toHaveValue('reader@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(requests).toHaveLength(3));
    await expect(canvas.queryByRole('alert')).toBeNull();
    await respond(2);
    await expect(await canvas.findByRole('status')).toHaveTextContent('You are now subscribed.');
    await render('/test-newsletter/third');
    await expect(canvas.getByRole('button', { name: 'Sign up' })).toBeEnabled();
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email address' }), 'other@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(requests).toHaveLength(4));
    await act(() => root.unmount());
    mounted = false;
    await expect(requests[3].options.signal.aborted).toBe(true);
    await respond(3);
  } finally {
    if (mounted) await act(() => root.unmount());
    window.fetch = originalFetch;
    host.remove();
  }
}
