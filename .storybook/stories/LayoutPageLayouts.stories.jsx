import { useState } from 'react';
import { expect, within } from 'storybook/test';

import categories from '../fixtures/site/categories.json';
import publications from '../fixtures/site/publications.json';
import tags from '../fixtures/site/tags.json';
import navigationMetadata from '../fixtures/site/navigationMetadata.mjs';

import { AccordionGroup } from '../../src/components/core/Accordion';
import Aurora from '../../src/components/layout/Aurora';
import Button from '../../src/components/core/Button';
import Card from '../../src/components/core/Card';
import Kbd from '../../src/components/core/Kbd';
import { FieldInput } from '../../src/components/core/Field';
import Footer from '../../src/components/layout/Footer';
import FloatingMenu from '../../src/components/navigation/FloatingMenu';
import { Grid } from '../../src/components/core/Grid';
import Icon from '../../src/components/core/Icon';
import Link from '../../src/components/core/Link';
import Menu from '../../src/components/navigation/Menu';
import { PaginationBar, POSTS_PER_PAGE } from '../../src/components/core/Pagination';
import Pill from '../../src/components/core/Pill';
import Search from '../../src/components/layout/Search';
import { TextHighlight } from '../../src/components/core/TextHighlight';
import Post from '../../src/components/post/Post';
import ThoughtsSection from '../../src/components/blocks/ThoughtsSection';
import Typography from '../../src/foundations/Typography';

const siteMetadata = {
  author: 'Ahmad Assaf',
  description: 'This is my personal space to share my thoughts and ideas on AI, Data and Productivity',
  github: 'https://github.com/ahmadassaf',
  linkedin: 'https://www.linkedin.com/in/ahmadassaf',
  shortname: 'Ahmad Assaf',
  twitter: 'https://twitter.com/ahmadaassaf'
};

const posts = [
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

const projects = [
  {
    category: 'projects',
    externalLink: 'projects/booklight',
    meta: { forks_count: 1, language: 'JavaScript', stargazers_count: 5 },
    slug: 'booklight',
    subtitle: 'Booklight is a clean Chrome Extension to ease the way of adding a bookmark',
    summary: 'A browser extension for keeping bookmark organization fast and tidy.',
    title: 'Booklight',
    type: 'Project'
  },
  {
    category: 'projects',
    externalLink: 'projects/gaudi',
    meta: { forks_count: 8, language: 'Shell', stargazers_count: 44 },
    slug: 'gaudi',
    subtitle: 'Automate and Simplify New Machine Setups',
    summary: 'A collection of tools and services to boost developer productivity from bash frameworks to dotfiles.',
    title: 'Gaudi',
    type: 'Project'
  },
  {
    category: 'projects',
    externalLink: 'projects/roomba',
    meta: { forks_count: 7, language: 'Java', stargazers_count: 29 },
    slug: 'roomba',
    subtitle: 'Automatic Validation, Correction and Generation of Dataset Metadata',
    summary: 'A scalable approach for extracting, validating, and generating linked dataset profiles.',
    title: 'Roomba',
    type: 'Project'
  }
];

const thoughts = [
  {
    category: 'thoughts',
    date: '2026-04-02',
    slug: 'learning-in-public',
    subtitle: 'Short notes make learning visible while it is still useful.',
    summary: 'Short notes make learning visible while it is still useful.',
    title: 'Learning in public',
    type: 'Thought'
  },
  {
    category: 'thoughts',
    date: '2026-02-18',
    slug: 'making-decisions',
    subtitle: 'Decision records are useful before memory starts editing the context.',
    summary: 'Decision records are useful before memory starts editing the context.',
    title: 'Making decisions',
    type: 'Thought'
  },
  {
    category: 'thoughts',
    date: '2025-12-03',
    slug: 'technical-debt',
    subtitle: 'Technical debt is a coordination problem before it is a code problem.',
    summary: 'Technical debt is a coordination problem before it is a code problem.',
    title: 'Technical debt',
    type: 'Thought'
  }
];

const sortedPosts = posts;
const featuredPosts = sortedPosts.filter((post) => post.featured);
const regularPosts = sortedPosts.filter((post) => !post.featured);

const footerProps = {
  brandDescription: 'Writing about AI, semantic systems, data products, and engineering practice.',
  brandTitle: siteMetadata.shortname,
  copyrightName: siteMetadata.author,
  sections: [
    {
      links: [
        { href: '/about', label: 'Summary' },
        { href: '/blog/publications', label: 'Publications' },
        { href: '/blog/projects', label: 'Projects' }
      ],
      title: 'About'
    },
    {
      links: categories.slice(0, 4).reverse().map((category) => ({
        href: category.href,
        label: category.title.replace('-', ' ')
      })),
      title: 'Blog'
    },
    {
      links: projects.map((project) => ({
        href: `/blog/${project.externalLink}`,
        label: project.title
      })),
      title: 'Projects'
    }
  ],
  socialLinks: [
    { href: siteMetadata.github, kind: 'github' },
    { href: siteMetadata.linkedin, kind: 'linkedin' },
    { href: siteMetadata.twitter, kind: 'twitter' }
  ],
  variant: 'editorial'
};

const menuProps = {
  categories,
  links: navigationMetadata.links,
  posts: sortedPosts,
  projects,
  publications,
  tags,
  thoughts
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

const PageShell = ({ children }) => (
  <div className='bg-white text-black antialiased dark:bg-neutral-950 dark:text-white'>
    <Aurora>
      <div className='relative isolate w-full px-4 dark:z-10 sm:w-[95%] sm:px-8 xl:max-w-6xl'>
        <div className='flex min-h-screen flex-col justify-between'>
          <FloatingMenu />
          <Menu { ...menuProps } />
          <main className='mb-4'>{children}</main>
          <Footer { ...footerProps } />
        </div>
      </div>
    </Aurora>
  </div>
);

const FeaturedPostsLayout = ({ hideTitle = false }) => {
  const featuredPost = featuredPosts[0];
  const displayPosts = featuredPosts.slice(1, 3);

  return (
    <div>
      {!hideTitle ? (
        <Typography variant='heading-lg' as='h2' className='pb-6 pt-8'>
          Featured Posts
        </Typography>
      ) : null}
      <div className='pb-10'>
        <article className='mx-auto w-full group'>
          <div className='mb-4 flex items-center gap-3'>
            <Pill tone='blue' variant='solid' radius='full' size='sm'>Featured</Pill>
            <Typography as='time' variant='metadata' dateTime={ featuredPost.date }>
              {formatDate(featuredPost.date)}
            </Typography>
            <Typography as='span' variant='metadata'>•</Typography>
            <Pill tone='blue' variant='subtle' size='sm' className='capitalize'>
              {featuredPost.category}
            </Pill>
          </div>

          <Typography variant='heading-xl' as='h2' className='mb-4'>
            <Link
              href={ `/blog/${featuredPost.slug}` }
              variant='bare'
              tone='neutral'
              className='no-underline hover:text-blue-600 hover:no-underline dark:hover:text-blue-400'
            >
              {featuredPost.title}
            </Link>
          </Typography>

          <Typography variant='paragraph-md' className='mb-6'>
            {featuredPost.summary}
          </Typography>

          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            <Link href={ `/blog/${featuredPost.slug}` } tone='blue' className='inline-flex items-center gap-2'>
              Read Full Article
              <Icon name='ArrowRight' decorative size='xs' />
            </Link>
            <div className='flex flex-wrap gap-2'>
              {featuredPost.tags.slice(0, 4).map((tag) => (
                <Pill key={ tag } href={ `/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}` } tone='gray' variant='soft' size='sm' className='capitalize'>
                  {tag}
                </Pill>
              ))}
            </div>
          </div>
        </article>

        <Grid columns='2' gap='lg' className='w-full pt-10'>
          {displayPosts.map((post) => (
            <article key={ post.slug } className='group'>
              <div className='mb-3 flex items-center gap-3'>
                <Typography as='time' variant='metadata' dateTime={ post.date }>
                  {formatDate(post.date)}
                </Typography>
                <Typography as='span' variant='metadata'>•</Typography>
                <Pill tone='blue' variant='subtle' size='sm' className='capitalize'>
                  {post.category}
                </Pill>
              </div>
              <Typography variant='heading-md' as='h2' className='mb-3'>
                <Link
                  href={ `/blog/${post.slug}` }
                  tone='neutral'
                  variant='bare'
                  className='no-underline hover:text-blue-600 hover:no-underline dark:hover:text-blue-400'
                >
                  {post.title}
                </Link>
              </Typography>
              <Typography variant='paragraph-md' className='mb-4'>
                {post.summary}
              </Typography>
              <div className='flex flex-wrap gap-2'>
                {post.tags.slice(0, 3).map((tag) => (
                  <Pill key={ tag } href={ `/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}` } tone='gray' variant='soft' size='sm' className='capitalize'>
                    {tag}
                  </Pill>
                ))}
              </div>
            </article>
          ))}
        </Grid>
      </div>
    </div>
  );
};

const BlogListLayout = ({ filter = true, posts: listPosts = sortedPosts }) => {
  const [ searchValue, setSearchValue ] = useState('');
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ isLoading, setIsLoading ] = useState(false);

  const filteredBlogPosts = listPosts.filter((frontMatter) => {
    const searchContent = `${frontMatter.title}${frontMatter.summary}${frontMatter.tags?.join(' ') || ''}`;

    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });
  const totalPages = Math.ceil(filteredBlogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayPosts = searchValue ? filteredBlogPosts : filteredBlogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = async(newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setCurrentPage(newPage);
    setIsLoading(false);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <div className='border-0'>
      <div>
        {filter ? <Search setSearchValue={ handleSearchChange } /> : null}
        <ul className='pt-6'>
          {!filteredBlogPosts.length ? 'No posts found' : null}
          {displayPosts.map((frontMatter) => (
            <Post key={ frontMatter.slug } frontMatter={ frontMatter } />
          ))}
        </ul>
        {totalPages > 1 && !searchValue ? (
          <PaginationBar
            currentPage={ currentPage }
            totalPages={ totalPages }
            getHref={ () => '' }
            onPageChange={ isLoading ? undefined : handlePageChange }
          />
        ) : null}
      </div>
    </div>
  );
};

const HomePage = () => (
  <PageShell>
    <div className='divide-y divide-gray-200 dark:divide-gray-700'>
      <div className='mb-8 space-y-3 pb-6 pt-8 md:space-y-4'>
        <Typography variant='title-xl' className='uppercase'>
          {siteMetadata.author}
        </Typography>
        <Typography variant='heading-lg' as='h2'>
          <TextHighlight className='text-black dark:text-white'>
            AI and Machine Learning Leader, Mentor and Advisor
          </TextHighlight>
        </Typography>
        <Typography variant='subtitle-md' className='max-sm:py-3'>{siteMetadata.description}</Typography>
        <Typography variant='paragraph-md'>
          A driven AI and Machine Learning (ML) leader with a passion for building intelligent systems and turning complex technology into useful products through my current role as <strong>CTO <Link tone='blue' href='https://mav9.com' className='font-bold'>@Mav9</Link></strong>, where I lead technology strategy across AI, data, knowledge graphs, and product engineering; previously, as <strong>VP of AI and Data <Link tone='blue' href='https://beamery.com' className='font-bold'>@Beamery</Link></strong>, I built and scaled engineering, AI, and data science teams and helped the company become one of the latest tech unicorns.
        </Typography>
        <Typography variant='paragraph-md'>
          I am a Knowledge Graph and Semantic Web Enthusiast (<strong>PhD in Semantic Web and Information Retrieval</strong>) with <Link tone='blue' href='/blog/publications'>publications</Link> on Linked Data, Data Quality and Recommender Systems.
        </Typography>
        <p className='flex items-center gap-1.5 text-sm text-text-muted'>
          Press <Kbd keys='command,k' size='sm' /> to start
        </p>
      </div>
      <FeaturedPostsLayout />
      <div className='pb-8'>
        <BlogListLayout posts={ regularPosts.slice(0, 6) } filter={ false } />
        <div className='flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between'>
          <ul role='list' className='flex-1'>
            {regularPosts[6] ? <Post frontMatter={ regularPosts[6] } /> : null}
          </ul>
          <div className='flex justify-end md:flex-shrink-0'>
            <Button variant='outline' tone='accent' size='md' href='/blog' aria-label='View all blog posts'>
              View All Posts
              <Icon name='ArrowRight' decorative size='xs' />
            </Button>
          </div>
        </div>
      </div>
      <ThoughtsSection thoughts={ thoughts } />
    </div>
  </PageShell>
);

const BlogPage = () => (
  <PageShell>
    <div>
      <FeaturedPostsLayout hideTitle />
      <BlogListLayout posts={ sortedPosts } />
    </div>
  </PageShell>
);

const CategoryPostsPage = () => {
  const filteredPosts = sortedPosts.filter((post) => post.category === 'engineering');

  return (
    <PageShell>
      <div>
        <BlogListLayout posts={ filteredPosts } />
      </div>
    </PageShell>
  );
};

const StatCard = ({ icon, label, value }) => (
  <Card variant='outline'>
    <div className='flex items-center gap-3'>
      <Icon name={ icon } size='md' decorative color='primary' />
      <div>
        <Typography variant='heading-sm'>{value}</Typography>
        <Typography variant='metadata'>{label}</Typography>
      </div>
    </div>
  </Card>
);

const PostSummaryCard = ({ post }) => (
  <Card interactive className='h-full' variant='outline'>
    <article>
      <Typography variant='heading-sm' as='h3' className='mb-2 line-clamp-2'>
        {post.title}
      </Typography>
      <Typography variant='paragraph-sm' className='mb-3 line-clamp-3'>
        {post.summary || post.description}
      </Typography>
      <div className='flex items-center justify-between'>
        <Typography as='time' variant='metadata'>
          {formatDate(post.date)}
        </Typography>
        <Typography as='span' variant='metadata' className='inline-flex items-center gap-1'>
          Read
          <Icon name='ChevronRight' size='xs' decorative />
        </Typography>
      </div>
    </article>
  </Card>
);

const CategoriesPageView = () => {
  const [ viewMode, setViewMode ] = useState('cards');
  const sortedCategories = [ ...categories ].sort((a, b) => b.count - a.count);
  const totalArticles = categories.reduce((sum, category) => sum + category.count, 0);
  const mostPopularCategory = sortedCategories[0];
  const categoriesWithPosts = sortedCategories.map((category) => {
    const categoryPosts = sortedPosts.filter((post) => post.category?.toLowerCase() === category.slug.toLowerCase());

    return {
      ...category,
      posts: categoryPosts,
      samplePosts: categoryPosts.slice(0, 3)
    };
  });

  return (
    <PageShell>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <Typography variant='title-md' className='mb-6'>
            Categories
          </Typography>
          <Grid columns='3' gap='md' className='mb-6'>
            <StatCard icon='FolderOpen' value={ categories.length } label='Categories' />
            <StatCard icon='FileText' value={ totalArticles } label='Articles' />
            <StatCard icon='Flame' value={ mostPopularCategory?.count || 0 } label='Most popular' />
          </Grid>
          <div className='mb-8 flex justify-end'>
            <div className='inline-flex gap-2'>
              <Button onClick={ () => setViewMode('cards') } variant={ viewMode === 'cards' ? 'solid' : 'outline' } tone={ viewMode === 'cards' ? 'accent' : 'neutral' } size='sm'>
                <Icon name='Grid3X3' size='sm' decorative />
                Cards
              </Button>
              <Button onClick={ () => setViewMode('list') } variant={ viewMode === 'list' ? 'solid' : 'outline' } tone={ viewMode === 'list' ? 'accent' : 'neutral' } size='sm'>
                <Icon name='List' size='sm' decorative />
                List
              </Button>
            </div>
          </div>
        </div>
        <div className='space-y-12'>
          {categoriesWithPosts.map((category, index) => (
            <section key={ category.id }>
              {index > 0 && viewMode === 'list' ? <div className='mb-12' /> : null}
              <div className='mb-2 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Typography variant='heading-md' as='h2' className='capitalize'>
                    {category.title.replace('-', ' ')}
                  </Typography>
                  <Pill tone='blue' variant='soft' radius='full' size='sm'>
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </Pill>
                </div>
                <Link href={ `/blog/categories/${category.slug}` } tone='blue'>
                  View all →
                </Link>
              </div>
              <Typography variant='paragraph-md' className='mb-6'>
                {category.description}
              </Typography>
              {category.samplePosts.length > 0 && viewMode === 'cards' ? (
                <Grid columns='3' gap='lg'>
                  {category.samplePosts.map((post) => (
                    <Link key={ post.slug } href={ `/blog/${post.slug}` } variant='bare' className='block h-full'>
                      <PostSummaryCard post={ post } />
                    </Link>
                  ))}
                </Grid>
              ) : null}
              {category.samplePosts.length > 0 && viewMode === 'list' ? (
                <div className='space-y-2'>
                  {category.samplePosts.map((post) => (
                    <Link key={ post.slug } href={ `/blog/${post.slug}` } variant='bare' className='block py-3'>
                      <article>
                        <Typography as='time' variant='metadata' className='mb-1 block'>
                          {formatDate(post.date)}
                        </Typography>
                        <Typography variant='heading-sm' as='h3' className='mb-1'>
                          {post.title}
                        </Typography>
                        <Typography variant='paragraph-sm'>{post.subtitle}</Typography>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

const PostSummary = ({ post }) => (
  <article>
    <Typography variant='heading-sm' as='h3' className='mb-2 line-clamp-2'>
      {post.title}
    </Typography>
    <Typography variant='paragraph-sm' className='mb-3 line-clamp-2'>
      {post.summary || post.description}
    </Typography>
    <div className='flex items-center justify-between'>
      <Typography as='time' variant='metadata'>
        {formatDate(post.date)}
      </Typography>
      <Typography as='span' variant='metadata' className='inline-flex items-center gap-1'>
        Read
        <Icon name='ChevronRight' size='xs' decorative />
      </Typography>
    </div>
  </article>
);

const TagsPageView = () => {
  const [ selectedTag, setSelectedTag ] = useState(null);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);
  const [ searchQuery, setSearchQuery ] = useState('');
  const filteredAndSortedTags = [ ...tags ]
    .filter((tag) => tag.display.toLowerCase().includes(searchQuery.toLowerCase()) || tag.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.count - a.count);
  const totalArticles = tags.reduce((sum, tag) => sum + tag.count, 0);
  const mostPopularTag = filteredAndSortedTags[0];
  const tagPosts = selectedTag ? sortedPosts.filter((post) => post.tags?.map((tag) => tag.replace(' ', '-').toLowerCase()).includes(selectedTag.slug)).slice(0, 4) : [];

  const loadTagPosts = (tag) => {
    setSelectedTag(tag);
    setSidebarOpen(true);
  };

  return (
    <PageShell>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <Typography variant='title-md' className='mb-6'>
            Topics
          </Typography>
          <Grid columns='3' gap='md' className='mb-6'>
            <StatCard icon='FolderOpen' value={ tags.length } label='Topics' />
            <StatCard icon='FileText' value={ totalArticles } label='Articles' />
            <StatCard icon='Flame' value={ mostPopularTag?.count || 0 } label='Most popular' />
          </Grid>
          <div className='relative mb-8'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <Icon name='Search' size='sm' decorative />
            </div>
            <FieldInput
              type='text'
              placeholder='Search topics...'
              value={ searchQuery }
              onChange={ (event) => setSearchQuery(event.target.value) }
              className='pl-10'
            />
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          {filteredAndSortedTags.map((tag) => (
            <Button key={ tag.id } onClick={ () => loadTagPosts(tag) } variant='outline' tone='gray' size='sm'>
              {tag.display}
              <Pill tone='gray' variant='soft' size='xs'>{tag.count}</Pill>
            </Button>
          ))}
        </div>
      </div>
      {sidebarOpen ? (
        <div className='fixed inset-0 z-50 overflow-hidden'>
          <div className='absolute inset-0 bg-black/20' onClick={ () => setSidebarOpen(false) } />
          <Card variant='outline' radius='none' padding='none' className='absolute right-0 top-0 h-full w-full max-w-lg shadow-lg'>
            <div className='flex h-full flex-col'>
              <Card variant='flat' radius='none' className='border-x-0 border-t-0 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <Icon name='Tags' size='md' decorative />
                      <Typography variant='heading-sm' as='h2'>
                        {selectedTag?.display}
                      </Typography>
                    </div>
                    <Typography variant='paragraph-sm' className='mt-1'>
                      {selectedTag?.count} {selectedTag?.count === 1 ? 'article' : 'articles'}
                    </Typography>
                  </div>
                  <Button onClick={ () => setSidebarOpen(false) } variant='ghost' tone='gray' size='xs' aria-label='Close topics panel'>
                    <Icon name='X' size='md' decorative />
                  </Button>
                </div>
              </Card>
              <div className='flex-1 overflow-y-auto'>
                {tagPosts.length > 0 ? (
                  <div>
                    {tagPosts.map((post) => (
                      <Link key={ post.slug } href={ `/blog/${post.slug}` } onClick={ () => setSidebarOpen(false) } variant='bare' className='block p-6'>
                        <PostSummary post={ post } />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className='py-12 text-center'>
                    <Typography variant='paragraph-sm'>No articles found</Typography>
                  </div>
                )}
              </div>
              <Card variant='flat' radius='none' className='border-x-0 border-b-0 p-6'>
                <Button href={ `/blog/tags/${selectedTag?.slug}` } onClick={ () => setSidebarOpen(false) } variant='outline' tone='gray' className='w-full'>
                  View All Articles →
                </Button>
              </Card>
            </div>
          </Card>
        </div>
      ) : null}
    </PageShell>
  );
};

const ProjectCard = ({ project }) => (
  <Card interactive className='h-full' variant='outline'>
    <article className='flex h-full flex-col'>
      <Typography variant='heading-sm' as='h3' className='mb-2'>
        {project.title}
      </Typography>
      <Typography variant='paragraph-sm' className='mb-3 flex-grow'>
        {project.subtitle}
      </Typography>
      <Typography as='div' variant='metadata' className='flex items-center gap-3'>
        <div className='flex items-center gap-1'>
          <Icon name='Star' size='xs' decorative />
          <span>{project.meta.stargazers_count}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Icon name='Fork' size='xs' decorative />
          <span>{project.meta.forks_count}</span>
        </div>
        <Pill tone='gray' variant='soft' size='xs'>
          {project.meta.language}
        </Pill>
      </Typography>
    </article>
  </Card>
);

const ProjectsPageView = () => (
  <PageShell>
    <div className='divide-y divide-gray-200 dark:divide-gray-700'>
      <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
        <Typography variant='title-xl'>
          Projects
        </Typography>
      </div>
      <div>
        <Grid columns='3' gap='md' className='py-10'>
          {projects.map((project) => (
            <Link href={ `/blog/${project.externalLink}` } key={ project.externalLink } variant='bare' className='block h-full'>
              <ProjectCard project={ project } />
            </Link>
          ))}
        </Grid>
      </div>
    </div>
  </PageShell>
);

const PublicationCard = ({ publication }) => (
  <Card interactive className='h-full' variant='outline'>
    <article className='flex h-full flex-col'>
      <div className='mb-3 flex items-center gap-2'>
        {publication.venueType ? (
          <Pill tone='yellow' variant='soft' size='xs'>
            {publication.venueType}
          </Pill>
        ) : null}
        {publication.award ? (
          <Pill tone='green' variant='soft' size='xs'>
            {publication.award}
          </Pill>
        ) : null}
      </div>

      <Typography variant='heading-sm' as='h3' className='mb-2'>
        {publication.title}
      </Typography>

      <Typography variant='paragraph-sm' className='mb-3 flex-grow'>
        {publication.venue}
      </Typography>

      <Typography variant='paragraph-sm'>
        {publication.authors}
      </Typography>
    </article>
  </Card>
);

const PublicationsPageView = () => {
  const publicationsGroups = publications.reduce((groups, publication) => {
    const year = publication.year;

    return {
      ...groups,
      [year]: [ ...(groups[year] || []), publication ]
    };
  }, {});
  const years = Object.keys(publicationsGroups).reverse();

  return (
    <PageShell>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
          <Typography variant='title-xl'>
            Publications
          </Typography>
          <Typography variant='subtitle-md'>
            A list of papers I contributed to/authored. The papers span the fields of Semantic Web, Information Retrieval, and Natural Language Processing
          </Typography>
        </div>
        <AccordionGroup
          className='mt-6'
          defaultValue={ years[0] }
          items={ years.map((year) => ({
            content: (
              <Grid columns='3' gap='md'>
                {publicationsGroups[year].map((publication) => (
                  <Link href={ publication.href } key={ publication.href } variant='bare' className='block h-full'>
                    <PublicationCard publication={ publication } />
                  </Link>
                ))}
              </Grid>
            ),
            title: year,
            value: year
          })) }
          type='single'
        />
      </div>
    </PageShell>
  );
};

const AboutPage = () => {
  const values = [
    {
      description: 'Providing strategic guidance to help you navigate complex business challenges and make informed decisions.',
      icon: <Icon name='ChessKnight' decorative />,
      name: 'Advisory Services'
    },
    {
      description: 'Offering personalized mentorship to emerging leaders and teams, fostering growth and development',
      icon: <Icon name='HandshakeLine' decorative />,
      name: 'Mentorship'
    },
    {
      description: 'Asisting in scaling operations and accelerating growth through proven strategies and industry insights',
      icon: <Icon name='ChartArea' decorative />,
      name: 'Scaling and Growth'
    },
    {
      description: 'Leading technical teams with a focus on innovation, efficiency, and achieving business goals',
      icon: <Icon name='Cubes' decorative />,
      name: 'Technical Leadership'
    },
    {
      description: 'Developing and implementing robust technical strategies that align with your business objectives and drive competitive advantage',
      icon: <Icon name='Codepen' decorative />,
      name: 'Technical Strategy'
    },
    {
      description: 'Conducting thorough assessments of AI and technology systems to ensure they meet industry standards and support business growth, while identifying potential risks and opportunities',
      icon: <Icon name='Robot' decorative />,
      name: 'AI and Tech Due Diligence'
    }
  ];

  return (
    <PageShell>
      <div>
        <div className='isolate'>
          <div>
            <div className='overflow-hidden'>
              <div className='pb-32 pt-8'>
                <div className='max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center'>
                  <div className='w-full max-w-xl lg:shrink-0 xl:max-w-2xl'>
                    <Typography variant='title-xl'>
                      Artificial Intelligence Leader, Advisor and Mentor
                    </Typography>
                    <Typography variant='paragraph-lg' className='relative mt-6 sm:max-w-md lg:max-w-none'>
                      Ahmad is CTO at Mav9 and a seasoned AI and data leader with more than a decade of experience scaling SaaS and technology businesses across engineering, data, and AI. He has a proven track record in engineering leadership, encompassing engineering operations, innovation strategy, and product development.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-12 sm:mt-0 xl:-mt-8'>
            <div className='max-w-2xl lg:mx-0 lg:max-w-none'>
              <Typography variant='heading-xl' as='h2'>A Brief History</Typography>
              <div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
                <div className='lg:w-full lg:max-w-2xl lg:flex-auto'>
                  <Typography variant='paragraph-lg'>
                    I am currently CTO at <Link href='https://mav9.com' tone='blue'>Mav9</Link>, where I lead technology strategy across AI, data, knowledge graphs, and product engineering. Before Mav9, as a founding engineer at <Link href='https://beamery.com' tone='blue'>Beamery</Link>, I had the unique opportunity to shape the company's technological journey from its inception.
                  </Typography>
                  <div className='mt-10 max-w-xl'>
                    <Typography variant='paragraph-md'>
                      As a continuous learner, I love working in collaborative environments, tackling challenging problems with my team and providing strategic leadership to achieve product-market fit and growth.
                    </Typography>
                    <Typography variant='paragraph-md' className='mt-10'>
                      In addition to my technical and leadership roles, I am deeply committed to fostering a culture of growth and continuous learning.
                    </Typography>
                  </div>
                </div>
                <div className='lg:flex lg:flex-auto lg:justify-center'>
                  <dl className='w-auto space-y-6 xl:w-72'>
                    {[
                      [ 'CTO', 'Mav9', 'https://mav9.com' ],
                      [ 'VP AI and Data', 'Beamery', 'https://beamery.com' ],
                      [ 'Research Scientist', 'SAP', 'https://sap.com' ]
                    ].map(([ role, company, href ]) => (
                      <div key={ role } className='flex flex-col-reverse gap-y-4'>
                        <Typography as='dt' variant='paragraph-md'>
                          <Link href={ href } tone='blue'>{company}</Link>
                        </Typography>
                        <Typography as='dd' variant='heading-sm'>{role}</Typography>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-32 py-2 sm:mt-40'>
            <div className='max-w-2xl lg:mx-0'>
              <Typography variant='heading-xl' as='h2'>How Can I Help?</Typography>
              <Typography variant='paragraph-lg' className='mt-6'>
                As an experienced leader in the technology and SaaS industry, I am committed to helping businesses achieve their full potential. My approach is grounded in core values of collaboration, innovation, and integrity.
              </Typography>
            </div>
            <Grid columns='3' gap='lg' className='my-16 max-w-2xl lg:mx-0 lg:max-w-none'>
              {values.map((value) => (
                <Card
                  key={ value.name }
                  title={ (
                    <>
                      {value.icon}
                      {value.name}
                    </>
                  ) }
                  subtitle={ value.description }
                  variant='flat'
                  padding='none'
                  classNames={{
                    body: 'space-y-2',
                    title: 'flex items-center gap-2'
                  }}
                />
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default {
  id: 'layout-examples',
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/'
      }
    }
  },
  title: 'Layout/Examples'
};

export const MainPage = {
  name: 'Main Page',
  render: () => <HomePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Both the hero title and the footer brand heading carry the author name.
    const authorHeadings = canvas.getAllByRole('heading', { name: 'Ahmad Assaf' });

    await expect(authorHeadings[0]).toBeVisible();
    await expect(canvas.getByText('AI and Machine Learning Leader, Mentor and Advisor')).toBeVisible();
  }
};

export const BlogMainPage = {
  name: 'Blog Main Page',
  render: () => <BlogPage />
};

export const CategoryPageWithPostsAndPagination = {
  render: () => <CategoryPostsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('searchbox', { name: 'Filter articles' })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  }
};

export const CategoriesPage = {
  render: () => <CategoriesPageView />
};

export const TagsPage = {
  render: () => <TagsPageView />
};

export const ProjectsPage = {
  render: () => <ProjectsPageView />
};

export const PublicationsPage = {
  render: () => <PublicationsPageView />
};

export const AboutMePage = {
  name: 'About Me Page',
  render: () => <AboutPage />
};
