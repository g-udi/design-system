import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { default as Button } from '../../../core/Button/index.js';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatPersona, personaStates, personaVariants } from '../index.js';

export default {
  title: 'Chat/ChatPersona',
  id: 'chat-persona',
  tags: ['autodocs'],
  ...chatMeta('ChatPersona', {
    component: ChatPersona,
    controls: { state: personaStates, variant: personaVariants, size: [ 'xs', 'sm', 'md', 'lg', 'xl' ], showLabel: 'boolean', name: 'text' },
    primary: () => Playground,
    wide: true
  })
};

export const Playground = {
  args: { name: 'Gaudi', state: 'listening', variant: 'iridescent', size: 'lg', showLabel: true },
  parameters: {
    docs: {
      description: { story: 'One assistant presence, eight renderers. Without a live level each state keeps its own rhythm; pass `level` or `levelRef` (for example from `useAudioLevel`) to follow real audio. The orb is an image named after the assistant and its state, each change is announced once, and readers who reduce motion see a still frame that still differs per state.' },
      source: playgroundSource('ChatPersona', { imports: "import { ChatPersona } from '@gaudi/design-system/chat';" })
    }
  },
  render: (args) => <ChatPersona {...args} />,
  play: async ({ args, canvasElement }) => {
    const orb = within(canvasElement).getByRole('img', { name: new RegExp(`^${args.name}: `) });
    await expect(orb.querySelector('[data-slot="voice-orb"]')).toHaveAttribute('data-orb', args.variant);
  }
};

const variantNotes = {
  iridescent: 'WebGL thin film, CSS fallback',
  mercury: 'CSS metal with a turning sheen',
  waveform: 'Canvas ring, traces live samples',
  activity: 'SVG dot sphere',
  circle: 'CSS disc that breathes and swells',
  bars: 'Five bars, a loading wave',
  cloud: 'WebGL sky, CSS fallback',
  radial: 'WebGL pinwheel, CSS fallback'
};

function OrbGallery() {
  const [ state, setState ] = useState('speaking');
  const [constrained, setConstrained] = useState(false);
  return (
    <div className='grid w-full gap-6'>
      <div role='group' aria-label='Persona state' className='flex flex-wrap gap-1.5'>
        <Button size='xs' variant='outline' aria-pressed={constrained} onClick={() => setConstrained((value) => !value)}>Constrain orbs</Button>
        {personaStates.map((item) => (
          <Button key={item} size='xs' variant={item === state ? 'soft' : 'ghost'} tone={item === state ? 'accent' : undefined} aria-pressed={item === state} onClick={() => setState(item)}>
            {item}
          </Button>
        ))}
      </div>
      <ul className='grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4'>
        {personaVariants.map((variant) => (
          <li key={variant} className='border-border flex flex-col items-center gap-2 rounded-(--ds-radius-card) border p-4 text-center'>
            <div data-testid='orb-container' style={{ width: constrained ? 64 : 96, maxWidth: '100%' }}>
              <ChatPersona name={`Gaudi (${variant})`} variant={variant} state={state} size='md' showLabel announce={false} />
            </div>
            <span className='text-sm font-medium capitalize'>{variant}</span>
            <span className='text-text-subtle text-xs'>{variantNotes[variant]}</span>
          </li>
        ))}
      </ul>
      <div className='flex flex-wrap items-end gap-4'>
        {[ 'xs', 'sm', 'md' ].map((size) => <ChatPersona key={size} name={`Gaudi, ${size}`} variant='activity' state={state} size={size} announce={false} />)}
        <span className='text-text-muted text-xs'>Activity orb at xs, sm and md, for a composer, a header or a sidebar.</span>
      </div>
    </div>
  );
}

export const Orbs = {
  name: 'Orbs and states',
  parameters: {
    docs: {
      description: { story: 'Every renderer in every state: idle rests, connecting circles, listening ripples, thinking interferes, speaking swells, asleep dims and stops, and error turns to the danger palette. Colours come from tokens (`--ds-voice-<variant>-from/to`), so the orbs follow the theme.' },
      source: { language: 'jsx', code: "import { useRef } from 'react';\nimport { ChatPersona } from '@gaudi/design-system/chat/ChatPersona';\nexport function PersonasExample() {\n  const levelRef = useRef(0);\n  const waveformRef = useRef([]);\n  // A host audio analyser may update these refs without rerendering React.\n  return <div className='flex flex-wrap gap-6'>\n    <ChatPersona name='Gaudi' variant='iridescent' state='speaking' showLabel />\n    <ChatPersona name='Gaudi' variant='mercury' state='thinking' showLabel />\n    <ChatPersona name='Gaudi' variant='waveform' state='listening' levelRef={levelRef} waveformRef={waveformRef} />\n    <ChatPersona name='Gaudi' variant='activity' state='asleep' size='sm' />\n    <ChatPersona name='Gaudi' variant='bars' state='thinking' size='sm' />\n    <ChatPersona name='Gaudi' variant='radial' state='speaking' levelRef={levelRef} />\n  </div>;\n}" }
    }
  },
  render: () => <OrbGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img')).toHaveLength(personaVariants.length + 3);
    await userEvent.click(canvas.getByRole('button', { name: 'Constrain orbs' }));
    await waitFor(() => {
      for (const container of canvas.getAllByTestId('orb-container')) {
        const bounds = container.getBoundingClientRect();
        const orb = container.querySelector('[data-slot="voice-orb"]').getBoundingClientRect();
        expect(orb.width).toBeLessThanOrEqual(bounds.width + 1);
        expect(Math.abs(orb.width - orb.height)).toBeLessThan(1);
      }
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Constrain orbs' }));
    // The orb-ui styles: five bars, a disc, and the two shader fields (or their CSS fallback).
    const orbOf = (variant) => canvas.getByRole('img', { name: new RegExp(`^Gaudi \\(${variant}\\)`) }).querySelector('[data-slot="voice-orb"]');
    await expect(orbOf('bars').querySelectorAll('.ds-part-voice-bar')).toHaveLength(5);
    await expect(orbOf('circle').querySelector('.ds-part-voice-circle-disc')).not.toBeNull();
    for (const variant of [ 'cloud', 'radial' ]) await expect(orbOf(variant)).toHaveAttribute('data-orb', variant);
    await userEvent.click(canvas.getByRole('button', { name: 'listening' }));
    await waitFor(() => expect(Number(getComputedStyle(orbOf('bars').querySelector('.ds-part-voice-bar:nth-child(3)')).height.replace('px', ''))).toBeGreaterThan(4));
    await userEvent.click(canvas.getByRole('button', { name: 'asleep' }));
    await expect(canvas.getByRole('button', { name: 'asleep' })).toHaveAttribute('aria-pressed', 'true');
    for (const variant of personaVariants) {
      await expect(canvas.getByRole('img', { name: `Gaudi (${variant}): Asleep` })).toBeInTheDocument();
    }
    await expect(canvasElement.querySelectorAll('[data-slot="voice-orb"][data-moving]')).toHaveLength(0);
    await userEvent.click(canvas.getByRole('button', { name: 'error' }));
    await expect(canvasElement.querySelectorAll('[data-slot="voice-orb"][data-state="error"]')).toHaveLength(personaVariants.length + 3);
  }
};
