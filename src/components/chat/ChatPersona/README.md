# ChatPersona

The assistant’s presence in a voice conversation: an orb that rests, connects, listens, thinks, speaks, sleeps or shows an error. Eight renderers share one state model:

- `iridescent`: a thin-film sphere drawn by a small WebGL shader (no library), with a CSS gradient fallback.
- `mercury`: a polished metal sphere in CSS layers, with a rotating sheen and an energy-driven swell.
- `waveform`: a 2D canvas ring that ripples with the state or traces live time-domain samples.
- `activity`: a dotted sphere in SVG that turns, ripples, sweeps and swells.
- `circle`: a flat disc that breathes at rest, tightens with the level while listening, pulses while connecting or thinking, and swells with a glow while speaking.
- `bars`: five bars that rest as dots, follow the level while listening and speaking, and run a loading wave while connecting or thinking.
- `cloud`: a drifting WebGL sky with a milky horizon that draws in while listening and swells while speaking, with a CSS gradient fallback.
- `radial`: a WebGL pinwheel whose membrane ripples while listening and whose seams swing while speaking, with a CSS gradient fallback.

## Usage

```jsx
import { ChatPersona, useAudioLevel } from '@gaudi/design-system/chat';

<ChatPersona name='Gaudi' state='listening' variant='iridescent' size='lg' />

// Live microphone level and waveform from a MediaStream
const { levelRef, waveformRef } = useAudioLevel(stream);
<ChatPersona name='Gaudi' state='listening' variant='waveform' levelRef={levelRef} waveformRef={waveformRef} />

// TTS playback level as a number
<ChatPersona name='Gaudi' state='speaking' variant='mercury' level={replyLevel} showLabel />
```

## API

| Prop | Contract |
| --- | --- |
| `state` | idle, connecting, listening, thinking, speaking, asleep or error (`personaStates`). |
| `variant` | iridescent, mercury, waveform, activity, circle, bars, cloud or radial (`personaVariants`). |
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

The renderers adapt three MIT-licensed projects; their notices are kept in `orbs/LICENSE`.

- [VoiceOrbs](https://voiceorbs.vercel.app) ([amunozdev/voiceorbs](https://github.com/amunozdev/voiceorbs)) by Alexis Munoz, pinned at `339ab42d98f6c4ffa03709ffa71f9f6965a2171a`: the iridescent, mercury and waveform renderers and the shared orb model. Gaudi changes: JavaScript, Gaudi colour tokens, reduced-motion and off-screen pausing through Gaudi hooks, no microphone or audio fetching inside the orbs, and Mercury drawn with CSS instead of the [Paper Shaders](https://github.com/paper-design/shaders) library so no dependency is added.
- [Thinking Orbs](https://libraries.dev/orbs) ([Jakubantalik/Libraries.dev](https://github.com/Jakubantalik/Libraries.dev)) by Jakub Antalik, pinned at `0d448879917f92c2b9f2773c1f91054f4c83dae5`: the activity renderer's dotted sphere (a Fibonacci lattice on a turning, tilted sphere, shaded by depth), rewritten in SVG with Gaudi's voice states.
- [orb-ui](https://orb-ui.com) ([exprmntl/orb-ui](https://github.com/exprmntl/orb-ui)) by Alexander Chen, version 0.9.0 pinned at `0e78ad509e1b3a48013fb810eb25b130c355115d`: the circle, bars, cloud and radial styles. Only the visual themes are adapted; orb-ui's provider adapters, launch button and call controls are not included. Gaudi changes: palettes derived from `--ds-voice-<variant>-from/to` tokens, the asleep state, still frames for reduced motion, off-screen pausing, and the shared frame loop.
