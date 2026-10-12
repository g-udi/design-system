import { CipherReveal } from '@gaudi/design-system/animations/CipherReveal';
import { TextAnimationDemo } from '../../../../../docs/fixtures/animations/TextAnimationDemo.jsx';

export function CipherRevealPlayground(args) {
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <CipherReveal key={replay} {...args} paused={paused} />}
  </TextAnimationDemo>;
}
