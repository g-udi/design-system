import { WordSpotlight } from '@gaudi/design-system/animations/WordSpotlight';
import { TextAnimationDemo } from '../../../../../docs/fixtures/animations/TextAnimationDemo.jsx';

export function WordSpotlightPlayground(args) {
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <WordSpotlight key={replay} {...args} paused={paused} />}
  </TextAnimationDemo>;
}
