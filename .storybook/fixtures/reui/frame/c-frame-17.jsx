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
    <Frame className='w-full max-w-sm [--frame-radius:var(--radius-2xl)]'>
      <FrameHeader>
        <FrameTitle>Creative Portfolio</FrameTitle>
        <FrameDescription>Showcasing visual art and design</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className='text-sm font-semibold'>Gallery View</h2>
        <p className='text-ui-muted-foreground text-sm'>
          2XL radius provides a very soft, organic look suitable for creative
          portfolios and landing pages.
        </p>
      </FramePanel>
      <FrameFooter>
        <p className='text-ui-muted-foreground text-sm'>Browse 12 projects</p>
      </FrameFooter>
    </Frame>
  );
}
