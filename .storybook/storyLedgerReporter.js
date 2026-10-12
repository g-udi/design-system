import { mkdirSync, appendFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// Completion evidence is independent of Vitest's summary: a module can finish
// without executing its expected stories when the browser transport is lost.
export default class StoryLedgerReporter {
  constructor() {
    this.output = resolve(process.env.GAUDI_STORY_LEDGER);
    mkdirSync(dirname(this.output), { recursive: true });
    writeFileSync(this.output, '');
  }
  record(event) { appendFileSync(this.output, `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`); }
  onTestCaseResult(test) {
    this.record({ event: 'test-result', storyId: test.meta().storyId, name: test.fullName,
      module: test.module.moduleId, state: test.result().state, diagnostic: test.diagnostic() });
  }
  onTestModuleEnd(module) {
    this.record({ event: 'module-end', module: module.moduleId, errors: module.errors() });
  }
  onTestRunEnd(_modules, unhandledErrors, reason) {
    this.record({ event: 'run-end', reason, unhandledErrors });
  }
}
