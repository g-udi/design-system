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
    <Frame className='w-full' stacked>
      <FrameHeader>
        <FrameTitle>Section header</FrameTitle>
        <FrameDescription>Description for the section</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Stacked panel</h2>
        <p className='text-ui-muted-foreground text-sm'>Section description</p>
      </FramePanel>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Stacked panel</h2>
        <p className='text-ui-muted-foreground text-sm'>Section description</p>
      </FramePanel>
    </Frame>
  );
}
