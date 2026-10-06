import { FloatingLines } from '@gaudi/design-system/animations/FloatingLines';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function FloatingLinesPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused} hint="Move the pointer to bend the lines.">
      {({ paused, content }) => <FloatingLines {...args} paused={paused}>{content}</FloatingLines>}
    </BackgroundDemo>
  );
}
