export const posts = [
  {
    category: 'data',
    date: '2024-11-29',
    featured: true,
    path: '/blog/intro-knowledge-graphs',
    readingTime: { text: '35 min read' },
    slug: 'intro-knowledge-graphs',
    subtitle: 'A comprehensive guide to knowledge graphs and their applications.',
    summary: 'A comprehensive guide to knowledge graphs and their applications, covering graph-shaped data, semantic relationships, and practical uses.',
    tags: [ 'Semantic Web', 'Knowledge Graphs', 'Linked Data' ],
    title: 'An Introduction to Knowledge Graphs',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2024-05-02',
    featured: true,
    path: '/blog/creating-rich-blog-posts',
    readingTime: { text: '10 min read' },
    slug: 'creating-rich-blog-posts',
    subtitle: 'MDX, components, and post structure for a richer technical blog.',
    summary: 'How reusable MDX components, content metadata, and design-system primitives make long-form posts easier to compose.',
    tags: [ 'Next.js', 'mdx', 'React' ],
    title: 'Creating Rich Blog Posts',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2023-08-18',
    featured: true,
    path: '/blog/gaudi-my-bash-framework',
    readingTime: { text: '12 min read' },
    slug: 'gaudi-my-bash-framework',
    subtitle: 'A shell framework for repeatable development workflows and dotfile automation.',
    summary: 'A collection of shell tools and services to boost developer productivity, from bash frameworks to OS X widgets and dotfiles.',
    tags: [ 'bash', 'dotfiles', 'gaudi' ],
    title: 'Gaudi, my bash framework',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2023-06-11',
    path: '/blog/build-dynamic-og-images',
    readingTime: { text: '8 min read' },
    slug: 'build-dynamic-og-images',
    subtitle: 'Generating social previews with Next.js metadata and image routes.',
    summary: 'Generating social previews with Next.js metadata, dynamic image routes, and a repeatable content pipeline.',
    tags: [ 'Next.js', 'Open Graph', 'SEO' ],
    title: 'Build Dynamic OG Images',
    type: 'Post'
  },
  {
    category: 'data',
    date: '2022-10-04',
    path: '/blog/everything-you-need-to-know-about-rdf',
    readingTime: { text: '18 min read' },
    slug: 'everything-you-need-to-know-about-rdf',
    subtitle: 'A practical introduction to RDF and linked data foundations.',
    summary: 'A practical introduction to RDF, linked data, graph-shaped modeling, and the standards behind semantic web systems.',
    tags: [ 'RDF', 'Linked Data', 'Semantic Web' ],
    title: 'Everything You Need To Know About RDF',
    type: 'Post'
  },
  {
    category: 'management',
    date: '2021-05-16',
    path: '/blog/performance-management-evolution',
    readingTime: { text: '9 min read' },
    slug: 'performance-management-evolution',
    subtitle: 'Notes on feedback, leadership, and performance systems.',
    summary: 'How performance management evolved and what engineering leaders can learn from structured feedback loops.',
    tags: [ 'Performance Management', 'Feedback', 'Leadership' ],
    title: 'Performance Management Evolution',
    type: 'Post'
  },
  {
    category: 'productivity',
    date: '2020-02-08',
    path: '/blog/latex-best-practices',
    readingTime: { text: '7 min read' },
    slug: 'latex-best-practices',
    subtitle: 'A compact set of LaTeX habits for clean technical writing.',
    summary: 'A compact set of LaTeX habits for clean, repeatable technical writing and publication workflows.',
    tags: [ 'LaTEX', 'Productivity' ],
    title: 'LaTeX Best Practices',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2019-11-20',
    path: '/blog/using-contentLayer-with-nextjs',
    readingTime: { text: '11 min read' },
    slug: 'using-contentLayer-with-nextjs',
    subtitle: 'Typed content collections for a Next.js blog.',
    summary: 'Using ContentLayer with Next.js to turn markdown and MDX files into structured content collections.',
    tags: [ 'Next.js', 'ContentLayer', 'mdx' ],
    title: 'Using ContentLayer With Next.js',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2019-05-22',
    path: '/blog/nextjs-theme-switcher',
    readingTime: { text: '6 min read' },
    slug: 'nextjs-theme-switcher',
    subtitle: 'Adding dark mode and theme persistence to a Next.js site.',
    summary: 'Adding dark mode, theme persistence, and clean toggle behavior to a Next.js site.',
    tags: [ 'Next.js', 'React' ],
    title: 'Next.js Theme Switcher',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2018-12-10',
    path: '/blog/auditing-npm-modules-in-microservices',
    readingTime: { text: '9 min read' },
    slug: 'auditing-npm-modules-in-microservices',
    subtitle: 'Keeping dependency health visible across many services.',
    summary: 'Keeping dependency health visible across many services with repeatable audit workflows.',
    tags: [ 'Node.js', 'NPM', 'Microservices' ],
    title: 'Auditing NPM Modules In Microservices',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2018-07-28',
    path: '/blog/dotfiles-for-the-public',
    readingTime: { text: '8 min read' },
    slug: 'dotfiles-for-the-public',
    subtitle: 'Publishing personal setup scripts without leaking private context.',
    summary: 'Publishing personal setup scripts, shell aliases, and workstation automation without leaking private context.',
    tags: [ 'dotfiles', 'bash' ],
    title: 'Dotfiles For The Public',
    type: 'Post'
  },
  {
    category: 'engineering',
    date: '2017-11-05',
    path: '/blog/enabling-continuous-deployment-for-jekyll',
    readingTime: { text: '7 min read' },
    slug: 'enabling-continuous-deployment-for-jekyll',
    subtitle: 'A lightweight deployment pipeline for static blog publishing.',
    summary: 'A lightweight continuous deployment pipeline for static blog publishing.',
    tags: [ 'Jekyll', 'Continuous Deployment', 'Continuous Integration' ],
    title: 'Enabling Continuous Deployment For Jekyll',
    type: 'Post'
  }
];

export const tagHref = tag => `/blog/tags/${tag.replaceAll(' ', '-').toLowerCase()}`;
export const preparePost = post => ({ ...post, href: post.path, category: { id: post.category, label: post.category, href: `/blog/categories/${post.category}` }, tags: post.tags.map(tag => ({ id: tag, label: tag, href: tagHref(tag) })) });
