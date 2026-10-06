import { FaultyTerminal } from '@gaudi/design-system/animations/FaultyTerminal';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function FaultyTerminalPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <FaultyTerminal {...args} paused={paused}>{content}</FaultyTerminal>}
    </BackgroundDemo>
  );
}
