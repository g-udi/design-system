import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Preferences } from '../../../../.storybook/fixtures/application/Workspace';
import Button from '../../core/Button';
import Field, { FieldDescription, FieldLabel } from '../../core/Field';
import Input from '../../core/Input';
import SettingsPanel from './SettingsPanel';

const docs = getComponentDocs('Blocks/Application/SettingsPanel');

export default {
  title: 'Blocks/Application/SettingsPanel',
  component: SettingsPanel,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', description: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { title: 'Workspace identity', description: 'How readers find your workspace.' },
  parameters: {
    docs: {
      source: playgroundSource('SettingsPanel', {
        imports: "import { Button, Field, FieldLabel, Input, SettingsPanel } from '@gaudi/design-system';",
        children: "  <Field>\n    <FieldLabel>Workspace URL</FieldLabel>\n    <Input name='url' />\n  </Field>"
      })
    }
  },
  render: (args) => (
    <SettingsPanel {...args} footer={<Button size='sm'>Save</Button>}>
      <Field>
        <FieldLabel>Workspace URL</FieldLabel>
        <Input name='url' defaultValue='https://example.com/research' />
        <FieldDescription>Readers use this address to reach your workspace.</FieldDescription>
      </Field>
    </SettingsPanel>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Workspace URL' })).toHaveAccessibleDescription(
      'Readers use this address to reach your workspace.'
    );
  }
};

export const ProfileAndPreferences = {
  parameters: { docs: { description: { story: 'Several panels share one host-owned form. The last panel carries the save action and its status message.' } } },
  render: () => <Preferences />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole('textbox', { name: 'Display name' });
    await userEvent.clear(name);
    await userEvent.type(name, 'Alex Morgan');
    await userEvent.click(canvas.getByRole('button', { name: 'Save preferences' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Preferences saved');
  }
};
