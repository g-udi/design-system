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

const page = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
  :root { color-scheme: light; font-family: ui-sans-serif, system-ui, sans-serif; }
  body { margin: 0; color: #1c1917; background: #fafaf9; }
  header { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #e7e5e4; background: #fff; }
  header strong { font-size: 15px; }
  nav { display: flex; gap: 16px; font-size: 14px; }
  nav a { color: #57534e; text-decoration: none; }
  main { max-width: 880px; margin: 0 auto; padding: 48px 24px; }
  h1 { font-size: clamp(28px, 6vw, 44px); line-height: 1.1; margin: 0 0 16px; }
  p { color: #57534e; line-height: 1.6; max-width: 60ch; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 32px; }
  .card { padding: 20px; border: 1px solid #e7e5e4; border-radius: 4px; background: #fff; }
  .card b { display: block; font-size: 22px; margin-bottom: 4px; }
  button { margin-top: 24px; padding: 10px 18px; border: 0; border-radius: 4px; background: #0f766e; color: #fff; font-size: 15px; }
</style></head><body><header><strong>Reading Digest</strong><nav><a href="#">Issues</a><a href="#">Pricing</a><a href="#">Sign in</a></nav></header><main>${body}</main></body></html>`;

/** Generated pages keyed by address, as an assistant would return them. */
export const generatedPages = {
  'https://preview.gaudi.dev/': page('Reading Digest', '<h1>One calm email of the week’s best writing.</h1><p>Hand-picked essays on design systems, data and engineering, every Sunday morning. No tracking, no noise.</p><button>Subscribe free</button><div class="grid"><div class="card"><b>12k</b>readers</div><div class="card"><b>5 min</b>a week</div><div class="card"><b>186</b>issues so far</div></div>'),
  'https://preview.gaudi.dev/pricing': page('Pricing · Reading Digest', '<h1>Pricing</h1><p>The digest is free. Supporters fund the archive and get the annotated edition.</p><div class="grid"><div class="card"><b>Free</b>The Sunday digest</div><div class="card"><b>$4/mo</b>Annotated edition and full archive</div></div>')
};

/** srcDoc resolver for WebPreview: generated HTML for known addresses, a not-found page otherwise. */
export const generatedPage = (url) => generatedPages[url] || page('Not found', `<h1>Not generated yet</h1><p>The assistant has not built ${String(url).replace(/[<>&"]/g, '')} yet.</p>`);

export const generatedLogs = [
  { level: 'info', message: 'vite v7.1.4 ready in 412 ms', timestamp: '2026-10-02T09:14:02Z' },
  { level: 'log', message: 'Rendered / in 38 ms', timestamp: '2026-10-02T09:14:03Z' },
  { level: 'warn', message: 'Image "hero.png" has no width or height; layout may shift.', timestamp: '2026-10-02T09:14:03Z' },
  { level: 'error', message: 'Failed to load /api/subscribers: 404 (Not Found)', timestamp: '2026-10-02T09:14:04Z' }
];
