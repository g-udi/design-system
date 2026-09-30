// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
export function Pattern() {
  return (
    <Frame className='w-full' variant='ghost'>
      <FrameHeader>
        <FrameTitle>No Outer Border</FrameTitle>
        <FrameDescription>
          This frame uses variant="ghost" to remove the outer border.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <p className='text-ui-muted-foreground text-sm'>
          The outer container of this frame has no border, only the background
          and panels are visible.
        </p>
      </FramePanel>
    </Frame>
  );
}
