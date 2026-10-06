import { NumberField, NumberFieldGroup, NumberFieldInput } from '../../../../../components/core/NumberField/index.js';
import { Slider } from '../../../../../components/core/Slider/index.js';
import { Field, FieldLabel } from '../../../../../components/core/Field/index.js';
import { useSliderInput } from '../../../../../hooks/state/use-slider-input.js';

function ReadingTimeRange() {
  const { sliderValues, inputValues, setInputValues, handleSliderChange, validateAndUpdateValue } = useSliderInput({ minValue: 1, maxValue: 60, initialValue: [ 5, 20 ] });
  const commit = (index) => (event) => validateAndUpdateValue(parseFloat(event.target.value), index);
  return (
    <div className='grid gap-4'>
      <Slider aria-label='Reading time range' min={1} max={60} step={1} value={sliderValues} onValueChange={handleSliderChange} />
      <div className='grid grid-cols-2 gap-3'>
        {[ 'Shortest (minutes)', 'Longest (minutes)' ].map((label, index) => (
          <Field key={label}>
            <FieldLabel>{label}</FieldLabel>
            <NumberField min={1} max={60} value={inputValues[index] === '' ? null : inputValues[index]} onValueChange={(value) => setInputValues(current => current.map((entry, position) => position === index ? value ?? '' : entry))}>
              <NumberFieldGroup>
                <NumberFieldInput onBlur={commit(index)} onKeyDown={(event) => event.key === 'Enter' && commit(index)(event)} />
              </NumberFieldGroup>
            </NumberField>
          </Field>
        ))}
      </div>
    </div>
  );
}

export { ReadingTimeRange };
