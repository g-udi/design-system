import { RangeChart } from '@gaudi/design-system/charts/RangeChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const latency = [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ].map((hour, index) => ({
  label: `${hour}:00`,
  low: [ 92, 96, 104, 118, 126, 121, 110, 102, 98, 94 ][index],
  value: [ 148, 154, 172, 196, 214, 205, 181, 166, 158, 151 ][index],
  high: [ 260, 278, 330, 410, 452, 431, 362, 318, 290, 270 ][index]
}));

const lisbon = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].map((label, index) => ({ label, low: [ 14, 15, 13, 16, 17 ][index], high: [ 23, 25, 21, 26, 27 ][index], value: [ 18, 20, 17, 21, 22 ][index] }));

const forecast = [
  { label: 'W1', value: 410 }, { label: 'W2', value: 455 }, { label: 'W3', value: 498 },
  { label: 'W4', value: 530, low: 530, high: 530 },
  { label: 'W5', low: 520, high: 610 }, { label: 'W6', low: 540, high: 670 }, { label: 'W7', low: 556, high: 732 }
];

export const PlaygroundExample = ({ state, ...args }) => <RangeChart {...args} ariaLabel='Median response time with its p10 to p90 band' data={stateData(state, latency)} formatValue={{ style: 'unit', unit: 'millisecond' }} state={forcedState(state)} />;

export const TemperatureExample = () => (
    <RangeChart
      title='Lisbon during the conference'
      ariaLabel='Daily temperature range in Lisbon'
      data={lisbon}
      bandLabel='Low to high'
      valueLabel='Average'
      formatValue={(value) => `${value}°C`}
      height={240}
    />
  );

export const ForecastExample = () => (
    <RangeChart
      title='Signups forecast'
      ariaLabel='Weekly signups with the forecast range'
      data={forecast}
      bandLabel='Forecast'
      valueLabel='Actual'
      references={[{ x: 'W4', label: 'Today', tone: 'accent' }]}
    />
  );
