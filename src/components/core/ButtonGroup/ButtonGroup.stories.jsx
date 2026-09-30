import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Button from '../Button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './index.js';

const docs = getComponentDocs('Core/ButtonGroup');
// An inbox toolbar: labelled actions, a split reply button, and a pager with a page label.
const actions = [
  { label: 'Archive', icon: 'ArchiveIcon' },
  { label: 'Report', icon: 'FlagIcon' },
  { label: 'Snooze', icon: 'ClockIcon' }
];
const groups = ['Message actions', 'Reply', 'Pagination'];
const across = (orientation) => (orientation === 'vertical' ? 'horizontal' : 'vertical');
// Stacked groups stretch every child to one width, so icon buttons drop their fixed square size.
const iconSize = (orientation) => (orientation === 'vertical' ? 'md' : 'icon');

export default {
  title: 'Core/ButtonGroup',
  id: 'core-buttongroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { orientation: 'horizontal', onAction: fn() },
  parameters: {
    docs: {
      description: { story: 'An inbox toolbar with three groups: labelled actions, a split reply button with a separator, and a pager with a text label. `orientation` stacks every group, and the separator turns with it.' },
      source: playgroundSource('ButtonGroup', {
        imports: "import { Button, ButtonGroup } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        attributes: ["aria-label='Message actions'"],
        children: actions.map(({ label, icon }) => `  <Button variant='outline'>\n    <RegistryIcon lucide='${icon}' aria-hidden='true' />\n    ${label}\n  </Button>`).join('\n')
      })
    }
  },
  render: ({ onAction, orientation }) => (
    <div className={`flex flex-wrap justify-center gap-3 ${orientation === 'vertical' ? 'items-start' : 'items-center'}`}>
      <ButtonGroup orientation={orientation} aria-label={groups[0]}>
        {actions.map(({ label, icon }) => (
          <Button key={label} variant='outline' onClick={() => onAction(label)}>
            <RegistryIcon lucide={icon} aria-hidden='true' />
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup orientation={orientation} aria-label={groups[1]}>
        <Button onClick={() => onAction('Reply all')}>
          <RegistryIcon lucide='ReplyIcon' aria-hidden='true' />
          Reply all
        </Button>
        <ButtonGroupSeparator orientation={across(orientation)} />
        <Button size={iconSize(orientation)} aria-label='More reply options' onClick={() => onAction('More reply options')}>
          <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation={orientation} aria-label={groups[2]}>
        <Button variant='outline' size={iconSize(orientation)} aria-label='Previous page' onClick={() => onAction('Previous page')}>
          <RegistryIcon lucide={orientation === 'vertical' ? 'ChevronUpIcon' : 'ChevronLeftIcon'} aria-hidden='true' />
        </Button>
        <ButtonGroupText className='justify-center text-xs text-ui-muted-foreground tabular-nums'>Page 2 of 26</ButtonGroupText>
        <Button variant='outline' size={iconSize(orientation)} aria-label='Next page' onClick={() => onAction('Next page')}>
          <RegistryIcon lucide={orientation === 'vertical' ? 'ChevronDownIcon' : 'ChevronRightIcon'} aria-hidden='true' />
        </Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of groups) await expect(canvas.getByRole('group', { name })).toHaveAttribute('data-orientation', args.orientation);
    await userEvent.click(canvas.getByRole('button', { name: actions[1].label }));
    await expect(args.onAction).toHaveBeenCalledWith(actions[1].label);
    await userEvent.click(canvas.getByRole('button', { name: 'More reply options' }));
    await expect(args.onAction).toHaveBeenLastCalledWith('More reply options');
  }
};
