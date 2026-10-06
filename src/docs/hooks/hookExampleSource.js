import { publicSource } from '../components/PatternStoryHelpers.jsx';

/** Copied hook compositions include the same private readouts rendered in the preview. */
export function hookExampleSource(example, readouts, origin) {
  const source = example.replace(/import \{[^}]+\} from '[^']*\/HookReadouts\.jsx';/, readouts);
  return publicSource(source, origin);
}
