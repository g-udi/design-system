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
        <FrameTitle>Default Layout</FrameTitle>
        <FrameDescription>Standard component curvature</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Standard Settings</h2>
        <p className='text-ui-muted-foreground text-sm'>
          The default radius matches the overall design system for consistent
          application feel.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>
          System default applied
        </p>
      </FrameFooter>
    </Frame>
  );
}
