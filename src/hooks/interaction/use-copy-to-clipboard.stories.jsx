import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Icon from '../../components/core/Icon';
import Input from '../../components/core/Input';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { useLiveAnnouncer } from '../a11y/use-live-announcer.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useCopyToClipboard } from './use-copy-to-clipboard.js';

export default {
  title: 'Hooks/Interaction/useCopyToClipboard',
  id: 'hooks-interaction-usecopytoclipboard',
  tags: ['autodocs'],
  ...hookMeta('useCopyToClipboard')
};

const shareUrl = 'https://gaudi.dev/posts/designing-calm-interfaces';

function ShareLink() {
  const { announce } = useLiveAnnouncer();
  const { copy, isCopied } = useCopyToClipboard({
    onCopy: () => announce('Link copied'),
    onError: () => announce('Could not copy the link; select it and copy it yourself', 'assertive')
  });
  return (
    <Field>
      <FieldLabel>Share link</FieldLabel>
      <div className='flex gap-2'>
        <Input readOnly value={shareUrl} className='min-w-0 flex-1' onFocus={(event) => event.target.select()} />
        <Button variant='outline' tone='neutral' onClick={() => copy(shareUrl)}>
          <Icon name={isCopied ? 'Check' : 'Copy'} decorative size='sm' />
          {isCopied ? 'Copied' : 'Copy link'}
        </Button>
      </div>
    </Field>
  );
}

export const ShareField = {
  name: 'Copy a share link',
  parameters: example('The button reads "Copied" for two seconds and the result is announced politely. If the browser blocks the clipboard, the error is announced and the field stays selectable.', `
import { Button, Field, FieldLabel, Icon, Input } from '@gaudi/design-system';
import { useCopyToClipboard, useLiveAnnouncer } from '@gaudi/design-system/hooks';

export function ShareLink({ url }) {
  const { announce } = useLiveAnnouncer();
  const { copy, isCopied } = useCopyToClipboard({ onCopy: () => announce('Link copied') });
  return (
    <Field>
      <FieldLabel>Share link</FieldLabel>
      <Input readOnly value={url} />
      <Button onClick={() => copy(url)}>
        <Icon name={isCopied ? 'Check' : 'Copy'} decorative size='sm' />
        {isCopied ? 'Copied' : 'Copy link'}
      </Button>
    </Field>
  );
}`),
  render: () => <ShareLink />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const writes = [];
    const original = navigator.clipboard?.writeText;
    if (navigator.clipboard) navigator.clipboard.writeText = async (text) => writes.push(text);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copied' })).toBeVisible());
    if (navigator.clipboard) {
      await expect(writes).toEqual([ shareUrl ]);
      navigator.clipboard.writeText = original;
    }
  }
};

const snippets = [ [ 'pnpm', 'pnpm add github:ahmadassaf/design-system' ], [ 'npm', 'npm install github:ahmadassaf/design-system' ] ];

function InstallCommands() {
  const { copy, copiedText } = useCopyToClipboard(1500);
  return (
    <ul className='grid gap-2'>
      {snippets.map(([ manager, command ]) => (
        <li key={manager} className='flex items-center justify-between gap-2 rounded-(--ds-radius-control) border border-border px-3 py-2'>
          <code className='min-w-0 truncate font-mono text-xs'>{command}</code>
          <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={`Copy the ${manager} command`} onClick={() => copy(command)}>
            <Icon name={copiedText === command ? 'Check' : 'Copy'} decorative size='sm' />
          </Button>
        </li>
      ))}
    </ul>
  );
}

export const SeveralTargets = {
  name: 'One hook, several copy buttons',
  parameters: example('`copiedText` says which value was copied, so one hook can drive a list of icon buttons. A number argument is the reset timeout.', `
const { copy, copiedText } = useCopyToClipboard(1500);

{commands.map((command) => (
  <Button key={command} size='icon-sm' aria-label={\`Copy \${command}\`} onClick={() => copy(command)}>
    <Icon name={copiedText === command ? 'Check' : 'Copy'} decorative size='sm' />
  </Button>
))}`),
  render: () => <InstallCommands />
};
