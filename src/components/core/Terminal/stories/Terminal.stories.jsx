import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import Terminal, { terminalVariants } from '../Terminal';

const docs = getComponentDocs('Core/Terminal');
const options = (name) => Object.keys(terminalVariants.variants[name]);
// A release session: installs, tests and a push, with every output tone in one history.
const commands = [
  {
    command: 'pnpm add github:ahmadassaf/design-system',
    output: [
      { text: 'Packages resolved, downloaded, and linked.', tone: 'success' },
      { text: 'WARN 1 peer dependency expects react@^19.', tone: 'warning' }
    ]
  },
  {
    command: 'pnpm test:ds-contracts --filter=core',
    output: [
      { text: 'FAIL Toast.contract.test.js: 1 snapshot is obsolete.', tone: 'error' },
      { text: '85 component contracts passed.', tone: 'success' },
      { text: 'Done in 4.2s. Public Core exports verified.', tone: 'muted' }
    ]
  },
  {
    command: 'git push origin main',
    output: [
      { text: 'To github.com:ahmadassaf/design-system.git' },
      { text: '5e7f828..a41c9d2 main -> main', tone: 'success' }
    ]
  }
];
const ariaLabel = 'Design system release';
const lastOutput = commands.at(-1).output.at(-1).text;
const line = (scope, text) => within(scope).getByText(text).parentElement;

export default {
  title: 'Core/Data Display/Terminal',
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
    title: 'design-system — release',
    username: 'ahmad',
    promptSymbol: '$',
    typingSpeed: 35
  },
  parameters: {
    docs: {
      description: { story: 'A release session that installs, tests and pushes, with success, warning, error and muted output in one history. Every control restyles or replays it: `variant` switches between the dark code surface, a translucent one and the page surface, `animate` and `typingSpeed` retype the commands, and `size` sets the width and height.' },
      source: playgroundSource('Terminal', {
        imports: `import { Terminal } from '@gaudi/design-system';\n\nconst commands = ${JSON.stringify(commands, null, 2)};`,
        attributes: ['commands={commands}', `ariaLabel='${ariaLabel}'`]
      })
    }
  },
  render: (args) => <Terminal key={`${args.animate}-${args.typingSpeed}`} commands={commands} ariaLabel={ariaLabel} className='mx-auto' {...args} />,
  play: async ({ args, canvasElement }) => {
    const terminal = within(canvasElement).getByRole('region', { name: ariaLabel });
    if (args.showHeader) await expect(within(terminal).getByText(args.title)).toBeInTheDocument();
    await waitFor(() => expect(within(terminal).getByText(lastOutput)).toBeInTheDocument(), { timeout: 10000 });
    await expect(terminal.querySelector('pre')).toHaveTextContent(`${args.username}${args.promptSymbol}${commands[0].command}`);
    await expect(terminal).toHaveClass(...terminalVariants({ variant: args.variant, size: args.size, radius: args.radius }).split(' '));
    await expect(line(terminal, commands[0].output[0].text)).toHaveClass('text-success');
  }
};

export const LegacyOutputs = {
  parameters: {
    visualAudit: { wide: 'Terminals keep a fixed reading width.' }, docs: { description: { story: 'String `commands` with an `outputs` map keyed by command index remain supported for existing consumers.' } } },
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
    await expect(line(terminal, 'Build completed.')).toHaveClass('text-success');
  }
};
