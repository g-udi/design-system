import { execFileSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

/** This repository and the linked design-system checkout (the same lookup as scripts/generate.mjs). */
export const siteRoot = process.cwd();
const linked = path.join(siteRoot, 'node_modules/@gaudi/design-system');
export const designSystemRoot = process.env.GAUDI_DS_DIR
  ? path.resolve(siteRoot, process.env.GAUDI_DS_DIR)
  : existsSync(linked) ? realpathSync(linked) : path.resolve(siteRoot, '../design-system');

// One `git log` pass per repository, memoised for the life of the build worker (pages are
// prerendered, so this runs at build time, not per request): file -> latest commit date.
const histories = new Map<string, Map<string, string>>();

function history(repo: string) {
  let files = histories.get(repo);
  if (files) return files;
  files = new Map();
  try {
    const log = execFileSync('git', ['log', '--format=%x1e%cI', '--name-only', '--no-renames'], { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    for (const commit of log.split('\x1e')) {
      const [date, ...names] = commit.trim().split('\n');
      for (const name of names) if (name && !files.has(name)) files.set(name, date);
    }
  } catch {
    // Not a git checkout (or git missing): every page simply has no date.
  }
  histories.set(repo, files);
  return files;
}

/** Latest commit date (ISO) touching a file or, with a trailing slash, anything under a folder. */
export function lastCommitDate(repo: string, target: string): string | null {
  const files = history(repo);
  if (!target.endsWith('/')) return files.get(target) || null;
  let latest: string | null = null;
  for (const [name, date] of files) {
    if (name.startsWith(target) && (!latest || Date.parse(date) > Date.parse(latest))) latest = date;
  }
  return latest;
}
