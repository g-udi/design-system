import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import RadioGroup from './RadioGroup';

const docs = getComponentDocs('Core/RadioGroup');
const options = [
  { value: 'weekly', label: 'Weekly', description: 'A concise update every Friday.' },
  { value: 'monthly', label: 'Monthly', description: 'The highlights, once a month.' },
  { value: 'off', label: 'Off', description: 'Requires an administrator.', disabled: true }
];
const radio = (canvasElement, index) => within(canvasElement).getByRole('radio', { name: new RegExp(`^${options[index].label}`) });

export default {
  title: 'Core/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    description: 'text',
    variant: ['list', 'cards'],
    disabled: 'boolean',
    required: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    label: 'Reading digest',
    description: 'Choose how often we email you.',
    variant: 'list',
    disabled: false,
    required: false,
    onValueChange: fn()
  },
  parameters: {
    docs: {
      source: playgroundSource('RadioGroup', {
        imports: `import RadioGroup from '@gaudi/design-system/core/RadioGroup';\n\nconst options = ${JSON.stringify(options, null, 2)};`
      })
    }
  },
  render: (args) => <RadioGroup name='digest' defaultValue='weekly' options={options} {...args} />,
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).getByRole('group', { name: args.label })).toBeInTheDocument();
    await expect(radio(canvasElement, 2)).toBeDisabled();
    if (args.disabled) return expect(radio(canvasElement, 0)).toBeDisabled();
    await expect(radio(canvasElement, 0)).toBeChecked();
    await userEvent.click(radio(canvasElement, 1));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('monthly');
    // Native radios skip disabled options and wrap with the arrow keys.
    await userEvent.keyboard('{ArrowDown}');
    await expect(radio(canvasElement, 0)).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('weekly');
  }
};

function ControlledExample({ onValueChange }) {
  const [value, setValue] = useState('monthly');
  const update = (next) => {
    setValue(next);
    onValueChange(next);
  };
  return (
    <div className='grid gap-3 [&>button]:justify-self-start'>
      <RadioGroup label='Digest frequency' variant='cards' value={value} onValueChange={update} options={options} />
      <Button size='sm' variant='outline' onClick={() => setValue('weekly')}>Reset to weekly</Button>
    </div>
  );
}
export const Controlled = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'The host owns `value` and updates it from `onValueChange`. The `cards` variant gives each choice a larger target.' } } },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    await expect(radio(canvasElement, 1)).toBeChecked();
    await userEvent.click(radio(canvasElement, 0));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('weekly');
    await userEvent.click(radio(canvasElement, 1));
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Reset to weekly' }));
    await expect(radio(canvasElement, 0)).toBeChecked();
  }
};
