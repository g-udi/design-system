import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Preferences } from '../../../../.storybook/fixtures/application/Workspace';
import { topics } from '../../../../.storybook/fixtures/application/data';
import Button from '../../core/Button';
import Field, { FieldDescription, FieldLabel } from '../../core/Field';
import Input from '../../core/Input';
import Select from '../../core/Select';
import Switch from '../../core/Switch';
import Textarea from '../../core/Textarea';
import SettingsPanel from './SettingsPanel';

const docs = getComponentDocs('Blocks/SettingsPanel');

export default {
  title: 'Blocks/To Sort/SettingsPanel', id: 'blocks-application-settingspanel',
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

const bio = 'Writing about systems, research, and the craft of useful software.';

function IdentityFields() {
  const [about, setAbout] = useState(bio);
  const [digest, setDigest] = useState(true);
  return (
    <>
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <Input name='displayName' defaultValue='Maya Chen' />
      </Field>
      <Field>
        <FieldLabel>Workspace URL</FieldLabel>
        <Input name='url' defaultValue='https://example.com/research' />
        <FieldDescription>Readers use this address to reach your workspace.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>About</FieldLabel>
        <Textarea name='bio' rows={3} maxLength={160} value={about} onChange={(event) => setAbout(event.target.value)} />
        <FieldDescription>{about.length} / 160 characters</FieldDescription>
      </Field>
      <div className='grid gap-2'>
        <span className='ds-label' aria-hidden='true'>Default topic</span>
        <Select aria-label='Default topic' options={topics} defaultValue='research' className='max-w-none' />
      </div>
      <div className='grid gap-3'>
        <Switch label='Send me a weekly digest' checked={digest} onCheckedChange={setDigest} />
        <Switch label='Show my profile in search results' defaultChecked={false} />
      </div>
    </>
  );
}

export const Playground = {
  args: { title: 'Workspace identity', description: 'How readers find and recognise your workspace. Changes apply to every published article.' },
  parameters: {
    docs: {
      description: { story: 'A settings section mixing text inputs, a character-counted textarea, a select, and switches, with cancel and save actions in the footer.' },
      source: playgroundSource('SettingsPanel', {
        imports: "import { Button, Field, FieldDescription, FieldLabel, Input, SettingsPanel, Switch, Textarea } from '@gaudi/design-system';",
        attributes: ["footer={<><Button variant='ghost' tone='neutral' size='sm'>Cancel</Button><Button size='sm'>Save changes</Button></>}"],
        children: [
          '  <Field>',
          '    <FieldLabel>Workspace URL</FieldLabel>',
          "    <Input name='url' defaultValue='https://example.com/research' />",
          '    <FieldDescription>Readers use this address to reach your workspace.</FieldDescription>',
          '  </Field>',
          '  <Field>',
          '    <FieldLabel>About</FieldLabel>',
          "    <Textarea name='bio' rows={3} maxLength={160} />",
          '  </Field>',
          "  <Switch label='Send me a weekly digest' defaultChecked />"
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <SettingsPanel
      {...args}
      footer={
        <>
          <Button variant='ghost' tone='neutral' size='sm'>Cancel</Button>
          <Button size='sm'>Save changes</Button>
        </>
      }
    >
      <IdentityFields />
    </SettingsPanel>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('region', { name: args.title });
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(within(panel).getByText(args.description)).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Workspace URL' })).toHaveAccessibleDescription('Readers use this address to reach your workspace.');
    const digest = canvas.getByRole('switch', { name: 'Send me a weekly digest' });
    await expect(digest).toBeChecked();
    await userEvent.click(digest);
    await expect(digest).not.toBeChecked();
    await userEvent.click(digest);
    await expect(digest).toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toBeVisible();
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
