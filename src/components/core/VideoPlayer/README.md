# VideoPlayer

Native video playback with three presentations: `standard` adds a complete toolbar, `minimal` pares it back around an elastic seek rail, and `dialog` opens the player from a poster with a Gaudi Pointer label.

```jsx
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';

<VideoPlayer
  src='/media/film.webm'
  poster='/media/film.webp'
  title='A short film'
  tracks={[{ src: '/media/film.en.vtt', srcLang: 'en', label: 'English', default: true }]}
/>
```

`aspectRatio` defaults to `16 / 9`; `fit='cover'` crops the frame. Pass `variant='minimal'` or `variant='dialog'` for the other workflows. Dialog supports `open`, `defaultOpen`, and `onOpenChange`. It stops playback on close and restores focus to its poster.

`autoPlay`, `defaultMuted`, and `defaultVolume` are initial preferences applied when a source mounts or its dialog opens. They are not controlled playback props: changing them does not restart playback or directly update the active video's muted state or volume. Browser policy may reject autoplay; the player keeps Play available and explains the failure. `loop` and `preload` map to the native video. Media events drive the controls; `onPlay`, `onPause`, `onEnded`, `onTimeUpdate`, and `onError` receive native events. A forwarded `ref` points to the active HTMLVideoElement, or null while the dialog is closed; use it for subsequent programmatic playback changes. Changing `src` resets playback and ignores pending work from the old source.

The standard toolbar includes play/pause/replay, buffered seeking, mute, volume, caption selection, speed, and supported fullscreen/picture-in-picture actions. Minimal retains play, seeking, time, mute, captions, and supported fullscreen. The custom timeline supports finite-duration media; unknown or live durations disable seeking. Set `nativeControls` for browser-owned controls or device-specific/live playback. This still requires a browser-playable `src`; it does not add streaming adapters or codec support. Fullscreen and picture-in-picture depend on browser support and embedding permissions; failures leave inline playback available.

Buttons support Enter/Space. Sliders support arrow keys, Home and End, with spoken time/volume values. The dialog uses Gaudi’s focus trap and Escape handling. Reduced motion disables elastic movement. Touch targets enlarge, and controls wrap below videos in containers narrower than 640px. Captioned playback keeps controls below the frame at every width, preserving authored cue placement. Minimal controls always stay below the frame.

Provide accurate WebVTT captions for meaningful audio. Tracks default to `kind='captions'`; only captions and subtitles appear in the caption selector. Selecting a language or turning captions off changes only those track modes, leaving metadata and chapter track modes untouched. The component accepts the documented video props rather than forwarding arbitrary native attributes, including `crossOrigin`. Serve tracks from the same origin; cross-origin media setup belongs to the host integration. `className` and `style` apply to the outer player wrapper.

## Story assets and inspiration

The 12-second WebM, WebP poster, and English VTT in `.storybook/public/static/media/video-demo*` are local demo assets. The clip slowly zooms Gaudi’s existing `static/images/art/0.svg` with a title overlay and a quiet synthesized 220Hz tone fading in/out. It was generated from a browser render of the SVG with ImageMagick (960×540, Arial title) and FFmpeg (`zoompan`, VP9, 24fps, Opus); no external media is loaded. `video-invalid.webm` intentionally contains text to demonstrate media-error recovery.

Interaction references: [Skiper 67](https://skiper-ui.com/v1/skiper67), [Skiper 91](https://skiper-ui.com/v1/skiper91), and [Skiper 97](https://skiper-ui.com/v1/skiper97). Independently implemented with native media APIs and Gaudi components; no registry source is copied.
