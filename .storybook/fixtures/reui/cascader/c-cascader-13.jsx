// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Cascader,
  CascaderContent,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderColumns } from '../../../../src/components/core/Cascader/parts/cascader-columns-extended.jsx';
import {
  CascaderInput,
  CascaderNav
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
function LibraryTile({ children }) {
  return (
    <IconTile variant='outline' size='xs'>
      {children}
    </IconTile>
  );
}
const libraryTiles = {
  start: (
    <LibraryTile>
      <RegistryIcon
        lucide='RocketIcon'
        className='text-sky-600! **:text-sky-600! dark:text-sky-400! dark:**:text-sky-400!'
      />
    </LibraryTile>
  ),
  design: (
    <LibraryTile>
      <RegistryIcon
        lucide='PaletteIcon'
        className='text-violet-600! **:text-violet-600! dark:text-violet-400! dark:**:text-violet-400!'
      />
    </LibraryTile>
  ),
  engineering: (
    <LibraryTile>
      <RegistryIcon
        lucide='CodeIcon'
        className='text-indigo-600! **:text-indigo-600! dark:text-indigo-400! dark:**:text-indigo-400!'
      />
    </LibraryTile>
  ),
  podcast: (
    <LibraryTile>
      <RegistryIcon
        lucide='MicIcon'
        className='text-rose-600! **:text-rose-600! dark:text-rose-400! dark:**:text-rose-400!'
      />
    </LibraryTile>
  ),
  customers: (
    <LibraryTile>
      <RegistryIcon
        lucide='UsersIcon'
        className='text-emerald-600! **:text-emerald-600! dark:text-emerald-400! dark:**:text-emerald-400!'
      />
    </LibraryTile>
  ),
  webinars: (
    <LibraryTile>
      <RegistryIcon
        lucide='MonitorIcon'
        className='text-amber-600! **:text-amber-600! dark:text-amber-400! dark:**:text-amber-400!'
      />
    </LibraryTile>
  ),
  releases: (
    <LibraryTile>
      <RegistryIcon
        lucide='MegaphoneIcon'
        className='text-fuchsia-600! **:text-fuchsia-600! dark:text-fuchsia-400! dark:**:text-fuchsia-400!'
      />
    </LibraryTile>
  ),
  labs: (
    <LibraryTile>
      <RegistryIcon
        lucide='SparklesIcon'
        className='text-cyan-600! **:text-cyan-600! dark:text-cyan-400! dark:**:text-cyan-400!'
      />
    </LibraryTile>
  ),
  courses: (
    <LibraryTile>
      <RegistryIcon
        lucide='BookIcon'
        className='text-orange-600! **:text-orange-600! dark:text-orange-400! dark:**:text-orange-400!'
      />
    </LibraryTile>
  ),
  workshops: (
    <LibraryTile>
      <RegistryIcon
        lucide='WrenchIcon'
        className='text-teal-600! **:text-teal-600! dark:text-teal-400! dark:**:text-teal-400!'
      />
    </LibraryTile>
  ),
  templates: (
    <LibraryTile>
      <RegistryIcon
        lucide='LayoutTemplateIcon'
        className='text-purple-600! **:text-purple-600! dark:text-purple-400! dark:**:text-purple-400!'
      />
    </LibraryTile>
  ),
  security: (
    <LibraryTile>
      <RegistryIcon
        lucide='ShieldCheckIcon'
        className='text-green-600! **:text-green-600! dark:text-green-400! dark:**:text-green-400!'
      />
    </LibraryTile>
  ),
  community: (
    <LibraryTile>
      <RegistryIcon
        lucide='MessageCircleIcon'
        className='text-pink-600! **:text-pink-600! dark:text-pink-400! dark:**:text-pink-400!'
      />
    </LibraryTile>
  ),
  playbooks: (
    <LibraryTile>
      <RegistryIcon
        lucide='CompassIcon'
        className='text-yellow-600! **:text-yellow-600! dark:text-yellow-400! dark:**:text-yellow-400!'
      />
    </LibraryTile>
  ),
  support: (
    <LibraryTile>
      <RegistryIcon
        lucide='LifeBuoyIcon'
        className='text-blue-600! **:text-blue-600! dark:text-blue-400! dark:**:text-blue-400!'
      />
    </LibraryTile>
  ),
  research: (
    <LibraryTile>
      <RegistryIcon
        lucide='FlaskConicalIcon'
        className='text-lime-600! **:text-lime-600! dark:text-lime-400! dark:**:text-lime-400!'
      />
    </LibraryTile>
  )
};
const collectionIcon = <RegistryIcon lucide='LayersIcon' className='size-4' />;
const kindIcons = {
  video: <RegistryIcon lucide='VideoIcon' className='size-4' />,
  audio: <RegistryIcon lucide='HeadphonesIcon' className='size-4' />,
  article: <RegistryIcon lucide='FileTextIcon' className='size-4' />
};
function LengthBadge({ children, className }) {
  return (
    <Badge
      variant='info-outline'
      className={cn('text-info-foreground! shrink-0 tabular-nums', className)}
    >
      {children}
    </Badge>
  );
}
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
function collection(libraryValue, name, rows) {
  const value = `${libraryValue}.${slug(name)}`;
  return {
    value,
    label: name,
    icon: collectionIcon,
    children: rows.map(([title, kind, length]) => ({
      value: `${value}.${slug(title)}`,
      label: title,
      icon: kindIcons[kind],
      data: { kind, length }
    }))
  };
}
const libraries = [
  {
    value: 'start',
    label: 'Getting started',
    icon: libraryTiles.start,
    children: [
      collection('start', 'Install and setup', [
        ['Install the CLI', 'video', '6:12'],
        ['Your first component', 'video', '8:45'],
        ['Theming in five minutes', 'video', '5:30'],
        ['Framework adapters', 'article', '7 min'],
        ['When installs go wrong', 'article', '4 min']
      ]),
      collection('start', 'Core concepts', [
        ['Anatomy of a primitive', 'video', '11:20'],
        ['Slots and data attributes', 'article', '9 min'],
        ['Composition over props', 'video', '14:05'],
        ['Controlled or uncontrolled', 'article', '6 min'],
        ['Server and client boundaries', 'video', '12:38']
      ]),
      collection('start', 'Migration guides', [
        ['Moving off a legacy kit', 'video', '16:40'],
        ['Codemods in practice', 'article', '8 min'],
        ['Mapping the old tokens', 'article', '5 min'],
        ['Migration office hours', 'audio', '42:18']
      ])
    ]
  },
  {
    value: 'design',
    label: 'Design system',
    icon: libraryTiles.design,
    children: [
      collection('design', 'Foundations', [
        ['Colour tokens end to end', 'video', '13:24'],
        ['A type scale that survives', 'video', '9:58'],
        ['Spacing and rhythm', 'article', '6 min'],
        ['Elevation without shadows', 'article', '7 min'],
        ['Radius as a system', 'video', '7:41'],
        ['Dark mode by contract', 'video', '15:12']
      ]),
      collection('design', 'Components in depth', [
        ['Buttons are harder than that', 'video', '18:30'],
        ['Forms that forgive', 'video', '21:05'],
        ['Tables at scale', 'video', '24:47'],
        ['Empty states worth reading', 'article', '5 min'],
        ['Spending a motion budget', 'article', '8 min']
      ]),
      collection('design', 'Critique sessions', [
        ['Redesigning the pricing page', 'video', '46:12'],
        ['Dashboard teardown', 'video', '38:55'],
        ['Onboarding critique', 'audio', '51:30'],
        ['Icon set review', 'video', '29:14']
      ])
    ]
  },
  {
    value: 'engineering',
    label: 'Engineering',
    icon: libraryTiles.engineering,
    children: [
      collection('engineering', 'Deep dives', [
        ['Rendering ten thousand rows', 'video', '27:16'],
        ['The virtualizer, line by line', 'video', '33:02'],
        ['Focus management', 'article', '12 min'],
        ['Portals and layers', 'video', '19:48'],
        ['Hydration mismatches', 'article', '9 min'],
        ['Putting the bundle on a diet', 'video', '22:35']
      ]),
      collection('engineering', 'Performance clinic', [
        ['Profiling a slow page', 'video', '31:20'],
        ['The real cost of :has()', 'article', '11 min'],
        ['Memo, and when not to', 'video', '17:44'],
        ['Streaming and Suspense', 'video', '25:09'],
        ['Cache invalidation, again', 'audio', '39:52']
      ]),
      collection('engineering', 'Accessibility', [
        ['Keyboard maps that work', 'video', '20:11'],
        ['A screen reader run-through', 'video', '26:38'],
        ['Contrast in practice', 'article', '7 min'],
        ['Live regions, quietly', 'article', '10 min'],
        ['Testing with axe', 'video', '14:52']
      ])
    ]
  },
  {
    value: 'podcast',
    label: 'Podcast archive',
    icon: libraryTiles.podcast,
    children: [
      collection('podcast', 'Season 5', [
        ['Systems that outlive their authors', 'audio', '49:31'],
        ['The AI-shaped hole in the workflow', 'audio', '55:12'],
        ['Small teams, large surfaces', 'audio', '43:08'],
        ['What changed about the web', 'audio', '51:47'],
        ['Pricing, two years later', 'audio', '46:22'],
        ['The registry as a product', 'audio', '58:19'],
        ['Designers who ship', 'audio', '42:55'],
        ['Mid-season mailbag', 'audio', '37:14']
      ]),
      // The long one. Forty-four episodes is the column that makes the whole
      // layout argument: it cannot be read without scrolling, and scrolling it
      // must not move the two columns to its left.
      collection('podcast', 'Season 4', [
        ['Designing for the one percent case', 'audio', '48:12'],
        ['The registry model', 'audio', '52:40'],
        ['Shipping on a Friday', 'audio', '41:05'],
        ['What Figma cannot tell you', 'audio', '57:22'],
        ['Naming things, again', 'audio', '44:18'],
        ['Open source economics', 'audio', '1:02:14'],
        ['The two-person design team', 'audio', '39:47'],
        ['Migrating a decade of CSS', 'audio', '55:03'],
        ['Accessibility as a default', 'audio', '47:36'],
        ['When to fork a library', 'audio', '43:29'],
        ['Type systems for designers', 'audio', '50:58'],
        ['The cost of a config flag', 'audio', '36:41'],
        ['Documentation nobody reads', 'audio', '45:52'],
        ['Support as product research', 'audio', '49:10'],
        ['Pricing a developer tool', 'audio', '1:07:33'],
        ['Hiring for taste', 'audio', '42:26'],
        ['The last five percent', 'audio', '53:47'],
        ['Building in public', 'audio', '46:19'],
        ['Killing a feature', 'audio', '38:54'],
        ['A year of releases', 'audio', '1:12:08'],
        ['Design reviews that end', 'audio', '41:52'],
        ['The changelog as marketing', 'audio', '37:26'],
        ['Estimating the unknowable', 'audio', '44:09'],
        ['One repo or ten', 'audio', '48:33'],
        ['What versioning teaches you', 'audio', '39:41'],
        ['The interview that failed', 'audio', '35:18'],
        ['Refactors nobody asked for', 'audio', '52:04'],
        ["Reading other people's CSS", 'audio', '43:37'],
        ['The support rota', 'audio', '31:55'],
        ['Designing for the keyboard', 'audio', '46:48'],
        ['A week without meetings', 'audio', '29:12'],
        ['The demo that broke', 'audio', '40:26'],
        ['Selling internal tools', 'audio', '45:39'],
        ['Metrics we stopped tracking', 'audio', '38:17'],
        ['The second product', 'audio', '57:41'],
        ['Writing for engineers', 'audio', '42:03'],
        ['When the roadmap slips', 'audio', '36:29'],
        ['Contractors and continuity', 'audio', '44:56'],
        ['The style guide graveyard', 'audio', '33:44'],
        ['Shipping without a designer', 'audio', '50:12'],
        ['Our worst incident', 'audio', '1:04:38'],
        ['Answering the same question', 'audio', '27:31'],
        ['The tooling we regret', 'audio', '46:07'],
        ['Four seasons in', 'audio', '1:09:24']
      ]),
      collection('podcast', 'Season 3', [
        ['Design tokens, three years on', 'audio', '51:44'],
        ['The support inbox as a roadmap', 'audio', '44:02'],
        ['Componentising a marketing site', 'audio', '39:15'],
        ['Rewrites we regret', 'audio', '58:30'],
        ['Working across time zones', 'audio', '40:27'],
        ['What we got wrong about tables', 'audio', '47:51']
      ]),
      collection('podcast', 'Season 2', [
        ['The first hundred components', 'audio', '45:12'],
        ['Docs as the product', 'audio', '39:48'],
        ['Choosing a licence', 'audio', '51:33'],
        ['When users disagree', 'audio', '43:21'],
        ['The support week from hell', 'audio', '47:05'],
        ['A rewrite we did not do', 'audio', '55:40']
      ]),
      collection('podcast', 'Season 1', [
        ['Why another library', 'audio', '38:12'],
        ['The name we nearly used', 'audio', '33:47'],
        ['Our first contributor', 'audio', '41:19'],
        ['Design debt, day one', 'audio', '44:52'],
        ['Shipping the first release', 'audio', '49:26'],
        ['What we would redo', 'audio', '52:38']
      ]),
      collection('podcast', 'Bonus interviews', [
        ["A maintainer's week", 'audio', '33:18'],
        ['Notes from a design audit', 'audio', '28:44'],
        ['Reading the changelog aloud', 'audio', '22:36'],
        ['Show notes, annotated', 'article', '6 min']
      ]),
      collection('podcast', 'Live recordings', [
        ['Live from the meetup', 'audio', '58:44'],
        ['A recording with questions', 'audio', '1:03:27'],
        ['The unedited take', 'audio', '1:14:52'],
        ['Backstage notes', 'article', '5 min']
      ]),
      collection('podcast', 'Listener questions', [
        ['Questions about theming', 'audio', '31:22'],
        ['Questions about hiring', 'audio', '28:47'],
        ['Questions about pricing', 'audio', '34:16'],
        ['The ones we could not answer', 'audio', '26:53']
      ]),
      collection('podcast', 'Guest hosts', [
        ['A designer takes the mic', 'audio', '44:31'],
        ['An engineer takes the mic', 'audio', '47:18'],
        ['A support lead takes the mic', 'audio', '39:52']
      ]),
      collection('podcast', 'Show notes', [
        ['Season 5, annotated', 'article', '7 min'],
        ['Season 4, annotated', 'article', '12 min'],
        ['Transcript archive', 'article', '4 min']
      ])
    ]
  },
  {
    value: 'customers',
    label: 'Customer stories',
    icon: libraryTiles.customers,
    children: [
      collection('customers', 'Enterprise', [
        ['A bank rebuilds its console', 'video', '23:40'],
        ['Rolling out to nine teams', 'video', '18:12'],
        ['Compliance without friction', 'article', '9 min'],
        ['Two design systems, one app', 'audio', '44:55']
      ]),
      collection('customers', 'Startups', [
        ['Zero to launch in five weeks', 'video', '15:26'],
        ['One engineer, forty screens', 'video', '12:03'],
        ['Choosing boring on purpose', 'article', '6 min'],
        ['The first hundred users', 'audio', '37:41']
      ]),
      collection('customers', 'Agencies', [
        ['Reusing a kit across clients', 'video', '19:57'],
        ['Handover that survives', 'article', '8 min'],
        ['Pitching a system, not a page', 'audio', '35:12']
      ])
    ]
  },
  {
    value: 'webinars',
    label: 'Webinars',
    icon: libraryTiles.webinars,
    children: [
      collection('webinars', 'Live builds', [
        ['Building a settings page', 'video', '58:20'],
        ['An analytics dashboard', 'video', '1:04:37'],
        ['A checkout, end to end', 'video', '1:11:49'],
        ['Search that feels instant', 'video', '47:15'],
        ['A data grid from scratch', 'video', '1:21:06']
      ]),
      collection('webinars', 'Office hours', [
        ['Ask me anything: theming', 'video', '52:03'],
        ['Ask me anything: forms', 'video', '49:28'],
        ['Ask me anything: performance', 'video', '55:14'],
        ['Questions we keep getting', 'article', '7 min']
      ]),
      collection('webinars', 'Partner sessions', [
        ['Deploying at the edge', 'video', '41:32'],
        ['Auth without the tears', 'video', '38:09'],
        ['Analytics you can trust', 'video', '36:44']
      ])
    ]
  },
  {
    value: 'releases',
    label: 'Release notes',
    icon: libraryTiles.releases,
    children: [
      collection('releases', '2026 releases', [
        ['v9: the columns rewrite', 'video', '9:12'],
        ['v8.4: motion primitives', 'video', '6:48'],
        ['v8.2: the filters overhaul', 'video', '7:55'],
        ['v8.0: what changed and why', 'article', '11 min'],
        ['Release recap, quarter one', 'audio', '26:33']
      ]),
      collection('releases', '2025 releases', [
        ['v7: the theming pass', 'video', '8:21'],
        ['v6.5: keyboard everywhere', 'video', '5:39'],
        ['v6: the first data grid', 'article', '10 min'],
        ['A year in changelogs', 'audio', '31:07']
      ]),
      collection('releases', 'Deprecations', [
        ['Leaving the old icon API', 'article', '5 min'],
        ['Retiring the legacy tokens', 'article', '6 min'],
        ['How we deprecate', 'video', '12:44']
      ])
    ]
  },
  {
    value: 'labs',
    label: 'Labs',
    icon: libraryTiles.labs,
    children: [
      collection('labs', 'Prompting for UI', [
        ['Describing a layout precisely', 'video', '16:08'],
        ['Prompts that survive a refactor', 'article', '8 min'],
        ['Generating a theme', 'video', '13:52'],
        ['Where generation stops', 'audio', '34:26']
      ]),
      collection('labs', 'Agent workflows', [
        ['An agent that reads the registry', 'video', '24:19'],
        ['Guardrails for generated code', 'article', '12 min'],
        ['Reviewing what a model wrote', 'video', '21:33'],
        ['Tooling notes', 'article', '5 min']
      ]),
      collection('labs', 'Evaluations', [
        ['Scoring a generated screen', 'video', '18:47'],
        ['Building a taste rubric', 'article', '9 min'],
        ['What we measure, and why', 'audio', '29:58']
      ])
    ]
  },
  {
    value: 'courses',
    label: 'Courses',
    icon: libraryTiles.courses,
    children: [
      collection('courses', 'Beginner track', [
        ['What a component library is for', 'video', '10:24'],
        ['Reading the docs', 'article', '5 min'],
        ['Your first screen', 'video', '17:52'],
        ['Layout without fighting it', 'video', '14:31'],
        ['Forms, gently', 'video', '19:06']
      ]),
      collection('courses', 'Intermediate track', [
        ['Composing three primitives', 'video', '22:14'],
        ['State that survives a refactor', 'article', '11 min'],
        ['Theming a whole app', 'video', '26:48'],
        ['Testing what users do', 'video', '20:37']
      ]),
      collection('courses', 'Advanced track', [
        ['Writing your own primitive', 'video', '34:52'],
        ['Headless, but not hostile', 'article', '13 min'],
        ['Publishing to a registry', 'video', '28:19'],
        ['Maintaining a fork', 'audio', '41:22']
      ]),
      collection('courses', 'Course clinics', [
        ['Homework review, week one', 'video', '24:05'],
        ['Homework review, week two', 'video', '22:48'],
        ['Common mistakes', 'article', '8 min']
      ])
    ]
  },
  {
    value: 'workshops',
    label: 'Workshops',
    icon: libraryTiles.workshops,
    children: [
      collection('workshops', 'Hands-on: theming', [
        ['Setting up the tokens', 'video', '18:22'],
        ['Two brands, one build', 'video', '25:14'],
        ['Worksheet and answers', 'article', '9 min']
      ]),
      collection('workshops', 'Hands-on: data', [
        ['A grid you can maintain', 'video', '31:47'],
        ['Server pagination, honestly', 'video', '27:33'],
        ['Filters people can read', 'video', '21:16'],
        ['Exercise notes', 'article', '7 min']
      ]),
      collection('workshops', 'Hands-on: motion', [
        ['Timing that feels right', 'video', '16:44'],
        ['Motion that respects settings', 'article', '6 min'],
        ['Critique of the exercises', 'audio', '33:05']
      ])
    ]
  },
  {
    value: 'templates',
    label: 'Templates',
    icon: libraryTiles.templates,
    children: [
      collection('templates', 'Dashboards', [
        ['Tour of the admin template', 'video', '19:38'],
        ['Wiring it to your data', 'video', '24:12'],
        ['What to delete first', 'article', '6 min']
      ]),
      collection('templates', 'Marketing sites', [
        ['The landing page template', 'video', '15:47'],
        ['Blog and docs together', 'video', '21:29'],
        ['Swapping the brand', 'article', '5 min']
      ]),
      collection('templates', 'Application shells', [
        ['The auth flow, end to end', 'video', '29:52'],
        ['Settings that scale', 'video', '18:07'],
        ['Shell teardown', 'audio', '36:14']
      ])
    ]
  },
  {
    value: 'security',
    label: 'Security notes',
    icon: libraryTiles.security,
    children: [
      collection('security', 'Threat models', [
        ['Trust boundaries in a UI', 'video', '23:11'],
        ['What a client cannot enforce', 'article', '10 min'],
        ['Reviewing a third-party widget', 'video', '17:26']
      ]),
      collection('security', 'Practices', [
        ['Handling tokens in the browser', 'video', '20:44'],
        ['Content security policy, calmly', 'article', '12 min'],
        ['Dependency hygiene', 'video', '15:33'],
        ['Audit walkthrough', 'audio', '38:47']
      ]),
      collection('security', 'Incident reading', [
        ['Anatomy of a supply chain hit', 'article', '14 min'],
        ['The morning after a leak', 'audio', '42:09']
      ])
    ]
  },
  {
    value: 'community',
    label: 'Community',
    icon: libraryTiles.community,
    children: [
      collection('community', 'Show and tell', [
        ['Built in a weekend', 'video', '12:36'],
        ['A design system for one', 'video', '16:52'],
        ['The gallery, quarter one', 'article', '5 min']
      ]),
      collection('community', 'Contributor guides', [
        ['Your first pull request', 'video', '14:18'],
        ['How review works here', 'article', '7 min'],
        ['Issue triage, live', 'video', '26:41']
      ]),
      collection('community', 'Meetups', [
        ['Berlin, spring', 'video', '47:22'],
        ['Remote meetup, June', 'video', '51:08'],
        ['Lightning talks', 'video', '33:56']
      ])
    ]
  },
  {
    value: 'playbooks',
    label: 'Playbooks',
    icon: libraryTiles.playbooks,
    children: [
      collection('playbooks', 'Rollout', [
        ['Piloting with one team', 'article', '9 min'],
        ['Winning over the sceptics', 'audio', '34:41'],
        ['Measuring adoption', 'video', '18:59']
      ]),
      collection('playbooks', 'Governance', [
        ['Who owns a component', 'article', '8 min'],
        ['Requesting a new primitive', 'video', '13:24'],
        ['Deprecating with notice', 'article', '6 min']
      ]),
      collection('playbooks', 'Handbooks', [
        ['The design system handbook', 'article', '21 min'],
        ['Engineering handbook', 'article', '18 min'],
        ['Onboarding in a week', 'video', '25:37']
      ])
    ]
  },
  {
    value: 'support',
    label: 'Support clinic',
    icon: libraryTiles.support,
    children: [
      collection('support', 'Common issues', [
        ['Styles that never apply', 'video', '11:42'],
        ['The hydration warning', 'article', '6 min'],
        ['Why the popup is behind', 'video', '9:17'],
        ['Fonts loading twice', 'article', '4 min']
      ]),
      collection('support', 'Debug walkthroughs', [
        ['Reading a stack trace', 'video', '22:53'],
        ['Bisecting a broken upgrade', 'video', '19:31'],
        ['A live debugging session', 'audio', '45:26']
      ]),
      collection('support', 'Ask the team', [
        ['Office hours, week 12', 'audio', '39:14'],
        ['Office hours, week 13', 'audio', '41:37'],
        ['Answers we reuse', 'article', '7 min']
      ])
    ]
  },
  {
    value: 'research',
    label: 'Research',
    icon: libraryTiles.research,
    children: [
      collection('research', 'Usability studies', [
        ['Five users, one form', 'video', '28:44'],
        ['Testing a data grid', 'video', '32:19'],
        ['What the recordings showed', 'article', '11 min']
      ]),
      collection('research', 'Benchmarks', [
        ['Bundle size across kits', 'article', '13 min'],
        ['Interaction latency, measured', 'video', '24:07'],
        ['Method notes', 'article', '8 min']
      ]),
      collection('research', 'Field notes', [
        ['A week with the CLI', 'article', '9 min'],
        ['Watching a team migrate', 'audio', '37:52'],
        ['Notes from support tickets', 'article', '6 min']
      ])
    ]
  }
];
function MediaValue() {
  const { first, firstPath, isEmpty } = useCascaderSelection();
  if (isEmpty || !first) {
    return (
      <span className='text-ui-muted-foreground'>
        Select an item to feature
      </span>
    );
  }
  const collectionNode = firstPath[1];
  return (
    <span className='flex min-w-0 flex-1 items-center gap-2'>
      <span className='shrink-0'>
        {first.data ? kindIcons[first.data.kind] : null}
      </span>
      <span className='min-w-0 truncate font-medium'>{first.label}</span>
      <span className='text-ui-muted-foreground min-w-0 truncate text-xs'>
        {collectionNode?.label}
      </span>
      <LengthBadge className='ms-auto'>{first.data?.length}</LengthBadge>
    </span>
  );
}
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full flex-col items-center gap-3 self-start px-4 pt-6 pb-4'>
      <div className='w-full max-w-sm'>
        <Cascader
          mode='columns'
          items={libraries}
          value={value}
          onValueChange={setValue}
          renderLabel={(node, state) =>
            // Branches keep the default label. `customLabel ?? default` treats
            // null as "not handled", so opting out is a return rather than a
            // second copy of the default markup that would drift from it.
            state.branch ? null : (
              <span className='flex w-full min-w-0 items-center gap-2'>
                <span className='min-w-0 flex-1 truncate text-start'>
                  {node.label}
                </span>
                <LengthBadge>{node.data?.length}</LengthBadge>
              </span>
            )
          }
        >
          <CascaderTrigger
            aria-label='Featured media'
            render={
              <Button
                variant='outline'
                className='w-full justify-between gap-2 font-normal'
              />
            }
          >
            <MediaValue />
          </CascaderTrigger>

          <CascaderContent className='w-auto min-w-0'>
            <CascaderPanel>
              <CascaderNav>
                <CascaderInput placeholder='Search this column...' />
              </CascaderNav>
              {/* Kept: three panes side by side have to agree on a height, or the
       popup grows and shrinks as you move between columns of very
       different lengths. Each pane still scrolls inside it. */}
              <CascaderColumns columnWidth={240} maxHeight={288} />
              <CascaderStatus />
            </CascaderPanel>
          </CascaderContent>
        </Cascader>
      </div>
    </div>
  );
}
