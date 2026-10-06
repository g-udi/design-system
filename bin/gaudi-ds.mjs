#!/usr/bin/env node
// gaudi-ds: agent tooling for @gaudi/design-system.
//   gaudi-ds mcp                                   start the MCP server on stdio
//   gaudi-ds skills install [--agent <name>] [--dir <project>]
//   gaudi-ds skills list
//   gaudi-ds theme list|import|export|check|generate
import { parseArgs } from 'node:util';
import { themeUsage } from '../cli/themes.mjs';

const usage = `Usage:
  gaudi-ds mcp                                       Start the Gaudi MCP server (stdio)
  gaudi-ds skills install [--agent <agent>] [--dir <project>]
                                                     agent: claude (default), cursor, codex, windsurf, opencode, vscode, all
  gaudi-ds skills list                               Show where each agent's skill is installed
${themeUsage}
  gaudi-ds help`;

const [command, subcommand, ...rest] = process.argv.slice(2);

if (command === 'mcp') {
  const { startServer } = await import('../cli/server.mjs');
  await startServer();
} else if (command === 'skills' && subcommand === 'install') {
  const { values } = parseArgs({ args: rest, options: { agent: { type: 'string', short: 'a', default: 'claude' }, dir: { type: 'string', short: 'd', default: process.cwd() } } });
  const { installSkill } = await import('../cli/skills.mjs');
  try {
    for (const { file, status } of installSkill(values)) console.log(`${status.padEnd(9)} ${file}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
} else if (command === 'skills' && subcommand === 'list') {
  const { AGENTS } = await import('../cli/skills.mjs');
  for (const [name, { label, target }] of Object.entries(AGENTS)) console.log(`${name.padEnd(9)} ${label.padEnd(26)} ${target}`);
} else if (command === 'theme') {
  const { runThemeCommand } = await import('../cli/themes.mjs');
  try {
    process.exitCode = await runThemeCommand(subcommand, rest);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
} else {
  console.log(usage);
  if (command && command !== 'help' && command !== '--help') process.exitCode = 1;
}
