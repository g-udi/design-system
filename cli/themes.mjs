// `gaudi-ds theme …` — list, import, export, check and generate Gaudi themes. Shared with the MCP server.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { checkContrast, formatContrastReport } from '../src/themes/contrast.js';
import { exportTheme, THEME_EXPORT_FORMATS } from '../src/themes/exporter.js';
import { generateTheme } from '../src/themes/generate.js';
import { importTheme } from '../src/themes/importer.js';
import { themePresets } from '../src/themes/presets.js';
import { assertTheme } from '../src/themes/validate.js';

export const themeUsage = `  gaudi-ds theme list                                List shipped theme presets
  gaudi-ds theme import <file|url> [--id <id>] [--name <name>] [--out themes/] [--fix]
                                                     shadcn/tweakcn/StyleGlide CSS or registry JSON → Gaudi theme JSON
                                                     (themes from styleglide.ai/themes, tweakcn.com or ui.shadcn.com/themes import as-is)
  gaudi-ds theme export <id|file> --format css|shadcn|registry|json [--out <file>]
  gaudi-ds theme check <id|file> [--verbose]         WCAG AA contrast report (exit 1 on failures)
  gaudi-ds theme generate --brand <colour> [--secondary <colour>] [--seed <seed>] [--id <id>] [--name <name>] [--out themes/]`;

export const listThemeSummaries = () => themePresets.map(({ id, name, description = '', tags = [] }) => ({ id, name, description, tags }));

/** A preset id, a theme JSON file, or <dir>/<id>.json. */
export function resolveTheme(reference, { dir = 'themes', cwd = process.cwd() } = {}) {
  if (reference && typeof reference === 'object') return assertTheme(reference);
  const preset = themePresets.find((theme) => theme.id === reference);
  if (preset) return preset;
  for (const file of [path.resolve(cwd, reference), path.resolve(cwd, dir, `${reference}.json`)]) {
    if (existsSync(file)) return importTheme(readFileSync(file, 'utf8')).theme;
  }
  throw new Error(`Unknown theme "${reference}". Presets: ${themePresets.map((theme) => theme.id).join(', ')}; or pass a theme JSON file.`);
}

async function readSource(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Could not fetch ${source}: ${response.status}`);
    return response.text();
  }
  return readFileSync(path.resolve(source), 'utf8');
}

const writeTheme = (theme, out) => {
  const file = path.resolve(out, `${theme.id}.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, exportTheme(theme, 'json'));
  return file;
};

export async function runThemeCommand(subcommand, args, log = console.log) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      id: { type: 'string' }, name: { type: 'string' }, out: { type: 'string' }, format: { type: 'string', short: 'f' },
      fix: { type: 'boolean' }, verbose: { type: 'boolean', short: 'v' }, brand: { type: 'string' }, secondary: { type: 'string' }, seed: { type: 'string' }
    }
  });
  if (subcommand === 'list') {
    for (const theme of listThemeSummaries()) log(`${theme.id.padEnd(10)} ${theme.name.padEnd(14)} ${theme.description}`);
    return 0;
  }
  if (subcommand === 'import') {
    if (!positionals[0]) throw new Error('theme import needs a CSS/JSON file or URL.');
    const result = importTheme(await readSource(positionals[0]), { id: values.id, name: values.name, repair: values.fix });
    for (const warning of result.warnings) log(`warning: ${warning}`);
    if (values.out) log(`Wrote ${writeTheme(result.theme, values.out)} (${result.format})`);
    else log(exportTheme(result.theme, 'json'));
    log(formatContrastReport(result.report));
    return 0;
  }
  if (subcommand === 'export') {
    const format = values.format || 'css';
    if (!THEME_EXPORT_FORMATS.includes(format)) throw new Error(`--format must be one of ${THEME_EXPORT_FORMATS.join(', ')}.`);
    const output = exportTheme(resolveTheme(positionals[0]), format);
    if (values.out) { mkdirSync(path.dirname(path.resolve(values.out)), { recursive: true }); writeFileSync(path.resolve(values.out), output); log(`Wrote ${values.out}`); } else log(output.trimEnd());
    return 0;
  }
  if (subcommand === 'check') {
    const report = checkContrast(resolveTheme(positionals[0]));
    log(formatContrastReport(report, { verbose: values.verbose }));
    return report.pass ? 0 : 1;
  }
  if (subcommand === 'generate') {
    const theme = generateTheme({ brand: values.brand, secondary: values.secondary, seed: values.seed, id: values.id, name: values.name });
    if (values.out) log(`Wrote ${writeTheme(theme, values.out)}`);
    else log(exportTheme(theme, 'json').trimEnd());
    log(formatContrastReport(checkContrast(theme)));
    return 0;
  }
  log(`Usage:\n${themeUsage}`);
  return 1;
}
