// WCAG AA contrast report for a theme: every contract pair in both modes.
import { contrastRatio } from './color.js';
import { CONTRAST_PAIRS } from './contract.js';

/** checkContrast(theme) → { pass, checked, failures[], results[] } with ratios rounded to 2 decimals. */
export function checkContrast(theme) {
  const results = [];
  for (const mode of ['light', 'dark']) {
    for (const { fg, bg, min } of CONTRAST_PAIRS) {
      const ratio = contrastRatio(theme[mode][fg], theme[mode][bg]);
      results.push({ mode, fg, bg, min, ratio: Math.round(ratio * 100) / 100, pass: ratio >= min, kind: min >= 4.5 ? 'text' : 'ui' });
    }
  }
  const failures = results.filter((result) => !result.pass);
  return { pass: failures.length === 0, checked: results.length, failures, results };
}

/** Plain-text summary for the CLI and MCP. */
export function formatContrastReport(report, { verbose = false } = {}) {
  const lines = [`Contrast: ${report.pass ? 'PASS' : 'FAIL'} (${report.checked - report.failures.length}/${report.checked} WCAG AA pairs)`];
  for (const result of verbose ? report.results : report.failures) {
    lines.push(`  ${result.pass ? 'ok  ' : 'FAIL'} ${result.mode.padEnd(5)} ${`${result.fg} on ${result.bg}`.padEnd(40)} ${result.ratio.toFixed(2)}:1 (min ${result.min}:1)`);
  }
  return lines.join('\n');
}
