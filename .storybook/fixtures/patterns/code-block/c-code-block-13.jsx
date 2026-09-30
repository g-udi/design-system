'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const code = `export async function createInvite(workspaceId: string, email: string) {
  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } })
  if (!workspace) throw new WorkspaceNotFoundError(workspaceId)

  const seats = await countBillableSeats(workspaceId)
  if (seats.used >= seats.total) {
    throw new SeatLimitError(workspaceId, seats.total)
  }

  const invite = await db.invite.create({
    data: { workspaceId, email, status: "pending" },
  })

  await mail.send({ to: email, template: "workspace-invite" })
  return invite
}`;
function MatchCount({ query }) {
  const { code: source } = useCodeBlockConfig('MatchCount');
  const matches = useMemo(() => {
    const needle = query.trim();
    if (needle.length < 2) return null;
    return source.split(needle).length - 1;
  }, [source, query]);
  if (matches === null) return null;
  return (
    <Badge variant={matches ? 'primary-light' : 'secondary'}>
      {matches} {matches === 1 ? 'match' : 'matches'}
    </Badge>
  );
}
export function Pattern() {
  const [query, setQuery] = useState('workspace');
  const words = useMemo(
    () => (query.trim().length < 2 ? void 0 : [query.trim()]),
    [query]
  );
  return (
    <CodeBlock
      code={code}
      language='typescript'
      showLineNumbers
      highlightedWords={words}
      className='w-full max-w-2xl'
    >
      <CodeBlockHeader className='gap-2'>
        <CodeBlockTitle>invites.ts</CodeBlockTitle>
        <div className='ml-auto flex items-center gap-2'>
          <MatchCount query={query} />
          {/* The group joins the field to its clear button into one control,
         so the header keeps a single bordered shape rather than two. */}
          <ButtonGroup>
            <Input
              type='search'
              value={query}
              aria-label='Search in file'
              placeholder='Search'
              onChange={(event) => setQuery(event.target.value)}
              className='w-40 text-xs'
            />
            <Button
              variant='outline'
              size='icon'
              aria-label='Clear search'
              disabled={!query}
              onClick={() => setQuery('')}
            >
              <RegistryIcon lucide='XIcon' />
            </Button>
          </ButtonGroup>
        </div>
      </CodeBlockHeader>

      {/* Pinned over the code: the header is already carrying the search
         control, so the copy affordance moves onto the surface itself. */}
      <CodeBlockCopyButton
        variant='outline'
        size='icon-xs'
        className='bg-ui-card hover:bg-ui-muted'
      />
      <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72'>
        <CodeBlockContent />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </CodeBlock>
  );
}
