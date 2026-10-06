import Borealis from '@gaudi/design-system/animations/Borealis';
import { BackgroundDemo } from '../../../../../docs/fixtures/animations/BackgroundDemo.jsx';

export function BorealisPlayground(args) {
  return (
    <BackgroundDemo paused={args.paused}>
      {({ paused, content }) => <Borealis {...args} paused={paused} style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--ds-radius-card)' }}>{content}</Borealis>}
    </BackgroundDemo>
  );
}
