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
    <Frame stacked className='w-full max-w-sm'>
      <FrameHeader>
        <FrameTitle>Server Logs</FrameTitle>
        <FrameDescription>Recent activity and errors</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Auth Service</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Successfully logged in user: admin
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Database</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Query execution time: 12ms
        </p>
      </FramePanel>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Storage</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Upload complete: image.png
        </p>
      </FramePanel>
    </Frame>
  );
}
