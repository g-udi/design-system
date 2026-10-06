'use client';
import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  Item,
  ItemContent,
  ItemMedia
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [reverted, setReverted] = useState(false);
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Item size='xs' asChild>
        <Link href='/pull-requests/412' variant='bare'>
          <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
            <RegistryIcon lucide='GitMergeIcon' />
          </ItemMedia>
          <ItemContent className='min-w-0 break-words'>Review draft #412: Colour in long-form layouts</ItemContent>
        </Link>
      </Item>
      <Item size='xs' asChild>
        <Link href='/pull-requests/412/files#rate-limit' variant='bare'>
          <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
            <RegistryIcon lucide='FileTextIcon' />
          </ItemMedia>
          <ItemContent className='min-w-0 break-words'>Compare it with the published version</ItemContent>
        </Link>
      </Item>
      <Item size='xs' asChild>
        <Button variant='ghost' tone='neutral'
          type='button'
          className='hover:text-ui-foreground transition-colors'
          onClick={() => setReverted((value) => !value)}
        >
          <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>
            {reverted ? (
              <RegistryIcon lucide='CheckIcon' />
            ) : (
              <RegistryIcon lucide='RotateCcwIcon' />
            )}
          </ItemMedia>
          <ItemContent className='min-w-0 break-words'>
            {reverted ? 'Restore the edit' : 'Undo this edit'}
          </ItemContent>
        </Button>
      </Item>
      {/* Mounted empty from the first render, not inserted on the click: a
       live region added at the same moment as its text is not reliably
       announced, and the button's own label changes silently. */}
      <span role='status' aria-live='polite' className='sr-only'>
        {reverted ? 'Edit undone' : ''}
      </span>
    </div>
  );
}
