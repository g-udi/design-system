import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import Button from '../Button';
import PopoverRoot, { Popover, PopoverContent, PopoverTrigger } from './Popover';

const docs = getComponentDocs('Core/Popover');
const heading = 'Share this draft';
const shareUrl = 'gaudi.dev/d/tokens-oklch';
const people = [
  { name: 'Ahmad Assaf', role: 'Owner', tone: 'blue' },
  { name: 'Lina Haddad', role: 'Can edit', tone: 'teal' },
  { name: 'Sam Okafor', role: 'Can view', tone: 'amber' }
];

function SharePanel() {
  const [copied, setCopied] = useState(false);
  return (
    <div className='grid gap-3'>
      <div>
        <p className='m-0 font-semibold text-foreground'>{heading}</p>
        <p className='m-0 text-xs text-text-muted'>Anyone with the link can view.</p>
      </div>
      <div className='flex items-center gap-2'>
        <span className='flex min-h-8 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-text-muted'>
          <RegistryIcon lucide='LinkIcon' className='size-3.5 shrink-0' />
          <span className='truncate'>{shareUrl}</span>
        </span>
        <Button size='sm' variant='outline' onClick={() => setCopied(true)}>
          <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <ul className='m-0 grid list-none gap-2 border-t border-border p-0 pt-3'>
        {people.map((person) => (
          <li key={person.name} className='flex items-center gap-2'>
            <Avatar name={person.name} tone={person.tone} size='sm' alt='' />
            <span className='min-w-0 flex-1 truncate font-medium text-foreground'>{person.name}</span>
            <span className='text-xs text-text-muted'>{person.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Opens the popover once on mount so the preview shows the panel, not just the trigger.
function OpenOnMount({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const trigger = ref.current?.querySelector('[aria-haspopup="dialog"]');
    if (trigger?.getAttribute('aria-expanded') === 'false') trigger.click();
  }, []);
  return <div ref={ref} className='min-h-[21rem]'>{children}</div>;
}
const composedContent = 'Use the primitive slots when the trigger lives inside another layout.';

export default {
  title: 'Core/Popover',
  id: 'core-popover',
  component: PopoverRoot,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { trigger: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  // The panel is absolutely positioned, so reserve room for it below the trigger.
  decorators: [(Story) => <ExampleFrame className='min-h-56'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { trigger: 'Share' },
  parameters: {
    docs: {
      description: { story: 'A share panel with a copyable link and the people who have access. The preview opens it on load; Escape or a click outside closes it and returns focus to the trigger.' },
      source: playgroundSource('Popover', {
        imports: "import { Avatar, Button, Popover } from '@gaudi/design-system';",
        children: [
          `  <p>${heading}</p>`,
          `  <p>${shareUrl}</p>`,
          "  <Button size='sm' variant='outline' onClick={copyLink}>Copy</Button>",
          '  <ul>',
          '    {people.map((person) => (',
          "      <li key={person.name}><Avatar name={person.name} size='sm' alt='' /> {person.name} · {person.role}</li>",
          '    ))}',
          '  </ul>'
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <OpenOnMount>
      <PopoverRoot {...args} trigger={<><RegistryIcon lucide='Share2Icon' className='mr-2 size-4' />{args.trigger}</>}>
        <SharePanel />
      </PopoverRoot>
    </OpenOnMount>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.trigger });
    const panel = () => canvas.queryByText(heading);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    await expect(panel()).toBeVisible();
    await expect(canvas.getByText(people[1].name)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    // Leave the preview as it loads: open.
    await userEvent.click(trigger);
    await expect(panel()).toBeVisible();
  }
};

function ComposedExample() {
  const [open, setOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger aria-expanded={open} onClick={() => setOpen(!open)}>Open composed popover</PopoverTrigger>
      {open ? <PopoverContent>{composedContent}</PopoverContent> : null}
    </Popover>
  );
}
export const Composed = {
  parameters: { docs: { description: { story: 'Compose `Popover`, `PopoverTrigger`, and `PopoverContent` when the host owns the open state.' } } },
  render: () => <ComposedExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open composed popover' });
    await userEvent.click(trigger);
    await expect(canvas.getByText(composedContent)).toBeVisible();
    await userEvent.click(trigger);
    await expect(canvas.queryByText(composedContent)).not.toBeInTheDocument();
  }
};
