import { useId, useRef, useState } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import DropDown from './DropDown';

const docs = getComponentDocs('Navigation/DropDown');
// The featured menu follows the controls; its neighbours are ordinary closed triggers.
const topics = [
  { href: '/blog/categories/data', icon: 'Database', title: 'Data', description: 'Everything AI, ML and data' },
  { href: '/blog/categories/engineering', icon: 'Code2', title: 'Engineering', description: 'Development, programming and code' },
  { href: '/blog/categories/management', icon: 'UsersRound', title: 'Management', description: 'Engineering leadership' },
  { href: '/blog/categories/productivity', icon: 'Zap', title: 'Productivity', description: 'Tools, habits and tips' }
];
const neighbours = ['Projects', 'About'];

function NeighbourMenu({ name }) {
  const [open, setOpen] = useState(false);
  return <DropDown name={name} menuDropDownOpen={open} setMenuDropDownOpen={setOpen} />;
}

// A site header: the featured trigger opens a topic panel in the page flow beneath the bar.
function TopicsMenu({ menuDropDownOpen, name, setMenuDropDownOpen }) {
  const [open, setOpen] = useState(menuDropDownOpen);
  const boundaryRef = useRef(null);
  const id = useId();
  const update = (next) => {
    setOpen(next);
    setMenuDropDownOpen(next);
  };
  return (
    <div ref={boundaryRef} className='overflow-hidden rounded-card border border-border bg-surface'>
      <nav aria-label='Site' className='flex flex-wrap items-center gap-x-2 border-b border-border px-3'>
        <DropDown
          id={`${id}-trigger`}
          controlsId={`${id}-panel`}
          name={name}
          menuDropDownOpen={open}
          setMenuDropDownOpen={update}
          outsideClickRef={boundaryRef}
        />
        {neighbours.map((neighbour) => <NeighbourMenu key={neighbour} name={neighbour} />)}
      </nav>
      <div id={`${id}-panel`} aria-labelledby={`${id}-trigger`} hidden={!open} className='grid gap-1 p-2 sm:grid-cols-2'>
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href} variant='bare' className='flex items-start gap-3 rounded-md p-2.5 hover:bg-surface-muted'>
            <span className='flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent'>
              <Icon name={topic.icon} decorative size='sm' />
            </span>
            <span>
              <span className='block text-sm font-semibold text-text'>{topic.title}</span>
              <span className='block text-xs text-text-muted'>{topic.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default {
  title: 'Navigation/DropDown',
  id: 'navigation-dropdown',
  component: DropDown,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { name: 'text', menuDropDownOpen: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>],
  args: { name: 'Topics', setMenuDropDownOpen: fn() }
};

export const Playground = {
  args: { name: 'Topics', menuDropDownOpen: true },
  parameters: {
    docs: {
      description: { story: 'A site header with three menus. The featured trigger follows the controls: `name` sets its label and `menuDropDownOpen` opens its topic panel, turns the trigger accent, and flips the chevron. `outsideClickRef` spans the bar and the panel, so clicks inside the panel keep it open.' },
      source: playgroundSource('DropDown', {
        imports: "import { useState } from 'react';\nimport { DropDown } from '@gaudi/design-system';\n\nconst [open, setOpen] = useState(false);",
        attributes: ["controlsId='topics-panel'", 'setMenuDropDownOpen={setOpen}'],
        after: "\n<div id='topics-panel' hidden={!open}>{/* topic links */}</div>"
      })
    }
  },
  // Remount when the control changes so the local state starts from the chosen value.
  render: (args) => <TopicsMenu key={String(args.menuDropDownOpen)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.name });
    const panel = () => document.getElementById(trigger.getAttribute('aria-controls'));
    await expect(trigger).toHaveAttribute('aria-expanded', String(args.menuDropDownOpen));
    if (args.menuDropDownOpen) {
      await expect(within(panel()).getByRole('link', { name: /^Engineering/ })).toBeVisible();
      trigger.focus();
      await userEvent.keyboard('{Escape}');
      await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(false);
      await expect(trigger).toHaveFocus();
    }
    await expect(panel()).not.toBeVisible();
    await userEvent.click(trigger);
    await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Clicks inside the outsideClickRef boundary keep the panel open; clicks outside close it.
    await fireEvent.click(panel());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(document.body);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // Leave the preview in the state the controls describe.
    if (args.menuDropDownOpen) await userEvent.click(trigger);
  }
};
