import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

/** Include the shared static page payloads in copied examples without a private import. */
export function webPreviewExampleSource(example, previews, artwork, origin) {
  const payloads = previews.replace(/import \{[^}]+\} from '\.\/artwork';/, artwork);
  const source = example.replace(/import \{[^}]+\} from '[^']*\/link-previews';/, payloads);
  return publicSource(source, origin);
}
