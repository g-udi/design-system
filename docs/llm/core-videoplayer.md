# VideoPlayer

> Core/VideoPlayer · core · `@gaudi/design-system/core/VideoPlayer`

A native video player with a complete toolbar, an elastic minimal timeline, and a poster that opens a focused viewing dialog.

## Import

```js
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `VideoPlayer`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | no | A browser-playable video URL. Changing it resets playback and pending requests. An empty source shows the empty state. |
| `poster` | `string` | — | no | Preview image while the video is idle, and the dialog trigger image. |
| `title` | `string` | `Video` | no | Names the video, player region, and dialog. |
| `variant` | `standard \| minimal \| dialog` | `standard` | no | Full toolbar, compact elastic scrubber, or pointer-enhanced poster opening a dialog. |
| `aspectRatio` | `string \| number` | `16 / 9` | no | CSS aspect ratio of the video stage and poster. |
| `fit` | `contain \| cover` | `contain` | no | Contain preserves the entire frame. Cover crops to fill the stage. |
| `tracks` | `Array<{ src, srcLang, label, kind?, default? }>` | `[]` | no | Native WebVTT tracks; kind defaults to captions. Only captions and subtitles appear in the language selector. Selecting or disabling captions leaves metadata and chapter track modes untouched. Serve track files from the same origin. |
| `autoPlay` | `boolean` | `false` | no | Attempts playback when this source mounts or its dialog opens. Browser rejection leaves a usable Play control and a status message. |
| `defaultMuted` | `boolean` | `false` | no | Initial muted preference for each source. Native volume events own later changes. |
| `defaultVolume` | `number (0–1)` | `1` | no | Initial volume, clamped to the supported range. Applied when the source mounts. |
| `loop` | `boolean` | `false` | no | Restarts the native video at the end. |
| `preload` | `none \| metadata \| auto` | `metadata` | no | Native browser preload hint. Metadata enables the duration and seek controls. |
| `nativeControls` | `boolean` | `false` | no | Uses the browser’s controls in place of the custom toolbar. The source must still be browser-playable; this adds no streaming adapters or codec support. |
| `open` | `boolean` | `uncontrolled` | no | Controlled or uncontrolled dialog visibility. Only used by the dialog variant. |
| `defaultOpen` | `boolean` | `false` | no | Controlled or uncontrolled dialog visibility. Only used by the dialog variant. |
| `onOpenChange` | `(open) => void` | — | no | Controlled or uncontrolled dialog visibility. Only used by the dialog variant. |
| `onPlay / onPause / onEnded / onTimeUpdate / onError` | `(event) => void` | — | no | Native media event callbacks. Time updates are not live announcements. |
| `ref` | `Ref<HTMLVideoElement>` | — | no | Access to the active native video for programmatic playback changes. Null while a dialog is closed. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `standard`, `minimal`, `dialog`
- `fit`: `contain`, `cover`
- `preload`: `none`, `metadata`, `auto`

## Usage

```jsx
import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';

<VideoPlayer src='/media/film.webm' poster='/media/film.webp' title='A short film'
  tracks={[{ src: '/media/film.en.vtt', srcLang: 'en', label: 'English', default: true }]} />
```

## Accessibility

All controls have accessible names. Space or Enter activates focused buttons; the seek and volume sliders support arrow keys, Home and End. Captions use native text tracks; provide captions for speech and meaningful audio. Dialog traps focus, closes with Escape, and restores focus to its poster. Touch controls stay visible, and reduced motion removes elastic movement.

## Notes

- autoPlay, defaultMuted, and defaultVolume are initial preferences applied when a source mounts or its dialog opens. Updating them does not restart playback or directly update the active video’s muted state or volume. Use the native ref for subsequent programmatic changes.
- Only documented video props are supported; arbitrary native attributes such as crossOrigin are not forwarded. Cross-origin media setup belongs to the host integration. className and style apply to the outer player wrapper.
- The custom toolbar supports finite-duration files. Unknown or infinite durations disable seeking. Use nativeControls for live streams or device-specific playback features.
- Picture-in-picture and fullscreen appear only when supported. Their state follows browser events, and rejected requests show a recoverable message. Support depends on the browser, operating system, and embedding permissions.
- Custom controls remain visible. Below a 640px player width they flow below the video; larger standard players place them over the frame. Enabling captions keeps the controls below so they cannot cover the text. Minimal controls stay below the frame at every width.
- The Skiper 67, 91, and 97 references informed the interactions. This implementation uses Gaudi primitives and native media APIs; it does not load remote examples or copy registry source.

## Examples

- Playground (Storybook `core-videoplayer--playground`)
- Minimal & elastic timeline (Storybook `core-videoplayer--minimal`)
- Poster to dialog (Storybook `core-videoplayer--poster-dialog`)
- Empty, error & source changes (Storybook `core-videoplayer--recovery`)
- Browser controls (Storybook `core-videoplayer--native`)

## Related

`core-dialog`, `mdx-preview`

## README

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

### Story assets and inspiration

The 12-second WebM, WebP poster, and English VTT in `.storybook/public/static/media/video-demo*` are local demo assets. The clip slowly zooms Gaudi’s existing `static/images/art/0.svg` with a title overlay and a quiet synthesized 220Hz tone fading in/out. It was generated from a browser render of the SVG with ImageMagick (960×540, Arial title) and FFmpeg (`zoompan`, VP9, 24fps, Opus); no external media is loaded. `video-invalid.webm` intentionally contains text to demonstrate media-error recovery.

Interaction references: [Skiper 67](https://skiper-ui.com/v1/skiper67), [Skiper 91](https://skiper-ui.com/v1/skiper91), and [Skiper 97](https://skiper-ui.com/v1/skiper97). Independently implemented with native media APIs and Gaudi components; no registry source is copied.
