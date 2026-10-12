import { expect, userEvent, waitFor, within } from 'storybook/test';
import { VideoPlayer } from '../index.js';
import { VideoPlayground, MinimalVideo, DialogVideo, VideoRecovery, NativeVideo } from './fixtures/VideoExamples.jsx';
import examplesRaw from './fixtures/VideoExamples.jsx?raw';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { checkVideoLifecycle } from '../../../../../tests/components/core/VideoPlayer/checkVideoLifecycle.jsx';

const docs = getComponentDocs('Core/VideoPlayer');
const imports = publicSource(examplesRaw, new URL('./fixtures/VideoExamples.jsx', import.meta.url));
const source = name => playgroundSource(name, { imports });
const ready = async video => waitFor(() => expect(video.duration).toBeGreaterThan(0), { timeout: 10000 });

export default {
  title: 'Core/VideoPlayer', id: 'core-videoplayer', component: VideoPlayer, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: ['standard', 'minimal', 'dialog'], title: 'text', aspectRatio: ['16 / 9', '4 / 3', '1 / 1'], fit: ['contain', 'cover'], loop: 'boolean', nativeControls: 'boolean' }),
  parameters: { docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) } }
};

export const Playground = {
  args: { title: 'Form in motion', variant: 'standard', aspectRatio: '16 / 9', fit: 'contain', loop: false, nativeControls: false },
  parameters: { docs: { source: source('VideoPlayground') }, controlAudit: { interaction: ['loop', 'fit'] } },
  render: VideoPlayground,
  play: async ({ canvasElement, args }) => {
    if (args.variant !== 'standard' || args.nativeControls) return;
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video');
    await ready(video);
    await expect(canvas.getByText('Elapsed time:').parentElement).toHaveTextContent(/^Elapsed time: \d+:\d{2}$/);
    await expect(canvas.getByText('Duration:').parentElement).toHaveTextContent(/^Duration: \d+:\d{2}$/);
    await userEvent.click(canvas.getByRole('button', { name: 'Play', exact: true }));
    await waitFor(() => expect(video.paused).toBe(false));
    await waitFor(() => expect(video.currentTime).toBeGreaterThan(0));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause', exact: true }));
    const seek = canvas.getByRole('slider', { name: 'Seek video' });
    seek.focus();
    await userEvent.keyboard('{Home}{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(video.currentTime).toBeCloseTo(0.2, 1));
    await userEvent.click(canvas.getByRole('button', { name: 'Unmute', exact: true }));
    await waitFor(() => expect(video.muted).toBe(false));
    const volume = canvas.getByRole('slider', { name: 'Volume' });
    volume.focus();
    await userEvent.keyboard('{Home}{ArrowRight}');
    await waitFor(() => expect(video.volume).toBeCloseTo(0.05));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Playback speed' }), '1.5');
    await waitFor(() => expect(video.playbackRate).toBe(1.5));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Captions' }), 'off');
    await expect(video.textTracks[0].mode).toBe('disabled');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Captions' }), '0');
    await expect(video.textTracks[0].mode).toBe('showing');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Captions' }), 'off');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Playback speed' }), '1');
    await userEvent.click(canvas.getByRole('button', { name: 'Mute', exact: true }));
    await waitFor(() => expect(Number(seek.getAttribute('aria-valuemax'))).toBeGreaterThan(1));
    seek.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(video.currentTime).toBeCloseTo(video.duration, 1));
    await userEvent.keyboard('{Home}');
    seek.blur();
    await checkVideoLifecycle(canvasElement);
  }
};

export const Minimal = {
  name: 'Minimal & elastic timeline', parameters: { docs: { source: source('MinimalVideo') } }, render: () => <MinimalVideo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video');
    await ready(video);
    const seek = canvas.getByRole('slider', { name: 'Seek video' });
    await waitFor(() => expect(Number(seek.getAttribute('aria-valuemax'))).toBeGreaterThan(1));
    seek.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(video.currentTime).toBeCloseTo(video.duration, 1));
    await userEvent.keyboard('{Home}');
    seek.blur();
    await expect(canvas.queryByRole('combobox', { name: 'Playback speed' })).toBeNull();
  }
};

export const PosterDialog = {
  name: 'Poster to dialog', parameters: { docs: { source: source('DialogVideo') } }, render: () => <DialogVideo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Play Form in motion' });
    await userEvent.click(trigger);
    const dialog = await page.findByRole('dialog', { name: 'Form in motion' });
    const video = dialog.querySelector('video');
    await ready(video);
    await waitFor(() => expect(video.paused).toBe(false));
    await expect(within(dialog).getByRole('button', { name: 'Close video' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'Form in motion' })).toBeNull());
    await expect(video.paused).toBe(true);
    await expect(trigger).toHaveFocus();
    trigger.blur();
  }
};

export const Recovery = {
  name: 'Empty, error & source changes', parameters: { docs: { source: source('VideoRecovery') } }, render: () => <VideoRecovery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No video selected.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Load broken source' }));
    await waitFor(() => expect(canvas.getByText('This video could not load.')).toBeVisible(), { timeout: 10000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Retry video' }));
    await waitFor(() => expect(canvas.getByText('This video could not load.')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Load video' }));
    const video = canvasElement.querySelector('video');
    await ready(video);
    await expect(video.currentTime).toBe(0);
    await expect(video.paused).toBe(true);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear video' }));
    await expect(canvas.getByText('No video selected.')).toBeVisible();
  }
};

export const Native = {
  name: 'Browser controls', parameters: { docs: { source: source('NativeVideo') } }, render: () => <NativeVideo />,
  play: async ({ canvasElement }) => {
    const video = canvasElement.querySelector('video');
    await ready(video);
    await expect(video.controls).toBe(true);
    await expect(within(canvasElement).queryByRole('slider', { name: 'Seek video' })).toBeNull();
  }
};
