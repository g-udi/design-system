import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import Input from '@gaudi/design-system/core/Input';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import { useLiveAnnouncer } from '@gaudi/design-system/hooks/a11y/use-live-announcer';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';

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

const snippets = [ [ 'pnpm', 'pnpm add github:g-udi/design-system' ], [ 'npm', 'npm install github:g-udi/design-system' ] ];

function InstallCommands() {
  const { copy, copiedText } = useCopyToClipboard(1500);
  return (
    <ul className='grid min-w-0 grid-cols-1 gap-2'>
      {snippets.map(([ manager, command ]) => (
        <li key={manager} className='flex min-w-0 items-center justify-between gap-2 rounded-(--ds-radius-control) border border-border px-3 py-2'>
          <code className='min-w-0 truncate font-mono text-xs'>{command}</code>
          <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={`Copy the ${manager} command`} onClick={() => copy(command)}>
            <Icon name={copiedText === command ? 'Check' : 'Copy'} decorative size='sm' />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function ResettableCopy() {
  const { copy, isCopied, reset } = useCopyToClipboard();
  return (
    <div className='flex flex-wrap gap-2'>
      <Button onClick={() => copy(shareUrl)}>{isCopied ? 'Copied' : 'Copy share link'}</Button>
      <Button variant='outline' onClick={reset}>Reset copy feedback</Button>
    </div>
  );
}

export { shareUrl, ShareLink, snippets, InstallCommands, ResettableCopy };
