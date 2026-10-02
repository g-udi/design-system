import Input from '../../components/core/Input';
import { Slider } from '../../components/core/Slider/index.js';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useSliderInput } from './use-slider-input.js';

export default {
  title: 'Hooks/State/useSliderInput',
  id: 'hooks-state-usesliderinput',
  tags: ['autodocs'],
  ...hookMeta('useSliderInput')
};

function ReadingTimeRange() {
  const { sliderValues, inputValues, handleSliderChange, handleInputChange, validateAndUpdateValue } = useSliderInput({ minValue: 1, maxValue: 60, initialValue: [ 5, 20 ] });
  const commit = (index) => (event) => validateAndUpdateValue(parseFloat(event.target.value) || 0, index);
  return (
    <div className='grid gap-4'>
      <Slider aria-label='Reading time range' min={1} max={60} step={1} value={sliderValues} onValueChange={handleSliderChange} />
      <div className='grid grid-cols-2 gap-3'>
        {[ 'Shortest (minutes)', 'Longest (minutes)' ].map((label, index) => (
          <Field key={label}>
            <FieldLabel>{label}</FieldLabel>
            <Input
              type='number'
              inputMode='numeric'
              value={inputValues[index]}
              onChange={(event) => handleInputChange(event, index)}
              onBlur={commit(index)}
              onKeyDown={(event) => event.key === 'Enter' && commit(index)(event)}
            />
          </Field>
        ))}
      </div>
    </div>
  );
}

export const RangeWithInputs = {
  name: 'Range slider with exact inputs',
  parameters: example('Dragging updates both inputs; typed values are clamped to the bounds and to the other thumb when the field is left or Enter is pressed.', `
import { Field, FieldLabel, Input, Slider } from '@gaudi/design-system';
import { useSliderInput } from '@gaudi/design-system/hooks';

const { sliderValues, inputValues, handleSliderChange, handleInputChange, validateAndUpdateValue } =
  useSliderInput({ minValue: 1, maxValue: 60, initialValue: [5, 20] });

<Slider aria-label='Reading time range' min={1} max={60} value={sliderValues} onValueChange={handleSliderChange} />
<Field>
  <FieldLabel>Shortest (minutes)</FieldLabel>
  <Input type='number' value={inputValues[0]} onChange={(event) => handleInputChange(event, 0)}
    onBlur={(event) => validateAndUpdateValue(Number(event.target.value), 0)} />
</Field>`),
  render: () => <ReadingTimeRange />
};
