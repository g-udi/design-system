// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
export function Pattern() {
  return (
    <Frame className='w-full max-w-sm'>
      <FrameHeader>
        <FrameTitle>Team Collaboration</FrameTitle>
        <FrameDescription>Invite and manage workspace members</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Active Members</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Review active members and manage invitations from one workspace.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>3 members online</p>
      </FrameFooter>
    </Frame>
  );
}
