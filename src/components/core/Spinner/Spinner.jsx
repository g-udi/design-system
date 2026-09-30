import { cn } from '../../../utilities/cn';
import { Spinner as SpinnerRoot } from './parts/spinner.jsx';

const spinnerSizes = {
  'lg': 'size-8',
  'md': 'size-5',
  'sm': 'size-4',
  'xs': 'size-3'
};

/** A labelled loading indicator in the accent colour; pass `className='text-current'` to follow the text. */
const Spinner = ({ className, label = 'Loading', size = 'md', ...props }) => (
  <SpinnerRoot aria-label={ label } className={ cn('text-accent', spinnerSizes[size], className) } { ...props } />
);

export default Spinner;
