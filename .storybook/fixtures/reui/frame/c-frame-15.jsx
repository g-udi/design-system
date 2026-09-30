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
    <Frame className='w-full max-w-sm [--frame-radius:var(--radius-lg)]'>
      <FrameHeader>
        <FrameTitle>Team Collaboration</FrameTitle>
        <FrameDescription>Invite and manage workspace members</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Active Members</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Large radius offers a modern, friendly appearance for social and
          collaborative interfaces.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>3 members online</p>
      </FrameFooter>
    </Frame>
  );
}
