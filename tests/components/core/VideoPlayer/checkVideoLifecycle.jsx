import { StrictMode, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { VideoPlayer } from '../../../../src/components/core/VideoPlayer/index.js';

export async function checkVideoLifecycle(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const ref = createRef();
  const render = (src, props = {}) => act(() => root.render(<StrictMode><VideoPlayer ref={ref} src={src} title='Lifecycle test' defaultMuted {...props} /></StrictMode>));
  try {
    await render('/static/media/video-demo.webm');
    await waitFor(() => expect(ref.current.duration).toBeGreaterThan(0));
    const video = ref.current;
    video.play = () => Promise.reject(new DOMException('Blocked by browser', 'NotAllowedError'));
    await userEvent.click(within(host).getByRole('button', { name: 'Play', exact: true }));
    await expect(within(host).getByText('Playback could not start. Try Play again.')).toBeVisible();
    await expect(within(host).getByRole('button', { name: 'Play', exact: true })).toBeEnabled();
    let reject;
    video.play = () => new Promise((resolve, failure) => { reject = failure; });
    await userEvent.click(within(host).getByRole('button', { name: 'Play', exact: true }));
    await render('');
    await act(async () => { reject(new DOMException('Old source', 'NotAllowedError')); await Promise.resolve(); });
    await expect(within(host).queryByText('Playback could not start. Try Play again.')).toBeNull();
    await expect(within(host).getByText('No video selected.')).toBeVisible();
    await render('/static/media/video-demo.webm', {
      defaultMuted: false, defaultVolume: 0,
      tracks: [{ src: '/static/media/video-demo.en.vtt', srcLang: 'en', label: 'English' }]
    });
    await userEvent.click(within(host).getByRole('button', { name: 'Unmute', exact: true }));
    await waitFor(() => expect(ref.current.muted).toBe(false));
    await expect(ref.current.volume).toBe(1);
    const markers = ref.current.addTextTrack('metadata', 'Host markers');
    markers.mode = 'hidden';
    const captions = within(host).getByRole('combobox', { name: 'Captions' });
    await userEvent.selectOptions(captions, '0');
    await expect(markers.mode).toBe('hidden');
    await userEvent.selectOptions(captions, 'off');
    await expect(markers.mode).toBe('hidden');
    markers.mode = 'showing';
    await waitFor(() => expect(captions).toHaveValue('off'));
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
