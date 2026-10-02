import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../story-helpers.jsx';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { Persona } from '../Persona/index.js';
import { AudioPlayer, MicSelector, SpeechInput, VoiceSelector, computePeaks, exampleVoices } from './index.js';
import { installVoiceMocks, synthesizeReply } from './story-mocks.js';

export default {
  title: 'Chat/Voice',
  id: 'chat-voice',
  tags: ['autodocs'],
  ...chatMeta('Voice', { component: SpeechInput, primary: () => VoiceMode, wide: true })
};

const voiceModeSource = `import { AudioPlayer, MicSelector, Persona, SpeechInput, VoiceSelector, exampleVoices } from '@gaudi/design-system/chat';

function VoiceMode({ reply, onSend }) {
  const levelRef = useRef(0);
  const [ deviceId, setDeviceId ] = useState();
  const [ voice, setVoice ] = useState('openai-nova');
  const [ heard, setHeard ] = useState('');
  const [ interim, setInterim ] = useState('');
  const [ listening, setListening ] = useState(false);
  const [ speaking, setSpeaking ] = useState(false);

  return (
    <section aria-label='Voice mode'>
      <Persona name='Gaudi' variant='iridescent' size='lg' showLabel levelRef={levelRef}
        state={listening ? 'listening' : reply.pending ? 'thinking' : speaking ? 'speaking' : 'idle'} />
      <p aria-live='polite'>{heard} {interim}</p>
      <SpeechInput
        deviceId={deviceId}
        onStateChange={(state) => setListening(state === 'listening')}
        onLevel={(level) => { levelRef.current = level; }}
        onInterim={setInterim}
        onTranscript={(text) => { setHeard(text); onSend(text, { voice }); }}
        onAudio={(blob) => transcribe(blob)}
      />
      <MicSelector value={deviceId} onValueChange={setDeviceId} />
      <VoiceSelector voices={exampleVoices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} />
      {reply.audioUrl ? (
        <AudioPlayer src={reply.audioUrl} title='Gaudi’s reply' peaks={reply.peaks} download='reply.wav'
          onPlay={() => setSpeaking(true)} onPause={() => setSpeaking(false)} onEnded={() => setSpeaking(false)} />
      ) : null}
    </section>
  );
}`;

// A sample in the chosen voice: the browser's speech synthesis when it has voices, else a short tone.
function speakSample(voice, { signal } = {}) {
  return new Promise((resolve) => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (synth && synth.getVoices().length) {
      const utterance = new SpeechSynthesisUtterance(`Hi, I'm ${voice.name}. This is how your replies will sound.`);
      utterance.onend = resolve;
      utterance.onerror = resolve;
      signal?.addEventListener('abort', () => synth.cancel());
      synth.speak(utterance);
      return;
    }
    const timer = setTimeout(resolve, 1400);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function VoiceModeDemo() {
  const levelRef = useRef(0);
  const [ deviceId, setDeviceId ] = useState();
  const [ voice, setVoice ] = useState('openai-nova');
  const [ heard, setHeard ] = useState('');
  const [ interim, setInterim ] = useState('');
  const [ listening, setListening ] = useState(false);
  const [ thinking, setThinking ] = useState(false);
  const [ speaking, setSpeaking ] = useState(false);
  const [ reply, setReply ] = useState(null);
  const voiceName = exampleVoices.find((item) => item.id === voice)?.name;

  useEffect(() => () => {
    if (reply) URL.revokeObjectURL(reply.url);
  }, [ reply ]);

  // Pretend the assistant answers a moment after the prompt ends.
  useEffect(() => {
    if (!thinking) return undefined;
    const timer = setTimeout(() => {
      const audio = synthesizeReply(6);
      setReply({ url: audio.url, peaks: computePeaks(audio.samples, 56), seconds: audio.seconds });
      setThinking(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [ thinking ]);

  const state = listening ? 'listening' : thinking ? 'thinking' : speaking ? 'speaking' : 'idle';
  const transcript = `${heard} ${interim}`.trim();

  return (
    <section aria-labelledby='voice-mode-title' className='border-border bg-surface grid w-full gap-5 rounded-(--ds-radius-card) border p-4 sm:p-6'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <h3 id='voice-mode-title' className='text-sm font-semibold'>Voice mode</h3>
        <Persona name='Gaudi' variant='iridescent' size='lg' state={state} levelRef={levelRef} showLabel />
      </div>

      <div className='grid gap-2'>
        <div className='border-border flex min-w-0 items-end gap-2 rounded-(--ds-radius-card) border p-2'>
          <p aria-live='polite' className='text-text min-h-8 min-w-0 flex-1 px-1 py-1.5 text-sm break-words' data-testid='voice-transcript'>
            {transcript || <span className='text-text-subtle'>Press the microphone and ask Gaudi something.</span>}
          </p>
          <SpeechInput
            deviceId={deviceId}
            onStateChange={(next) => {
              setListening(next === 'listening');
              if (next === 'listening') setHeard('');
            }}
            onLevel={(level) => {
              levelRef.current = level;
            }}
            onInterim={setInterim}
            onTranscript={(text) => {
              setHeard(text);
              setReply(null);
              setThinking(true);
            }}
          />
        </div>
        <p className='text-text-subtle text-xs'>Press Escape to stop listening. The ring and the orb follow your voice.</p>
      </div>

      {reply || thinking ? (
        <Message>
          <MessageContent>
            <MessageHeader>{`Gaudi · ${voiceName}`}</MessageHeader>
            {thinking ? <p className='text-text-muted text-sm'>Thinking…</p> : (
              <AudioPlayer
                src={reply.url}
                duration={reply.seconds}
                title='Gaudi’s reply'
                peaks={reply.peaks}
                download='gaudi-reply.wav'
                onPlay={() => setSpeaking(true)}
                onPause={() => setSpeaking(false)}
                onEnded={() => setSpeaking(false)}
              />
            )}
          </MessageContent>
        </Message>
      ) : null}

      <div className='grid gap-5 md:grid-cols-2'>
        <MicSelector value={deviceId} onValueChange={setDeviceId} />
        <VoiceSelector voices={exampleVoices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} className='max-h-96 overflow-y-auto' />
      </div>
    </section>
  );
}

export const VoiceMode = {
  name: 'Voice mode',
  beforeEach: () => installVoiceMocks(),
  parameters: {
    docs: {
      description: {
        story: 'A full voice turn. Allow the microphone, pick an input, then press the mic: the button rings with your level, the orb listens, the live transcript fills in, and stopping hands the prompt over. The orb thinks, then the spoken reply arrives as an AudioPlayer with a scrubbable waveform; playing it makes the orb speak. VoiceSelector picks the voice that answers and plays samples. This example uses a simulated microphone and speech service so it runs anywhere; in an app the same props drive the Web Speech API, MediaRecorder (through `onAudio`) and getUserMedia.'
      },
      source: { code: voiceModeSource, language: 'jsx' }
    }
  },
  render: () => <VoiceModeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Device names appear once access is allowed.
    await userEvent.click(await canvas.findByRole('button', { name: 'Allow microphone' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Microphone' })).toBeInTheDocument());

    const mic = canvas.getByRole('button', { name: 'Start voice input' });
    await waitFor(() => expect(mic).toBeEnabled());
    await userEvent.click(mic);
    const stop = await canvas.findByRole('button', { name: 'Stop voice input' });
    await expect(stop).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('img', { name: 'Gaudi: Listening' })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByTestId('voice-transcript')).toHaveTextContent('three short bullet points'), { timeout: 5000 });

    // Escape stops listening; the reply arrives as a player.
    stop.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Start voice input' })).toHaveAttribute('aria-pressed', 'false'));
    const seek = await canvas.findByRole('slider', { name: 'Seek Gaudi’s reply' }, { timeout: 4000 });
    await expect(seek).toHaveAttribute('aria-valuetext', '0:00 of 0:06');
    await expect(canvas.getByRole('button', { name: 'Playback speed 1×' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Playback speed 1×' }));
    await expect(canvas.getByRole('button', { name: 'Playback speed 1.5×' })).toBeInTheDocument();

    // Choosing a voice is a radio choice; samples have their own buttons.
    const george = canvas.getByRole('radio', { name: /George/ });
    await userEvent.click(george);
    await expect(george).toBeChecked();
    await expect(canvas.getByText('Gaudi · George')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Play a sample of George' })).toBeInTheDocument();
  }
};

