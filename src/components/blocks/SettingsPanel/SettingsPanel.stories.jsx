import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Preferences } from '../../../../.storybook/fixtures/application/Workspace';
import SettingsPanel from './SettingsPanel';
import Field, { FieldLabel, FieldDescription } from '../../core/Field';
import Input from '../../core/Input';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/SettingsPanel',
  component: SettingsPanel,
  ...applicationDocs(
    'Responsive settings sections with title, description, field area and footer. Compose related sections within one host-owned form. Labels sit beside fields on wide screens and above them on phones.',
    "import { Button, Field, FieldLabel, Input, SettingsPanel } from '@gaudi/design-system';\n\nexport function ProfileSettings({ onSave }) {\n  return (\n    <form onSubmit={(event) => {\n      event.preventDefault();\n      onSave(new FormData(event.currentTarget));\n    }}>\n      <SettingsPanel\n        title='Profile'\n        description='How readers see you.'\n        footer={<Button type='submit'>Save</Button>}\n      >\n        <Field>\n          <FieldLabel>Name</FieldLabel>\n          <Input name='name' />\n        </Field>\n      </SettingsPanel>\n    </form>\n  );\n}",
    'Each section is labelled by its heading. Fields retain their own label and description wiring; submission and announcements belong to the host.'
  )
};
export const ProfileAndPreferences = {
  render: () => (
    <ExampleFrame wide>
      <Preferences />
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole('textbox', { name: 'Display name' });
    await userEvent.clear(name);
    await userEvent.type(name, 'Alex Morgan');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save preferences' })
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Preferences saved'
    );
  }
};
export const ReadOnly = {
  render: () => (
    <ExampleFrame wide>
      <SettingsPanel
        title='Workspace identity'
        description='Managed by your workspace owner.'
      >
        <Field>
          <FieldLabel>Workspace URL</FieldLabel>
          <Input readOnly value='https://example.com/research' />
          <FieldDescription>
            Contact the owner to change this address.
          </FieldDescription>
        </Field>
      </SettingsPanel>
    </ExampleFrame>
  )
};
