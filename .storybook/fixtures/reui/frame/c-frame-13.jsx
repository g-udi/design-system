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
    <Frame className='w-full max-w-sm [--frame-radius:var(--radius-sm)]'>
      <FrameHeader>
        <FrameTitle>Network Diagnostics</FrameTitle>
        <FrameDescription>
          Analyzing real-time socket connections
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Port Status</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Small radius gives a sharp, precise look, perfect for technical
          dashboards and data grids.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>Scan completed</p>
      </FrameFooter>
    </Frame>
  );
}
