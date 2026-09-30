import { useEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Button from '../Button';
import Tooltip from './Tooltip';

const docs = getComponentDocs('Core/Tooltip');
const trigger = 'Copy link';
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const focusTooltip = async (canvasElement, name) => {
  await userEvent.tab();
  await expect(within(canvasElement).getByRole('button', { name })).toHaveFocus();
  return waitFor(() => page(canvasElement).getByRole('tooltip'));
};

// An editor toolbar: every icon button has a tooltip with its shortcut; Copy link follows the controls.
const tools = [
  { label: 'Bold', icon: 'Bold', shortcut: '⌘B' },
  { label: 'Italic', icon: 'Italic', shortcut: '⌘I' },
  { label: 'Underline', icon: 'Underline', shortcut: '⌘U' },
  { label: 'Add comment', icon: 'MessageSquare', shortcut: '⌘⌥M' },
  { label: 'Version history', icon: 'History' }
];

/** Hovers Copy link once on mount, so its tooltip opens after `delayDuration` and shows the current args. */
function CopyLinkTooltip(args) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }));
  }, []);
  return (
    <span ref={ref} className='ms-auto'>
      <Tooltip {...args}>
        <Button size='sm' variant='outline' tone='neutral'>
          <RegistryIcon lucide='Link' />
          {trigger}
        </Button>
      </Tooltip>
    </span>
  );
}

export default {
  title: 'Core/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { content: 'text', side: ['top', 'right', 'bottom', 'left'], delayDuration: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { content: 'Copy a link to this article', side: 'top', delayDuration: 300 },
  parameters: {
    docs: {
      description: { story: 'An editor toolbar where every icon button has a tooltip with its shortcut. The Copy link tooltip follows the controls and opens after `delayDuration` whenever they change, so `content` and `side` show immediately. Hover or focus any other button to compare.' },
      source: playgroundSource('Tooltip', {
        imports: "import { Button, Tooltip } from '@gaudi/design-system';",
        children: `  <Button variant='outline' tone='neutral'>${trigger}</Button>`
      })
    }
  },
  render: (args) => (
    <div className='mx-auto grid max-w-xl gap-3 rounded-lg border border-border p-4'>
      <div>
        <p className='text-sm font-medium'>Knowledge graphs in practice</p>
        <p className='text-xs text-text-muted'>Draft · edited 12 minutes ago</p>
      </div>
      <div className='flex flex-wrap items-center gap-1'>
        {tools.map(({ label, icon, shortcut }) => (
          <Tooltip key={label} side='bottom' content={<>{label}{shortcut ? <span className='ms-2 opacity-70'>{shortcut}</span> : null}</>}>
            <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={label}>
              <RegistryIcon lucide={icon} />
            </Button>
          </Tooltip>
        ))}
        <CopyLinkTooltip key={JSON.stringify(args)} {...args} />
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger });
    const hovered = await waitFor(() => page(canvasElement).getByRole('tooltip'));
    await expect(hovered).toHaveTextContent(args.content);
    await expect(hovered.closest('[data-side]')).toHaveAttribute('data-side', args.side);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page(canvasElement).queryByRole('tooltip')).not.toBeInTheDocument());
    button.focus();
    const focused = await waitFor(() => page(canvasElement).getByRole('tooltip'));
    await expect(focused).toHaveTextContent(args.content);
    await expect(button).toHaveAccessibleDescription(args.content);
  }
};

export const LongHint = {
  parameters: { docs: { description: { story: 'Longer hints wrap within the viewport, including on narrow phones.' } } },
  render: () => (
    <Tooltip content='This explanation wraps within the viewport, including on narrow phones.'>
      <Button variant='ghost'>About this collection</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const tooltip = await focusTooltip(canvasElement, 'About this collection');
    const bubble = tooltip.parentElement.getBoundingClientRect();
    await expect(bubble.width).toBeLessThanOrEqual(canvasElement.ownerDocument.documentElement.clientWidth);
    await userEvent.keyboard('{Escape}');
  }
};
