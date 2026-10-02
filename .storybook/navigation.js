export const navigationPages = [
  { id: 'overview-getting-started--default', title: 'Getting Started' },
  { id: 'overview-accessibility--default', title: 'Accessibility' },
  { id: 'overview-colors-tokens--default', title: 'Colors & Tokens' },
  { id: 'overview-icons--default', title: 'Icons' },
  { id: 'overview-indicators--default', title: 'Indicators' },
  { id: 'overview-states-recovery--default', title: 'States & Recovery' },
  { id: 'overview-typography--default', title: 'Typography' }
];

export const isNavigationPage = (entry) => navigationPages.some(page => page.id === entry.id);

// Keep the seven top-level guides alongside all component docs and examples.
export const isSidebarEntry = (entry) => isNavigationPage(entry)
  || /^(Core|Blocks|Chat|Charts|Hooks|MDX|Post|Layout)\//.test(entry.title);
