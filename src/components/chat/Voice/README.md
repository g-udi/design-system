# Voice

Building blocks for talking to an assistant: dictate a prompt, pick the microphone, pick the voice that answers and play the spoken reply. They pair with Persona for a full voice mode.

- `SpeechInput`: a mic button for the composer’s mic slot, with idle, listening and processing states and a ring that follows the input level.
- `MicSelector`: the input device picker, with permission, refresh and a test level meter.
- `VoiceSelector`: a data-driven list of TTS voices with tags and sample playback.
- `AudioPlayer`: a compact player for voice messages and TTS replies.
- Helpers: `useAudioLevel(stream)`, `useAudioInputs()`, `voiceSupport()`, `getSpeechRecognition()`, `computePeaks()`, `formatAudioTime()` and `exampleVoices`.

## Usage

```jsx
import { AudioPlayer, MicSelector, PromptComposer, SpeechInput, VoiceSelector, exampleVoices } from '@gaudi/design-system/chat';

<MicSelector value={deviceId} onValueChange={setDeviceId} />
<SpeechInput
  deviceId={deviceId}
  onInterim={setDraftPreview}
  onTranscript={(text) => setDraft((draft) => `${draft} ${text}`.trim())}
  onAudio={(blob) => transcribe(blob)} // Firefox and Safari: return the transcript
/>
<VoiceSelector voices={exampleVoices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} />
<AudioPlayer src={reply.audioUrl} title='Reply' peaks={reply.peaks} download='reply.mp3' />
```

## API

| Component | Contract |
| --- | --- |
| `SpeechInput` | `onTranscript(text, { final })`, `onInterim(text)`, `onAudio(blob) => transcript?`, `onStateChange`, `onError(kind)`, `onLevel(level)`; `mode` auto, speech or recorder; `lang`, `deviceId`, `showLevel`, `labels`, plus Button `size` / `variant`. |
| `MicSelector` | `value` / `defaultValue` / `onValueChange(deviceId, device)`, `meter` (a Test button and level meter), `autoRequest`, `labels`. |
| `VoiceSelector` | `voices` (`{ id, name, provider?, gender?, accent?, age?, style?, description?, previewUrl? }`), `value` / `defaultValue` / `onValueChange(id, voice)`, `onPreview(voice, { signal })`, `groupBy`, `searchable`, `labels`. |
| `AudioPlayer` | `src`, `title`, `peaks` (0..1), `duration`, `speeds`, `download` (true or a file name), `autoPlay`, `onPlay` / `onPause` / `onEnded`, `labels`. |
| `useAudioLevel(stream, { onLevel })` | `{ levelRef, waveformRef }` for Persona, updated every frame without re-rendering. |
| `useAudioInputs({ autoRequest })` | `{ devices, permission, error, refresh, request }`. |

All browser APIs (SpeechRecognition, MediaRecorder, getUserMedia, enumerateDevices, AudioContext, Audio) are read lazily and guarded, so every part renders on the server; SpeechInput stays disabled until the browser reports what it supports.

## Accessibility

SpeechInput is a real button with `aria-pressed` while listening; Escape stops it; a polite status announces listening, transcribing and stopped, and a disabled button explains why through `aria-describedby`. MicSelector names its select, explains a blocked permission with a retry, and only opens the microphone for an explicit test. VoiceSelector is a fieldset of Core RadioGroup controls (arrow keys move the choice) with separate, named sample buttons. AudioPlayer’s scrubber is a slider that reads time (“0:12 of 0:45”) and moves with the arrow keys, Page Up / Page Down, Home and End. Motion (the level ring, the meter, spinners) is not the only signal, and calms down for reduced motion.
