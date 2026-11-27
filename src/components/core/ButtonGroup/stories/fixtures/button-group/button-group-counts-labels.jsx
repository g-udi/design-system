'use client';
import { useState } from 'react';
import Dialog from '@gaudi/design-system/core/Dialog';
import { writeToClipboard } from '@gaudi/design-system/hooks';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup, ButtonGroupText } from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const count = 'rounded-md border border-border px-2.5 text-xs text-text-muted tabular-nums';
const roadmap =
  'Q4 product roadmap\nOctober — Audit mobile navigation\nNovember — Publish shared examples\nDecember — Review onboarding\n';
const filename = 'q4-product-roadmap.txt';
export function Pattern() {
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [following, setFollowing] = useState(false);
  const [watching, setWatching] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const share = async () => {
    const ok = await writeToClipboard(window.location.href);
    setCopied(ok);
    setShareFailed(!ok);
  };
  return (
    <div className='mx-auto flex w-full max-w-lg flex-wrap items-center gap-2'>
      <ButtonGroup aria-label='Like'>
        <Button variant='outline' aria-pressed={liked} onClick={() => setLiked(!liked)}>
          <RegistryIcon aria-hidden='true' lucide='HeartIcon' />
          Like
        </Button>
        <ButtonGroupText className={count}>{liked ? '1,201' : '1,200'}</ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Star'>
        <Button variant='outline' aria-pressed={starred} onClick={() => setStarred(!starred)}>
          <RegistryIcon aria-hidden='true' lucide='StarIcon' />
          Star
          <Badge variant='secondary'>{starred ? '2,401' : '2,400'}</Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' aria-label='Repository actions'>
              <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-40'>
            <DropdownMenuCheckboxItem checked={watching} onCheckedChange={setWatching}>
              Watch
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={saved} onCheckedChange={setSaved}>
              Save to list
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem asChild>
              <a href='https://github.com/g-udi/design-system' target='_blank' rel='noreferrer'>
                Open repository
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup aria-label='Follow'>
        <Button size='sm' variant='outline' aria-pressed={following} onClick={() => setFollowing(!following)}>
          <RegistryIcon aria-hidden='true' lucide='UserPlusIcon' />
          Follow
        </Button>
        <ButtonGroupText className={count}>{following ? '2,401' : '2,400'} followers</ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Share'>
        <Button size='sm' onClick={share}>
          <RegistryIcon aria-hidden='true' lucide='Share2Icon' />
          {copied ? 'Link copied' : 'Copy link'}
        </Button>
        <ButtonGroupText className='rounded-md border border-accent px-2.5 text-xs font-medium text-accent tabular-nums'>
          {copied ? '129' : '128'}
        </ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Attachment'>
        <Dialog
          title='Q4 product roadmap'
          trigger={
            <Button variant='outline' size='xs'>
              <RegistryIcon aria-hidden='true' lucide='PaperclipIcon' />
              {filename}
              <span className='text-text-muted'>{new Blob([roadmap]).size} B</span>
            </Button>
          }
        >
          <p className='whitespace-pre-line'>{roadmap}</p>
        </Dialog>
        <Button asChild variant='outline' size='icon-xs'>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(roadmap)}`}
            download={filename}
            aria-label='Download attachment'
          >
            <RegistryIcon aria-hidden='true' lucide='DownloadIcon' />
          </a>
        </Button>
      </ButtonGroup>
      {shareFailed && <p role='status'>Copy the address from your browser to share this example.</p>}
    </div>
  );
}
