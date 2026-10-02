import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Card from '../../components/core/Card';
import Button from '../../components/core/Button';
import { useInterval } from '../state/use-interval.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useHover } from './use-hover.js';

export default {
  title: 'Hooks/Interaction/useHover',
  id: 'hooks-interaction-usehover',
  tags: ['autodocs'],
  ...hookMeta('useHover')
};

const tips = [ 'Name every icon button.', 'Keep focus visible.', 'Never rely on colour alone.' ];

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

export const PauseOnHover = {
  name: 'Pause rotating content',
  parameters: example('Rotation pauses while a mouse is over the card or anything in it has focus, so hover is never the only way to stop it.', `
import { Button, Card } from '@gaudi/design-system';
import { useHover, useInterval } from '@gaudi/design-system/hooks';

const { isHovered, hoverProps } = useHover();
const [focused, setFocused] = useState(false);
useInterval(nextTip, isHovered || focused ? null : 3000);

<div {...hoverProps} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>…</div>`),
  render: () => <PausingTips />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByText('Accessibility tip'));
    await expect(canvas.getByText('Paused while you point at or focus it')).toBeVisible();
    await userEvent.unhover(canvas.getByText('Accessibility tip'));
    await expect(canvas.getByText('Rotating every 3 seconds')).toBeVisible();
  }
};
