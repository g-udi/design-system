import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import ArticleContentLayout from '../../src/components/layout/ArticleContentLayout';
import Aurora from '../../src/components/layout/Aurora';
import Footer from '../../src/components/layout/Footer';
import LayoutWrapper from '../../src/components/layout/LayoutWrapper';
import NewsletterForm, { BlogNewsletterForm } from '../../src/components/layout/NewsletterForm';
import Search from '../../src/components/layout/Search';
import Link from '../../src/components/core/Link';
import Typography from '../../src/foundations/Typography';

const story = (description) => ({ docs: { description: { story: description } } });

const footerSections = [
  {
    'links': [
      { 'href': '/blog/categories/engineering', 'label': 'Engineering' },
      { 'href': '/blog/categories/data', 'label': 'Data' },
      { 'href': '/blog/categories/productivity', 'label': 'Productivity' }
    ],
    'title': 'Categories'
  },
  {
    'links': [ { 'href': '/blog/projects/gaudi', 'label': 'Gaudi' } ],
    'title': 'Projects'
  },
  {
    'links': [
      { 'href': '/about', 'label': 'Summary' },
      { 'href': '/blog/publications', 'label': 'Publications' }
    ],
    'title': 'About'
  }
];

const aside = (
  <nav className='space-y-2 px-1 py-4' aria-label='Article contents'>
    <p className='text-sm font-semibold text-text'>On this page</p>
    <Link href='#layout-boundaries' tone='accent' className='block text-sm'>Layout boundaries</Link>
    <Link href='#reading-column' tone='accent' className='block text-sm'>The reading column</Link>
  </nav>
);

const SearchExample = ({ label }) => {
  const [ query, setQuery ] = useState('');

  return (
    <div className='mx-auto max-w-xl p-6'>
      <Search label={ label } resultsId='storybook-article-results' setSearchValue={ setQuery } value={ query } />
      <p id='storybook-article-results' className='mt-4 text-sm text-text-muted' role='status'>
        {query ? `Filtering articles by “${query}”` : 'Showing all articles'}
      </p>
    </div>
  );
};

export default {
  id: 'layout-components',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Layout/Components'
};

export const ArticleContent = {
  name: 'ArticleContentLayout',
  args: { collapsibleAside: true, padding: 'md' },
  argTypes: {
    collapsibleAside: { control: 'boolean', description: 'Add a show/hide toggle above the aside.' },
    padding: { control: 'inline-radio', options: [ 'md', 'lg' ], description: 'Vertical prose padding.' }
  },
  parameters: story('The reading column beside a contents aside. `collapsibleAside` adds the show/hide toggle; `padding` sets the prose spacing.'),
  render: (args) => (
    <div className='mx-auto max-w-6xl px-6'>
      <ArticleContentLayout aside={ aside } { ...args }>
        <h1 id='layout-boundaries'>Layout boundaries</h1>
        <p>ArticleContentLayout keeps long-form content and its supporting navigation readable across breakpoints.</p>
        <h2 id='reading-column'>The reading column</h2>
        <p>Prose keeps its measure while the aside takes three of nine columns on wide screens and moves above the article on small ones.</p>
      </ArticleContentLayout>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    if (!args.collapsibleAside) return;
    await userEvent.click(canvas.getByRole('button', { name: 'Hide Table of contents' }));
    await expect(canvas.queryByRole('navigation', { name: 'Article contents' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show Table of contents' }));
    await expect(canvas.getByRole('navigation', { name: 'Article contents' })).toBeVisible();
  }
};

export const AuroraSurface = {
  name: 'Aurora',
  args: { showRadialGradient: true },
  argTypes: { showRadialGradient: { control: 'boolean', description: 'Fade the aurora into the page with a radial mask.' } },
  parameters: story('The page atmosphere behind hero content. It pauses off screen and in hidden tabs, and the content stays complete without it.'),
  render: (args) => (
    <Aurora className='min-h-[28rem] px-6' { ...args }>
      <div className='relative z-10 max-w-2xl text-center'>
        <Typography as='h1' variant='heading-xl'>Theme-aware page atmosphere</Typography>
        <Typography variant='paragraph-md' className='mt-4'>Content remains complete when motion or decorative gradients are unavailable.</Typography>
      </div>
    </Aurora>
  )
};

export const FooterLayout = {
  name: 'Footer',
  args: { brandTitle: 'Field notes', copyrightName: 'Ahmad Assaf', variant: 'standard' },
  argTypes: {
    brandTitle: { control: 'text', description: 'Editorial brand heading.', if: { arg: 'variant', eq: 'editorial' } },
    copyrightName: { control: 'text', description: 'Name in the copyright line.' },
    variant: { control: 'inline-radio', options: [ 'standard', 'editorial' ], description: '`standard` adds the newsletter form; `editorial` leads with the brand.' }
  },
  parameters: story('The site footer with link columns, social links, and copyright. Switch `variant` between the newsletter layout and the brand-led editorial layout.'),
  render: (args) => (
    <div className='mx-auto max-w-6xl px-6'>
      <Footer { ...args } sections={ footerSections } newsletterProps={{ 'endpoint': '#newsletter' }} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible();
    await expect(canvas.getByText(new RegExp(`${args.copyrightName}\\. All rights reserved`))).toBeVisible();
    await expect(Boolean(canvas.queryByRole('textbox', { name: 'Email address' }))).toBe(args.variant === 'standard');
  }
};

export const PageShell = {
  name: 'LayoutWrapper',
  parameters: story('The page shell: shared navigation, a main landmark, and the footer around page content.'),
  render: () => (
    <LayoutWrapper footerProps={{ 'newsletterProps': { 'endpoint': '#newsletter' }, 'sections': footerSections }}>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <Typography as='h1' variant='heading-xl'>Application page shell</Typography>
        <Typography variant='paragraph-md' className='mt-4'>LayoutWrapper composes the shared navigation, main landmark, and footer.</Typography>
      </div>
    </LayoutWrapper>
  )
};

export const Newsletter = {
  name: 'NewsletterForm',
  args: { title: 'Subscribe to the newsletter' },
  argTypes: { title: { control: 'text', description: 'Form heading.' } },
  parameters: story('The subscription form on its own, and inside the tinted `BlogNewsletterForm` frame used between articles. The email field is required and results are announced below it.'),
  render: (args) => (
    <div className='mx-auto grid max-w-2xl gap-10 p-6'>
      <NewsletterForm { ...args } endpoint='#newsletter' className='mt-0' />
      <BlogNewsletterForm title={ args.title } />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('heading', { name: args.title })).toHaveLength(2);
    for (const email of canvas.getAllByRole('textbox', { name: 'Email address' })) await expect(email).toBeRequired();
  }
};

export const ArticleSearch = {
  name: 'Search',
  args: { label: 'Filter articles' },
  argTypes: { label: { control: 'text', description: 'Accessible label and placeholder.' } },
  parameters: story('The article filter: typing reports each change, and the clear button appears once there is a query.'),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: args.label });

    await userEvent.type(search, 'graphs');
    await expect(canvas.getByRole('status')).toHaveTextContent('Filtering articles by “graphs”');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear article filter' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing all articles');
  },
  render: (args) => <SearchExample { ...args } />
};
