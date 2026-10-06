import { useState } from 'react';
import Card from '../../../../../components/core/Card';
import Button from '../../../../../components/core/Button';
import { useInterval } from '../../../../../hooks/state/use-interval.js';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useHover } from '../../../../../hooks/interaction/use-hover.js';

const tips = [ 'Name every icon button.', 'Keep focus visible.', 'Never rely on colour alone.' ];

function HoverRecovery() {
  const [disabled, setDisabled] = useState(false);
  const { isHovered, hoverProps } = useHover({ disabled });
  return (
    <div {...hoverProps} className='grid gap-2'>
      <Button onClick={() => setDisabled((current) => !current)}>{disabled ? 'Enable hover' : 'Disable hover'}</Button>
      <Readout>{isHovered ? 'Pointer detected' : 'No pointer hover'}</Readout>
    </div>
  );
}

function PausingTips() {
  const { isHovered, hoverProps } = useHover();
  const [ focused, setFocused ] = useState(false);
  const [ index, setIndex ] = useState(0);
  const paused = isHovered || focused;
  useInterval(() => setIndex((current) => (current + 1) % tips.length), paused ? null : 3000);
  return (
    <div
      {...hoverProps}
      onFocus={() => setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
      className='grid gap-3'
    >
      <Card variant='outline' padding='sm' title='Accessibility tip' titleLevel={4}>
        <p aria-live={paused ? 'polite' : 'off'}>{tips[index]}</p>
      </Card>
      <div className='flex flex-wrap items-center gap-3'>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setIndex((index + 1) % tips.length)}>Next tip</Button>
        <Readout>{paused ? 'Paused while you point at or focus it' : 'Rotating every 3 seconds'}</Readout>
      </div>
    </div>
  );
}

export { tips, HoverRecovery, PausingTips };
