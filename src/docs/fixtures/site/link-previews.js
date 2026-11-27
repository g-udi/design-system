// Static preview payloads in the shape the blog's /api/preview returns, plus the
// optional platform extras (stars, duration, likes) the normaliser understands.
// Images are local artwork so stories never reach the network.
import { aurora, dusk, lagoon, meadow, sky } from './artwork';

export const linkPreviewExamples = {
  repository: {
    url: 'https://github.com/g-udi/design-system',
    title: 'Gaudi on GitHub',
    previewData: {
      type: 'repository',
      title: 'g-udi/design-system',
      description: 'Gaudi: a curated design system for blogs and applications.',
      image: aurora,
      siteName: 'GitHub',
      language: 'JavaScript',
      stars: 1284,
      forks: 96
    }
  },
  video: {
    url: 'https://www.youtube.com/watch?v=qh3NGpYRG3I',
    title: 'the token walkthrough',
    previewData: {
      type: 'video',
      title: 'Designing with tokens - YouTube',
      description: 'Radius, spacing and colour tokens, and how one setting reshapes every component.',
      image: dusk,
      siteName: 'YouTube',
      author: 'Gaudi',
      duration: 'PT12M41S',
      views: 48200
    }
  },
  article: {
    url: 'https://medium.com/@ahmadassaf/an-introduction-to-knowledge-graphs',
    title: 'my knowledge graph primer',
    previewData: {
      type: 'article',
      title: 'An Introduction to Knowledge Graphs',
      description: 'Entities, relations and the schemas that let machines reason over linked data.',
      image: lagoon,
      siteName: 'Medium',
      author: 'Ahmad Assaf',
      publishedTime: '2026-05-12',
      readingTime: '9 min read'
    }
  },
  social: {
    url: 'https://x.com/ahmadaassaf/status/1840000000000000000',
    title: 'the launch post',
    previewData: {
      type: 'social',
      title: 'Ahmad Assaf on X',
      description: 'Link previews in Gaudi now know what a link is: repos show stars, videos show their length, posts show who wrote them.',
      siteName: 'X',
      publishedTime: '2026-09-30',
      replies: 38,
      likes: 1240
    }
  },
  docs: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe',
    title: 'the iframe reference',
    previewData: {
      title: '<iframe>: The Inline Frame element - MDN Web Docs',
      description: 'The <iframe> element represents a nested browsing context, embedding another HTML page into the current one.',
      image: sky,
      siteName: 'MDN Web Docs'
    }
  },
  wikipedia: {
    url: 'https://en.wikipedia.org/wiki/Knowledge_graph',
    title: 'knowledge graph',
    previewData: {
      type: 'wikipedia',
      title: 'Knowledge graph - Wikipedia',
      articleName: 'Knowledge graph',
      description: 'Knowledge base that uses a graph-structured data model',
      excerpt: 'In knowledge representation and reasoning, a knowledge graph is a knowledge base that uses a graph-structured data model or topology to represent and operate on data...'
    }
  },
  website: {
    url: 'https://assaf.website',
    title: 'assaf.website',
    previewData: {
      type: 'website',
      title: 'assaf.website',
      description: 'Personal website and writing archive for Ahmad Assaf.',
      favicon: '/static/favicons/favicon-32x32.png',
      image: meadow,
      siteName: 'assaf.website'
    }
  },
  file: {
    url: 'https://example.com/reports/linked-data-quality.pdf',
    title: 'the quality report',
    previewData: {
      title: 'Linked Data Quality Assessment',
      description: 'Roomba’s framework for measuring the quality of open data portals.',
      siteName: 'Example Research'
    }
  },
  internal: {
    url: '/blog/engineering/gaudi-my-bash-framework',
    title: 'the Gaudi post',
    previewData: {
      type: 'internal',
      title: 'Gaudi, my bash framework',
      siteName: 'Internal',
      description: 'How a small core and lazily loaded modules keep a new shell fast.',
      publishedTime: '2026-06-05',
      readingTime: '8 min read',
      category: 'engineering',
      tags: [ 'bash', 'tooling' ]
    }
  }
};

export const linkPreviewKindNames = Object.keys(linkPreviewExamples);

const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="about:srcdoc"><title>${title}</title><style>
  :root { color-scheme: light; font-family: ui-sans-serif, system-ui, sans-serif; }
  body { margin: 0; color: #1c1917; background: #fafaf9; }
  header { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #e7e5e4; }
  main { max-width: 64ch; margin: 0 auto; padding: 32px 24px; }
  h1 { font: 600 clamp(28px, 6vw, 44px)/1.1 Georgia, serif; margin: 0 0 16px; }
  p, li { color: #57534e; line-height: 1.6; }
  nav ul { padding-inline-start: 20px; }
  a { color: #0f625b; }
  section { margin-block: 24px; }
  h2 { font: 600 22px/1.2 Georgia, serif; }
</style></head><body><header><strong>Reading Digest</strong><span>Sunday edition</span></header><main>${body}</main></body></html>`;

export const issueHtml = `<h1>A reading list for design engineers</h1>
<p>This week’s issue follows a keyboard shortcut and a screen-reader announcement from prototype to release.</p>
<nav aria-label="In this issue"><ul>
  <li><a href="#shortcuts">Keyboard shortcuts across platforms</a></li>
  <li><a href="#announcements">Announcing a completed task</a></li>
</ul></nav>
<section id="shortcuts"><h2>Keyboard shortcuts across platforms</h2>
  <p>Use the platform modifier in the hint. Keep a visible button beside the field so readers can run the same action with a pointer.</p>
</section>
<section id="announcements"><h2>Announcing a completed task</h2>
  <p>Keep the status region in the document before the action starts. Update its text after completion so the reader hears the result without losing focus.</p>
</section>`;

/** Generated pages keyed by address, as an assistant would return them. */
export const generatedPages = {
  'https://preview.gaudi.dev/': page('Reading Digest', issueHtml),
  'https://preview.gaudi.dev/pricing': page('Pricing · Reading Digest', '<h1>Pricing</h1><p>Every reader gets the Sunday issue. Supporters also receive the editor’s notes.</p><section><h2>Free</h2><p>The weekly reading list and links to the original sources.</p></section><section><h2>Supporter · $4 a month</h2><p>The annotated edition and full archive of previous issues.</p></section>')
};

/** srcDoc resolver for WebPreview: generated HTML for known addresses, a not-found page otherwise. */
export const generatedPage = (url) => generatedPages[url] || page('Not found', `<h1>Not generated yet</h1><p>The assistant has not built ${String(url).replace(/[<>&"]/g, '')} yet.</p>`);

export const generatedLogs = [
  { level: 'info', message: 'vite v7.1.4 ready in 412 ms', timestamp: '2026-10-02T09:14:02Z' },
  { level: 'log', message: 'Rendered / in 38 ms', timestamp: '2026-10-02T09:14:03Z' },
  { level: 'warn', message: 'Image "hero.png" has no width or height; layout may shift.', timestamp: '2026-10-02T09:14:03Z' },
  { level: 'error', message: 'Failed to load /api/subscribers: 404 (Not Found)', timestamp: '2026-10-02T09:14:04Z' }
];
