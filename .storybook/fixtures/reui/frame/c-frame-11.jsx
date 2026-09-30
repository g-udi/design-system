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
        <FrameTitle>User Profile</FrameTitle>
        <FrameDescription>
          Manage your personal account details
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Account Security</h2>
        <p className='text-ui-muted-foreground text-sm'>
          Default spacing is the standard for primary application content and
          main dialogs.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>
          Last login: Today at 4:30 PM
        </p>
      </FrameFooter>
    </Frame>
  );
}
