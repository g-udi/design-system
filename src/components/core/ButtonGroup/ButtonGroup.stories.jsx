import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import { ButtonGroup } from './index.js';

const docs = getComponentDocs('Core/ButtonGroup');
const actions = ['Archive', 'Report', 'Snooze'];

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
  args: { orientation: 'horizontal', 'aria-label': 'Message actions', onAction: fn() },
  parameters: {
    docs: {
      source: playgroundSource('ButtonGroup', {
        imports: "import { Button, ButtonGroup } from '@gaudi/design-system';",
        children: actions.map((action) => `  <Button variant='outline'>${action}</Button>`).join('\n')
      })
    }
  },
  render: ({ onAction, ...args }) => (
    <ButtonGroup {...args}>
      {actions.map((action) => (
        <Button key={action} variant='outline' onClick={() => onAction(action)}>{action}</Button>
      ))}
    </ButtonGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: args['aria-label'] })).toHaveAttribute('data-orientation', args.orientation);
    await userEvent.click(canvas.getByRole('button', { name: actions[1] }));
    await expect(args.onAction).toHaveBeenCalledWith(actions[1]);
  }
};
