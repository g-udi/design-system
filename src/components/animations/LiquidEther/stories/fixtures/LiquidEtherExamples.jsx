import { LiquidEther } from '@gaudi/design-system/animations/LiquidEther';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function LiquidEtherPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Move the pointer to stir the dye.">
      {({ paused, content }) => <LiquidEther {...args} paused={paused}>{content}</LiquidEther>}
    </BackgroundDemo>
  );
}
