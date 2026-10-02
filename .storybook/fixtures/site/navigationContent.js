import categoryData from './categories.json';
import navigationMetadata from './navigationMetadata.mjs';

/** Blog categories in the `{ id, title, description }` shape the navigation menus accept. */
export const categories = categoryData.map(({ id, title, description }) => ({ id, title, description }));

/** Destinations shown on every route, as consumed by FloatingMenu and the site header phone sheet. */
export const primaryLinks = navigationMetadata.links
  .filter((link) => link.showInPath === '*')
  .map(({ href, title }) => ({ href, title }));

/** Newest first. The fourth post sits outside the three-post Recent posts list. */
export const posts = [
  { date: '2026-05-20', slug: 'design-systems', title: 'Design systems keep editorial rhythm predictable' },
  { date: '2026-04-18', slug: 'knowledge-graphs', title: 'Knowledge graphs for product teams' },
  { date: '2026-03-16', slug: 'component-contracts', title: 'Component contracts for navigation' },
  { date: '2026-02-10', slug: 'older-post', title: 'Older post outside the recent list' }
];
