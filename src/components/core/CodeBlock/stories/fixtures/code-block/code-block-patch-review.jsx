'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CodeBlock,
  CodeBlockDownloadButton,
  CodeBlockHeader,
  CodeBlockTitle,
  parseUnifiedDiff
} from '@gaudi/design-system/core/CodeBlock';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardFooter
} from '@gaudi/design-system/core/Card';
import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
const patch = `diff --git a/lib/seats.ts b/lib/seats.ts
--- a/lib/seats.ts
+++ b/lib/seats.ts
@@ -12,7 +12,8 @@ export async function countBillableSeats(workspaceId: string) {
   const members = await db.member.findMany({ where: { workspaceId } })
-  const used = members.length
+  const used = members.filter((member) => !member.isGuest).length
+  if (used < 0) throw new SeatCountError(workspaceId)
   return { used, total: await seatAllowance(workspaceId) }
 }
diff --git a/app/api/invites/route.ts b/app/api/invites/route.ts
--- a/app/api/invites/route.ts
+++ b/app/api/invites/route.ts
@@ -3,6 +3,7 @@ export async function POST(request: Request) {
   const { email } = await request.json()
+  if (!email) return new Response("email required", { status: 422 })
   const invite = await createInvite(session.workspaceId, email)
   return Response.json(invite, { status: 201 })
 }`;
/* Split each parsed file back into its old and new source. The changed rows
   are marked by a shiki transformer instead of the `diff` prop. */
function sides(file) {
  const [, oldStart, newStart] = file.hunks[0].header.match(/-(\d+).*\+(\d+)/);
  const before = { code: [], marked: new Set(), start: Number(oldStart) };
  const after = { code: [], marked: new Set(), start: Number(newStart) };
  for (const line of file.lines) {
    if (line.state?.level) continue;
    if (line.state?.diff !== 'add') {
      before.code.push(line.text);
      if (line.state?.diff === 'remove') before.marked.add(before.code.length);
    }
    if (line.state?.diff !== 'remove') {
      after.code.push(line.text);
      if (line.state?.diff === 'add') after.marked.add(after.code.length);
    }
  }
  const mark = (side, kind) => [
    {
      line(node, line) {
        if (side.marked.has(line)) node.properties.class = `line diff ${kind}`;
      }
    }
  ];
  return [
    { label: 'Before', ...before, code: before.code.join('\n'), transformers: mark(before, 'remove') },
    { label: 'After', ...after, code: after.code.join('\n'), transformers: mark(after, 'add') }
  ];
}
const files = parseUnifiedDiff(patch).map((file, index) => ({
  ...file,
  sides: sides(file),
  patch: patch.split(/(?=^diff --git)/m)[index]
}));
const added = files.reduce((sum, file) => sum + file.added, 0);
const removed = files.reduce((sum, file) => sum + file.removed, 0);
const messages = {
  pending: 'Agent proposed this change in the demo',
  accepted: 'Change accepted in this demo',
  rejected: 'Change discarded in this demo'
};
function Counts({ plus, minus }) {
  return (
    <>
      <Badge variant='success-light'>+{plus}</Badge>
      <Badge variant='destructive-light'>-{minus}</Badge>
    </>
  );
}
export function Pattern() {
  const [view, setView] = useState('patch');
  const [decision, setDecision] = useState('pending');
  return (
    <Card className='w-full max-w-2xl gap-0 py-0'>
      <div className='border-ui-border flex flex-wrap items-center gap-2 border-b px-3 py-2'>
        <span className='text-sm font-medium'>{files.length} files changed</span>
        <Counts plus={added} minus={removed} />
        <ToggleGroup
          aria-label='Diff view'
          variant='outline'
          size='sm'
          spacing={0}
          type='single'
          value={view}
          onValueChange={(next) => setView(next || view)}
          className='ml-auto'
        >
          <ToggleGroupItem value='patch'>Patch</ToggleGroupItem>
          <ToggleGroupItem value='split'>Before and after</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <CardContent className='p-0'>
        {/* One ScrollArea scrolls every block at once; the cap sits on the
         viewport so a short review never stretches. */}
        <ScrollArea className='rounded-none **:data-[slot=scroll-area-viewport]:max-h-96'>
          <div className='flex flex-col gap-3 p-3'>
            {files.map((file) =>
              view === 'patch' ? (
                <CodeBlock
                  key={file.file}
                  lines={file.lines}
                  showLineNumbers
                  label={`Patch for ${file.file}`}
                >
                  <CodeBlockHeader>
                    <CodeBlockTitle>{file.file}</CodeBlockTitle>
                    <div className='ml-auto flex items-center gap-1.5'>
                      <Counts plus={file.added} minus={file.removed} />
                      <CodeBlockDownloadButton
                        filename={`${file.file.split('/').pop()}.patch`}
                        value={file.patch}
                      />
                    </div>
                  </CodeBlockHeader>
                </CodeBlock>
              ) : (
                <Frame key={file.file} dense>
                  {file.sides.map((side) => (
                    <FramePanel key={side.label} className='p-0!'>
                      <CodeBlock
                        code={side.code}
                        language='typescript'
                        variant='ghost'
                        showLineNumbers
                        startLine={side.start}
                        transformers={side.transformers}
                      >
                        <CodeBlockHeader>
                          <CodeBlockTitle>{file.file}</CodeBlockTitle>
                          <span className='text-ui-muted-foreground ml-auto text-xs'>
                            {side.label}
                          </span>
                        </CodeBlockHeader>
                      </CodeBlock>
                    </FramePanel>
                  ))}
                </Frame>
              )
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className='border-ui-border bg-ui-muted/40 border-t px-3 py-2!'>
        <span className='text-ui-muted-foreground text-xs'>
          {messages[decision]}
        </span>
        <div className='ml-auto flex items-center gap-1.5'>
          {decision === 'pending' ? (
            <>
              <Button size='sm' variant='outline' onClick={() => setDecision('rejected')}>
                Reject
              </Button>
              <Button size='sm' onClick={() => setDecision('accepted')}>
                Accept
              </Button>
            </>
          ) : (
            <Button size='sm' variant='ghost' onClick={() => setDecision('pending')}>
              Undo
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
