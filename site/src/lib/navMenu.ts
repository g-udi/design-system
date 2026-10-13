// Curated content for the header menus. Kept small and static so the full catalogue stays server-side.
export type MenuLink = { title: string; href: string; description: string; icon: string };
export type MenuSection = { label: string; href: string; match: string[]; links: MenuLink[]; footer: { label: string; href: string } };

export const menuSections: MenuSection[] = [
  {
    label: 'Docs',
    href: '/docs',
    match: ['/docs/getting-started', '/docs/foundations', '/docs/theming', '/docs/ai', '/docs/credits'],
    links: [
      { title: 'Getting started', href: '/docs/getting-started', description: 'Installation, Next.js setup, Tailwind preset and fonts.', icon: 'Rocket' },
      { title: 'Foundations', href: '/docs/foundations', description: 'Colours and tokens, typography, icons and accessibility.', icon: 'Layers' },
      { title: 'Theming', href: '/docs/theming', description: 'Eight presets, the theme contract and Theme Studio.', icon: 'Palette' },
      { title: 'AI & agents', href: '/docs/ai', description: 'llms.txt, the agent skill, the MCP server and the registry.', icon: 'Bot' }
    ],
    footer: { label: 'Read the introduction', href: '/docs' }
  },
  {
    label: 'Components',
    href: '/docs/components',
    match: ['/docs/components'],
    links: [
      { title: 'Button', href: '/docs/components/button', description: 'Actions and link buttons with loading states.', icon: 'MousePointer2' },
      { title: 'Select', href: '/docs/components/select', description: 'Selects, comboboxes and multi-selects.', icon: 'ListFilter' },
      { title: 'DataTable', href: '/docs/components/data-table', description: 'Sorting, filtering, editing and virtual rows.', icon: 'Table' },
      { title: 'Calendar', href: '/docs/components/calendar', description: 'Dates, ranges, pickers and event calendars.', icon: 'Calendar' },
      { title: 'Dialog', href: '/docs/components/dialog', description: 'Modal dialogs, sheets and alert dialogs.', icon: 'Panels' },
      { title: 'Command', href: '/docs/components/commander', description: 'Command palettes and searchable menus.', icon: 'Search' }
    ],
    footer: { label: 'Browse all components', href: '/docs/components' }
  },
  {
    label: 'Blocks',
    href: '/docs/blocks',
    match: ['/docs/blocks'],
    links: [
      { title: 'App Shell', href: '/docs/blocks/app-shell', description: 'Sidebars, top bars and framed application windows.', icon: 'LayoutTemplate' },
      { title: 'Dashboard', href: '/docs/blocks/dashboard', description: 'Metrics, charts and activity in one view.', icon: 'LayoutDashboard' },
      { title: 'Forms', href: '/docs/blocks/forms', description: 'Checkout, profile and settings forms.', icon: 'FileText' },
      { title: 'Scheduling', href: '/docs/blocks/scheduling', description: 'Bookings, availability and time slots.', icon: 'Calendar' },
      { title: 'Heroes', href: '/docs/blocks/heroes', description: 'Marketing introductions with animated backgrounds.', icon: 'Sparkles' },
      { title: 'Stat Cards', href: '/docs/blocks/stat-cards', description: 'KPIs with trends, ranges and breakdowns.', icon: 'ChartBar' }
    ],
    footer: { label: 'Browse all blocks', href: '/docs/blocks' }
  },
  {
    label: 'Library',
    href: '/docs/chat',
    match: ['/docs/chat', '/docs/charts', '/docs/hooks', '/docs/animations', '/docs/mdx', '/docs/layout'],
    links: [
      { title: 'Chat & Agents', href: '/docs/chat', description: 'Messages, reasoning, tools, sources and voice.', icon: 'MessageSquare' },
      { title: 'Charts', href: '/docs/charts', description: 'Recharts-based charts with shared framing.', icon: 'ChartArea' },
      { title: 'Hooks', href: '/docs/hooks', description: 'State, layout, environment and accessibility hooks.', icon: 'Webhook' },
      { title: 'Animations', href: '/docs/animations', description: 'Text effects and theme-aware WebGL backgrounds.', icon: 'Sparkles' },
      { title: 'MDX', href: '/docs/mdx', description: 'Article primitives: code, callouts, citations, charts.', icon: 'FileCode' },
      { title: 'Post & Layout', href: '/docs/layout', description: 'Articles, contents, post headers and series.', icon: 'BookOpen' }
    ],
    footer: { label: 'Explore the library', href: '/docs/chat' }
  }
];

export const isMenuActive = (pathname: string, section: MenuSection) => {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized === section.href || section.match.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
};
