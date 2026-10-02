# Persona

The assistant’s presence in a voice conversation: an orb that rests, connects, listens, thinks, speaks, sleeps or shows an error. Four renderers share one state model:

- `iridescent`: a thin-film sphere drawn by a small WebGL shader (no library), with a CSS gradient fallback.
- `mercury`: a polished metal sphere in CSS layers, with a rotating sheen and an energy-driven swell.
- `waveform`: a 2D canvas ring that ripples with the state or traces live time-domain samples.
- `activity`: a dotted sphere in SVG that turns, ripples, sweeps and swells.

## Usage

```jsx
import { Persona, useAudioLevel } from '@gaudi/design-system/chat';

<Persona name='Gaudi' state='listening' variant='iridescent' size='lg' />

// Live microphone level and waveform from a MediaStream
const { levelRef, waveformRef } = useAudioLevel(stream);
<Persona name='Gaudi' state='listening' variant='waveform' levelRef={levelRef} waveformRef={waveformRef} />

// TTS playback level as a number
<Persona name='Gaudi' state='speaking' variant='mercury' level={replyLevel} showLabel />
```

## API

| Prop | Contract |
| --- | --- |
| `state` | idle, connecting, listening, thinking, speaking, asleep or error (`personaStates`). |
| `variant` | iridescent, mercury, waveform or activity (`personaVariants`). |
| `size` | xs 32, sm 48, md 96, lg 168, xl 240 (`personaSizes`), or a number of pixels. |
| `level` / `levelRef` | Live audio level, 0..1; without one each state keeps its own rhythm. |
| `waveformRef` | Time-domain samples (Uint8Array centred on 128) for the waveform ring. |
| `speed` / `active` | Animation multiplier (0 pauses); `active` defaults to true unless asleep. |
| `name` / `labels` / `showLabel` | Accessible name, copy per state and a visible state label. |
| `announce` / `decorative` | Polite status announcements (default on); hide everything when nearby text names the state. |
| `colorFrom` / `colorTo` | Hex overrides; by default the orb reads `--ds-voice-<variant>-from/to`, which point at colour tokens. |

## Accessibility

The orb is `role="img"` named “Gaudi: Listening”, and a polite status announces each change of state once. The state never depends on motion: the still frame differs per state and `showLabel` adds text. Animation runs only while the orb is on screen and the tab is visible, stops when asleep, and stops entirely (a still frame) for readers who prefer reduced motion.

## Attribution

The iridescent, mercury and waveform renderers are adapted from [VoiceOrbs](https://github.com/amunozdev/voiceorbs) by Alexis Munoz (MIT, pinned at `339ab42d98f6c4ffa03709ffa71f9f6965a2171a`), by way of the Mav9 design system’s ChatIridescentFlow, ChatMercuryOrb and ChatWaveformRing. The licence is preserved in `parts/orbs/LICENSE`. Gaudi changes: JavaScript, Gaudi colour tokens, reduced-motion and off-screen pausing through Gaudi hooks, no microphone or audio fetching inside the orbs, and Mercury drawn with CSS instead of the `@paper-design/shaders-react` shader so no dependency is added.

The `activity` renderer follows Mav9’s ChatActivityOrb, whose dotted geometry came from [thinking-orbs](https://www.npmjs.com/package/thinking-orbs) by Jakub Antalik (MIT). Gaudi does not depend on thinking-orbs; the dotted sphere is a compact rewrite of the idea. The state names and the Persona concept follow the Persona component of [AI SDK Elements](https://elements.ai-sdk.dev/components/persona) (Vercel, MIT), without its Rive runtime.
