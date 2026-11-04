// Curated discovery paths. Component ownership and existing preview/story IDs stay independent.
export const agentPanels = [
  { title: 'Agent findings', owner: 'ChatAgentFindings', href: '/docs/chat/chat-agent-findings', description: 'Filter findings, inspect evidence and review results.' },
  { title: 'Agent checkpoints', owner: 'ChatAgentCheckpoints', href: '/docs/chat/chat-agent-checkpoints', description: 'Browse attempts and request a checkpoint restore.' },
  { title: 'Agent queue', owner: 'ChatAgentQueue', href: '/docs/chat/chat-agent-queue', description: 'Inspect queued jobs, worker assignments and results.' },
  { title: 'Context window', owner: 'ChatContextWindow', href: '/docs/chat/chat-context-window', description: 'Inspect capacity, highlight categories and remove context files.' }
];
export const agentPatterns = [
  { slug: 'fleet', name: 'chat-delegation-agent-fleet', title: 'Agent fleet', description: 'Inspect lead agents and their teams, review tasks and recover failed work.' },
  { slug: 'handoff', name: 'chat-delegation-handoff-relay', title: 'Agent handoff', description: 'Follow context between agents and recover missing information.' },
  { slug: 'steering', name: 'plan-agent-steering', title: 'Agent steering', description: 'Queue guidance for the next step or interrupt the current run.' },
  { slug: 'conflict-radar', name: 'chat-delegation-conflict-radar', title: 'Conflict radar', description: 'Review overlapping file changes and choose between proposed approaches.' },
  { slug: 'graph', name: 'flow-agent-graph', title: 'Agent graph', description: 'Explore an agent and tool-call network built with Flow.' },
  { slug: 'context-map', name: 'treemap-chart-context-map', title: 'Context map', description: 'Explore prepared token usage through TreemapChart.' },
  { slug: 'usage-meter', name: 'stat-card-usage-meter', title: 'Usage meter', description: 'Inspect usage, limits and history with StatMeter and chart primitives.' },
  { slug: 'cited-answer', name: 'chat-sources-linked-answer', title: 'Cited answer', description: 'Connect answer passages to evidence using ChatCitedAnswer.' }
];
