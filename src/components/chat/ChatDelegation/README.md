# ChatDelegation

Work the assistant handed to another agent: who took it, the brief, its status and that agent’s own activity.

## Usage

```jsx
import { ChatMessageDelegation, ChatMessageTool } from '@gaudi/design-system/chat';

<ChatMessageDelegation agent={{ name: 'Research agent' }} status='running' instructions={brief}>
  <ChatMessageTool name='web_search' status='done' />
</ChatMessageDelegation>
```

## API

| Prop / part | Contract |
| --- | --- |
| `agent` | `{ name }` of the agent that took the work. |
| `status` | The shared statuses. |
| `instructions` / `error` | The brief, and an error as an alert. |
| `children` | The agent’s own activity, usually tool calls. |

## Accessibility

The card names the agent and its status in text; the status does not rely on colour.

## Agent handoff relay example

The **Agent handoff relay** example follows one fictional article through Researcher, Writer and Reviewer. It composes ChatAgentMark with Core Button, Badge and Collapsible. The two transfers show what reached the next agent and identify a safety note omitted from the Writer’s handoff. The example opens with Reviewer waiting for that note. Expand or collapse transfers, restore the note, then finish the review. Reset replays the sequence from an empty handoff history; a simulated disconnect preserves context and provides retry.

The relay uses three columns in containers at least 56rem wide and stacks in reading order below that width. Status labels and the missing-item explanation remain visible without hover. Enter and Space operate disclosures and actions, and a polite status announces progress and recovery. Restoring context keeps its action mounted so keyboard focus is preserved.

All data and workflow decisions belong to the example. Applications provide transfers, missing-item reasons, restoration callbacks and execution policy. This adds no public handoff component or agent service. The simpler **Handing work to another agent** example remains available for one delegation and its tool calls.

## Agent findings example

This panel now belongs to [ChatAgentFindings](../ChatAgentFindings/README.md), with a public import and its own examples. ChatDelegation keeps its existing API.

## Agent queue example

This panel now belongs to [ChatAgentQueue](../ChatAgentQueue/README.md), with a public import and its own examples. ChatDelegation keeps its existing API.

## Agent fleet example

The **Agent fleet** example composes Core Accordion, Tree, Dialog, Progress, Badge and Button with ChatAgentMark, ChatPlan and ChatMessageToolApproval. One lead's branch is open at a time. Wide containers place the tree beside the leads; containers narrower than 52rem place it beneath the selected lead. Every lead can be folded. Nested teams expand in the shared keyboard tree; leaf agents open task details in a dialog.

Approving or denying access, retrying or dismissing a failure, finishing the run and resetting all update local fictional data. The demo sums each agent's own cost once; branch totals include the lead and all descendants. Applications supply real costs, execution state, permissions, task data and persistence. This is a copyable workflow composition, not another public agent component.

Use the accordion's arrow keys and Home/End to move between leads, and Enter/Space to toggle. The tree supports arrow navigation and Enter/Space to open a leaf's tasks. Escape closes task details and returns focus to the originating agent. Updates use a polite announcement; statuses have text labels, and empty and completed states retain useful controls.

## Conflict radar example

**Conflict radar** composes Core DataTable, RadioGroup, Button, Badge and EmptyState with ChatAgentMark. A file-by-agent matrix shows prepared edit ranges and distinguishes overlaps from independent edits, including two agents touching separate ranges of one file. Bars locate a range within its file; text names each range and state. Select an overlapping file in the table or the comparison controls, then choose one agent’s approach. The explanation names what that choice preserves and omits; it does not imply an automatic combination of changes.

Two local updates finish the agents. Merge demo changes remains disabled until both conflicts have choices and all three agents have finished. Disconnecting Delivery retains edits and choices but blocks merging; Retry connection restores the prior progress. Clear choice reopens a conflict and returns focus to its first approach. A completed merge retains the comparison and disables resolution changes. Empty snapshot and Reset demo exercise the empty and initial states, restoring focus to the surviving Reset control.

The matrix keeps a readable minimum width of 44rem and scrolls inside DataTable’s labelled keyboard-accessible region on narrow containers. Full file paths and agent names remain available. Comparison controls wrap below the matrix; radio groups use the shared arrow-key behavior. A polite status announces selections, recovery and simulated completion. The example caps at 64rem and follows the shared spacing presets and light/dark tokens.

All file paths, branches, edits, overlap flags, resolution policy and progress are fictional fixture data. Applications own conflict detection, permissions, live update invalidation, Git operations and persistence. This example adds no public conflict engine or service integration and never reads or changes a repository.
