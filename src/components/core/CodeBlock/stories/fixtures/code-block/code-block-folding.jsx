'use client';
import { useState } from 'react';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig
} from '@gaudi/design-system/core/CodeBlock';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ScrollArea,
  ScrollBar
} from '@gaudi/design-system/core/ScrollArea';
import { cn } from '@gaudi/design-system/utilities/cn';
const code = `export async function syncWorkspace(workspaceId: string) {
  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } })

  if (!workspace) {
    throw new WorkspaceNotFoundError(workspaceId)
  }

  const members = await db.member.findMany({ where: { workspaceId } })

  for (const member of members) {
    if (member.status === "invited") {
      await mail.send({
        to: member.email,
        template: "workspace-reminder",
      })
    }
  }

  return { synced: members.length }
}`;
/* Fold regions are detected from indentation; these are their first lines,
   counted from the top of the snippet whatever startLine says. Folding
   something drops the line budget, since the file is already short. */
const REGION_STARTS = [1, 4, 10, 11, 12];
function CollapsibleArea({ children }) {
  const { expanded } = useCodeBlockConfig('CollapsibleArea');
  return (
    <ScrollArea
      className={cn(
        'rounded-[inherit]',
        /* overflow-hidden makes collapsed mean collapsed: without it the
         reader could wheel through everything under the "Show more" fade. */
        !expanded &&
          '**:data-[slot=scroll-area-viewport]:max-h-56 **:data-[slot=scroll-area-viewport]:overflow-hidden'
      )}
    >
      {children}
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
export function Pattern() {
  const [folded, setFolded] = useState([]);
  return (
    <CodeBlock
      code={code}
      language='typescript'
      showLineNumbers
      startLine={40}
      maxLines={folded.length ? undefined : 10}
      className='w-full max-w-2xl'
      foldable
      folded={folded}
      onFoldedChange={setFolded}
    >
      <CodeBlockHeader className='gap-1.5'>
        <CodeBlockTitle>lib/sync-workspace.ts</CodeBlockTitle>
        <div className='ml-auto flex items-center gap-1'>
          <Button size='xs' variant='ghost' onClick={() => setFolded(REGION_STARTS)}>
            Fold all
          </Button>
          <Button
            size='xs'
            variant='ghost'
            disabled={!folded.length}
            onClick={() => setFolded([])}
          >
            Unfold all
          </Button>
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>
      <CollapsibleArea>
        <CodeBlockContent />
      </CollapsibleArea>
      <CodeBlockExpandButton />
    </CodeBlock>
  );
}
