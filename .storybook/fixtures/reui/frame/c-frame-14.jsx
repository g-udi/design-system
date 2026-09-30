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
        <FrameTitle>Media Library</FrameTitle>
        <FrameDescription>Manage your assets and downloads</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Storage Capacity</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Review storage usage and organize assets before uploading more files.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>75% of 100GB used</p>
      </FrameFooter>
    </Frame>
  );
}
