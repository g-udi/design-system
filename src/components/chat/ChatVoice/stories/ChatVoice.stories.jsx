import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chatMeta } from '../../stories/story-helpers.jsx';
import Button from '../../../core/Button/index.js';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '../../ChatMessage/index.js';
import { ChatPersona } from '../../ChatPersona/index.js';
import { ChatAudioPlayer, ChatMicSelector, ChatSpeechInput, ChatVoiceSelector, computePeaks } from '../index.js';
import { exampleVoices } from './fixtures/exampleVoices.js';
import { installVoiceMocks, synthesizeReply } from './story-mocks.js';

export default {
  title: 'Chat/ChatVoice',
  id: 'chat-voice',
  tags: ['autodocs'],
  ...chatMeta('ChatVoice', { component: ChatSpeechInput, primary: () => VoiceMode, wide: true })
};

const voiceModeSource = `import { useRef, useState } from 'react';
// Supply voices and service callbacks from your application.
import { ChatAudioPlayer, ChatMicSelector, ChatPersona, ChatSpeechInput, ChatVoiceSelector } from '@gaudi/design-system/chat';

function VoiceMode({ reply, onSend, transcribe, voices, speakSample }) {
  const levelRef = useRef(0);
  const [ deviceId, setDeviceId ] = useState();
  const [ voice, setVoice ] = useState('openai-nova');
  const [ heard, setHeard ] = useState('');
  const [ interim, setInterim ] = useState('');
  const [ listening, setListening ] = useState(false);
  const [ speaking, setSpeaking ] = useState(false);

  return (
    <section aria-label='Voice mode'>
      <ChatPersona name='Gaudi' variant='iridescent' size='lg' showLabel levelRef={levelRef}
        state={listening ? 'listening' : reply.pending ? 'thinking' : speaking ? 'speaking' : 'idle'} />
      <p aria-live='polite'>{heard} {interim}</p>
      <ChatSpeechInput
        deviceId={deviceId}
        onStateChange={(state) => setListening(state === 'listening')}
        onLevel={(level) => { levelRef.current = level; }}
        onInterim={setInterim}
        onTranscript={(text) => { setHeard(text); onSend(text, { voice }); }}
        onAudio={(blob) => transcribe(blob)}
      />
      <ChatMicSelector value={deviceId} onValueChange={setDeviceId} />
      <ChatVoiceSelector voices={voices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} />
      {reply.audioUrl ? (
        <ChatAudioPlayer src={reply.audioUrl} title='Gaudi’s reply' peaks={reply.peaks} download='reply.wav'
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
        <ChatPersona name='Gaudi' variant='iridescent' size='lg' state={state} levelRef={levelRef} showLabel />
      </div>

      <div className='grid gap-2'>
        <div className='border-border flex min-w-0 items-end gap-2 rounded-(--ds-radius-card) border p-2'>
          <p aria-live='polite' className='text-text min-h-8 min-w-0 flex-1 px-1 py-1.5 text-sm break-words' data-testid='voice-transcript'>
            {transcript || <span className='text-text-subtle'>Press the microphone and ask Gaudi something.</span>}
          </p>
          <ChatSpeechInput
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
        <ChatMessage>
          <ChatMessageContent>
            <ChatMessageHeader>{`Gaudi · ${voiceName}`}</ChatMessageHeader>
            {thinking ? <p className='text-text-muted text-sm'>Thinking…</p> : (
              <ChatAudioPlayer
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
          </ChatMessageContent>
        </ChatMessage>
      ) : null}

      <div className='grid gap-5 md:grid-cols-2'>
        <ChatMicSelector value={deviceId} onValueChange={setDeviceId} />
        <ChatVoiceSelector voices={exampleVoices} groupBy='provider' value={voice} onValueChange={setVoice} onPreview={speakSample} className='max-h-96 overflow-y-auto' />
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
        story: 'A full voice turn. Allow the microphone, pick an input, then press the mic: the button rings with your level, the orb listens, the live transcript fills in, and stopping hands the prompt over. The orb thinks, then the spoken reply arrives as an ChatAudioPlayer with a scrubbable waveform; playing it makes the orb speak. ChatVoiceSelector picks the voice that answers and plays samples. This example uses a simulated microphone and speech service so it runs anywhere; in an app the same props drive the Web Speech API, MediaRecorder (through `onAudio`) and getUserMedia.'
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


export const CaptureCancellation = {
  name: 'Cancel capture and pending transcription',
  beforeEach: () => installVoiceMocks(),
  parameters: { docs: { description: { story: 'Disabling voice input releases capture and discards a pending transcript. The microphone and transcription service are simulated locally.' } } },
  render: function CaptureCancellationExample() {
    const [speechDisabled, setSpeechDisabled] = useState(false);
    const [recorderDisabled, setRecorderDisabled] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [pending, setPending] = useState(false);
    const resolveAudio = useRef(null);
    const [previewStatus, setPreviewStatus] = useState('No sample playing');
    const [meter, setMeter] = useState(true);
    return <div className='grid w-full max-w-md gap-4'>
      <div className='flex flex-wrap items-center gap-2' data-testid='speech-capture'>
        <ChatSpeechInput mode='speech' showLevel={false} disabled={speechDisabled} onTranscript={setTranscript} />
        <Button variant='outline' onClick={() => setSpeechDisabled(true)}>Disable dictation</Button>
      </div>
      <div className='flex flex-wrap items-center gap-2' data-testid='recorder-capture'>
        <ChatSpeechInput mode='recorder' showLevel={false} disabled={recorderDisabled} onTranscript={setTranscript} onAudio={() => new Promise((resolve) => { resolveAudio.current = resolve; setPending(true); })} />
        <Button variant='outline' onClick={() => setRecorderDisabled(true)}>Disable recording</Button>
        <Button variant='outline' disabled={!pending} onClick={() => { resolveAudio.current?.('Stale transcript'); setPending(false); }}>Finish transcription</Button>
      </div>
      <div className='grid gap-2' data-testid='meter-capture'>
        <ChatMicSelector meter={meter} />
        <Button variant='outline' onClick={() => setMeter((shown) => !shown)}>Toggle microphone test</Button>
      </div>
      <ChatVoiceSelector voices={exampleVoices.slice(0, 2)} searchable onPreview={(voice, { signal }) => new Promise((resolve) => {
        setPreviewStatus(`Playing ${voice.name}`);
        signal.addEventListener('abort', () => { setPreviewStatus('Sample stopped'); resolve(); }, { once: true });
      })} />
      <output data-testid='sample-status' className='text-sm text-text-muted'>{previewStatus}</output>
      <output data-testid='cancelled-transcript' className='text-sm text-text-muted'>{transcript || 'No transcript'}</output>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const speech = within(canvas.getByTestId('speech-capture'));
    await waitFor(() => expect(speech.getByRole('button', { name: 'Start voice input' })).toBeEnabled());
    await userEvent.click(speech.getByRole('button', { name: 'Start voice input' }));
    await expect(speech.getByRole('button', { name: 'Stop voice input' })).toHaveAttribute('data-state', 'listening');
    await userEvent.click(speech.getByRole('button', { name: 'Disable dictation' }));
    await waitFor(() => expect(speech.getByRole('button', { name: 'Start voice input' })).toBeDisabled());
    await expect(speech.getByRole('button', { name: 'Start voice input' })).toHaveAttribute('data-state', 'idle');

    const recorder = within(canvas.getByTestId('recorder-capture'));
    await userEvent.click(recorder.getByRole('button', { name: 'Start voice input' }));
    await userEvent.click(await recorder.findByRole('button', { name: 'Stop voice input' }));
    await waitFor(() => expect(recorder.getByRole('button', { name: 'Transcribing' })).toHaveAttribute('data-state', 'processing'));
    await userEvent.click(recorder.getByRole('button', { name: 'Disable recording' }));
    await waitFor(() => expect(recorder.getByRole('button', { name: 'Start voice input' })).toBeDisabled());
    await userEvent.click(recorder.getByRole('button', { name: 'Finish transcription' }));
    await waitFor(() => expect(recorder.getByRole('button', { name: 'Finish transcription' })).toBeDisabled());
    await expect(canvas.getByTestId('cancelled-transcript')).toHaveTextContent('No transcript');
    const microphone = within(canvas.getByTestId('meter-capture'));
    const allow = microphone.queryByRole('button', { name: 'Allow microphone' });
    if (allow) await userEvent.click(allow);
    await userEvent.click(microphone.getByRole('button', { name: 'Test microphone', exact: true }));
    await expect(await microphone.findByRole('button', { name: 'Stop test' })).toBeVisible();
    await userEvent.click(microphone.getByRole('button', { name: 'Toggle microphone test' }));
    await waitFor(() => expect(microphone.queryByRole('button', { name: 'Stop test' })).not.toBeInTheDocument());
    await userEvent.click(microphone.getByRole('button', { name: 'Toggle microphone test' }));
    await expect(microphone.getByRole('button', { name: 'Test microphone', exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: `Play a sample of ${exampleVoices[0].name}` }));
    await expect(canvas.getByTestId('sample-status')).toHaveTextContent(`Playing ${exampleVoices[0].name}`);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search voices' }), exampleVoices[1].name);
    await waitFor(() => expect(canvas.getByTestId('sample-status')).toHaveTextContent('Sample stopped'));
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Search voices' }));
    await expect(canvas.getByRole('button', { name: `Play a sample of ${exampleVoices[0].name}` })).toBeVisible();
  }
};
