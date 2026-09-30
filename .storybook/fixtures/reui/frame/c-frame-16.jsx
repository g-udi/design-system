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
        <FrameTitle>Workspace settings</FrameTitle>
        <FrameDescription>Shared workspace preferences</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Standard Settings</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Keep workspace preferences together in a clearly separated panel.
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
