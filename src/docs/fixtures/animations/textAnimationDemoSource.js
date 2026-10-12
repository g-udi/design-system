import sharedSource from './TextAnimationDemo.jsx?raw';
import { publicSource } from '../../components/PatternStoryHelpers.jsx';

/** Include the private stage so copied examples remain standalone. */
export function textAnimationDemoSource(source, origin) {
  const example = source.replace(/^import \{ TextAnimationDemo \} from ['"][^'"]+['"];?\n/m, '');
  return publicSource(`${sharedSource}\n${example}`, origin);
}
