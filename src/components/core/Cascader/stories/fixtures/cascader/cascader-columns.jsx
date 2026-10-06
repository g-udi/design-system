'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Cascader,
  CascaderContent,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection
} from '@gaudi/design-system/core/Cascader';
import { CascaderColumns } from '@gaudi/design-system/core/Cascader';
import {
  CascaderInput,
  CascaderNav
} from '@gaudi/design-system/core/Cascader';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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
      className={cn('shrink-0 tabular-nums', className)}
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
    label: 'First steps',
    icon: libraryTiles.start,
    children: [
      collection('start', 'Opening your studio', [
        ['Claiming your address', 'video', '6:12'],
        ['Writing the first post', 'video', '8:45'],
        ['Choosing a typeface pair', 'video', '5:30'],
        ['Importing an old archive', 'article', '7 min'],
        ['When the first publish fails', 'article', '4 min']
      ]),
      collection('start', 'How pages are made', [
        ['Posts, pages and collections', 'video', '11:20'],
        ['Front matter, field by field', 'article', '9 min'],
        ['Blocks inside an essay', 'video', '14:05'],
        ['Drafts that never leak', 'article', '6 min'],
        ['Static or live pages', 'video', '12:38']
      ]),
      collection('start', 'Moving house', [
        ['Leaving a hosted platform', 'video', '16:40'],
        ['Redirects that keep readers', 'article', '8 min'],
        ['Carrying over comments', 'article', '5 min'],
        ['Moving day questions', 'audio', '42:18']
      ])
    ]
  },
  {
    value: 'design',
    label: 'Visual craft',
    icon: libraryTiles.design,
    children: [
      collection('design', 'Fundamentals', [
        ['Colour for long reading', 'video', '13:24'],
        ['Measure, leading and rhythm', 'video', '9:58'],
        ['Margins that breathe', 'article', '6 min'],
        ['Quiet surfaces', 'article', '7 min'],
        ['Corners and frames', 'video', '7:41'],
        ['Night reading done properly', 'video', '15:12']
      ]),
      collection('design', 'Pieces of a page', [
        ['Pull quotes with restraint', 'video', '18:30'],
        ['Footnotes readers follow', 'video', '21:05'],
        ['Figures and captions', 'video', '24:47'],
        ['Tables in an essay', 'article', '5 min'],
        ['Animation for editors', 'article', '8 min']
      ]),
      collection('design', 'Page critiques', [
        ['Redrawing a home page', 'video', '46:12'],
        ['Archive page teardown', 'video', '38:55'],
        ['A newsletter critique', 'audio', '51:30'],
        ['Cover image review', 'video', '29:14']
      ])
    ]
  },
  {
    value: 'engineering',
    label: 'Building the site',
    icon: libraryTiles.engineering,
    children: [
      collection('engineering', 'Under the hood', [
        ['Ten thousand posts, one index', 'video', '27:16'],
        ['Pagination, line by line', 'video', '33:02'],
        ['Keyboard paths through a page', 'article', '12 min'],
        ['Overlays and stacking', 'video', '19:48'],
        ['Server and browser agreeing', 'article', '9 min'],
        ['Shrinking the reading page', 'video', '22:35']
      ]),
      collection('engineering', 'Speed clinic', [
        ['Profiling a heavy article', 'video', '31:20'],
        ['The price of web fonts', 'article', '11 min'],
        ['Images at every width', 'video', '17:44'],
        ['Streaming long reads', 'video', '25:09'],
        ['Caching a busy archive', 'audio', '39:52']
      ]),
      collection('engineering', 'Reading for everyone', [
        ['Headings as a map', 'video', '20:11'],
        ['A screen reader tour of an essay', 'video', '26:38'],
        ['Contrast on cream paper', 'article', '7 min'],
        ['Announcing new comments', 'article', '10 min'],
        ['Checking a post with axe', 'video', '14:52']
      ])
    ]
  },
  {
    value: 'podcast',
    label: 'Radio archive',
    icon: libraryTiles.podcast,
    children: [
      collection('podcast', 'Series five', [
        ['Writing that outlives its platform', 'audio', '49:31'],
        ['Editors and machines', 'audio', '55:12'],
        ['Small magazines, big archives', 'audio', '43:08'],
        ['The web after feeds', 'audio', '51:47'],
        ['Paying writers fairly', 'audio', '46:22'],
        ['The archive as a product', 'audio', '58:19'],
        ['Designers who write', 'audio', '42:55'],
        ['Letters bag, midseason', 'audio', '37:14']
      ]),
      // The long one. Forty-four episodes is the column that makes the whole
      // layout argument: it cannot be read without scrolling, and scrolling it
      // must not move the two columns to its left.
      collection('podcast', 'Series four', [
        ['Writing for the rare reader', 'audio', '48:12'],
        ['The slow publishing model', 'audio', '52:40'],
        ['Publishing on a Friday', 'audio', '41:05'],
        ['What a mockup cannot tell you', 'audio', '57:22'],
        ['Naming a column', 'audio', '44:18'],
        ['The economics of free essays', 'audio', '1:02:14'],
        ['A two-person magazine', 'audio', '39:47'],
        ['Moving ten years of posts', 'audio', '55:03'],
        ['Accessible by default', 'audio', '47:36'],
        ['When to start a new title', 'audio', '43:29'],
        ['Grammar for designers', 'audio', '50:58'],
        ['The cost of a setting', 'audio', '36:41'],
        ['Guides nobody opens', 'audio', '45:52'],
        ['Reader mail as research', 'audio', '49:10'],
        ['Pricing a subscription', 'audio', '1:07:33'],
        ['Editing for taste', 'audio', '42:26'],
        ['The final proofread', 'audio', '53:47'],
        ['Drafting in public', 'audio', '46:19'],
        ['Ending a column', 'audio', '38:54'],
        ['A year of issues', 'audio', '1:12:08'],
        ['Edit meetings that finish', 'audio', '41:52'],
        ['The colophon as a story', 'audio', '37:26'],
        ['Deadlines and guesses', 'audio', '44:09'],
        ['One site or several', 'audio', '48:33'],
        ['What revisions teach', 'audio', '39:41'],
        ['The pitch that failed', 'audio', '35:18'],
        ['Rewrites nobody wanted', 'audio', '52:04'],
        ['Reading other people’s drafts', 'audio', '43:37'],
        ['The night desk', 'audio', '31:55'],
        ['Writing for the ear', 'audio', '46:48'],
        ['A month offline', 'audio', '29:12'],
        ['The launch that stalled', 'audio', '40:26'],
        ['Selling a print edition', 'audio', '45:39'],
        ['Numbers we stopped reading', 'audio', '38:17'],
        ['The second publication', 'audio', '57:41'],
        ['Writing for specialists', 'audio', '42:03'],
        ['When the calendar slips', 'audio', '36:29'],
        ['Freelancers and continuity', 'audio', '44:56'],
        ['The style guide drawer', 'audio', '33:44'],
        ['Publishing without an editor', 'audio', '50:12'],
        ['Our worst correction', 'audio', '1:04:38'],
        ['The same question, again', 'audio', '27:31'],
        ['Tools we regret', 'audio', '46:07'],
        ['Four series in', 'audio', '1:09:24']
      ]),
      collection('podcast', 'Series three', [
        ['House style, three years on', 'audio', '51:44'],
        ['The inbox as an editorial plan', 'audio', '44:02'],
        ['Turning a blog into a magazine', 'audio', '39:15'],
        ['Redesigns we regret', 'audio', '58:30'],
        ['Editing across time zones', 'audio', '40:27'],
        ['What we got wrong about archives', 'audio', '47:51']
      ]),
      collection('podcast', 'Series two', [
        ['The first hundred posts', 'audio', '45:12'],
        ['The help pages as the product', 'audio', '39:48'],
        ['Choosing a licence for essays', 'audio', '51:33'],
        ['When readers disagree', 'audio', '43:21'],
        ['The week the feed broke', 'audio', '47:05'],
        ['A redesign we skipped', 'audio', '55:40']
      ]),
      collection('podcast', 'Series one', [
        ['Why start a publication', 'audio', '38:12'],
        ['The title we nearly used', 'audio', '33:47'],
        ['Our first guest writer', 'audio', '41:19'],
        ['Style debt on day one', 'audio', '44:52'],
        ['Sending the first issue', 'audio', '49:26'],
        ['What we would do again', 'audio', '52:38']
      ]),
      collection('podcast', 'Extra conversations', [
        ['An editor’s week', 'audio', '33:18'],
        ['Notes from a typography audit', 'audio', '28:44'],
        ['Reading the corrections aloud', 'audio', '22:36'],
        ['Interview notes, annotated', 'article', '6 min']
      ]),
      collection('podcast', 'Recorded live', [
        ['Live from the book fair', 'audio', '58:44'],
        ['A recording with audience questions', 'audio', '1:03:27'],
        ['The uncut session', 'audio', '1:14:52'],
        ['Green room notes', 'article', '5 min']
      ]),
      collection('podcast', 'Your questions', [
        ['Questions about type', 'audio', '31:22'],
        ['Questions about commissioning', 'audio', '28:47'],
        ['Questions about subscriptions', 'audio', '34:16'],
        ['Questions still open', 'audio', '26:53']
      ]),
      collection('podcast', 'Guest presenters', [
        ['An illustrator presents', 'audio', '44:31'],
        ['A sub-editor presents', 'audio', '47:18'],
        ['A reader presents', 'audio', '39:52']
      ]),
      collection('podcast', 'Episode notes', [
        ['Series five, annotated', 'article', '7 min'],
        ['Series four, annotated', 'article', '12 min'],
        ['Transcript library', 'article', '4 min']
      ])
    ]
  },
  {
    value: 'customers',
    label: 'Reader letters',
    icon: libraryTiles.customers,
    children: [
      collection('customers', 'Large newsrooms', [
        ['A broadsheet rebuilds its archive', 'video', '23:40'],
        ['Bringing nine desks together', 'video', '18:12'],
        ['Corrections without friction', 'article', '9 min'],
        ['Two house styles, one site', 'audio', '44:55']
      ]),
      collection('customers', 'New titles', [
        ['Zero to first issue in five weeks', 'video', '15:26'],
        ['One writer, forty pages', 'video', '12:03'],
        ['Choosing plain on purpose', 'article', '6 min'],
        ['The first hundred subscribers', 'audio', '37:41']
      ]),
      collection('customers', 'Studios', [
        ['One template, many clients', 'video', '19:57'],
        ['Handovers that last', 'article', '8 min'],
        ['Pitching a voice, not a page', 'audio', '35:12']
      ])
    ]
  },
  {
    value: 'webinars',
    label: 'Live sessions',
    icon: libraryTiles.webinars,
    children: [
      collection('webinars', 'Built live', [
        ['Building an author page', 'video', '58:20'],
        ['A reading statistics page', 'video', '1:04:37'],
        ['A paywall, end to end', 'video', '1:11:49'],
        ['Search across the archive', 'video', '47:15'],
        ['A footnote system from scratch', 'video', '1:21:06']
      ]),
      collection('webinars', 'Open hours', [
        ['Open questions: colour', 'video', '52:03'],
        ['Open questions: comments', 'video', '49:28'],
        ['Open questions: speed', 'video', '55:14'],
        ['Questions that keep coming', 'article', '7 min']
      ]),
      collection('webinars', 'Guest sessions', [
        ['Publishing from a CDN', 'video', '41:32'],
        ['Sign-in for readers', 'video', '38:09'],
        ['Statistics you can trust', 'video', '36:44']
      ])
    ]
  },
  {
    value: 'releases',
    label: 'Studio updates',
    icon: libraryTiles.releases,
    children: [
      collection('releases', 'This year', [
        ['Studio 9: the new editor', 'video', '9:12'],
        ['Studio 8.4: smoother transitions', 'video', '6:48'],
        ['Studio 8.2: better search filters', 'video', '7:55'],
        ['Studio 8.0: what changed', 'article', '11 min'],
        ['Season recap, spring', 'audio', '26:33']
      ]),
      collection('releases', 'Last year', [
        ['Studio 7: themes for every title', 'video', '8:21'],
        ['Studio 6.5: keyboard writing', 'video', '5:39'],
        ['Studio 6: the first archive grid', 'article', '10 min'],
        ['A year of updates', 'audio', '31:07']
      ]),
      collection('releases', 'Retirements', [
        ['Retiring the old embed syntax', 'article', '5 min'],
        ['Replacing legacy colour names', 'article', '6 min'],
        ['How we retire features', 'video', '12:44']
      ])
    ]
  },
  {
    value: 'labs',
    label: 'Experiments',
    icon: libraryTiles.labs,
    children: [
      collection('labs', 'Writing with models', [
        ['Asking for a layout precisely', 'video', '16:08'],
        ['Prompts that survive a redesign', 'article', '8 min'],
        ['Generating a colour theme', 'video', '13:52'],
        ['Where generation should stop', 'audio', '34:26']
      ]),
      collection('labs', 'Assistants at work', [
        ['An assistant that reads the style guide', 'video', '24:19'],
        ['Guardrails for drafted copy', 'article', '12 min'],
        ['Reviewing what a model drafted', 'video', '21:33'],
        ['Notes on the tools', 'article', '5 min']
      ]),
      collection('labs', 'Judging the output', [
        ['Scoring a drafted page', 'video', '18:47'],
        ['Writing a taste checklist', 'article', '9 min'],
        ['What we measure, and why it matters', 'audio', '29:58']
      ])
    ]
  },
  {
    value: 'courses',
    label: 'Writing school',
    icon: libraryTiles.courses,
    children: [
      collection('courses', 'Foundation course', [
        ['What a publication needs', 'video', '10:24'],
        ['Reading the help pages', 'article', '5 min'],
        ['Your first article page', 'video', '17:52'],
        ['Layout without a fight', 'video', '14:31'],
        ['Forms for readers', 'video', '19:06']
      ]),
      collection('courses', 'Next steps course', [
        ['Combining three blocks', 'video', '22:14'],
        ['Drafts that survive edits', 'article', '11 min'],
        ['Theming a whole title', 'video', '26:48'],
        ['Testing what readers do', 'video', '20:37']
      ]),
      collection('courses', 'Masterclass', [
        ['Designing your own block', 'video', '34:52'],
        ['Flexible but not fragile', 'article', '13 min'],
        ['Sharing blocks with others', 'video', '28:19'],
        ['Keeping a fork healthy', 'audio', '41:22']
      ]),
      collection('courses', 'Course feedback', [
        ['Assignment review, week one', 'video', '24:05'],
        ['Assignment review, week two', 'video', '22:48'],
        ['Frequent slips', 'article', '8 min']
      ])
    ]
  },
  {
    value: 'workshops',
    label: 'Hands-on days',
    icon: libraryTiles.workshops,
    children: [
      collection('workshops', 'Practice: colour', [
        ['Choosing the palette', 'video', '18:22'],
        ['Two titles, one codebase', 'video', '25:14'],
        ['Exercise sheet with answers', 'article', '9 min']
      ]),
      collection('workshops', 'Practice: archives', [
        ['An archive you can maintain', 'video', '31:47'],
        ['Paging a large archive', 'video', '27:33'],
        ['Filters readers understand', 'video', '21:16'],
        ['Exercise notes for archives', 'article', '7 min']
      ]),
      collection('workshops', 'Practice: movement', [
        ['Timing page transitions', 'video', '16:44'],
        ['Movement that respects settings', 'article', '6 min'],
        ['Review of the exercises', 'audio', '33:05']
      ])
    ]
  },
  {
    value: 'templates',
    label: 'Starter layouts',
    icon: libraryTiles.templates,
    children: [
      collection('templates', 'Editor desks', [
        ['Tour of the editor desk', 'video', '19:38'],
        ['Connecting your statistics', 'video', '24:12'],
        ['What to remove first', 'article', '6 min']
      ]),
      collection('templates', 'Front pages', [
        ['The cover page layout', 'video', '15:47'],
        ['Essays and help pages together', 'video', '21:29'],
        ['Changing the masthead', 'article', '5 min']
      ]),
      collection('templates', 'Reader accounts', [
        ['Sign-in, end to end', 'video', '29:52'],
        ['Reader settings that scale', 'video', '18:07'],
        ['Account page teardown', 'audio', '36:14']
      ])
    ]
  },
  {
    value: 'security',
    label: 'Safe publishing',
    icon: libraryTiles.security,
    children: [
      collection('security', 'Risk maps', [
        ['Where trust ends on a page', 'video', '23:11'],
        ['What the browser cannot promise', 'article', '10 min'],
        ['Checking an embedded widget', 'video', '17:26']
      ]),
      collection('security', 'Habits', [
        ['Keeping reader sessions safe', 'video', '20:44'],
        ['A calm content security policy', 'article', '12 min'],
        ['Tidy dependencies', 'video', '15:33'],
        ['Walking through an audit', 'audio', '38:47']
      ]),
      collection('security', 'Lessons learned', [
        ['Inside a compromised plugin', 'article', '14 min'],
        ['The morning after a data leak', 'audio', '42:09']
      ])
    ]
  },
  {
    value: 'community',
    label: 'Circle',
    icon: libraryTiles.community,
    children: [
      collection('community', 'Reader showcase', [
        ['Made over a weekend', 'video', '12:36'],
        ['A magazine for one', 'video', '16:52'],
        ['Showcase, spring edition', 'article', '5 min']
      ]),
      collection('community', 'Contributing', [
        ['Your first suggested edit', 'video', '14:18'],
        ['How reviews work here', 'article', '7 min'],
        ['Sorting issues, live', 'video', '26:41']
      ]),
      collection('community', 'Gatherings', [
        ['Lisbon, spring', 'video', '47:22'],
        ['Online gathering, June', 'video', '51:08'],
        ['Five-minute talks', 'video', '33:56']
      ])
    ]
  },
  {
    value: 'playbooks',
    label: 'Field guides',
    icon: libraryTiles.playbooks,
    children: [
      collection('playbooks', 'Launching', [
        ['Starting with one desk', 'article', '9 min'],
        ['Persuading the doubters', 'audio', '34:41'],
        ['Measuring take-up', 'video', '18:59']
      ]),
      collection('playbooks', 'Ownership', [
        ['Who owns a section', 'article', '8 min'],
        ['Asking for a new block', 'video', '13:24'],
        ['Retiring with notice', 'article', '6 min']
      ]),
      collection('playbooks', 'Handbooks', [
        ['The editorial handbook', 'article', '21 min'],
        ['The production handbook', 'article', '18 min'],
        ['Your first week here', 'video', '25:37']
      ])
    ]
  },
  {
    value: 'support',
    label: 'Help desk',
    icon: libraryTiles.support,
    children: [
      collection('support', 'Frequent problems', [
        ['Styles that do not appear', 'video', '11:42'],
        ['The mismatch warning', 'article', '6 min'],
        ['Why the menu hides behind', 'video', '9:17'],
        ['Fonts arriving twice', 'article', '4 min']
      ]),
      collection('support', 'Fixing it together', [
        ['Reading an error report', 'video', '22:53'],
        ['Tracing a broken update', 'video', '19:31'],
        ['A live fixing session', 'audio', '45:26']
      ]),
      collection('support', 'Ask the editors', [
        ['Open hours, week 12', 'audio', '39:14'],
        ['Open hours, week 13', 'audio', '41:37'],
        ['Replies worth keeping', 'article', '7 min']
      ])
    ]
  },
  {
    value: 'research',
    label: 'Reading research',
    icon: libraryTiles.research,
    children: [
      collection('research', 'Reader studies', [
        ['Watching readers skim', 'video', '28:44'],
        ['Testing the archive search', 'video', '32:19'],
        ['Notes from five interviews', 'article', '11 min']
      ]),
      collection('research', 'Measurements', [
        ['Reading speed on phones', 'article', '13 min'],
        ['Contrast across themes', 'video', '24:07'],
        ['Time to first paragraph', 'article', '8 min']
      ]),
      collection('research', 'Field notes', [
        ['A week in a newsroom', 'article', '9 min'],
        ['Notes from a library visit', 'audio', '37:52'],
        ['Reading on the train', 'article', '6 min']
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
