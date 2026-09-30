import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Button from '../Button';
import { KbdRoot as Kbd } from '../Kbd';
import Tooltip from './Tooltip';

const docs = getComponentDocs('Core/Tooltip');
const trigger = 'Copy link';
const page = (canvasElement) => within(canvasElement.ownerDocument.body);

// An editor toolbar: every icon button has a tooltip with its shortcut; Copy link follows the controls.
const tools = [
  { label: 'Bold', icon: 'Bold', shortcut: '⌘B' },
  { label: 'Italic', icon: 'Italic', shortcut: '⌘I' },
  { label: 'Underline', icon: 'Underline', shortcut: '⌘U' },
  { label: 'Add comment', icon: 'MessageSquare', shortcut: '⌘⌥M' },
  { label: 'Version history', icon: 'History', hint: 'See every saved version of this draft and restore an earlier one.' }
];

export default {
  title: 'Core/Tooltip', id: 'core-tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { content: 'text', side: ['top', 'right', 'bottom', 'left'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { content: 'Copy a link to this article', side: 'top', onOpenChange: fn() },
  parameters: {
    docs: {
      description: { story: 'An editor toolbar where every icon button has a tooltip with its shortcut, and a longer hint that wraps. The Copy link tooltip follows the controls and starts open with `defaultOpen`; hover or focus any other button to compare.' },
      source: playgroundSource('Tooltip', {
        imports: "import { Button, Tooltip } from '@gaudi/design-system';",
        attributes: ['defaultOpen'],
        children: `  <Button variant='outline' tone='neutral'>${trigger}</Button>`
      })
    }
  },
  render: (args) => (
    <div className='mx-auto grid max-w-xl gap-3 rounded-lg border border-border p-3'>
      <div>
        <p className='text-sm font-medium'>Knowledge graphs in practice</p>
        <p className='text-xs text-text-muted'>Draft · edited 12 minutes ago</p>
      </div>
      <div className='flex flex-wrap items-center gap-1'>
        {tools.map(({ label, icon, shortcut, hint }) => (
          <Tooltip key={label} side='bottom' content={hint || <>{label}{shortcut ? <Kbd>{shortcut}</Kbd> : null}</>}>
            <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={label}>
              <RegistryIcon lucide={icon} />
            </Button>
          </Tooltip>
        ))}
        <Tooltip key={`${args.content}-${args.side}`} defaultOpen {...args}>
          <Button size='sm' variant='outline' tone='neutral' className='ms-auto'>
            <RegistryIcon lucide='Link' />
            {trigger}
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger });
    const tooltip = () => page(canvasElement).queryByRole('tooltip');
    const dismiss = async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(tooltip()).not.toBeInTheDocument());
    };
    await waitFor(() => expect(tooltip()).toHaveTextContent(args.content));
    await expect(tooltip().closest('[data-side]')).toHaveAttribute('data-side', args.side);
    await dismiss();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    // A long hint wraps inside the viewport instead of running off it.
    within(canvasElement).getByRole('button', { name: 'Version history' }).focus();
    await waitFor(() => expect(tooltip()).toHaveTextContent('See every saved version'));
    await expect(tooltip().parentElement.getBoundingClientRect().width).toBeLessThanOrEqual(canvasElement.ownerDocument.documentElement.clientWidth);
    await dismiss();
    // Focus opens the hint and describes the button; the preview rests here.
    button.focus();
    await waitFor(() => expect(button).toHaveAccessibleDescription(args.content));
  }
};
