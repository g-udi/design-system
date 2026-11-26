import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { generate, parser, traverse, types as t } from 'storybook/internal/babel';
import publicNames from '../src/docs/catalogue/public-names.json' with { type: 'json' };
import { rewritePublicSource } from '../src/docs/components/publicSource.js';

const publicSource = (source, file) => rewritePublicSource(source, file, publicNames);

const print = node => generate(node).code;
const field = (object, key) => object?.isObjectExpression()
  ? object.get('properties').find(property => property.isObjectProperty() && (property.node.key.name ?? property.node.key.value) === key)?.get('value')
  : undefined;

// Follow references from the actual render and its default props. A CSF module also contains play
// functions, controls and docs configuration, none of which belong in a consumer's example.
function sourceModule(program, render, defaults, name) {
  const used = new Set();
  function visit(path) {
    function reference(ref) {
      const binding = ref.scope.getBinding(ref.node.name);
      if (!binding || binding.scope !== program.scope || used.has(binding.path)) return;
      used.add(binding.path);
      visit(binding.path);
    }
    if (path.isReferencedIdentifier()) reference(path);
    path.traverse({ ReferencedIdentifier: reference });
  }
  visit(render);
  defaults.forEach(visit);
  const imports = [];
  const declarations = [];
  for (const statement of program.get('body')) {
    if (statement.isImportDeclaration()) {
      const specifiers = statement.get('specifiers').filter(specifier => used.has(specifier)).map(specifier => specifier.node);
      if (specifiers.length) imports.push(print(t.importDeclaration(specifiers, statement.node.source)));
      continue;
    }
    const declaration = statement.isExportNamedDeclaration() ? statement.get('declaration') : statement;
    if (declaration?.isVariableDeclaration()) {
      const needed = declaration.get('declarations').filter(path => used.has(path)).map(path => path.node);
      if (needed.length) declarations.push(print(t.variableDeclaration(declaration.node.kind, needed)));
    } else if (used.has(declaration)) declarations.push(print(declaration.node));
  }

  const component = program.scope.hasBinding(name + 'Example') ? name + 'Demo' : name + 'Example';
  const options = defaults.length === 1 && defaults[0].isObjectExpression()
    ? [...defaults[0].node.properties] : defaults.map(path => t.spreadElement(path.node));
  if (defaults.length) options.push(t.spreadElement(t.identifier('__gaudiEditedProps')));
  const props = t.objectExpression(options);
  if (render.isFunction()) {
    const { body, params: [param] } = render.node;
    const statements = t.isBlockStatement(body) ? [...body.body] : [t.returnStatement(body)];
    if (param) statements.unshift(t.variableDeclaration('const', [t.variableDeclarator(param, props)]));
    declarations.push(print(t.exportDefaultDeclaration(t.functionDeclaration(t.identifier(component), [], t.blockStatement(statements)))));
  } else if (defaults.length) {
    declarations.push(`export default function ${component}() { return <${print(render.node)} {...${print(props)}} />; }`);
  } else {
    declarations.push(`export default ${print(render.node)};`);
  }
  return [...imports, ...declarations].join('\n\n');
}

// Bundle only private example fixtures/data. React and published Gaudi components stay imports,
// and JSX stays JSX, so the clipboard contains the example the reader can edit.
async function bundleExample(source, file, watch) {
  const result = await build({
    stdin: { contents: publicSource(source, file), loader: 'jsx', resolveDir: dirname(file), sourcefile: 'example.jsx' },
    bundle: true, write: false, outdir: 'example', format: 'esm', jsx: 'preserve', charset: 'utf8', packages: 'external', treeShaking: true,
    metafile: true, legalComments: 'none', logLevel: 'silent',
    plugins: [{ name: 'public-example-imports', setup(builder) {
      builder.onLoad({ filter: /\.[jt]sx?$/ }, async ({ path }) => ({
        contents: publicSource(await readFile(path, 'utf8'), path), loader: 'jsx', resolveDir: dirname(path)
      }));
    } }]
  });
  for (const input of Object.keys(result.metafile.inputs)) {
    if (input !== 'example.jsx' && !input.endsWith('/example.jsx')) watch?.(resolve(input));
  }
  const cleanBanners = text => text.replace(/^\/\/ .*\.(?:jsx?|json)$/gm, '').replaceAll('/* @__PURE__ */ ', '').replace(/\n{3,}/g, '\n\n').trim();
  const js = cleanBanners(result.outputFiles.find(output => /\.jsx?$/.test(output.path)).text);
  const css = result.outputFiles.find(output => output.path.endsWith('.css'));
  if (!css) return js;
  // A story fixture can supply its own scoped styles. Keep them in the copyable module.
  const styles = css.text.replace(/^\/\* .*\.css \*\/\n/gm, '').trim();
  const cssLiteral = '`\n' + styles.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${') + '\n`';
  return js.replace(/export \{\s*(\w+) as default\s*\};$/, (_, component) =>
    `const styles = ${cssLiteral};\nexport default function StyledExample() { return <><style>{styles}</style><${component} /></>; }`);
}

/** Supply static JSX when an owner renders a story without an authored Docs snippet. */
export async function storyExamples(source, file, watch) {
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
  let program;
  traverse(ast, {
    Program(path) { program = path; },
    CallExpression(path) {
      const callee = path.get('callee');
      if (!callee.isIdentifier()) return;
      const binding = callee.scope.getBinding(callee.node.name)?.path;
      if (binding?.isImportSpecifier() && binding.node.imported.name === 'fn' && binding.parent.source.value === 'storybook/test') {
        path.replaceWith(path.node.arguments[0] ?? t.arrowFunctionExpression([], t.blockStatement([])));
      }
    }
  });
  const examples = new Map();
  const exported = program.get('body').find(statement => statement.isExportDefaultDeclaration());
  const meta = exported?.get('declaration');
  const metaSource = field(field(field(meta, 'parameters'), 'docs'), 'source');
  if (metaSource) return { examples };
  for (const statement of program.get('body')) {
    if (!statement.isExportNamedDeclaration()) continue;
    const declaration = statement.get('declaration');
    if (!declaration?.isVariableDeclaration()) continue;
    for (const variable of declaration.get('declarations')) {
      const story = variable.get('init');
      const render = field(story, 'render');
      if (!render || field(field(field(story, 'parameters'), 'docs'), 'source')) continue;
      const name = variable.node.id.name;
      const code = sourceModule(program, render, [field(meta, 'args'), field(story, 'args')].filter(Boolean), name);
      examples.set(name, await bundleExample(code, file, watch));
    }
  }
  return { examples, meta: meta?.node, exported: exported?.node };
}

export function storyExampleSourcePlugin() {
  return {
    name: 'gaudi-copyable-story-examples',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/src\/components\/[^/]+\/[^/]+\/stories\/[^/]+\.stories\.jsx?$/.test(id)) return;
      // The framework may already have compiled JSX and annotated CSF before this hook.
      // Generate the readable example from disk, then augment the module Vite actually supplied.
      const original = await readFile(id, 'utf8');
      const extracted = await storyExamples(original, id, file => this.addWatchFile(file));
      const { examples } = extracted;
      if (!examples.size) return;
      const exported = original === code ? extracted.exported : parser.parse(code, { sourceType: 'module', plugins: ['jsx'] }).program.body.find(t.isExportDefaultDeclaration);
      const meta = exported?.declaration;
      if (!meta) return;
      const metaName = meta.type === 'Identifier' ? meta.name : '__gaudiExampleMeta';
      // Resolve inherited sources at runtime too: a meta factory or spread can provide one.
      if (meta.type !== 'Identifier') {
        code = code.slice(0, exported.start) + `const ${metaName} = ` + code.slice(meta.start, meta.end)
          + `;\nexport default ${metaName};` + code.slice(exported.end);
      }
      const helper = relative(dirname(id), fileURLToPath(new URL('../src/docs/components/previewSource.js', import.meta.url))).replaceAll('\\', '/');
      const install = `import { setFallbackSource as __gaudiFallback } from ${JSON.stringify(helper)};`;
      const additions = [...examples].map(([name, example]) => `__gaudiFallback(${name}, ${metaName}, ${JSON.stringify(example)});`);
      return { code: [install, code, ...additions].join('\n'), map: null };
    }
  };
}
