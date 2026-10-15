import { useState } from 'react';
import { ReelText } from '@gaudi/design-system/animations/ReelText';
import Button from '@gaudi/design-system/core/Button';
import { TextAnimationDemo } from '../../../../../docs/fixtures/animations/TextAnimationDemo.jsx';

export function ReelTextPlayground(args) {
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <ReelText key={replay} {...args} paused={paused} />}
  </TextAnimationDemo>;
}

const figures = ['$31,904', '$127,616', '$4,558', '$1,531,392'];

export function ReelTextChangingValue(args) {
  const [index, setIndex] = useState(0);
  return <TextAnimationDemo paused={args.paused}>
    {({ paused, replay }) => <span style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <ReelText key={replay} {...args} value={figures[index]} paused={paused} />
      <Button variant="outline" size="sm" onClick={() => setIndex(value => (value + 1) % figures.length)}>Next value</Button>
    </span>}
  </TextAnimationDemo>;
}
