/*
 * Flow's constants, kept out of the client modules so server components read the values
 * rather than client references.
 */

/** Run states a node can show. Each maps to a Badge variant and a registry icon. */
export const FLOW_STATUSES = {
  idle: { label: 'Idle', badge: 'secondary', icon: 'CircleDashed' },
  queued: { label: 'Queued', badge: 'outline', icon: 'Clock' },
  running: { label: 'Running', badge: 'info-light', icon: 'RefreshCw' },
  success: { label: 'Passed', badge: 'success-light', icon: 'CircleCheck' },
  failed: { label: 'Failed', badge: 'destructive-light', icon: 'CircleX' },
  waiting: { label: 'Waiting', badge: 'warning-light', icon: 'Hourglass' },
  blocked: { label: 'Blocked', badge: 'attention-light', icon: 'Lock' },
  skipped: { label: 'Skipped', badge: 'secondary', icon: 'Minus' }
};

/** Line styles an edge can draw. Any of them can also flow (`animated`). */
export const FLOW_EDGE_VARIANTS = ['solid', 'dashed', 'dotted'];

/** Every string Flow and its controls render, plus React Flow's own announcements. */
export const DEFAULT_FLOW_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitView: 'Fit to view',
  fitSelection: 'Fit selection',
  autoLayout: 'Auto layout',
  selectTool: 'Select',
  handTool: 'Pan',
  tools: 'Canvas tool',
  zoomLevel: (percent) => `Zoom ${percent}%`,
  issues: (count) => (count ? `${count} ${count === 1 ? 'issue' : 'issues'}` : 'No issues'),
  controls: 'Canvas controls',
  minimap: 'Mini map',
  summaryTitle: 'Steps in this flow',
  summaryCount: (nodes, edges) => `${nodes} ${nodes === 1 ? 'step' : 'steps'} and ${edges} ${edges === 1 ? 'connection' : 'connections'}.`,
  leadsTo: 'leads to',
  ends: 'ends here',
  nodeDescription: 'Press Enter or Space to select, then use the arrow keys to move it. Press Delete to remove a selected step.',
  activateDescription: 'Press Enter to open its details. Press Space to select, then use the arrow keys to move it.',
  edgeDescription: 'Press Enter or Space to select this connection. Press Delete to remove it.'
};

/** Default labels for FlowInspector's controls. */
export const DEFAULT_FLOW_INSPECTOR_LABELS = {
  close: 'Close',
  cancel: 'Cancel',
  save: 'Save task',
  tabs: 'Sections'
};
