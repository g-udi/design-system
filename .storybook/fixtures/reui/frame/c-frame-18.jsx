// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
export function Pattern() {
  return (
    <Frame className='w-full max-w-sm'>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Account Snapshot</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Active seats, usage limits, and billing status are ready for review.
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Team Activity</h2>
        <p className='text-ui-muted-foreground text-sm'>
          24 members signed in this week with no unresolved security alerts.
        </p>
      </FramePanel>
    </Frame>
  );
}
