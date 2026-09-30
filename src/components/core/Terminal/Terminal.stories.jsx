import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Terminal, { terminalVariants } from './Terminal';

const docs = getComponentDocs('Core/Terminal');
const options = (name) => Object.keys(terminalVariants.variants[name]);
const commands = [
  {
    command: 'pnpm add github:ahmadassaf/design-system',
    output: [{ text: 'Packages resolved, downloaded, and linked.', tone: 'success' }]
  },
  {
    command: 'pnpm test:ds-contracts',
    output: [
      { text: '85 component contracts passed.', tone: 'success' },
      { text: 'Public Core exports verified.', tone: 'muted' }
    ]
  }
];
const lastOutput = commands.at(-1).output.at(-1).text;
const line = (scope, text) => within(scope).getByText(text).parentElement;

export default {
  title: 'Core/Terminal',
  id: 'core-terminal',
  component: Terminal,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: options('variant'),
    size: options('size'),
    radius: options('radius'),
    showHeader: 'boolean',
    animate: 'boolean',
    title: 'text',
    username: 'text',
    promptSymbol: 'text',
    typingSpeed: 'number'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    variant: 'dark',
    size: 'md',
    radius: 'lg',
    showHeader: true,
    animate: true,
    title: 'design-system — bash',
    username: 'ahmad',
    promptSymbol: '$',
    typingSpeed: 35,
    ariaLabel: 'Design system install'
  },
  parameters: {
    docs: {
      source: playgroundSource('Terminal', {
        imports: `import { Terminal } from '@gaudi/design-system';\n\nconst commands = ${JSON.stringify(commands, null, 2)};`
      })
    }
  },
  render: (args) => <Terminal key={`${args.animate}`} commands={commands} {...args} />,
  play: async ({ args, canvasElement }) => {
    const terminal = within(canvasElement).getByRole('region', { name: args.ariaLabel });
    if (args.showHeader) await expect(within(terminal).getByText(args.title)).toBeInTheDocument();
    await waitFor(() => expect(within(terminal).getByText(lastOutput)).toBeInTheDocument(), { timeout: 10000 });
    await expect(terminal.querySelector('pre')).toHaveTextContent(`${args.username}${args.promptSymbol}${commands[0].command}`);
  }
};

export const Variants = {
  parameters: { docs: { description: { story: 'Each `variant` retunes the surface and output tones. `animate={false}` renders the full history at once.' } } },
  render: () => (
    <div className='grid gap-4'>
      {options('variant').map((variant) => (
        <Terminal key={variant} animate={false} size='sm' commands={commands} title={variant} ariaLabel={`${variant} terminal`} variant={variant} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const terminal = (variant) => canvas.getByRole('region', { name: `${variant} terminal` });
    await expect(terminal('dark')).toHaveClass('bg-gray-950', 'text-gray-100');
    await expect(terminal('translucent')).toHaveClass('bg-gray-950/90', 'backdrop-blur');
    await expect(terminal('light')).toHaveClass('bg-white', 'text-gray-950');
    await expect(line(terminal('dark'), commands[0].output[0].text)).toHaveClass('text-green-300');
    await expect(line(terminal('light'), commands[0].output[0].text)).toHaveClass('text-green-700');
    await expect(line(terminal('dark'), lastOutput)).toBeInTheDocument();
  }
};

export const LegacyOutputs = {
  parameters: { docs: { description: { story: 'String `commands` with an `outputs` map keyed by command index remain supported for existing consumers.' } } },
  render: () => (
    <Terminal
      animate={false}
      size='sm'
      showHeader={false}
      commands={['pnpm content', 'pnpm build']}
      outputs={{ 0: ['Generated posts, projects, and thoughts.'], 1: [{ text: 'Build completed.', tone: 'success' }] }}
    />
  ),
  play: async ({ canvasElement }) => {
    const terminal = within(canvasElement).getByRole('region', { name: 'Terminal' });
    await expect(terminal.querySelector('pre')).toHaveTextContent('ahmad$pnpm content');
    await expect(line(terminal, 'Build completed.')).toHaveClass('text-green-300');
  }
};
