import { expect, within } from 'storybook/test';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { chatMeta } from '../story-helpers.jsx';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { AgentMark, agentHues, agentMotifs } from './index.js';

export default {
  title: 'Chat/AgentMark',
  id: 'chat-agentmark',
  tags: ['autodocs'],
  ...chatMeta('AgentMark', {
    component: AgentMark,
    controls: { name: 'text', motif: ['auto', ...Object.keys(agentMotifs)], hue: ['auto', ...agentHues], size: ['xs', 'sm', 'md', 'lg', 'xl'], state: ['idle', 'thinking', 'streaming', 'tool', 'done', 'error'] },
    primary: () => Playground
  })
};

export const Playground = {
  args: { name: 'Gaudi', motif: 'auto', hue: 'auto', size: 'xl', state: 'idle' },
  parameters: {
    docs: {
      description: { story: 'Each agent gets a Gaudí-inspired mark: trencadís mosaic, basilica spires, a wrought-iron spiral, a rose window, the palmetto gate, the flower paving tile, a twisted chimney, a sun medallion or the nativity star, glazed in one of eight tile hues. The name, or a `seed` such as the agent id, picks both, so an agent keeps the same mark everywhere; `motif` and `hue` pin them. Change the name with motif and hue on auto to see a different mark. `state` adds an ActivityIndicator badge at the corner.' },
      source: playgroundSource('AgentMark', { imports: "import { AgentMark } from '@gaudi/design-system/chat';" })
    }
  },
  render: (args) => <AgentMark {...args} />,
  play: async ({ args, canvasElement }) => {
    const mark = within(canvasElement).getByRole('img', { name: args.name });
    await expect(mark).toHaveAttribute('data-slot', 'agent-mark');
    await expect(mark.querySelector('svg[data-agent-motif]')).not.toBeNull();
  }
};

export const Motifs = {
  name: 'Motifs and glazes',
  parameters: { docs: { description: { story: 'The nine motifs, each in a different glaze, then one motif across all eight hues. Motifs are drawn bare, a deep glaze on light surfaces and a bright one on dark.' } } },
  render: () => (
    <div className='grid gap-6'>
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        {Object.entries(agentMotifs).map(([motif, label], index) => (
          <li key={motif} className='flex items-center gap-3 text-sm'>
            <AgentMark name={label} motif={motif} hue={agentHues[index]} size='lg' />
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <div className='flex flex-wrap gap-2'>
        {agentHues.map((hue) => <AgentMark key={hue} name={`Trencadís in ${hue}`} motif='trencadis' hue={hue} size='md' />)}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('img')).toHaveLength(Object.keys(agentMotifs).length + agentHues.length);
  }
};

export const Statuses = {
  name: 'Status at every size',
  parameters: { docs: { description: { story: 'The status dot scales with the mark, about a quarter of its size, and sits on the corner ringed by the surface. Colour shows the state; the state is announced for screen readers.' } } },
  render: () => (
    <div className='grid gap-4'>
      {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
        <div key={size} className='flex flex-wrap items-center gap-4'>
          <span className='text-text-muted w-6 text-xs'>{size}</span>
          {['thinking', 'streaming', 'tool', 'done', 'error'].map((state) => <AgentMark key={state} name={`Gaudi, ${state}`} seed='gaudi' size={size} state={state} />)}
        </div>
      ))}
    </div>
  )
};

export const IconsAndMonograms = {
  name: 'Icon, image or monogram instead',
  parameters: { docs: { description: { story: 'When an agent has its own icon, picture or initials, those sit on a `tone` tile instead of a motif.' } } },
  render: () => (
    <div className='flex items-center gap-3'>
      <AgentMark name='Search agent' icon='Search' tone='discovery' size='lg' />
      <AgentMark name='Fact checker' monogram tone='neutral' size='lg' />
      <AgentMark name='Editor' image='https://randomuser.me/api/portraits/women/44.jpg' size='lg' />
      <AgentMark name='Publisher' icon='Send' tone='solid' size='lg' />
    </div>
  )
};

export const InAThread = {
  name: 'In a thread, with several agents',
  parameters: { docs: { description: { story: 'Each agent’s name picks its own motif and glaze, so the agents in one conversation are easy to tell apart. The visible name sits beside each mark, so the marks are decorative here and the header names the sender.' } } },
  render: () => (
    <div className='flex w-full max-w-lg flex-col gap-4 text-sm'>
      <Message>
        <AgentMark size='sm' decorative state='done' />
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <p>I asked the Research agent for recent drop-off studies.</p>
        </MessageContent>
      </Message>
      <Message>
        <AgentMark name='Research agent' size='sm' decorative state='streaming' />
        <MessageContent>
          <MessageHeader className='px-0'>Research agent</MessageHeader>
          <p>Reading three papers from 2024 and one archive report…</p>
        </MessageContent>
      </Message>
      <Message>
        <AgentMark name='Fact checker' size='sm' decorative state='error' />
        <MessageContent>
          <MessageHeader className='px-0'>Fact checker</MessageHeader>
          <p>Couldn’t open the 2023 survey; it needs a login.</p>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Research agent', { selector: '[data-slot="message-header"]' })).toBeVisible();
  }
};
