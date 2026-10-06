import { PlaygroundDemo, DisabledOptionsDemo, statusOf, initialStatus, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import ToggleGroup from '../ToggleGroup';

const docs = getComponentDocs('Core/ToggleGroup');

const option = (canvas, name, role = 'radio') => canvas.getByRole(role, { name });
// A content library: the status filter follows the controls and filters the list; the view switch is icon-only.

const statusName = (value) => new RegExp(`^${statusOf[value].label}`);

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/ToggleGroup', id: 'core-togglegroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['single', 'multiple'], variant: ['outline', 'default'], size: ['sm', 'default', 'lg'], disabled: 'boolean' }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A content library. The status filter follows the controls and filters the list below: `type="multiple"` combines statuses, `single` keeps one, `variant` and `size` restyle both groups, and `disabled` locks the filter. The icon-only layout switch beside it toggles list and grid.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const multiple = args.type === 'multiple';
    const role = multiple ? 'button' : 'radio';
    const pressed = multiple ? 'aria-pressed' : 'aria-checked';
    const library = canvas.getByTestId('library');
    for (const value of [].concat(initialStatus(args.type))) await expect(option(canvas, statusName(value), role)).toHaveAttribute(pressed, 'true');
    await expect(option(canvas, statusName('archived'), role)).toBeDisabled();
    if (args.disabled) {
      await expect(option(canvas, statusName('published'), role)).toBeDisabled();
      return;
    }
    await userEvent.click(option(canvas, statusName('published'), role));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(multiple ? ['draft', 'review', 'published'] : 'published');
    await expect(within(library).getByText('Knowledge graphs in practice')).toBeVisible();
    if (!multiple) await expect(within(library).queryByText('Interfaces and real data')).not.toBeInTheDocument();
    await userEvent.click(option(canvas, 'Grid view'));
    await expect(library).toHaveAttribute('data-layout', 'grid');
  }
};

export const DisabledOptions = {
  parameters: { docs: { description: { story: 'A disabled option stays visible but arrow keys skip it; focus wraps from the last option to the first.' } } },
  render: DisabledOptionsDemo,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(option(canvas, 'PDF')).toBeDisabled();
    option(canvas, 'HTML').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(option(canvas, 'Markdown')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(option(canvas, 'HTML')).toHaveFocus();
  }
};
