import sharedSource from './TextAnimationDemo.jsx?raw';
import { publicSource } from '../../components/PatternStoryHelpers.jsx';

/** Include the private stage so copied examples remain standalone. */
export function textAnimationDemoSource(source, origin) {
  const example = source.replace(/^import \{ TextAnimationDemo \} from ['"][^'"]+['"];?\n/m, '');
  const sharedImports = new Set(sharedSource.split('\n').filter(line => line.startsWith('import ')));
  const exampleLines = example.split('\n').filter(line => !sharedImports.has(line));
  return publicSource(`${sharedSource}\n${exampleLines.join('\n')}`, origin);
}
