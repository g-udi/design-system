import sharedSource from './BackgroundDemo.jsx?raw';
import styles from './BackgroundDemo.css?raw';
import { publicSource } from '../../components/PatternStoryHelpers.jsx';

/** Expand the private composition and its CSS into a standalone, copyable example. */
export function backgroundDemoSource(source, origin) {
  const css = styles.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const shared = sharedSource
    .replace("import './BackgroundDemo.css';", `const backgroundDemoStyles = \`\n${css.trim()}\n\`;`)
    .replace('<div className="gaudi-background-demo">', '<div className="gaudi-background-demo">\n      <style>{backgroundDemoStyles}</style>');
  const example = source.replace(/^import \{ BackgroundDemo \} from ['"][^'"]+['"];?\n/m, '');
  return publicSource(`${shared}\n${example}`, origin);
}
