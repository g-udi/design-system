import { componentReference } from './ComponentReference.js';

const groupDocs = {
  'Blocks': {
    'accessibility': 'Blocks compose exported Gaudi components into full page sections. They must preserve semantic headings, readable focus order, and links/buttons with accessible names.',
    'description': 'documents full-section page compositions built from Gaudi primitives and domain components.',
    'recovery': [
      'Keep the surrounding page usable when one section cannot load, and provide a local retry or alternate path.',
      'Preserve the user\'s scroll position and completed work while the failed section recovers.'
    ]
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
  'Navigation': {
    'accessibility': 'Navigation components must use semantic links, nav landmarks where appropriate, visible focus, readable labels, and Escape behavior for temporary menus.',
    'description': 'supports shared blog navigation, menu composition, and search entry points.',
    'recovery': [
      'Keep the current location and query intact when navigation or search produces no destination.',
      'Escape should close temporary layers in reverse order and return focus to the trigger.'
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

const usageExamples = {
  'MDX/CitationTracker': "import { CitationTracker } from '@gaudi/design-system/mdx';\n\n// Mount once alongside the host's generated article markup.\n<CitationTracker />",
  'Core/Commander': "import { useState } from 'react';\nimport { Button, Commander } from '@gaudi/design-system';\n\nexport function ContentSearch({ posts = [], projects = [], publications = [], tags = [], thoughts = [] }) {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Search content</Button>\n      <Commander\n        open={open}\n        setOpen={setOpen}\n        posts={posts}\n        projects={projects}\n        publications={publications}\n        tags={tags}\n        thoughts={thoughts}\n      />\n    </>\n  );\n}",
  'Blocks/Thoughts': "import { ThoughtsSection } from '@gaudi/design-system';\n\n<ThoughtsSection thoughts={thoughts} />",
  'Layout': "import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';\n\n<LayoutContainer>{children}</LayoutContainer>",
  'MDX/Aside': '<Aside>\n  Additional context for the article that should sit outside the main argument.\n</Aside>',
  'MDX/Callout': "<Callout type='info'>\n  Useful article context that readers should notice before continuing.\n</Callout>",
  'MDX/Chart': "<BarChart\n  title='Article views'\n  ariaLabel='Article views by day'\n  data={[\n    { label: 'Mon', views: 124 },\n    { label: 'Tue', views: 168 },\n  ]}\n  yKey='views'\n/>\n\n<LineChart\n  title='Subscriber trend'\n  ariaLabel='Subscribers by day'\n  data={[\n    { label: 'Mon', subscribers: 8 },\n    { label: 'Tue', subscribers: 12 },\n  ]}\n  yKey='subscribers'\n/>",
  'MDX/Citation': "---\ntitle: 'An Introduction to Knowledge Graphs'\nbibliography: ['meta/bibliography/references.bib', 'meta/bibliography/kg.bib']\n---\n\nA heterogeneous graph [@HusseinYC18; @WangJSWYCY19; @YangXJWHW20] assigns types to nodes and edges.\n\nThe same source can be cited again later [@HusseinYC18].\n\n<!-- Do not hand-write citation anchors, popover data attributes, or references markup. -->",
  'MDX/Details': "<Details title='Implementation detail'>\n  Expanded article content that is useful but not required for the main reading path.\n</Details>",
  'MDX/FAQ': "<Faq questions={[\n  {\n    question: 'Why use FAQ blocks?',\n    answer: 'They structure repeated article answers.'\n  }\n]} />",
  'MDX/FileTree': "<FileTree data={[\n  { name: 'content', isFolder: true, childrenProp: [{ name: 'post.mdx' }] },\n  { name: 'package.json' }\n]} />",
  'MDX/Footnote': "Inline prose can use a normal markdown footnote reference.[^model-note]\n\n[^model-note]: This explanatory note can include links, emphasis, and short supporting context.\n\n<!-- Runtime wiring lives outside the post:\napp layout/page shell: <MDXLayoutRenderer ... />\narticle runtime: <Footnote />\n-->\n\n<!-- The blog pipeline generates anchors with data-footnote-popover, data-footnote-number, and data-footnote-content. -->",
  'MDX/Video': "<Video\n  animationStyle='from-center'\n  videoSrc='https://www.youtube.com/embed/qh3NGpYRG3I'\n  thumbnailSrc='/static/images/og-card.jpg'\n  thumbnailAlt='Video preview'\n  title='Video walkthrough'\n/>",
  'MDX/GaudiBarLayout': '<GaudiBarLayout />',
  'MDX/Highlight': 'Use <Highlight>inline emphasis</Highlight> inside normal article prose.',
  'MDX/Image': "<Image\n  src='/static/images/posts/gaudi.svg'\n  fallback='/static/images/logo.svg'\n  darkSrc='/static/images/posts/gaudi-dark.svg'\n  alt='Gaudi diagram'\n  caption='Project architecture diagram.'\n  width={420}\n  height={260}\n/>",
  'MDX/ImageModal': "<ImageModal src='/static/images/diagram.png' alt='Architecture diagram' />",
  'MDX/LatexText': '<LatexText>11$^{th}$ International Conference</LatexText>',
  'MDX/LinkedDataQualityFramework': "<LinkedDataQualityFramework\n  title='Roomba’s Linked Data quality architecture'\n  description='A modular path from a public data portal to a validated quality profile and report.'\n/>",
  'MDX/Mermaid': "<Mermaid\n  id='architecture-flow'\n  description='Draft moves to review before publication.'\n  chart={`flowchart TD\n  A[Draft] --> B[Review]`}\n/>",
  'MDX/PipelineDiagram': "<PipelineDiagram\n  title='Continuous deployment with Travis CI'\n  description='Changes move from a local workspace through GitHub and an automated build, validation, and deployment pipeline.'\n  source={{ label: 'Local changes', action: 'Push changes' }}\n  platform={{\n    label: 'GitHub',\n    detail: 'Push to a branch or open a pull request',\n    success: 'Build passes',\n    feedback: 'Link to deployed site'\n  }}\n  pipeline={{\n    label: 'Travis CI',\n    trigger: 'Trigger Travis',\n    stages: [\n      { label: 'Build', failure: 'Broken build' },\n      { label: 'Validate', failure: 'Broken build' },\n      { label: 'Deploy', action: 'Upload', output: 'Server' }\n    ]\n  }}\n  destination={{ label: 'Server' }}\n/>",
  'MDX/Overview': "# Article title\n\nIntroductory prose can use normal markdown.\n\n<Callout type='info'>Article context.</Callout>\n\n<Quote text='Readable examples matter.' author='Gaudi' />",
  'MDX/Preview': "[assaf.website](https://assaf.website)\n\n[Unavailable link](https://this-link-will-not-work.invalid)\n\n[Internal blog link](/blog/engineering/gaudi-my-bash-framework)\n\n<!-- Generated by the blog pipeline:\n<Preview url='https://assaf.website' title='assaf.website' />\n<Preview url='https://this-link-will-not-work.invalid' title='Unavailable link' />\n<Preview internal url='/blog/engineering/gaudi-my-bash-framework' title='Internal blog link' />\n-->\n\n<!-- Direct component usage is reserved for React pages and deterministic Storybook examples. -->",
  'MDX/Quote': "<Quote text='Good component systems make product code calmer.' author='Design System' />",
  'MDX/Table': '| Component | Status |\n| --- | --- |\n| Callout | Documented |\n| Chart | Ready for article embeds |',
  'MDX/Tooltip': "A <Tooltip message='Compact supporting context.'>technical term</Tooltip> can carry a short explanation.",
  'Navigation/FloatingMenu': "import { FloatingMenu } from '@gaudi/design-system';\n\n<FloatingMenu />",
  'Navigation/DropDown': "import { DropDown } from '@gaudi/design-system';\n\n<DropDown name='Content sections' menuDropDownOpen={open} setMenuDropDownOpen={setOpen} />",
  'Navigation/Menu': "import { Menu } from '@gaudi/design-system';\n\n<Menu categories={categories} posts={posts} />",
  'Navigation/MenuLogo': "import { MenuLogo } from '@gaudi/design-system';\n\n<MenuLogo />",
  'Navigation/MenuMain': "import { MenuMain } from '@gaudi/design-system';\n\n<MenuMain categories={categories} allPosts={posts} />",
  'Navigation/MenuMobile': "import { MenuMobile } from '@gaudi/design-system';\n\n<MenuMobile\n  blogLink={{ href: '/blog', title: 'Blog' }}\n  categories={categories}\n  links={links}\n  setMobileMenuOpen={setOpen}\n  setLauncherOpen={setLauncherOpen}\n/>",
  'Navigation/MenuSearch': "import { MenuSearch } from '@gaudi/design-system';\n\n<MenuSearch setOpen={setLauncherOpen} />",
  'Core/Accordion': "import { AccordionGroup } from '@gaudi/design-system';\n\n<AccordionGroup\n  items={[\n    { value: 'usage', title: 'When should I use it?', content: 'Use accordions for compact progressive disclosure.' },\n  ]}\n/>",
  'Core/Avatar': "import { Avatar } from '@gaudi/design-system';\n\n<Avatar name='Maya Chen' src='https://randomuser.me/api/portraits/women/44.jpg' shape='circle' indicator={{ label: 'Online', tone: 'success' }} />",
  'Post/Overview': "import { PostHeader, TableOfContents } from '@gaudi/design-system';\n\n<PostHeader frontMatter={frontMatter} siteMetadata={siteMetadata} toc={toc} />",
  'Core/Banner': "import { Banner } from '@gaudi/design-system';\n\n<Banner title='Now published' href='/blog'>\n  New essays and project notes are available.\n</Banner>",
  'Post/Post': "import { Post } from '@gaudi/design-system';\n\n<Post frontMatter={frontMatter} />",
  'Core/Breadcrumb': "import { BreadcrumbTrail } from '@gaudi/design-system';\n\n<BreadcrumbTrail\n  items={[\n    { href: '/', label: 'Home' },\n    { href: '/blog', label: 'Blog' },\n    { current: true, label: 'Design Systems' },\n  ]}\n/>",
  'Core/Button': "import { Button } from '@gaudi/design-system';\n\n<Button variant='solid' tone='accent' size='md'>Read article</Button>",
  'Post/PostHeader': "import { PostHeader } from '@gaudi/design-system';\n\n<PostHeader frontMatter={frontMatter} siteMetadata={siteMetadata} toc={toc} />",
  'Core/Card': "import { Card } from '@gaudi/design-system';\n\n<Card title='Building with tokens' subtitle='Cards frame reusable content.' />",
  'Post/PostNavigation': "import { PostNavigation } from '@gaudi/design-system';\n\n<PostNavigation prev={previousPost} next={nextPost} />",
  'Core/Carousel': "import { Carousel } from '@gaudi/design-system';\n\n<Carousel\n  ariaLabel='Featured articles'\n  items={[\n    { title: 'Design systems keep editorial rhythm predictable', eyebrow: 'Design Systems', description: 'A focused carousel item.', href: '/blog' },\n  ]}\n/>",
  'Post/PostSeriesBox': "import { PostSeriesBox } from '@gaudi/design-system';\n\n<PostSeriesBox series={seriesPosts} slug='components' />",
  'Core/Checkbox': "import { Checkbox } from '@gaudi/design-system';\n\n<Checkbox label='Include drafts' defaultChecked />",
  'Post/PostSharing': "import { PostSharing } from '@gaudi/design-system';\n\n<PostSharing\n  siteMetadata={siteMetadata}\n  slug='design-systems'\n  title={frontMatter.title}\n  tags={frontMatter.tags}\n/>",
  'Post/TableOfContents': "import { TableOfContents } from '@gaudi/design-system';\n\n<TableOfContents toc={toc} />",
  'Core/DataTable': "import { DataTable } from '@gaudi/design-system';\n\n<DataTable\n  columns={[{ key: 'component', header: 'Component' }]}\n  rows={[{ component: 'Button' }]}\n/>",
  'Core/Field': "import { Field, FieldDescription, FieldInput, FieldLabel } from '@gaudi/design-system';\n\n<Field>\n  <FieldLabel htmlFor='email'>Email</FieldLabel>\n  <FieldInput id='email' type='email' />\n  <FieldDescription>Used for article updates only.</FieldDescription>\n</Field>",
  'Core/Grid': "import { Grid, GridItem } from '@gaudi/design-system';\n\n<Grid columns='3' gap='md'>\n  <GridItem title='Tokens' description='Color, type, spacing, and shape definitions.' />\n</Grid>",
  'Core/Icon': "import { Icon } from '@gaudi/design-system';\n\n<Icon name='Info' label='More information' color='primary' size='lg' />",
  'Core/Kbd': "import { Kbd } from '@gaudi/design-system';\n\n<Kbd keys='command,shift,k' size='sm' variant='raised' />",
  'Core/Link': "import { Link } from '@gaudi/design-system';\n\n<Link href='/blog' variant='inline' tone='blue'>Read the blog</Link>",
  'Core/NavigationMenu': "import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';\n\n<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuLink href='' active>Blog</NavigationMenuLink>\n    <NavigationMenuDropdown label='Categories' width='xl'>\n      <NavigationMenuPanel columns={2}>\n        <NavigationMenuLink href='' variant='panel' description='Knowledge graphs, semantic web, and linked data.'>\n          Data\n        </NavigationMenuLink>\n        <NavigationMenuLink href='' variant='panel' description='Implementation notes and developer tooling.'>\n          Engineering\n        </NavigationMenuLink>\n      </NavigationMenuPanel>\n    </NavigationMenuDropdown>\n  </NavigationMenuList>\n</NavigationMenu>",
  'Core/Pagination': "import { PaginationBar } from '@gaudi/design-system';\n\n<PaginationBar currentPage={1} totalPages={4} getHref={(page) => `?page=${page}`} />",
  'Core/Pill': "import { Pill } from '@gaudi/design-system';\n\n<Pill tone='blue' variant='solid' size='sm'>Engineering</Pill>",
  'Core/Popover': "import { Popover } from '@gaudi/design-system';\n\n<Popover trigger='Open popover'>Compact supporting content.</Popover>",
  'Core/Select': "import { Select } from '@gaudi/design-system';\n\n<Select\n  searchable\n  multiple\n  placeholder='Choose topics'\n  options={[\n    { label: 'Design systems', value: 'design-systems' },\n    { label: 'Knowledge graphs', value: 'knowledge-graphs' },\n  ]}\n/>",
  'Core/Skeleton': "import { Skeleton } from '@gaudi/design-system';\n\n<Skeleton className='h-4 w-40' />",
  'Core/Spinner': "import { Spinner } from '@gaudi/design-system';\n\n<Spinner label='Loading articles' size='md' />",
  'Core/Switch': "import { Switch } from '@gaudi/design-system';\n\n<Switch label='Email notifications' defaultChecked />",
  'Core/Terminal': "import { Terminal } from '@gaudi/design-system';\n\n<Terminal\n  title='blog — zsh'\n  username='ahmad'\n  commands={[\n    { command: 'pnpm test:ds-contracts', output: [{ text: '85 component contracts passed.', tone: 'success' }] },\n  ]}\n/>",
  'Core/TextHighlight': "import { TextHighlight } from '@gaudi/design-system';\n\n<p>Design systems make <TextHighlight>consistency visible</TextHighlight>.</p>"
};

const componentDocs = {
  'Post/TableOfContents': {
    description: 'Tracks article headings and indexes diagrams and tables. Pass contentRef when several articles share the same page.',
    props: [
      ['toc', 'Array<{ id, url, value, depth, children }>', '[]', 'Heading IDs and labels from the article.'],
      ['contentRef', 'RefObject<HTMLElement>', '-', 'Article to index. Defaults to the first article on the page.'],
      ['className', 'string', '-', 'Layout and responsive visibility classes.']
    ]
  },
  'Navigation/MenuMobile': {
    'accessibility': 'MenuMobile renders a named modal dialog with initial Close focus, focus containment, Escape dismissal, a labelled navigation landmark, and real lists and links for every destination.',
    'decisionRules': [
      'Pass the primary Blog destination through `blogLink`; use `links` only for additional top-level destinations.',
      'Keep category ids stable because they form `/blog/categories/:id` destinations.',
      'Mount MenuMobile only while open so its dialog can isolate the page and restore focus to the trigger.'
    ],
    'description': 'MenuMobile renders the compact navigation dialog, blog categories, search entry point, and newsletter action.',
    'props': [
      [ 'blogLink', '{ href, title }', "{ href: '/blog', title: 'Blog' }", 'Explicit primary Blog destination rendered before its categories.' ],
      [ 'categories', 'Array<{ id, title, description }>', '[]', 'Blog category destinations and their supporting descriptions.' ],
      [ 'container', 'HTMLElement', 'document.body', 'Element the dialog renders into and isolates, for example an embedded preview frame.' ],
      [ 'links', 'Array<{ href, title }>', '[]', 'Additional top-level destinations. No position carries special meaning.' ],
      [ 'setMobileMenuOpen', '(open: boolean) => void', '-', 'Closes the dialog after navigation, search launch, Escape, or the Close action.' ],
      [ 'setLauncherOpen', '(open: boolean) => void', '-', 'Opens the search launcher after the mobile dialog closes.' ]
    ],
    'recovery': [
      'Keep the current page intact when the menu closes without navigation and restore focus to its trigger.',
      'If category data is unavailable, retain the primary Blog and top-level destinations instead of rendering broken category links.'
    ]
  },
  'Core/Commander': {
    'accessibility': 'Commander is a keyboard-first overlay. Keep focus visible, support Escape close/back behavior, expose readable result labels, and make Cmd/Ctrl + K available without hiding the visible trigger.',
    'description': 'Commander provides the blog-wide command palette for navigation, content search, and theme actions.',
    'overview': 'Use Commander with a visible trigger such as MenuSearch. MenuSearch already includes the keyboard hint.',
    'recovery': [
      'Keep the query and current page intact when a search returns no results; offer a clear route back to all destinations.',
      'Escape closes the current level first, then the launcher, so keyboard users can recover without losing context.'
    ],
    'props': [
      [ 'open', 'boolean', '-', 'Controlled palette state.' ],
      [ 'setOpen', '(open: boolean) => void', '-', 'State setter used by the trigger, shortcut, keyboard handler, and close behavior.' ],
      [ 'posts', 'Array', '[]', 'Searchable post records.' ],
      [ 'projects', 'Array', '[]', 'Searchable project records.' ],
      [ 'publications', 'Array', '[]', 'Searchable publication records.' ],
      [ 'tags', 'Array', '[]', 'Searchable tag records.' ],
      [ 'thoughts', 'Array', '[]', 'Searchable thought records.' ]
    ]
  },
  'Core/Accordion': {
    'accessibility': 'Radix-backed native buttons expose expanded state and labelled panels. Arrow Up/Down and Home/End navigate enabled headers within the current accordion; Enter/Space toggle. Disabled items are skipped. Headings default to h3 and can follow the document hierarchy. Closed panels are inert during animation and unmounted afterward; forceMount retains hidden, inert content. Reduced motion is respected.',
    'description': 'Rich disclosure for FAQs, settings, member directories, nested help, and guided setup. Eleven patterns use Gaudi tokens, icons, avatars, cards, and pills.',
    'notes': [
      '`Accordion` and `AccordionGroup` from the package root are the items-based convenience API. Use `AccordionRoot` for compound composition. The named `Accordion` from the `core/Accordion` subpath remains the compound root for compatibility.',
      'Give every item a stable, unique, non-empty string value. Single mode uses a string; multiple mode uses an array. An explicit undefined controlled value collapses every panel.',
      'The group opens the first enabled item by default. Use `defaultValue={null}` for a collapsed single group or `defaultValue={[]}` in multiple mode. AccordionRoot starts closed unless a default is supplied.',
      'Existing render-function children and explicit `isOpen` / `onClick` composition remain supported. New compound usage manages state and ARIA associations automatically.',
      'Leading content and badges must be noninteractive. Put links, inputs, and action buttons inside AccordionContent. Provide an appropriate headingLevel for nested sections.',
      'forceMount preserves form state but does not omit closed inputs from native form submission. Consumers own persistence, validation, and submission scope.'
    ],
    'props': [
      [ 'items', 'Array<{ value, title, content, disabled?, leading?, description?, badge?, indicator?, indicatorPosition?, headingLevel?, forceMount?, className?, triggerClassName?, contentClassName? }>', '[]', 'Convenience group items. Rich slots accept React nodes.' ],
      [ 'type', 'single | multiple', 'single', 'Allow one or several expanded panels.' ],
      [ 'variant', 'outline | flush | separated | solid | framed', 'outline', 'Shared border, quiet dividers, individual borders, muted items, or an inset frame.' ],
      [ 'defaultValue', 'string | string[] | null', 'first enabled item (group)', 'Initial uncontrolled state. Use null or [] to start collapsed.' ],
      [ 'value / onValueChange', 'string | string[] | undefined / function', '-', 'Controlled state. Single close emits undefined; multiple close emits an array.' ],
      [ 'collapsible', 'boolean', 'true', 'Allow the current single item to close. Set false to keep the active item expanded.' ],
      [ 'disabled', 'boolean', 'false', 'Disable all root items or one AccordionItem.' ],
      [ 'indicator', 'chevron | plus-minus | arrow | ReactNode | ({isOpen}) => ReactNode | null', 'chevron', 'Root default with per-trigger or per-item overrides.' ],
      [ 'indicatorPosition', 'start | end', 'end', 'Logical indicator position, including RTL.' ],
      [ 'highlight', 'boolean', 'false', 'Use the accent surface on expanded headers.' ],
      [ 'headingLevel', '2 | 3 | 4 | 5 | 6', '3', 'Heading level; override per item or trigger.' ],
      [ 'leading / description / badge', 'ReactNode', '-', 'Noninteractive slots on AccordionTrigger or group items.' ],
      [ 'forceMount', 'boolean', 'false', 'Retain closed panel children, hidden and inert, to preserve form drafts.' ],
      [ 'children', 'ReactNode | render function', '-', 'AccordionRoot compound children or the legacy state render function.' ],
      [ 'className / ref / DOM attributes', 'native props', '-', 'Root, item, and trigger forward native props; content className styles its padded inner body.' ]
    ]
  },
  'Core/Avatar': {
    'accessibility': 'A named Avatar exposes one image label, including host-provided presence. Use alt="" beside visible identity text. Wrap interactive avatars in Button, Tooltip or DropdownMenu; status badges never infer presence from image loading.',
    'description': 'Profile images, resilient initials, presence, verification, account menus and collaborator groups. The existing Avatar API and all 35 curated patterns share the same image and fallback primitives.',
    'props': [
      [ 'src', 'string', '-', 'Remote, local or data image source; failed and pending images show the fallback.' ],
      [ 'name / label', 'string', '-', 'Name generates Unicode initials; label preserves explicit legacy initials.' ],
      [ 'alt', 'string', '-', 'Accessible identity override; an empty string is decorative.' ],
      [ 'fallback', 'ReactNode | boolean', 'initials', 'Custom artwork or text; true shows the guest silhouette.' ],
      [ 'size', '2xs | xs | sm | md | lg | xl', 'md', 'Six sizes; existing xs through lg dimensions are preserved.' ],
      [ 'shape / surface', 'circle | square | tile / solid | tinted | plain | bare', 'square / solid', 'Identity crop and background treatment.' ],
      [ 'indicator', '{ label, tone?, icon?, position? }', '-', 'Host-provided presence or verification; positions follow reading direction.' ],
      [ 'imageProps / imageClassName / fallbackClassName', 'object / string / string', '-', 'Image attributes and per-layer appearance.' ],
      [ 'tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'gray', 'Fallback colour family.' ],
      [ 'grayscale', 'boolean', 'false', 'Desaturates the image.' ],
      [ 'onLoadingStatusChange', '(status) => void', '-', 'Receives loading, loaded or error; source changes recover automatically.' ],
      [ 'AvatarGroup', 'avatars, max, size, shape, label, renderAvatar, renderOverflow', '-', 'Accepts data-driven identities or existing compound children.' ]
    ]
  },
  'Core/Banner': {
    'accessibility': 'Static banners use status semantics. Linked banners expose a combined accessible label.',
    'description': 'Banner renders a compact announcement strip.',
    'props': [
      [ 'title', 'ReactNode', '-', 'Optional bold leading text.' ],
      [ 'children', 'ReactNode', '-', 'Announcement body copy.' ],
      [ 'href', 'string', '-', 'Turns the banner copy into a navigation link.' ],
      [ 'ariaLabel', 'string', 'title + children', 'Accessible label for linked banners.' ],
      [ 'size', 'xs | sm | md | lg', 'md', 'Controls vertical and horizontal padding.' ],
      [ 'tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'gray', 'Color family for the banner.' ],
      [ 'variant', 'solid | soft | outline', 'soft', 'Visual treatment.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, body, action }', '-', 'Slot-level class overrides.' ]
    ]
  },
  'Core/Breadcrumb': {
    'accessibility': 'Breadcrumb renders a nav landmark, ordered list, real links for ancestors, and aria-current on the current page.',
    'description': 'Breadcrumb renders hierarchical page trails for navigation context.',
    'props': [
      [ 'items', 'Array<{ href, label, current }>', '[]', 'Convenience API for a complete breadcrumb trail.' ],
      [ 'label', 'string', 'Breadcrumb', 'Accessible name for the nav landmark.' ],
      [ 'className', 'string', '-', 'Root or slot class override depending on the exported primitive.' ],
      [ 'children', 'ReactNode', '-', 'Composition API for custom Breadcrumb/List/Item/Link/Page layouts.' ],
      [ 'href', 'string', '-', 'Link target for ancestor pages.' ],
      [ 'current', 'boolean', 'false', 'Marks the active page with aria-current.' ]
    ]
  },
  'Core/Button': {
    'accessibility': 'Button renders native buttons for actions and links for navigation. Disabled link variants are removed from tab order.',
    'decisionRules': [
      'Use `solid` with `accent` for the one primary action in a local group.',
      'Use `outline` or `soft` with `neutral` for secondary actions that still need a visible target.',
      'Use `ghost`, `subtle`, or inline Link for quiet navigation and toolbar actions.',
      'Choose semantic tones by meaning: `success`, `warning`, `danger`, `attention`, `discovery`, or `info`.'
    ],
    'description': 'Button renders the Gaudi action and link-button variants.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Visible button label or content.' ],
      [ 'variant', 'solid | soft | outline | ghost | subtle', 'solid', 'Reusable visual treatment.' ],
      [ 'size', 'xs | sm | md | lg | icon | icon-xs | icon-sm | icon-lg', 'md', 'Compact heights: xs 24px, sm 28px, md/default 32px, lg 36px. Icon sizes match their text-button counterparts. Use matching sizes for controls in the same row.' ],
      [ 'tone', 'accent | neutral | success | warning | danger | attention | discovery | info', 'accent', 'Semantic meaning for the action. Legacy hue names remain supported as compatibility aliases.' ],
      [ 'radius', 'sm | md | lg | full', 'md', 'Legacy aliases use the global --ds-radius setting (2px by default); none stays square where supported.' ],
      [ 'href', 'string', '-', 'Renders an internal Next link or safe external anchor.' ],
      [ 'disabled', 'boolean', 'false', 'Disables native buttons and removes disabled links from the tab order.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },

  'Core/Card': {
    'accessibility': 'Card is a structural container. Put links or buttons inside it rather than making the whole card a fake control.',
    'decisionRules': [
      'Use Card to frame one reusable content unit, not as page scaffolding.',
      'Put real links and buttons inside the card instead of turning the whole surface into a fake control.',
      'Avoid nested cards; separate sections with spacing or a table/list pattern instead.'
    ],
    'description': 'Card frames reusable content with title, subtitle, and optional children.',
    'props': [
      [ 'title', 'ReactNode', '-', 'Optional card heading.' ],
      [ 'titleLevel', '2 | 3 | 4 | 5 | 6', '3', 'Semantic level for the optional card heading.' ],
      [ 'subtitle', 'ReactNode', '-', 'Supporting description under the title.' ],
      [ 'children', 'ReactNode', '-', 'Body content, actions, or nested composition.' ],
      [ 'variant', 'elevated | outline | soft | flat', 'elevated', 'Container surface treatment.' ],
      [ 'padding', 'none | sm | md | lg', 'md', 'Internal spacing.' ],
      [ 'radius', 'none | sm | md | lg', 'md', 'Legacy aliases use the global --ds-radius setting (2px by default); none stays square where supported.' ],
      [ 'interactive', 'boolean', 'false', 'Adds hover elevation for cards containing a real link or button.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, body, title, subtitle }', '-', 'Slot-level class overrides.' ]
    ]
  },
  'MDX/Chart': {
    'accessibility': 'Charts render as labelled figures with role img and deterministic Recharts rendering. Provide ariaLabel, title, and description so the visual has a readable summary in article content.',
    'description': 'Chart renders Recharts-based article data visualisations for MDX posts.',
    'overview': 'Use Chart and the named chart exports inside MDX when an article needs inline data visualisation. The components wrap Recharts with Gaudi spacing, borders, tooltips, tokens, and reduced-motion-safe rendering.',
    'props': [
      [ 'type', 'bar | line | area | pie | donut | composed | scatter | radial', 'bar', 'Generic Chart type. Named exports are preferred when the chart shape is known.' ],
      [ 'data', 'Array<Record<string, unknown>>', '[]', 'Recharts data array for the selected chart.' ],
      [ 'xKey', 'string', 'label', 'Field used for the x axis on axis-based charts.' ],
      [ 'yKey', 'string', 'value', 'Primary value key for bar, line, and area charts.' ],
      [ 'series', 'Array<{ key, label }>', '-', 'Multiple data series for bar, line, and area charts.' ],
      [ 'title', 'ReactNode', '-', 'Figure title shown above the chart.' ],
      [ 'description', 'ReactNode', '-', 'Supporting caption copy shown above the chart.' ],
      [ 'ariaLabel', 'string', 'title or Chart', 'Accessible summary for the chart figure.' ],
      [ 'height', 'number', '320', 'Responsive container height.' ],
      [ 'colors', 'string[]', 'Gaudi chart palette', 'Optional color sequence for series or slices.' ],
      [ 'showGrid', 'boolean', 'true', 'Shows chart grid lines on axis-based charts.' ],
      [ 'showLegend', 'boolean', 'false', 'Shows a Recharts legend when useful.' ],
      [ 'showTooltip', 'boolean', 'true', 'Shows a token-styled tooltip.' ],
      [ 'className', 'string', '-', 'Root figure class override.' ]
    ]
  },
  'MDX/Citation': {
    propsTitle: 'Runtime contract',
    props: [[ 'CitationPopover / CitationTracker', 'Runtime component; no props', '—', 'Enhances generated article markup. Mount once per article runtime.' ]],
    'accessibility': 'Generated citation links are real anchors with readable labels. Popovers open on hover or focus, grouped references remain individually reachable, and CitationTracker keeps bibliography back-links pointed at the most recent citation instance.',
    'consumerResponsibilities': [
      'Keep BibTeX source files in the blog, usually under `data/meta/bibliography`. They do not belong in the design-system package.',
      'Register `rehypeSimpleCitations` in the blog MDX/content pipeline so citation text is transformed before React renders the article.',
      'Mount `CitationTracker` once in the app layout and mount `CitationPopover` near the rendered article content.',
      'Keep citation keys in MDX prose exactly matched to the BibTeX ids in the bibliography files.'
    ],
    'description': 'Citation documents the blog citation authoring flow and the Gaudi runtime components that hydrate generated citation links.',
    'donts': [
      'Do not hand-write `<sup>`, `citation-link` classes, `data-citation-*` attributes, or References markup in MDX.',
      'Do not import `CitationPopover` or `CitationTracker` inside individual MDX posts.',
      'Do not use `CitationPopover` as a manual popover for arbitrary text; it expects generated citation anchors.'
    ],
    'dos': [
      'Add BibTeX files to `data/meta/bibliography` in the blog repo.',
      'List the BibTeX files in post frontmatter with `bibliography: [\'meta/bibliography/references.bib\', \'meta/bibliography/kg.bib\']`.',
      'Cite one source with `[@HusseinYC18]` and grouped sources with `[@HusseinYC18; @WangJSWYCY19; @YangXJWHW20]`.',
      'Let `rehypeSimpleCitations` generate numbered anchors, popover data attributes, and the References section.',
      'Use `CitationPopover` and `CitationTracker` only as runtime hydration for the generated citation markup.'
    ],
    'notes': [
      'The authoring API is markdown citation syntax, not a React component API.',
      '`rehypeSimpleCitations` is the blog rehype plugin. It loads BibTeX through `citation-js`, assigns first-use numbers, supports grouped citations, emits citation anchors, and appends the References list.',
      '`CitationPopover` binds to generated anchors marked with `data-citation-popover` and reads the generated citation keys, numbers, and reference text from data attributes.',
      '`CitationTracker` updates bibliography back-links so a reference points back to the most recent citation instance the reader used.'
    ],
    'overview': 'Use citations in three places. Authors put BibTeX files in the blog, list those files in post frontmatter, and cite keys directly in prose with Pandoc-style brackets. The blog MDX pipeline runs rehypeSimpleCitations, which converts those text markers into numbered anchors plus a generated References section. Gaudi does not parse BibTeX or rewrite MDX; it only provides the runtime CitationPopover and CitationTracker behavior for the generated markup.',
    'usageTitle': 'Authoring Example'
  },
  'MDX/Footnote': {
    propsTitle: 'Runtime contract',
    props: [[ 'Footnote', 'Runtime component; no props', '—', 'Enhances generated article markup. Mount once per article runtime.' ]],
    'accessibility': 'Generated footnote references are real anchors, so readers can still jump to the notes list. `Footnote` adds hover and focus previews without replacing the underlying link or removing the accessible footnote relationship.',
    'consumerResponsibilities': [
      'Enable markdown footnotes in the blog MDX pipeline with `remarkGfm`.',
      'Run `remarkFootnoteData` before rehype so footnote definitions are available on `file.data.footnotes`.',
      'Run `rehypeFootnotePopoverV2` after footnotes are converted to HTML so reference anchors receive `data-footnote-popover`, `data-footnote-number`, and `data-footnote-content`.',
      'Mount `Footnote` once near the rendered MDX article, not inside the MDX document itself.'
    ],
    'description': 'Footnote hydrates generated markdown footnote references with hover and focus popover previews.',
    'donts': [
      'Do not hand-write `data-footnote-*` attributes in article MDX.',
      'Do not use `<Footnote />` as an inline MDX component or wrapper around footnote text.',
      'Do not hide the underlying footnote references without preserving anchor navigation and focus behavior.'
    ],
    'dos': [
      'Write standard markdown footnotes with `[^id]` references and `[^id]: note text` definitions.',
      'Let `remarkFootnoteData` extract note content and let `rehypeFootnotePopoverV2` attach popover data to generated reference links.',
      'Use `Footnote` as a page-level runtime binder after the article has rendered.',
      'Keep footnote copy short enough for a compact popover; long supporting material belongs in the visible footnotes section.'
    ],
    'notes': [
      '`Footnote` listens for `mouseenter`, `mouseleave`, `focusin`, and `focusout` on generated links marked with `data-footnote-popover="true"`.',
      'The popover body is read from generated `data-footnote-content`, so the plugin must sanitize and serialize the note content before runtime.',
      'The component positions the popover next to the reference and flips left when it would overflow the viewport.',
      'The visible footnotes list remains the source of truth; the popover is a reading convenience.'
    ],
    'overview': 'Authors do not write a React component for each footnote. They write standard markdown footnote syntax in the post. The blog MDX pipeline extracts the definitions, enhances the generated footnote reference anchors with `data-footnote-*` attributes, and may visually collapse the bottom notes section. Gaudi only owns the small client runtime that reads those generated attributes and shows the preview popover on hover or keyboard focus.',
    'usageTitle': 'Authoring Example'
  },
  'MDX/FAQ': {
    'accessibility': 'Faq uses a semantic definition list and native disclosure buttons. Choose a headingLevel that follows the surrounding article heading without skipping a level.',
    'props': [
      [ 'questions', 'Array<{ question, answer }>', '-', 'Question and answer disclosures.' ],
      [ 'heading', 'ReactNode', 'FAQ', 'Visible section heading.' ],
      [ 'headingLevel', '2 | 3 | 4 | 5 | 6', '2', 'Semantic level for the section heading.' ]
    ]
  },
  'MDX/Image': {
    'accessibility': 'Image keeps article images semantic with alt text, figure captions, and a button trigger for the modal preview.',
    'description': 'Image renders editorial MDX images with caption, dark-mode source, fallback source, and click-to-open modal behavior.',
    'recovery': [
      'Provide a valid fallback source for editorial images that can fail independently of the article.',
      'Keep useful alt text available when both image sources fail; never replace the article with an empty frame.'
    ],
    'props': [
      [ 'src', 'string', '-', 'Primary image source.' ],
      [ 'fallback', 'string', '-', 'Fallback image source used after load failure.' ],
      [ 'darkSrc', 'string', '-', 'Optional image source shown in dark mode.' ],
      [ 'alt', 'string', 'post-image', 'Accessible alt text for informative images.' ],
      [ 'caption', 'ReactNode', '-', 'Optional visible figure caption.' ],
      [ 'width', 'number', '-', 'Image width for Next image rendering unless fill is supplied.' ],
      [ 'height', 'number', '-', 'Image height for Next image rendering unless fill is supplied.' ],
      [ 'fill', 'boolean', 'false', 'Uses the parent box instead of explicit dimensions.' ],
      [ 'sizes', 'string', '-', 'Responsive image sizes hint passed to Next image.' ],
      [ 'className', 'string', '-', 'Image class override.' ]
    ]
  },
  'MDX/Mermaid': {
    'accessibility': 'Mermaid exposes the rendered diagram as one labelled figure. Provide a concise description that communicates the diagram meaning without relying on shape, position, or color.',
    'props': [
      [ 'chart', 'string', '-', 'Mermaid chart definition.' ],
      [ 'description', 'string', 'Diagram', 'Accessible text alternative for the rendered diagram.' ],
      [ 'id', 'string', 'generated', 'Stable Mermaid render identifier.' ],
      [ 'className', 'string', '-', 'Root figure class override.' ]
    ],
    'recovery': [
      'Render a readable diagram error next to the source context when Mermaid cannot parse the chart.',
      'Keep the page usable after a rendering failure and let authors correct the chart without losing surrounding article content.'
    ]
  },
  'MDX/GaudiBarLayout': {
    'accessibility': 'GaudiBarLayout includes a complete text equivalent, six keyboard-accessible region controls, pressed-state semantics, and a live widget readout. The hierarchy remains understandable without colour or pointer input.',
    'description': 'GaudiBarLayout presents the desktop, its top and bottom primary bars, their left, middle, and right regions, and the flexible widgets inside each region as an interactive compositor.',
    'props': [
      [ 'title', 'string', 'How gaudiBar composes the desktop', 'Visible diagram title.' ],
      [ 'description', 'string', 'Choose any region…', 'Concise explanation of the layout model.' ],
      [ 'className', 'string', '-', 'Additional root figure class.' ]
    ],
    'recovery': [
      'Keep the region data synchronized with the ordered text equivalent when widgets or layout areas change.',
      'Prefer a normal image with descriptive alt text if the layout no longer fits the supported two-bar, three-region model.'
    ]
  },
  'MDX/LinkedDataQualityFramework': {
    'accessibility': 'LinkedDataQualityFramework includes a complete ordered text equivalent, keyboard-accessible subsystem controls, pressed-state semantics, and a live subsystem readout. Meaning never depends on position or colour alone.',
    'description': 'LinkedDataQualityFramework presents Roomba’s portal, extraction, validation, profiling, and reporting modules as a connected, interactive block architecture for long-form articles.',
    'props': [
      [ 'title', 'string', 'Roomba’s Linked Data quality architecture', 'Visible diagram title.' ],
      [ 'description', 'string', 'A modular path…', 'Concise explanation of the architecture.' ],
      [ 'className', 'string', '-', 'Additional root figure class.' ]
    ],
    'recovery': [
      'Keep the ordered text equivalent synchronized with every subsystem and module when the architecture changes.',
      'Prefer a normal image with descriptive alt text if the framework can no longer be represented by the supported subsystem structure.'
    ]
  },
  'MDX/PipelineDiagram': {
    'accessibility': 'PipelineDiagram includes a complete ordered text equivalent, keyboard-accessible stage controls, and current-step semantics. Meaning never depends on position or colour alone.',
    'description': 'PipelineDiagram turns a source, shared platform, ordered stages, failure branches, and destination into an interactive, responsive HTML workflow for long-form articles.',
    'props': [
      [ 'title', 'string', '-', 'Visible diagram title.' ],
      [ 'description', 'string', '-', 'Concise explanation of the full workflow.' ],
      [ 'source', '{ label, action }', '-', 'The workflow origin and action that enters the shared platform.' ],
      [ 'platform', '{ label, detail?, success?, feedback? }', '-', 'The repository or system of record and the signals returned to it.' ],
      [ 'pipeline', '{ label, trigger, stages[] }', '-', 'The named pipeline and its ordered stages. Stages can expose failure or output branches.' ],
      [ 'destination', '{ label }', '-', 'Optional deployment or delivery destination.' ],
      [ 'className', 'string', '-', 'Additional root figure class.' ]
    ],
    'recovery': [
      'Keep labels and outcomes in the component data so the ordered text equivalent remains complete.',
      'Prefer a normal image with descriptive alt text when a workflow cannot be expressed with the supported stages and branches.'
    ]
  },
  'MDX/Preview': {
    'accessibility': 'Preview renders a real link with a readable label. The hover card is supplemental; the target URL remains reachable without JavaScript, images, or preview metadata.',
    'consumerResponsibilities': [
      'Register `remarkLinks` in the blog remark pipeline so external markdown links become `Preview` MDX elements.',
      'Register `rehypeInternalLinks` in the blog rehype pipeline so internal blog anchors become `Preview internal` elements after markdown has become HTML.',
      'Expose `/api/preview` in the consuming app for external metadata fetching, caching, and failure handling.',
      'Keep `Preview` in the `MDXComponents` map so generated MDX JSX can resolve at render time.'
    ],
    'description': 'Preview renders inline link previews for markdown links transformed by the blog MDX pipeline.',
    'donts': [
      'Do not rewrite ordinary article links by hand when markdown syntax can express the link.',
      'Do not rely on the hover card as the only place a title or destination appears.',
      'Do not fetch external preview metadata inside the design-system package; the consuming app owns the API route.'
    ],
    'dos': [
      'Write normal markdown links such as `[assaf.website](https://assaf.website)` in MDX posts.',
      'Use direct `<Preview />` only in React pages, custom layouts, or deterministic docs examples with `previewData`.',
      'Use `internal` for local blog links that should render internal metadata without remote preview fetching.',
      'Provide `title` when the source text is not enough or when deterministic rendering matters.'
    ],
    'notes': [
      '`remarkLinks` converts external `http` and `https` markdown links into `Preview` MDX text elements with `url` and optional `title` attributes.',
      '`rehypeInternalLinks` converts matching internal blog anchors like `/blog/category/slug` into `Preview internal` elements after markdown has become HAST.',
      'External previews call `/api/preview`; unavailable URLs render a red fallback link instead of breaking article content.',
      'Internal previews skip remote fetching and can use local metadata supplied by the app or generated pipeline.'
    ],
    'overview': 'Authors should usually write normal markdown links. During compilation, the blog turns eligible external markdown links into `Preview` components with `remarkLinks`, then turns eligible internal blog anchors into `Preview internal` components with `rehypeInternalLinks`. Gaudi owns the rendered inline link, fallback state, loading skeleton, and hover card UI; the blog owns the markdown transforms and preview API.',
    'recovery': [
      'Preserve the original destination link while preview metadata loads or fails, so navigation never depends on the enrichment API.',
      'Name the unavailable preview and keep the supplied title visible; a failed hover card must not become an empty interaction.'
    ],
    'props': [
      [ 'url', 'string', '-', 'Target URL to link to and preview.' ],
      [ 'title', 'string', '-', 'Optional custom title that overrides fetched preview metadata.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'defaultOpen', 'boolean', 'false', 'Starts the hover card open for deterministic demos and visual tests.' ],
      [ 'internal', 'boolean', 'false', 'Renders a local app link and skips remote preview fetching.' ],
      [ 'previewData', 'object', 'null', 'Preloaded metadata for deterministic docs, tests, or server-provided previews.' ],
      [ 'showImage', 'boolean', 'true', 'Controls whether the hover card can show image preview metadata.' ],
      [ 'timeout', 'number', '10000', 'Preview metadata request timeout in milliseconds.' ],
      [ 'onLoad', '(data) => void', '-', 'Called when preview metadata loads successfully.' ],
      [ 'onError', '(error) => void', '-', 'Called when preview metadata fails to load.' ],
      [ 'fallback', 'ReactNode', '-', 'Custom fallback UI for unavailable preview metadata.' ]
    ],
    'usageTitle': 'Authoring Example'
  },
  'Core/Carousel': {
    'accessibility': 'Carousel exposes a labelled carousel region, native previous/next buttons, aria-live status updates, keyboard arrow support, and named indicators.',
    'description': 'Carousel renders standard feature slides and editorial card rails.',
    'props': [
      [ 'items', 'Array<{ id, title, description, eyebrow, image, alt, href, action, content }>', '[]', 'Slide data. Standard uses the active item; apple renders the horizontal rail.' ],
      [ 'ariaLabel', 'string', 'Carousel', 'Accessible name for the carousel region.' ],
      [ 'variant', 'standard | rail | apple', 'standard', 'Slide format. Use rail for editorial card rails; apple remains a legacy alias.' ],
      [ 'size', 'sm | md | lg', 'md', 'Controls max width and slide/card height.' ],
      [ 'radius', 'none | sm | md | lg', 'lg', 'Legacy aliases use the global --ds-radius setting; none keeps square corners.' ],
      [ 'controls', 'boolean', 'true', 'Shows previous and next buttons.' ],
      [ 'loop', 'boolean', 'false', 'Wraps previous/next navigation.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, header, viewport, track, slide, card, image, content, eyebrow, title, description, action, controls, control, indicators, indicator, dialog, overlay }', '-', 'Slot-level overrides for visual composition.' ]
    ]
  },
  'Core/Checkbox': {
    'accessibility': 'Checkbox exposes role checkbox, aria-checked, disabled state, and a visible label when provided.',
    'description': 'Checkbox renders a token-styled binary control.',
    'props': [
      [ 'id', 'string', 'generated id', 'Connects the button control to its visible label.' ],
      [ 'label', 'ReactNode', '-', 'Visible label text.' ],
      [ 'checked', 'boolean', '-', 'Controlled checked state.' ],
      [ 'defaultChecked', 'boolean', 'false', 'Initial checked state for uncontrolled usage.' ],
      [ 'disabled', 'boolean', 'false', 'Prevents changes and lowers visual emphasis.' ],
      [ 'onCheckedChange', '(checked) => void', '-', 'Called with the next checked state.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/DataTable': {
    'accessibility': 'DataTable renders a real table: a visually hidden caption, scoped column headers with aria-sort, named selection checkboxes, and a labelled, keyboard-focusable scroll region that pans with the arrow keys. Expand, row-action and group toggles are named buttons with aria-expanded; clickable rows take focus and activate with Enter or Space.',
    'decisionRules': [
      'Use DataTable for actual tabular comparison, not card grids or definition lists.',
      'Keep filtering predicates in the host: pass FilterBar state through your own match function and give DataTable the visible rows.',
      'Right-align numeric columns with align: right so figures line up in tabular numerals.',
      'Pin at most the identifying column and one summary column; pinning releases on narrow screens so every column stays reachable.'
    ],
    'description': 'DataTable is a TanStack table with a compact data anatomy: uppercase tracked headers, hairline rows, synced column and row hover, a tinted wash for selected rows, and declarative column alignment, width and pinning. It adds search with a live count, sorting, selection with bulk actions, expandable rows, row action menus, grouped bands, a totals footer, pagination, and loading, refreshing, empty and error states.',
    'props': [
      [ 'columns', 'Array<{ key, header, render?, align?, width?, sticky?, footer?, sortable?, searchable?, hideable? }>', '[]', 'Column definitions. align: right sets tabular numerals; sticky: left | right pins; footer(rows) renders a total.' ],
      [ 'rows', 'Array<Record<string, unknown>>', '[]', 'Rows keyed by column key. row.id is used as the stable key when present.' ],
      [ 'searchable / sortable / selectable', 'boolean', 'false', 'Search with a live count, header sorting, and page-scoped row selection.' ],
      [ 'columnVisibility / pagination', 'boolean', 'false', 'Column controls and paged rows with first, previous, next and last.' ],
      [ 'pageSize', 'number', '10', 'Rows per page when pagination is enabled.' ],
      [ 'density', 'compact | normal | comfortable', 'normal', 'Cell padding and header height.' ],
      [ 'striped / footer', 'boolean', 'false', 'Alternate row wash; a footer row with the record count and column totals.' ],
      [ 'renderExpanded / canExpand / expandMode', 'function(row) / function(row) / single | multiple', '- / - / single', 'Detail rows under an expand toggle.' ],
      [ 'getRowActions', 'function(row) => Array<{ label, onSelect, icon?, tone?, disabled? }>', '-', 'An overflow menu at the end of each row.' ],
      [ 'onRowClick', 'function(row)', '-', 'Makes rows focusable and activatable, ignoring clicks on inner controls.' ],
      [ 'groupBy', 'function(row) => { key, label }', '-', 'Collapsible group bands with counts.' ],
      [ 'toolbar', 'ReactNode', '-', 'Extra controls beside the search, such as a FilterBar facet trigger.' ],
      [ 'selection / onSelectionChange', 'Record<string, boolean> / function', '-', 'Controlled selection keyed by stable row IDs.' ],
      [ 'getRowId', 'function', 'row.id or index', 'Supply stable identity for interactive collections.' ],
      [ 'renderSelectionActions', 'function(rows)', '-', 'Bulk actions for the selected rows.' ],
      [ 'loading / refreshing / error / onRetry', 'boolean / boolean / string / function', '-', 'Skeleton rows, a floating updating pill over current rows, and host-owned recovery.' ],
      [ 'caption', 'ReactNode', '-', 'Visually hidden caption that names the table and its scroll region.' ],
      [ 'overflowLabel', 'string', 'Scrollable data table', 'Accessible name for the scroll region when no caption is present.' ],
      [ 'labels', 'object', '-', 'Visible and accessible copy overrides.' ],
      [ 'className', 'string', '-', 'Outer table frame class override.' ]
    ]
  },
  'MDX/Video': {
    'accessibility': 'Video uses a native button for the thumbnail trigger, an aria-modal dialog, Escape-to-close behavior, labelled close controls, and returns focus to the trigger when closed.',
    'description': 'Video renders a video thumbnail that opens an embedded video in an accessible modal dialog.',
    'overview': 'Use Video inside MDX when an article needs a focused video walkthrough without embedding an always-loaded iframe in the page flow.',
    'props': [
      [ 'videoSrc', 'YouTube embed URL or embeddable URL', '-', 'Source URL converted to an embeddable iframe URL when possible.' ],
      [ 'thumbnailSrc', 'string', '-', 'Optional thumbnail image source.' ],
      [ 'thumbnailAlt', 'string', 'Video thumbnail', 'Accessible alt text for the thumbnail image or fallback thumbnail label.' ],
      [ 'animationStyle', 'from-center | from-bottom | from-top | from-left | from-right | fade | top-in-bottom-out | left-in-right-out', 'from-center', 'Dialog entrance animation.' ],
      [ 'title', 'string', 'Video', 'Dialog heading and iframe title.' ],
      [ 'ariaLabel', 'string', 'playLabel', 'Accessible label for the thumbnail trigger.' ],
      [ 'autoplay', 'boolean', 'true', 'Adds autoplay to the iframe URL when the dialog opens.' ],
      [ 'playLabel', 'string', 'Play video', 'Fallback accessible label for the thumbnail trigger.' ],
      [ 'className', 'string', '-', 'Thumbnail trigger class override.' ],
      [ 'classNames', '{ trigger, thumbnail, playWrapper, playButton, dialog, overlay, panel, title, close, video }', '-', 'Slot-level class overrides.' ]
    ]
  },
  'Core/Field': {
    'accessibility': 'Field keeps label, input, description, and error markup colocated so form controls can be wired with id/htmlFor.',
    'decisionRules': [
      'Use a persistent FieldLabel; placeholders are examples, not labels.',
      'Put requirements and recovery text next to the field before submission.',
      'Use FieldError and aria-invalid for invalid states instead of relying on red borders alone.'
    ],
    'description': 'Field composes form label, description, error, and input building blocks.',
    'recovery': [
      'Keep the entered value when validation fails and move the actionable message next to the input.',
      'State the problem and the correction in plain language, then clear `aria-invalid` as soon as the value becomes valid.'
    ],
    'props': [
      [ 'children', 'ReactNode', '-', 'Composes label, input, description, and error slots or supplies slot text.' ],
      [ 'htmlFor', 'string', '-', 'Connects the visible label to the input id.' ],
      [ 'id', 'string', '-', 'Input id paired with FieldLabel htmlFor.' ],
      [ 'type', 'string', 'text', 'Native input type.' ],
      [ 'name', 'string', '-', 'Native input name for form submission.' ],
      [ 'value', 'string', '-', 'Controlled input value.' ],
      [ 'defaultValue', 'string', '-', 'Initial uncontrolled input value.' ],
      [ 'placeholder', 'string', '-', 'Native input placeholder.' ],
      [ 'required', 'boolean', 'false', 'Marks the input as required.' ],
      [ 'invalid', 'boolean', 'true when a FieldError is rendered', 'Forces aria-invalid and the error border on FieldInput.' ],
      [ 'disabled', 'boolean', 'false', 'Disables the input.' ],
      [ 'onChange', '(event) => void', '-', 'Native input change handler.' ],
      [ 'className', 'string', '-', 'Class override on each Field slot.' ]
    ]
  },
  'Core/Grid': {
    'accessibility': 'Grid provides layout only. Its children keep their own headings, links, and controls.',
    'description': 'Grid and GridItem render responsive feature grids.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Grid items or custom content.' ],
      [ 'columns', '2 | 3 | 4', '3', 'Responsive column count.' ],
      [ 'gap', 'sm | md | lg', 'md', 'Space between grid items.' ],
      [ 'title', 'ReactNode', '-', 'GridItem heading.' ],
      [ 'description', 'ReactNode', '-', 'GridItem body text.' ],
      [ 'header', 'ReactNode', '-', 'Optional GridItem header media.' ],
      [ 'icon', 'ReactNode', '-', 'Optional GridItem icon content.' ],
      [ 'variant', 'elevated | outline | soft', 'elevated', 'GridItem surface treatment.' ],
      [ 'padding', 'sm | md | lg', 'md', 'GridItem internal spacing.' ],
      [ 'radius', 'sm | md | lg', 'md', 'Legacy aliases use the global --ds-radius setting (2px by default).' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, body, title, description }', '-', 'GridItem slot overrides.' ]
    ]
  },
  'Core/Icon': {
    'accessibility': 'Decorative icons are hidden from assistive technology. Informative or icon-only links need a readable label.',
    'decisionRules': [
      'Use the Gaudi icon registry; do not import vendor icons directly outside `src/icons/index.jsx`.',
      'Mark decorative icons as decorative and label meaningful icon-only controls.',
      'Keep icon size and stroke aligned with the surrounding text or control.'
    ],
    'description': 'Static and interactive artwork from Gaudi’s centralized icon registry. AnimatedIcon adds opt-in motion with shared size and color tokens, a searchable catalogue, and host-controlled activation.',
    'props': [
      [ 'name', 'registry icon name', '-', 'Renders an icon from the Gaudi registry.' ],
      [ 'kind', 'github | linkedin | twitter | youtube | mail | ...', '-', 'Compatibility alias for social/link icon use.' ],
      [ 'href', 'string', '-', 'Renders the icon as a safe link when provided.' ],
      [ 'label', 'string', '-', 'Accessible label for informative icons and icon links.' ],
      [ 'decorative', 'boolean', 'false', 'Hides the SVG from assistive technology when the icon is visual only.' ],
      [ 'size', 'xs | sm | md | lg | xl | 2xl | number', 'md', 'Controls icon dimensions.' ],
      [ 'color', 'neutral | muted | primary | info | success | warning | danger | attention | blue | teal | green | amber | yellow | red | rose | dim', 'currentColor', 'Token color shortcut.' ],
      [ 'strokeWidth', 'number', 'icon default', 'Adjusts line icon stroke width. Filled brand icons such as Github ignore it.' ],
      [ 'active', 'boolean (AnimatedIcon)', 'false', 'Starts motion when the host is active and visible. Reduced motion and hidden documents keep the resting artwork.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/Kbd': {
    'accessibility': 'Keyboard shortcuts expose readable aria-label text such as Command plus K while keeping visual symbols compact.',
    'description': 'Kbd renders keyboard keys and multi-key shortcuts.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Single visible key when keys is not provided.' ],
      [ 'keys', 'string | string[]', '-', 'Shortcut list such as "command,shift,k".' ],
      [ 'size', 'xs | sm | md | lg', 'md', 'Controls key dimensions and text size.' ],
      [ 'variant', 'raised | outline | flat', 'raised', 'Visual keycap treatment.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/Link': {
    'accessibility': 'Link renders Next links for internal URLs, anchors for fragments, and safe external anchors with noopener noreferrer.',
    'description': 'Link centralizes navigation semantics for internal, anchor, and external links.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Visible link label.' ],
      [ 'href', 'internal | anchor | external URL', '-', 'Internal routes use Next Link; anchors and external URLs use native anchors.' ],
      [ 'prefetch', 'boolean', 'true', 'Next.js prefetch behavior for internal links.' ],
      [ 'variant', 'inline | muted | nav | bare', 'inline', 'Text link style: inline takes tone, muted is secondary gray, nav is strong gray turning blue on hover, bare inherits the parent color.' ],
      [ 'tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'neutral', 'Color family of the inline variant. Default is black/gray and turns blue on hover. muted, nav, and bare have fixed colors and ignore tone.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/NavigationMenu': {
    'accessibility': 'NavigationMenu renders a nav landmark, real links, native dropdown buttons, aria-expanded triggers, Escape-to-close behavior, outside-click dismissal, and aria-current for active links.',
    'description': 'NavigationMenu renders grouped site navigation with dropdown panels for categories, sections, and related destinations.',
    'props': [
      [ 'label', 'string', 'Main navigation', 'Accessible name for the nav landmark.' ],
      [ 'children', 'ReactNode', '-', 'Composition API for list, items, links, and dropdowns.' ],
      [ 'href', 'string', '-', 'NavigationMenuLink destination.' ],
      [ 'active', 'boolean', 'false', 'Marks a NavigationMenuLink as the current page with aria-current.' ],
      [ 'variant', 'link | panel', 'link', 'Use link for top-level items and panel for dropdown card links.' ],
      [ 'description', 'ReactNode', '-', 'Supporting copy shown in panel links.' ],
      [ 'meta', 'ReactNode', '-', 'Small metadata line for panel links.' ],
      [ 'trigger', 'ReactNode', 'label', 'Custom dropdown trigger content.' ],
      [ 'defaultOpen', 'boolean', 'false', 'Initial uncontrolled dropdown state. Useful for demos and persistent nav panels.' ],
      [ 'align', 'start | center | end', 'start', 'Controls dropdown panel alignment.' ],
      [ 'width', 'sm | md | lg | xl', 'lg', 'Controls dropdown panel width.' ],
      [ 'columns', '1 | 2 | 3', '2', 'Responsive panel grid columns.' ],
      [ 'panelClassName', 'string', '-', 'Dropdown panel class override.' ],
      [ 'className', 'string', '-', 'Class override on each slot.' ]
    ]
  },
  'Core/Pagination': {
    'accessibility': 'Pagination renders a nav landmark, disabled button states for unavailable directions, keyboard-focusable status shortcuts, and aria-current on active numbered links.',
    'description': 'Pagination renders blog-style previous/status/next navigation. Hovering or focusing the center status reveals direct page shortcuts.',
    'props': [
      [ 'currentPage', 'number', '1', 'Active page number.' ],
      [ 'totalPages', 'number', '1', 'Total page count.' ],
      [ 'getHref', '(page) => string', '?page={page}', 'Builds each page link URL.' ],
      [ 'onPageChange', '(page) => void', '-', 'Optional client-side page change handler for filtered lists.' ],
      [ 'label', 'string', 'Pagination', 'Accessible name for the pagination nav.' ],
      [ 'children', 'ReactNode', '-', 'Composition API for custom PaginationContent/Item/Link layouts.' ],
      [ 'href', 'string', '#', 'Link destination for previous/next/link slots.' ],
      [ 'disabled', 'boolean', 'false', 'Disables previous/next or numbered controls.' ],
      [ 'isActive', 'boolean', 'false', 'Marks a page link as current.' ],
      [ 'className', 'string', '-', 'Class override on each slot.' ]
    ]
  },
  'Core/Pill': {
    'accessibility': 'Pill includes visible text so status or category meaning is not color-only.',
    'decisionRules': [
      'Use Pill for compact metadata, tags, filters, and status labels.',
      'Keep the visible label as the source of meaning; color only supports scanning.'
    ],
    'description': 'Pill renders compact category and status labels.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Visible category, status, or tag label.' ],
      [ 'size', 'xs | sm | md | lg', 'md', 'Controls padding and text size.' ],
      [ 'tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'blue', 'Semantic tone alias mapped through Gaudi tokens rather than raw palette utilities.' ],
      [ 'variant', 'solid | soft | outline | ghost | subtle', 'solid', 'Visual treatment.' ],
      [ 'radius', 'sm | md | full', 'sm', 'Legacy aliases use the global --ds-radius setting (2px by default); none stays square where supported.' ],
      [ 'href', 'string', '-', 'Renders the pill as a navigation link.' ],
      [ 'icon', 'ReactNode', '-', 'Decorative leading icon.' ],
      [ 'pulse', 'boolean', 'false', 'Adds a pulsing status dot.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/Popover': {
    'accessibility': 'Popover trigger is a native button and outside pointer interactions close the panel. Keep popover content short and non-modal.',
    'description': 'Popover renders compact positioned supporting content.',
    'props': [
      [ 'trigger', 'ReactNode', '-', 'Button label/content for the default PopoverRoot.' ],
      [ 'children', 'ReactNode', '-', 'Popover panel content or custom composition.' ],
      [ 'onClick', '(event) => void', '-', 'Trigger click handler for custom composition.' ],
      [ 'className', 'string', '-', 'Root, trigger, or content class override depending on slot.' ]
    ]
  },
  'Core/Select': {
    'accessibility': 'Select uses a native button trigger, listbox semantics, aria-expanded, aria-selected, aria-multiselectable for multi-select, and keyboard support for Arrow keys, Enter, Space, Home, End, and Escape.',
    'decisionRules': [
      'Use Select when choices are bounded; use search or command palette when users need discovery across content.',
      'Enable `searchable` once the list is too long to scan comfortably.',
      'Use `multiple` only when the user truly needs a set; otherwise keep the decision singular.'
    ],
    'description': 'Select renders a styled option picker with searchable combobox behavior and multi-select support.',
    'recovery': [
      'Keep the existing selection when filtering returns no matches and expose `emptyText` as the recovery message.',
      'Invalid state must be paired with nearby text that explains the required correction; color and `aria-invalid` alone are insufficient.'
    ],
    'props': [
      [ 'options', 'Array<{ label, value, disabled }>', '[]', 'Selectable options. Option children are also normalized when options is empty.' ],
      [ 'value', 'string | string[]', '-', 'Controlled selected value. Arrays are used for multiple mode.' ],
      [ 'defaultValue', 'string | string[]', '-', 'Initial uncontrolled selected value.' ],
      [ 'onValueChange', '(value, option) => void', '-', 'Called when selection changes.' ],
      [ 'multiple', 'boolean', 'false', 'Allows selecting more than one option.' ],
      [ 'searchable', 'boolean', 'false', 'Shows a search field inside the popup and filters options.' ],
      [ 'placeholder', 'string', 'Select option', 'Trigger placeholder when nothing is selected.' ],
      [ 'searchPlaceholder', 'string', 'Search options...', 'Search input placeholder.' ],
      [ 'emptyText', 'string', 'No options found.', 'Empty result text.' ],
      [ 'defaultOpen', 'boolean', 'false', 'Initial open state for demos or controlled-looking examples.' ],
      [ 'disabled', 'boolean', 'false', 'Disables the trigger.' ],
      [ 'invalid', 'boolean', 'false', 'Applies aria-invalid and error styling.' ],
      [ 'name', 'string', '-', 'Renders hidden form inputs for selected values.' ],
      [ 'aria-label', 'string', '-', 'Accessible label for icon-only or unlabeled select controls.' ],
      [ 'children', 'ReactNode', '-', 'Option children normalized when options is empty.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, trigger, value, placeholder, chevron, popup, search, option, check, empty }', '-', 'Slot-level class overrides.' ]
    ]
  },
  'Core/Skeleton': {
    'accessibility': 'Skeleton is aria-hidden and should be paired with loading text or a labelled busy region when content loading needs announcement.',
    'description': 'Skeleton renders non-semantic loading placeholders on the theme border token, so blocks read clearly in light and dark themes.',
    'props': [
      [ 'className', 'string', '-', 'Defines shape, width, height, radius, and layout placement.' ]
    ]
  },
  'Core/Spinner': {
    'accessibility': 'Spinner exposes role status and requires a readable label for the loading operation.',
    'description': 'Spinner renders compact loading progress.',
    'props': [
      [ 'size', 'xs | sm | md | lg', 'md', 'Controls spinner dimensions.' ],
      [ 'label', 'string', 'Loading', 'Accessible status label.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/Switch': {
    'accessibility': 'Switch exposes role switch, aria-checked, disabled state, and a visible label when provided.',
    'description': 'Switch renders a token-styled boolean preference control.',
    'props': [
      [ 'id', 'string', 'generated id', 'Connects the switch to its visible label.' ],
      [ 'label', 'ReactNode', '-', 'Visible label text.' ],
      [ 'checked', 'boolean', '-', 'Controlled checked state.' ],
      [ 'defaultChecked', 'boolean', 'false', 'Initial checked state for uncontrolled usage.' ],
      [ 'size', 'sm | md | lg', 'md', 'Controls track, thumb, and label scale.' ],
      [ 'disabled', 'boolean', 'false', 'Prevents changes and lowers visual emphasis.' ],
      [ 'onCheckedChange', '(checked) => void', '-', 'Called with the next checked state.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
    ]
  },
  'Core/Terminal': {
    'accessibility': 'Terminal renders readable command history inside a labelled region. Motion is disabled when users prefer reduced motion.',
    'description': 'Terminal renders mac-style shell examples with typed commands and structured output lines.',
    'props': [
      [ 'commands', 'Array<string | { command, output, tone }>', 'example commands', 'Command history. output can be strings or { text, tone } lines.' ],
      [ 'outputs', 'Record<number, output[]>', '{}', 'Legacy output mapping for string command arrays.' ],
      [ 'ariaLabel', 'string', 'Terminal', 'Accessible name for the terminal region.' ],
      [ 'title', 'string', 'terminal', 'Header title.' ],
      [ 'username', 'string', 'ahmad', 'Prompt username segment.' ],
      [ 'promptSymbol', 'string', '$', 'Prompt separator.' ],
      [ 'variant', 'dark | light | translucent', 'dark', 'Terminal surface treatment.' ],
      [ 'size', 'sm | md | lg', 'md', 'Controls max width, body height, and text size.' ],
      [ 'radius', 'none | sm | md | lg', 'lg', 'Legacy aliases use the global --ds-radius setting; none keeps square corners.' ],
      [ 'showHeader', 'boolean', 'true', 'Shows mac window controls and title.' ],
      [ 'animate', 'boolean', 'true', 'Types commands over time unless reduced motion is preferred.' ],
      [ 'typingSpeed', 'number', '35', 'Milliseconds between typed characters.' ],
      [ 'initialDelay', 'number', '400', 'Delay before the first command starts.' ],
      [ 'delayBetweenCommands', 'number', '700', 'Delay after a command before the next command starts.' ],
      [ 'className', 'string', '-', 'Root class override.' ],
      [ 'classNames', '{ root, header, controls, title, body, line, prompt, command, output }', '-', 'Slot-level class overrides.' ]
    ]
  },
  'Core/TextHighlight': {
    'accessibility': 'TextHighlight is inline text emphasis. It must keep the original text readable and must not be the only way meaning is conveyed.',
    'description': 'TextHighlight emphasizes short inline phrases inside prose.',
    'overview': 'Use TextHighlight sparingly inside article copy or compact editorial headings when a phrase needs emphasis without becoming a link, button, or badge.',
    'props': [
      [ 'children', 'ReactNode', '-', 'Inline text to emphasize.' ],
      [ 'variant', 'marker | soft | underline', 'marker', 'Highlight treatment.' ],
      [ 'tone', 'gray | neutral | blue | teal | green | amber | yellow | red | rose | indigo', 'blue', 'Color family.' ],
      [ 'radius', 'none | sm | md', 'sm', 'Legacy aliases remain supported; highlights always have square edges.' ],
      [ 'animate', 'boolean', 'true', 'Enables the marker draw animation.' ],
      [ 'className', 'string', '-', 'Root class override.' ]
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
  const title = rest.length > 1 && !(sidebarTitle in componentDocs) && !(sidebarTitle in componentReference) ? `${group}/${rest.at(-1)}` : sidebarTitle;
  const component = rest.length > 1 ? rest.at(-1) : rest.join(' / ') || group;
  const docs = groupDocs[group] || groupDocs.Core;
  const overrides = componentDocs[title] || componentReference[title] || {};
  const usage = overrides.usage || usageExamples[title] || defaultUsage(title, component);

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
    'hasAuthoredUsage': Boolean(overrides.usage || usageExamples[title]),
    'usage': usage,
    'usageLanguage': overrides.usageLanguage || (group === 'MDX' ? 'mdx' : 'jsx')
  };
};
