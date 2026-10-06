# ChatVoice

> Chat/ChatVoice · chat · `@gaudi/design-system/chat/ChatVoice`

Voice building blocks: ChatSpeechInput dictates into the composer, ChatMicSelector picks the input device, ChatVoiceSelector picks the voice that answers and ChatAudioPlayer plays voice messages and spoken replies.

## Import

```js
import { ChatAudioPlayer } from '@gaudi/design-system/chat/ChatVoice';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatAudioPlayer`, `ChatMicSelector`, `ChatSpeechInput`, `ChatVoiceSelector`, `audioPlayerLabels`, `computePeaks`, `formatAudioTime`, `getSpeechRecognition`, `micSelectorLabels`, `speechInputLabels`, `speechInputStates`, `useAudioInputs`, `useAudioLevel`, `voiceSelectorLabels`, `voiceSupport`, `voiceTags`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ChatSpeechInput.onTranscript / onInterim` | `(text, { final }) => void / (text) => void` | — | no | Final phrases and the live interim text from the Web Speech API. |
| `ChatSpeechInput.onAudio` | `(blob: Blob) => string \| Promise<string> \| void` | — | no | MediaRecorder fallback; return the transcript. |
| `ChatSpeechInput.mode / lang / deviceId` | `auto \| speech \| recorder / string / string` | `auto / en-US / —` | no | Engine, recognition language and input device. |
| `ChatSpeechInput.onStateChange / onError / onLevel` | `(state) => void / (kind, cause) => void / (level) => void` | — | no | idle, listening, processing; denied, no-device, unsupported, failed; live level 0..1. |
| `ChatMicSelector.value / onValueChange / meter` | `string / (deviceId, device) => void / boolean` | `— / — / true` | no | Chosen device and a Test level meter. |
| `ChatVoiceSelector.voices` | `Array<{ id, name, provider?, gender?, accent?, age?, style?, description?, previewUrl? }>` | `[]` | no | The voices, supplied by the app. |
| `ChatVoiceSelector.value / onValueChange / onPreview / groupBy / searchable` | `string / (id, voice) => void / (voice, { signal }) => Promise / string / boolean` | — | no | Choice, sample playback, headings and filter. |
| `ChatAudioPlayer.src / title / peaks / duration` | `string / string / number[] / number` | — | no | Audio, label, waveform peaks 0..1 and a length before metadata. |
| `ChatAudioPlayer.speeds / download` | `number[] / boolean \| string` | `[1, 1.5, 2] / false` | no | Speed toggle and an optional download. |
| `useAudioLevel(stream, { onLevel })` | `{ levelRef, waveformRef }` | — | no | Live level and samples for ChatPersona. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ChatAudioPlayer, ChatMicSelector, ChatSpeechInput, ChatVoiceSelector } from '@gaudi/design-system/chat';

<>
<ChatMicSelector value={deviceId} onValueChange={setDeviceId} />
<ChatSpeechInput deviceId={deviceId} onInterim={setPreview} onTranscript={append} onAudio={transcribe} />
<ChatVoiceSelector voices={voices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} />
<ChatAudioPlayer src={reply.audioUrl} title='Reply' peaks={reply.peaks} download='reply.mp3' />
</>
```

## Accessibility

ChatSpeechInput is a pressed-state button stopped by Escape that announces listening and transcribing politely and explains when it is disabled; ChatMicSelector names its select and explains a blocked permission; ChatVoiceSelector is a fieldset of native radios with named sample buttons; the ChatAudioPlayer scrubber is a slider that reads time.

## Examples

- Voice mode (Storybook `chat-voice--voice-mode`)
- Cancel capture and pending transcription (Storybook `chat-voice--capture-cancellation`)

## Related

`chat-chatpersona`

## README

Building blocks for talking to an assistant: dictate a prompt, pick the microphone, pick the voice that answers and play the spoken reply. They pair with ChatPersona for a full voice mode.

- `ChatSpeechInput`: a mic button for the composer’s mic slot, with idle, listening and processing states and a ring that follows the input level.
- `ChatMicSelector`: the input device picker, with permission, refresh and a test level meter.
- `ChatVoiceSelector`: a data-driven list of TTS voices with tags and sample playback.
- `ChatAudioPlayer`: a compact player for voice messages and TTS replies.
- Helpers: `useAudioLevel(stream)`, `useAudioInputs()`, `voiceSupport()`, `getSpeechRecognition()`, `computePeaks()`, `formatAudioTime()`.

### Usage

```jsx
import { ChatAudioPlayer, ChatMicSelector, ChatPromptComposer, ChatSpeechInput, ChatVoiceSelector } from '@gaudi/design-system/chat';

<ChatMicSelector value={deviceId} onValueChange={setDeviceId} />
<ChatSpeechInput
  deviceId={deviceId}
  onInterim={setDraftPreview}
  onTranscript={(text) => setDraft((draft) => `${draft} ${text}`.trim())}
  onAudio={(blob) => transcribe(blob)} // Firefox and Safari: return the transcript
/>
<ChatVoiceSelector voices={voices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} />
<ChatAudioPlayer src={reply.audioUrl} title='Reply' peaks={reply.peaks} download='reply.mp3' />
```

The host supplies its available `voices`. The former `exampleVoices` package export now lives only in `stories/fixtures/exampleVoices.js` for the Voice mode demo.

### API

| Component | Contract |
| --- | --- |
| `ChatSpeechInput` | `onTranscript(text, { final })`, `onInterim(text)`, `onAudio(blob) => transcript?`, `onStateChange`, `onError(kind)`, `onLevel(level)`; `mode` auto, speech or recorder; `lang`, `deviceId`, `showLevel`, `labels`, plus Button `size` / `variant`. |
| `ChatMicSelector` | `value` / `defaultValue` / `onValueChange(deviceId, device)`, `meter` (a Test button and level meter), `autoRequest`, `labels`. |
| `ChatVoiceSelector` | `voices` (`{ id, name, provider?, gender?, accent?, age?, style?, description?, previewUrl? }`), `value` / `defaultValue` / `onValueChange(id, voice)`, `onPreview(voice, { signal })`, `groupBy`, `searchable`, `labels`. |
| `ChatAudioPlayer` | `src`, `title`, `peaks` (0..1), `duration`, `speeds`, `download` (true or a file name), `autoPlay`, `onPlay` / `onPause` / `onEnded`, `labels`. |
| `useAudioLevel(stream, { onLevel })` | `{ levelRef, waveformRef }` for ChatPersona, updated every frame without re-rendering. |
| `useAudioInputs({ autoRequest })` | `{ devices, permission, error, refresh, request }`. |

All browser APIs (SpeechRecognition, MediaRecorder, getUserMedia, enumerateDevices, AudioContext, Audio) are read lazily and guarded, so every part renders on the server; ChatSpeechInput stays disabled until the browser reports what it supports. Disabling it or changing `mode`, `deviceId` or `lang` cancels the current capture and ignores pending transcription results. Unmounting releases the microphone.

### Accessibility

ChatSpeechInput is a real button with `aria-pressed` while listening; Escape stops it; a polite status announces listening, transcribing and stopped, and a disabled button explains why through `aria-describedby`. ChatMicSelector names its select, explains a blocked permission with a retry, and only opens the microphone for an explicit test. ChatVoiceSelector is a fieldset of Core RadioGroup controls (arrow keys move the choice) with separate, named sample buttons. ChatAudioPlayer’s scrubber is a slider that reads time (“0:12 of 0:45”) and moves with the arrow keys, Page Up / Page Down, Home and End. Motion (the level ring, the meter, spinners) is not the only signal, and calms down for reduced motion.
