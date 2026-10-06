import { ownerDocumentation } from '../catalogue/component-docs.js';
import { hookCatalogue, hookTitle } from '../hooks/catalogue.js';

// Hooks/<Group>/<hook> pages: the API table lists parameters, then return values.
const hookDocs = Object.fromEntries(hookCatalogue.map((hook) => [ hookTitle(hook), {
  'accessibility': hook.accessibility,
  'description': hook.description,
  'notes': hook.notes,
  'props': [
    ...hook.params,
    ...hook.returns.map(([ name, type, description ]) => [ `returns ${name}`, type, '—', description ])
  ],
  'propsTitle': 'API',
  'usage': hook.usage,
  'usageTitle': 'Usage'
} ]));

const groupDocs = {
  'Blocks': {
    'accessibility': 'Blocks compose exported Gaudi components into full page sections. They must preserve semantic headings, readable focus order, and links/buttons with accessible names.',
    'description': 'documents full-section page compositions built from Gaudi primitives and domain components.',
    'recovery': [
      'Keep the surrounding page usable when one section cannot load, and provide a local retry or alternate path.',
      'Preserve the user\'s scroll position and completed work while the failed section recovers.'
    ]
  },
  'Charts': {
    'accessibility': 'Every chart is a captioned figure whose plot is one tab stop with a name and the role description "chart". The arrow keys walk the points (Up and Down move between rows on grid-shaped charts), Home and End jump to the ends, Enter or Space activates the point and Escape clears it; the active point is drawn and read out in a polite live region. Every value is mirrored in a data table, hidden by default and shown with showData. Loading sets aria-busy, invalid and error states are alerts, and the SVG is hidden from assistive technology because the table carries the same data.',
    'description': 'is a chart from the Charts collection, framed for keyboard reading, data states and locale formatting, and imported from @gaudi/design-system/charts (it stays out of the root entry so pages without a chart never load Recharts).',
    'recovery': [
      'Keep the frame and its caption in place when data fails to load, and show the error state with copy that says what to do next.',
      'Show the empty state with copy written for the dashboard rather than an empty plot, and keep the data table available once values arrive.'
    ]
  },
  'Chat': {
    'accessibility': 'Chat parts follow one contract: name the sender of every turn, keep the thread in its own labelled scroll region, announce the start and end of a reply once in a polite status (never every token), and give every icon action a name.',
    'description': 'is a chat or agent building block from the Chat area, exported from the root and from @gaudi/design-system/chat.',
    'recovery': [
      'Keep the user\'s message and the rest of the thread when a reply or tool fails, and offer a retry beside the failure.',
      'Let a stopped or failed reply be regenerated without losing the conversation or scroll position.'
    ]
  },
  'Hooks': {
    'accessibility': 'Hooks carry behaviour, not markup: the component that uses one still owns its roles, names, focus order and announcements.',
    'description': 'is a React hook from the Hooks collection, exported from @gaudi/design-system/hooks and the package root. It is SSR-safe.',
    'recovery': []
  },
  'Content': {
    'accessibility': 'Content components should preserve semantic structure, readable labels, image alt text, and keyboard access for modals, search, pagination, and dropdown controls.',
    'description': 'supports reusable blog browsing, reading, and supporting page composition.',
    'recovery': [
      'Keep available content readable when a secondary asset or request fails.',
      'Name the missing content and provide a retry or direct navigation path without clearing user context.'
    ]
  },
  'Core': {
    'accessibility': 'Core components set the baseline accessibility contract: semantic elements, visible focus, readable contrast, keyboard support, and correct disabled states.',
    'description': 'is a reusable UI component exported by the design system package and the canonical core subpath.',
    'recovery': [
      'Preserve entered values, selections, and nearby context when validation or an async action fails.',
      'Name the problem beside its source and provide a direct correction, retry, or safe exit.'
    ]
  },
  'Layout': {
    'accessibility': 'Layout components should preserve document landmarks, reading order, and form semantics. They must not trap focus or create non-semantic wrappers around interactive content.',
    'description': 'provides consistent spacing, width, and page shell composition.',
    'recovery': [
      'Keep primary landmarks and navigation available when nested content enters an empty or error state.',
      'Prevent loading or fallback content from shifting the page shell or stealing focus.'
    ]
  },
  'MDX': {
    'accessibility': 'MDX components must keep article semantics intact: real headings, tables, code blocks, captions, alt text, and keyboard-accessible expandable content.',
    'description': 'renders long-form article content with consistent editorial structure.',
    'recovery': [
      'Keep the surrounding article readable when an embed, citation, diagram, or media asset fails.',
      'Render a labelled fallback with the original source or retry path instead of removing the failed content silently.'
    ]
  },
  'Post': {
    'accessibility': 'Post components must preserve article landmarks, heading hierarchy, readable metadata, and link semantics for breadcrumbs, sharing, series, and table of contents.',
    'description': 'composes article chrome, metadata, navigation, and reading aids.',
    'recovery': [
      'Keep the article body and primary navigation available when optional metadata or related content is missing.',
      'Use explicit unavailable states for sharing, series, and adjacent-post actions rather than broken or empty controls.'
    ]
  }
};

const defaultUsage = (title, component) => {
  const name = (title.split('/').at(-1) || component).replaceAll(' ', '');
  const entry = title.startsWith('MDX/') ? '@gaudi/design-system/mdx' : '@gaudi/design-system';

  if (name.startsWith('use')) return `import { ${name} } from '@gaudi/design-system';\n\nconst result = ${name}();`;

  return `import { ${name} } from '${entry}';\n\n<${name} />`;
};

export const getComponentDocs = (sidebarTitle) => {
  // Sidebar groups (Core/Actions/Button) resolve to the owner key (Core/Button).
  const [ group, ...rest ] = sidebarTitle.split('/');
  const title = rest.length > 1 && !(sidebarTitle in ownerDocumentation) && !(sidebarTitle in hookDocs) ? `${group}/${rest.at(-1)}` : sidebarTitle;
  const component = rest.length > 1 ? rest.at(-1) : rest.join(' / ') || group;
  const docs = groupDocs[group] || groupDocs.Core;
  const overrides = ownerDocumentation[title] || hookDocs[title] || {};
  const usage = overrides.usage || defaultUsage(title, component);

  return {
    ...docs,
    ...overrides,
    'component': component,
    'description': overrides.description || `${component} ${docs.description}`,
    'decisionRules': overrides.decisionRules || [],
    'donts': overrides.donts || [],
    'dos': overrides.dos || [],
    'group': group,
    'recovery': overrides.recovery || [],
    'title': title,
    'hasAuthoredUsage': Boolean(overrides.usage),
    'usage': usage,
    'usageLanguage': overrides.usageLanguage || (group === 'MDX' ? 'mdx' : 'jsx')
  };
};
