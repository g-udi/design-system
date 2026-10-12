import { resolve } from 'node:path';
import { build } from 'esbuild';

/** Use the sanitizer's tested browser bundle in Storybook's development preview. */
export function sanitizeHtmlBrowserPlugin(rootDir) {
  const entry = resolve(rootDir, 'src/utilities/sanitizeHtml/sanitizeHtml.js');
  let bundle;
  let inputs = new Set([entry]);

  return {
    name: 'gaudi-sanitize-html-browser',
    apply: 'serve',
    enforce: 'pre',
    async load(id, options) {
      if (options?.ssr || id.split('?')[0] !== entry) return null;
      bundle ??= build({
        absWorkingDir: rootDir,
        entryPoints: [entry],
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'esm',
        metafile: true,
        logLevel: 'silent'
      }).then(result => {
        // Keep dependency edits visible during development without writing a generated asset.
        inputs = new Set(Object.keys(result.metafile.inputs).filter(file => !file.startsWith('(')).map(file => resolve(rootDir, file)));
        return result;
      }).catch(error => {
        bundle = undefined;
        throw error;
      });
      const result = await bundle;
      for (const file of inputs) this.addWatchFile(file);
      for (const warning of result.warnings) this.warn(warning.text);
      return result.outputFiles[0].text;
    },
    handleHotUpdate(context) {
      if (inputs.has(context.file)) bundle = undefined;
    }
  };
}
