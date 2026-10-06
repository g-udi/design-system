// `gaudi-ds skills install`: copies the Gaudi agent skill into a project in each agent's native
// location. Idempotent: unchanged files are left alone and managed AGENTS.md sections are replaced.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { packageRoot } from './metadata.mjs';

const SKILL = 'gaudi-design-system';
const START = `<!-- ${SKILL}:start (managed by gaudi-ds skills install) -->`;
const END = `<!-- ${SKILL}:end -->`;

export const AGENTS = {
  claude: { label: 'Claude Code', target: `.claude/skills/${SKILL}/SKILL.md (+ references/)` },
  cursor: { label: 'Cursor', target: `.cursor/rules/${SKILL}.mdc` },
  codex: { label: 'Codex', target: 'AGENTS.md (managed section)' },
  opencode: { label: 'OpenCode', target: 'AGENTS.md (managed section)' },
  windsurf: { label: 'Windsurf', target: `.windsurf/rules/${SKILL}.md` },
  vscode: { label: 'VS Code (GitHub Copilot)', target: `.github/instructions/${SKILL}.instructions.md` }
};

function readSkillFiles(root) {
  const directory = path.join(root, 'skills', SKILL);
  const skill = readFileSync(path.join(directory, 'SKILL.md'), 'utf8');
  const referencesDirectory = path.join(directory, 'references');
  const references = existsSync(referencesDirectory)
    ? readdirSync(referencesDirectory).filter((file) => file.endsWith('.md')).sort().map((file) => ({ file, content: readFileSync(path.join(referencesDirectory, file), 'utf8') }))
    : [];
  const [, frontmatter = '', body = skill] = skill.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1].trim() || 'Build UI with @gaudi/design-system.';
  return { skill, body: body.trim(), description, references };
}

/** Single-file agents get the skill body followed by its references. */
const combined = ({ body, references }) => [body, ...references.map(({ content }) => content.trim().replace(/^# /, '## Reference: '))].join('\n\n') + '\n';

function write(file, content, results, project) {
  const relative = path.relative(project, file);
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return results.push({ file: relative, status: 'unchanged' });
  const status = existsSync(file) ? 'updated' : 'created';
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
  results.push({ file: relative, status });
}

function writeSection(file, content, results, project) {
  const section = `${START}\n${content.trim()}\n${END}`;
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const pattern = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END}`);
  const next = pattern.test(current) ? current.replace(pattern, section) : `${current}${current && !current.endsWith('\n') ? '\n' : ''}${current ? '\n' : ''}${section}\n`;
  write(file, next, results, project);
}

export function installSkill({ agent = 'claude', dir = process.cwd(), root = packageRoot } = {}) {
  const agents = agent === 'all' ? Object.keys(AGENTS) : String(agent).split(',').map((name) => name.trim());
  for (const name of agents) if (!AGENTS[name]) throw new Error(`Unknown agent "${name}". Use one of: ${Object.keys(AGENTS).join(', ')}, all.`);
  const project = path.resolve(dir);
  const files = readSkillFiles(root);
  const results = [];
  for (const name of agents) {
    if (name === 'claude') {
      write(path.join(project, '.claude/skills', SKILL, 'SKILL.md'), files.skill, results, project);
      for (const { file, content } of files.references) write(path.join(project, '.claude/skills', SKILL, 'references', file), content, results, project);
    } else if (name === 'cursor') {
      write(path.join(project, '.cursor/rules', `${SKILL}.mdc`), `---\ndescription: ${JSON.stringify(files.description)}\nglobs: "**/*.{jsx,tsx,js,ts,mdx}"\nalwaysApply: false\n---\n\n${combined(files)}`, results, project);
    } else if (name === 'codex' || name === 'opencode') {
      if (!results.some((result) => result.file === 'AGENTS.md')) writeSection(path.join(project, 'AGENTS.md'), combined(files), results, project);
    } else if (name === 'windsurf') {
      write(path.join(project, '.windsurf/rules', `${SKILL}.md`), `---\ntrigger: model_decision\ndescription: ${JSON.stringify(files.description)}\n---\n\n${combined(files)}`, results, project);
    } else if (name === 'vscode') {
      write(path.join(project, '.github/instructions', `${SKILL}.instructions.md`), `---\napplyTo: "**/*.{jsx,tsx,js,ts,mdx}"\ndescription: ${JSON.stringify(files.description)}\n---\n\n${combined(files)}`, results, project);
    }
  }
  return results;
}
