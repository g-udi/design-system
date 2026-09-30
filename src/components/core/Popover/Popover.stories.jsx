import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import Button from '../Button';
import PopoverRoot, { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { PopoverDescription, PopoverHeader, PopoverTitle } from './parts/popover.jsx';

const docs = getComponentDocs('Core/Popover');
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const heading = 'Share this draft';
const shareUrl = 'gaudi.dev/d/tokens-oklch';
const people = [
  { name: 'Ahmad Assaf', role: 'Owner', src: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Lina Haddad', role: 'Can edit', src: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Sam Okafor', role: 'Can view', src: 'https://randomuser.me/api/portraits/men/75.jpg' }
];

function SharePanel() {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PopoverHeader>
        <PopoverTitle>{heading}</PopoverTitle>
        <PopoverDescription>Anyone with the link can view.</PopoverDescription>
      </PopoverHeader>
      <div className='flex items-center gap-2'>
        <span className='flex min-h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-text-muted'>
          <RegistryIcon lucide='LinkIcon' className='size-3.5 shrink-0' />
          <span className='truncate'>{shareUrl}</span>
        </span>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setCopied(true)}>
          <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <ul className='m-0 grid list-none gap-2 border-t border-border p-0 pt-2'>
        {people.map((person) => (
          <li key={person.name} className='flex items-center gap-2'>
            <Avatar src={person.src} name={person.name} size='sm' shape='circle' alt='' />
            <span className='min-w-0 flex-1 truncate font-medium text-text'>{person.name}</span>
            <span className='text-xs text-text-muted'>{person.role}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default {
  title: 'Core/Overlays & Menus/Popover',
  id: 'core-popover',
  component: PopoverRoot,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { trigger: 'text', side: ['top', 'right', 'bottom', 'left'], align: ['start', 'center', 'end'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { trigger: 'Share', side: 'bottom', align: 'center', onOpenChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A share panel with a copyable link and the people who have access, open on load. `side` and `align` place it around the button; Escape or a click outside closes it and returns focus to the button.' },
      source: playgroundSource('Popover', {
        imports: "import { Avatar, Button, Popover, PopoverDescription, PopoverHeader, PopoverTitle } from '@gaudi/design-system';",
        children: [
          '  <PopoverHeader>',
          `    <PopoverTitle>${heading}</PopoverTitle>`,
          '    <PopoverDescription>Anyone with the link can view.</PopoverDescription>',
          '  </PopoverHeader>',
          "  <Button size='sm' variant='outline' tone='neutral' onClick={copyLink}>Copy</Button>",
          '  <ul>',
          '    {people.map((person) => (',
          "      <li key={person.name}><Avatar src={person.src} name={person.name} size='sm' alt='' /> {person.name} · {person.role}</li>",
          '    ))}',
          '  </ul>'
        ].join('\n')
      })
    }
  },
  // The stage leaves room on every side; `key` reopens the panel when a placement control changes.
  render: (args) => (
    <div className='flex min-h-[32rem] items-center justify-center'>
      <PopoverRoot key={`${args.side}-${args.align}`} defaultOpen modal={false} {...args} trigger={<><RegistryIcon lucide='Share2Icon' />{args.trigger}</>}>
        <SharePanel />
      </PopoverRoot>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const body = page(canvasElement);
    const trigger = within(canvasElement).getByRole('button', { name: args.trigger });
    const panel = () => body.queryByRole('dialog');
    await waitFor(() => expect(panel()).toBeVisible());
    await expect(panel()).toHaveAttribute('data-side', args.side);
    await expect(panel()).toHaveAttribute('data-align', args.align);
    await expect(within(panel()).getByText(people[1].name)).toBeVisible();
    await userEvent.click(within(panel()).getByRole('button', { name: 'Copy' }));
    await expect(within(panel()).getByRole('button', { name: 'Copied' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await userEvent.click(trigger);
    await waitFor(() => expect(panel()).toBeVisible());
    await userEvent.click(canvasElement);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    // Leave the preview as it loads: open.
    await userEvent.click(trigger);
    await waitFor(() => expect(panel()).toBeVisible());
  }
};

const snoozeOptions = ['Later today', 'Tomorrow', 'Next week'];
function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [snoozed, setSnoozed] = useState('');
  return (
    <div className='flex min-h-56 items-start justify-center gap-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' tone='neutral'><RegistryIcon lucide='AlarmClockIcon' />Snooze</Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-48'>
          <PopoverHeader>
            <PopoverTitle>Snooze until</PopoverTitle>
          </PopoverHeader>
          <div className='grid gap-1'>
            {snoozeOptions.map((option) => (
              <Button key={option} size='sm' variant='ghost' tone='neutral' className='justify-start' onClick={() => {
                setSnoozed(option);
                setOpen(false);
              }}>
                {option}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <p role='status' className='pt-1.5 text-sm text-text-muted'>{snoozed ? `Snoozed until ${snoozed.toLowerCase()}.` : 'Not snoozed.'}</p>
    </div>
  );
}

export const Composed = {
  name: 'Controlled composition',
  parameters: { docs: { description: { story: 'Compose `Popover`, `PopoverTrigger` and `PopoverContent` with `open` and `onOpenChange` when the host decides when the panel closes, here right after a choice.' } } },
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Snooze' });
    await userEvent.click(trigger);
    const panel = await page(canvasElement).findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Tomorrow' }));
    await waitFor(() => expect(panel).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Snoozed until tomorrow.');
    await expect(trigger).toHaveFocus();
  }
};
