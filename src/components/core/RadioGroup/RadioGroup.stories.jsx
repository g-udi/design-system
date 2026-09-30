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
const radio = (canvasElement, index, choices = options) => within(canvasElement).getByRole('radio', { name: new RegExp(`^${choices[index].label}`) });
// A billing plan picker: a free tier, the recommended plan, and a plan the account cannot choose yet.
const plans = [
  { value: 'hobby', label: 'Hobby', description: 'Free · one site and community support.' },
  { value: 'pro', label: 'Pro', description: '$12 a month · custom domains and five editors.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Needs an annual contract · SSO and audit logs.', disabled: true }
];

export default {
  title: 'Core/Inputs/RadioGroup', id: 'core-radiogroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    description: 'text',
    variant: ['list', 'cards'],
    disabled: 'boolean'
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
    label: 'Plan',
    description: 'You can switch plans at any time; changes apply from the next invoice.',
    variant: 'cards',
    disabled: false,
    onValueChange: fn()
  },
  parameters: {
    docs: {
      description: { story: 'A billing plan picker with a free tier, the selected plan, and an unavailable plan. `variant` switches between compact rows and bordered cards that highlight the choice, and `disabled` locks the whole fieldset.' },
      source: playgroundSource('RadioGroup', {
        imports: `import RadioGroup from '@gaudi/design-system/core/RadioGroup';\n\nconst plans = ${JSON.stringify(plans, null, 2)};`,
        attributes: ["name='plan'", "defaultValue='pro'", 'options={plans}']
      })
    }
  },
  render: (args) => <RadioGroup name='plan' defaultValue='pro' options={plans} {...args} />,
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: args.label });
    const choice = (index) => radio(canvasElement, index, plans);
    await expect(group.querySelector('.ds-radio-options').classList.contains('ds-radio-cards')).toBe(args.variant === 'cards');
    await expect(within(group).getByText(args.description)).toBeVisible();
    await expect(choice(2)).toBeDisabled();
    await expect(choice(1)).toBeChecked();
    if (args.disabled) return expect(choice(0)).toBeDisabled();
    await userEvent.click(choice(0));
    await expect(args.onValueChange).toHaveBeenLastCalledWith('hobby');
    // Native radios move with the arrow keys and skip the disabled plan.
    await userEvent.keyboard('{ArrowDown}');
    await expect(choice(1)).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('pro');
    await userEvent.keyboard('{ArrowDown}');
    await expect(choice(0)).toHaveFocus();
    // Leave the recommended plan selected, as the preview loads.
    await userEvent.click(choice(1));
    await expect(choice(1)).toBeChecked();
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
