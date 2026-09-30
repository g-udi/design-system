import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
const code = `export async function resolveWorkspaceMembershipForActiveSubscription(workspaceId: string, userId: string) {
  const membership = await db.membership.findFirst({ where: { workspaceId, userId, status: "active" } })
  if (!membership) throw new WorkspaceAccessError("No active membership for this workspace")
  return membership
}

export function formatSeatSummary(seats: number, used: number) {
  return \`\${used} of \${seats} seats in use, \${Math.max(0, seats - used)} remaining\`
}

export function countBillableSeats(members: Member[]) {
  return members.filter((member) => member.status === "active" && !member.isGuest).length
}

export function canInviteMember(seats: number, used: number) {
  return used < seats
}`;
export function Pattern() {
  return (
    <CodeBlock code={code} language='typescript' className='w-full max-w-2xl'>
      <CodeBlockCopyButton
        variant='outline'
        size='icon-sm'
        className='bg-ui-card hover:bg-ui-muted'
      />
      {/* The cap goes on the ScrollArea VIEWPORT, not its root: the viewport
       is height-100% of the root, and a percentage against a max-height
       only parent resolves to auto, so a root-level cap clips without ever
       scrolling. */}
      <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-56'>
        <CodeBlockContent />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </CodeBlock>
  );
}
