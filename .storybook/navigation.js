export const navigationPages = [
  { id: 'overview-getting-started--default', title: 'Getting Started' },
  { id: 'overview-accessibility--default', title: 'Accessibility' },
  { id: 'overview-colors-tokens--default', title: 'Colors & Tokens' },
  { id: 'overview-icons--default', title: 'Icons' },
  { id: 'overview-indicators--default', title: 'Indicators' },
  { id: 'overview-states-recovery--default', title: 'States & Recovery' },
  { id: 'overview-typography--default', title: 'Typography' },
  { id: 'theming-overview--default', title: 'Theming' },
  // Nested under Theming: Storybook already indents it beneath the `theming` node.
  { id: 'theming-theme-studio--studio', title: 'Theme Studio', parent: 'theming-overview--default' }
];

export const isNavigationPage = (entry) => navigationPages.some(page => page.id === entry.id);

// Keep the top-level guides alongside all component docs and examples.
export const isSidebarEntry = (entry) => isNavigationPage(entry)
  || /^(Core|Blocks|Chat|Charts|Animations|Hooks|MDX|Post|Layout)\//.test(entry.title);
