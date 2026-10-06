import { ScreenExample, asides } from './fixtures/ScreenExample.jsx';
import ScreenExampleSource from './fixtures/ScreenExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import Screen from '../Screen';

const docs = getComponentDocs('Blocks/Screens');

export default {
  title: 'Blocks/Auth',
  id: 'blocks-application-authform',
  component: Screen,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    aside: Object.keys(asides),
    asideSide: ['end', 'start'],
    header: 'boolean',
    footer: 'boolean',
    mode: ['password', 'email', 'signup']
  }),
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const ScreenFrame = {
  name: 'Screen frame',
  args: {
    aside: 'testimonial',
    asideSide: 'end',
    header: true,
    footer: true,
    mode: 'password',
    onSubmit: fn()
  },
  argTypes: { onSubmit: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: 'A sign-in screen: the AuthForm in the main column beside an `aside` of imagery, customer quotes or logos. `asideSide` moves the aside to the start or end from md up; below md it hides so the form comes first. `header` and `footer` add bands for the logo, account links and legal links. `mode` switches the form between password, email link and sign-up.'
      },
      source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('ScreenExample', args, { imports: publicSource(ScreenExampleSource, new URL('./fixtures/ScreenExample.jsx', import.meta.url)), attributes: ['onSubmit={async () => { /* Simulated successful sign-in. */ }}'] }) }
    }
  },
  render: (args) => <ScreenExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // The form leads the reading order whichever side the aside sits on.
    const screen = canvasElement.querySelector('[data-slot=screen]');
    await expect(screen.firstElementChild).toContainElement(canvas.getByRole('form'));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'maya@fieldnotes.app');
    if (args.mode === 'signup') await userEvent.type(canvas.getByRole('textbox', { name: 'Full name' }), 'Maya Lopez');
    if (args.mode !== 'email') await userEvent.type(canvas.getByLabelText('Password'), 'correct horse battery');
    await userEvent.click(canvas.getByRole('button', { name: /Sign in|Email me a link|Create account/ }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
  }
};
