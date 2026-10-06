import { useState } from 'react';
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';
import Button from '@gaudi/design-system/core/Button';

const clip = '/static/media/video-demo.webm';
const poster = '/static/media/video-demo-poster.webp';
const tracks = [{ src: '/static/media/video-demo.en.vtt', srcLang: 'en', label: 'English' }];

export function VideoPlayground(args) {
  return <div className='mx-auto grid w-full max-w-4xl gap-3'>
    <VideoPlayer src={clip} poster={poster} tracks={tracks} defaultMuted {...args} />
    <p className='text-sm text-text-muted'>A 12-second local motion study with a soft tone and English captions. Unmute to hear it.</p>
  </div>;
}

export function MinimalVideo() {
  return <div className='mx-auto grid w-full max-w-xl gap-3'>
    <VideoPlayer src={clip} poster={poster} title='Form in motion' variant='minimal' aspectRatio='4 / 3' fit='cover' tracks={tracks} defaultMuted />
    <p className='text-sm text-text-muted'>Hover to preview a time. Drag the timeline or use its arrow keys to seek.</p>
  </div>;
}

export function DialogVideo() {
  return <div className='mx-auto grid w-full max-w-3xl gap-3'>
    <VideoPlayer src={clip} poster={poster} title='Form in motion' variant='dialog' tracks={tracks} defaultMuted autoPlay />
    <p className='text-sm text-text-muted'>Open the film. Escape closes it and returns focus to the poster.</p>
  </div>;
}

export function VideoRecovery() {
  const [src, setSrc] = useState('');
  return <div className='mx-auto grid w-full max-w-2xl gap-3'>
    <div className='flex flex-wrap gap-2'>
      <Button variant='outline' size='sm' onClick={() => setSrc(clip)}>Load video</Button>
      <Button variant='outline' size='sm' onClick={() => setSrc('/static/media/video-invalid.webm')}>Load broken source</Button>
      <Button variant='outline' size='sm' onClick={() => setSrc('')}>Clear video</Button>
    </div>
    <VideoPlayer src={src} poster={poster} title='Source preview' tracks={tracks} defaultMuted />
    <p className='text-sm text-text-muted'>A new source resets playback. A failed source offers Retry; the host can also replace it.</p>
  </div>;
}

export function NativeVideo() {
  return <div className='mx-auto grid w-full max-w-3xl gap-3'>
    <VideoPlayer src={clip} poster={poster} title='Form in motion' tracks={tracks} defaultMuted nativeControls />
    <p className='text-sm text-text-muted'>Browser controls, including the device’s own media integrations.</p>
  </div>;
}
