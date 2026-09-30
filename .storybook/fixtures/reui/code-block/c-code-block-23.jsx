// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
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
const REGION_STARTS = [1, 4, 10, 11, 12];
export function Pattern() {
  const [folded, setFolded] = useState([11]);
  return (
    <CodeBlock
      code={code}
      language='typescript'
      showLineNumbers
      className='w-full max-w-2xl'
      foldable
      folded={folded}
      onFoldedChange={setFolded}
    >
      <CodeBlockHeader className='gap-1.5'>
        <CodeBlockTitle>sync-workspace.ts</CodeBlockTitle>
        <div className='ml-auto flex items-center gap-1'>
          <Button
            size='xs'
            variant='ghost'
            onClick={() => setFolded(REGION_STARTS)}
          >
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
          <Separator orientation='vertical' className='h-4' />
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>
      <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72'>
        <CodeBlockContent />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </CodeBlock>
  );
}
