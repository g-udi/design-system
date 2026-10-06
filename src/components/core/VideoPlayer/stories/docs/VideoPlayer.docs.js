import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/VideoPlayer': {
    ...definition('A native video player with a complete toolbar, an elastic minimal timeline, and a poster that opens a focused viewing dialog.', [
      p('src', 'string', '—', 'A browser-playable video URL. Changing it resets playback and pending requests. An empty source shows the empty state.'),
      p('poster', 'string', '—', 'Preview image while the video is idle, and the dialog trigger image.'),
      p('title', 'string', 'Video', 'Names the video, player region, and dialog.'),
      p('variant', 'standard | minimal | dialog', 'standard', 'Full toolbar, compact elastic scrubber, or pointer-enhanced poster opening a dialog.'),
      p('aspectRatio', 'string | number', '16 / 9', 'CSS aspect ratio of the video stage and poster.'),
      p('fit', 'contain | cover', 'contain', 'Contain preserves the entire frame. Cover crops to fill the stage.'),
      p('tracks', 'Array<{ src, srcLang, label, kind?, default? }>', '[]', 'Native WebVTT tracks; kind defaults to captions. Only captions and subtitles appear in the language selector. Selecting or disabling captions leaves metadata and chapter track modes untouched. Serve track files from the same origin.'),
      p('autoPlay', 'boolean', 'false', 'Attempts playback when this source mounts or its dialog opens. Browser rejection leaves a usable Play control and a status message.'),
      p('defaultMuted', 'boolean', 'false', 'Initial muted preference for each source. Native volume events own later changes.'),
      p('defaultVolume', 'number (0–1)', '1', 'Initial volume, clamped to the supported range. Applied when the source mounts.'),
      p('loop', 'boolean', 'false', 'Restarts the native video at the end.'),
      p('preload', 'none | metadata | auto', 'metadata', 'Native browser preload hint. Metadata enables the duration and seek controls.'),
      p('nativeControls', 'boolean', 'false', 'Uses the browser’s controls in place of the custom toolbar. The source must still be browser-playable; this adds no streaming adapters or codec support.'),
      p('open / defaultOpen / onOpenChange', 'boolean / boolean / (open) => void', 'uncontrolled / false / —', 'Controlled or uncontrolled dialog visibility. Only used by the dialog variant.'),
      p('onPlay / onPause / onEnded / onTimeUpdate / onError', '(event) => void', '—', 'Native media event callbacks. Time updates are not live announcements.'),
      p('ref', 'Ref<HTMLVideoElement>', '—', 'Access to the active native video for programmatic playback changes. Null while a dialog is closed.'),
      className
    ], 'All controls have accessible names. Space or Enter activates focused buttons; the seek and volume sliders support arrow keys, Home and End. Captions use native text tracks; provide captions for speech and meaningful audio. Dialog traps focus, closes with Escape, and restores focus to its poster. Touch controls stay visible, and reduced motion removes elastic movement.', [
      'autoPlay, defaultMuted, and defaultVolume are initial preferences applied when a source mounts or its dialog opens. Updating them does not restart playback or directly update the active video’s muted state or volume. Use the native ref for subsequent programmatic changes.',
      'Only documented video props are supported; arbitrary native attributes such as crossOrigin are not forwarded. Cross-origin media setup belongs to the host integration. className and style apply to the outer player wrapper.',
      'The custom toolbar supports finite-duration files. Unknown or infinite durations disable seeking. Use nativeControls for live streams or device-specific playback features.',
      'Picture-in-picture and fullscreen appear only when supported. Their state follows browser events, and rejected requests show a recoverable message. Support depends on the browser, operating system, and embedding permissions.',
      'Custom controls remain visible. Below a 640px player width they flow below the video; larger standard players place them over the frame. Enabling captions keeps the controls below so they cannot cover the text. Minimal controls stay below the frame at every width.',
      'The Skiper 67, 91, and 97 references informed the interactions. This implementation uses Gaudi primitives and native media APIs; it does not load remote examples or copy registry source.'
    ]),
    usage: "import { VideoPlayer } from '@gaudi/design-system/core/VideoPlayer';\n\n<VideoPlayer src='/media/film.webm' poster='/media/film.webp' title='A short film'\n  tracks={[{ src: '/media/film.en.vtt', srcLang: 'en', label: 'English', default: true }]} />"
  }
};
