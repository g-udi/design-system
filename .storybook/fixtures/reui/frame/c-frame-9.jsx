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
    <Frame spacing='xs' className='w-full max-w-xs'>
      <FrameHeader>
        <FrameTitle>Project Configuration</FrameTitle>
        <FrameDescription>Adjust your environment settings</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Environment Variables</h2>
        <p className='text-ui-muted-foreground text-sm'>
          XS spacing is ideal for high-density toolbars and property panels.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>Updated 2m ago</p>
      </FrameFooter>
    </Frame>
  );
}
