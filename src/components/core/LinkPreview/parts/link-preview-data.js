/**
 * Link preview data
 *
 * @description The single, pure description of "what rich information a link
 * preview shows". The consuming app's preview endpoint returns raw metadata
 * (Open Graph fields plus a few platform extras); `normalizeLinkPreview` turns
 * that payload into one display model, so the inline hover card, the card and
 * the compact row all agree on the kind, title, image and metadata of a link.
 * No fetching happens here.
 */

import formatDate from '../../../../utilities/formatDate/formatDate.js';

// Statuses that mean the destination itself is gone, not that metadata failed.
export const UNAVAILABLE_STATUSES = Object.freeze([ 400, 404, 410 ]);

// npmjs.com refuses metadata fetches, so package previews are synthesized from the URL.
export const NPM_HOSTNAME = 'npmjs.com';
export const NPM_FAVICON_URL = 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png';

// Image services the blog pipeline relies on when a page has no Open Graph image.
export const MICROLINK_SCREENSHOT_API = 'https://api.microlink.io/';
export const YOUTUBE_THUMBNAIL_API = 'https://img.youtube.com/vi';
export const GITHUB_OPENGRAPH_API = 'https://opengraph.githubassets.com/1';

const TITLE_MAX_LENGTH = 60;
const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const FILE_EXTENSIONS = /\.(csv|docx?|epub|json|key|pdf|pptx?|tar|tgz|txt|xlsx?|zip)$/i;
const DOCS_HOSTS = [ 'developer.mozilla.org', 'devdocs.io', 'docs.python.org', 'learn.microsoft.com', 'nodejs.org', 'react.dev', 'web.dev' ];

// Site-name suffixes that add noise to a title already labelled by its site.
const TITLE_SUFFIXES = [
  / - MDN Web Docs$/i,
  / \| MDN$/i,
  / - Wikipedia$/i,
  / - npm$/i,
  / · GitHub$/i,
  / - Stack Overflow$/i,
  / - YouTube$/i,
  / \/ X$/i
];

/**
 * Display rules per kind: the registry icon used when no favicon loads, the
 * badge label, and whether the brand icon should win over the site favicon.
 */
export const linkPreviewKinds = Object.freeze({
  'article': { 'icon': 'BookOpen', 'label': 'Article' },
  'docs': { 'icon': 'BookText', 'label': 'Docs' },
  'file': { 'icon': 'FileText', 'label': 'File' },
  'image': { 'icon': 'Image', 'label': 'Image' },
  'internal': { 'icon': 'LinkIcon', 'label': 'Post' },
  'package': { 'icon': 'Package', 'label': 'Package' },
  'repository': { 'icon': 'Github', 'label': 'Repository' },
  'social': { 'icon': 'Twitter', 'label': 'Post' },
  'video': { 'icon': 'Youtube', 'label': 'Video' },
  'website': { 'icon': 'Globe', 'label': 'Website' },
  'wikipedia': { 'icon': 'BookOpen', 'label': 'Wikipedia' }
});

const matchesHost = (hostname, domain) => hostname === domain || hostname.endsWith(`.${domain}`);

/** Parses an absolute URL; relative app paths resolve against a placeholder origin. */
export const parseLinkUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    return url.startsWith('/') ? new URL(url, 'https://internal.invalid') : new URL(url);
  } catch {
    return null;
  }
};

/** The bare hostname without `www.`, or the input when it cannot be parsed. */
export const getLinkHost = (url) => {
  const parsed = parseLinkUrl(url);

  if (!parsed || parsed.hostname === 'internal.invalid') return '';

  return parsed.hostname.replace(/^www\./, '');
};

/** Normalises favicon references: protocol-relative, root-relative and bare hosts. */
export const normalizeFaviconURL = (favicon) => {
  const value = String(favicon || '').trim();

  if (!value) return null;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return value;

  try {
    const faviconUrl = new URL(value.includes('://') ? value : `https://${value}`);

    return faviconUrl.protocol === 'http:' || faviconUrl.protocol === 'https:' ? faviconUrl.href : null;
  } catch {
    return null;
  }
};

/** Cleans a page title: GitHub repo titles, noisy site suffixes and a 60 character cap. */
export const formatLinkTitle = (title, url) => {
  if (!title) return getLinkHost(url) || url || '';

  // GitHub titles read "GitHub - owner/repo: description"
  if (title.startsWith('GitHub - ')) return title.substring('GitHub - '.length).split(':')[0].trim();

  let cleanTitle = title.trim();

  for (const suffix of TITLE_SUFFIXES) cleanTitle = cleanTitle.replace(suffix, '');

  return cleanTitle.length > TITLE_MAX_LENGTH ? `${cleanTitle.substring(0, TITLE_MAX_LENGTH - 3)}...` : cleanTitle;
};

/** YouTube video id from watch, embed, shorts and youtu.be URLs. */
export const getYouTubeVideoId = (url) => {
  const parsed = parseLinkUrl(url);

  if (!parsed) return '';

  const host = parsed.hostname.toLowerCase();

  if (matchesHost(host, 'youtu.be')) return parsed.pathname.slice(1).split('/')[0];
  if (!matchesHost(host, 'youtube.com')) return '';
  if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');

  const [ prefix, id ] = parsed.pathname.split('/').filter(Boolean);

  return [ 'embed', 'shorts', 'v', 'live' ].includes(prefix) && id ? id : '';
};

/**
 * Decides the kind of a link from its payload type and its URL. Payload types
 * set by the endpoint (`internal`, `repository`, `video`, `wikipedia`, `article`)
 * win; otherwise the host and path decide.
 */
export const detectLinkKind = (url, data = {}) => {
  const type = data?.type;
  const parsed = parseLinkUrl(url);
  const host = parsed?.hostname.toLowerCase() || '';
  const path = parsed?.pathname || '';

  if (type === 'internal') return 'internal';
  // App paths are internal pages unless they point at a static image or file.
  if (typeof url === 'string' && url.startsWith('/')) {
    if (type === 'image' || IMAGE_EXTENSIONS.test(path)) return 'image';
    if (type === 'file' || FILE_EXTENSIONS.test(path)) return 'file';

    return 'internal';
  }

  if (type === 'repository' || matchesHost(host, 'github.com')) return 'repository';
  if (type === 'video' || matchesHost(host, 'youtube.com') || matchesHost(host, 'youtu.be') || matchesHost(host, 'vimeo.com')) return 'video';
  if (type === 'social' || type === 'tweet' || matchesHost(host, 'x.com') || matchesHost(host, 'twitter.com') || matchesHost(host, 'bsky.app')) return 'social';
  if (type === 'wikipedia' || matchesHost(host, 'wikipedia.org')) return 'wikipedia';
  if (type === 'package' || matchesHost(host, NPM_HOSTNAME)) return 'package';
  if (type === 'image' || /^image\//.test(data?.contentType || '') || IMAGE_EXTENSIONS.test(path)) return 'image';
  if (type === 'file' || FILE_EXTENSIONS.test(path)) return 'file';
  if (type === 'docs' || DOCS_HOSTS.some((domain) => matchesHost(host, domain)) || host.startsWith('docs.') || matchesHost(host, 'readthedocs.io') || /^\/docs?(\/|$)/.test(path)) return 'docs';
  if (type === 'article' || matchesHost(host, 'medium.com') || matchesHost(host, 'substack.com') || matchesHost(host, 'dev.to') || data?.publishedTime || data?.author) return 'article';

  return 'website';
};

/**
 * The preview image for a link: the payload image, a platform image derived
 * from the URL (YouTube thumbnail, GitHub Open Graph card), the link itself for
 * images, and the screenshot service only when `screenshotFallback` is set.
 */
export const getPreviewImageUrl = (url, data, { screenshotFallback = true } = {}) => {
  if (data?.image) return data.image;

  const parsed = parseLinkUrl(url);

  if (!parsed) return null;
  if (url.startsWith('/')) return IMAGE_EXTENSIONS.test(parsed.pathname) ? url : null;

  const host = parsed.hostname.toLowerCase();
  const videoId = getYouTubeVideoId(url);

  if (videoId) return `${YOUTUBE_THUMBNAIL_API}/${videoId}/maxresdefault.jpg`;

  if (matchesHost(host, 'github.com')) {
    const [ owner, repo ] = parsed.pathname.split('/').filter(Boolean);

    if (owner && repo) return `${GITHUB_OPENGRAPH_API}/${owner}/${repo}`;
  }

  if (IMAGE_EXTENSIONS.test(parsed.pathname)) return parsed.href;

  // Wikipedia previews deliberately show their excerpt instead of a screenshot.
  if (matchesHost(host, 'wikipedia.org')) return null;

  return screenshotFallback ? `${MICROLINK_SCREENSHOT_API}?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url` : null;
};

/** Compact counts for repository and post stats: 1234 -> 1.2K. */
export const formatLinkCount = (value) => {
  const number = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;

  if (!Number.isFinite(number)) return typeof value === 'string' ? value : '';

  return new Intl.NumberFormat('en', { 'maximumFractionDigits': 1, 'notation': 'compact' }).format(number);
};

/** Seconds or ISO 8601 durations (PT1H2M3S) as 1:02:03; strings like "12:41" pass through. */
export const formatLinkDuration = (value) => {
  if (value === null || typeof value === 'undefined' || value === '') return '';

  let seconds = typeof value === 'number' ? value : null;
  const iso = typeof value === 'string' ? value.match(/^PT(?:(?<h>\d+)H)?(?:(?<m>\d+)M)?(?:(?<s>\d+)S)?$/) : null;

  if (iso) seconds = Number(iso.groups.h || 0) * 3600 + Number(iso.groups.m || 0) * 60 + Number(iso.groups.s || 0);
  if (seconds === null) return String(value);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => String(n).padStart(2, '0');

  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const siteFromHost = (host) => (host ? host.charAt(0).toUpperCase() + host.slice(1) : '');

const repositoryFromUrl = (parsed) => {
  const [ owner, repo ] = parsed?.pathname.split('/').filter(Boolean) || [];

  return owner && repo ? { owner, repo } : null;
};

const socialHandleFromUrl = (parsed) => {
  const [ handle, segment ] = parsed?.pathname.split('/').filter(Boolean) || [];

  if (!handle || [ 'i', 'home', 'search', 'explore' ].includes(handle)) return '';

  return segment === undefined || segment === 'status' || segment === 'post' ? `@${handle.replace(/^@/, '')}` : '';
};

const fileLabelFromUrl = (parsed) => {
  const match = parsed?.pathname.match(FILE_EXTENSIONS);

  return match ? match[1].toUpperCase() : 'File';
};

const metaItem = (id, text, icon, label) => (text ? { icon, id, label: label || text, text: String(text) } : null);

/**
 * Turns a preview payload into the display model shared by every LinkPreview variant.
 *
 * @param {Object|null} data - Raw preview payload from the app's preview endpoint or static `previewData`
 * @param {Object} [options]
 * @param {string} [options.url] - The link destination (required for kind detection)
 * @param {string} [options.title] - Link text that overrides the payload title for the visible link
 * @param {boolean} [options.screenshotFallback=false] - Use the screenshot service when no image is known
 * @param {string} [options.locale='en-US'] - Locale for dates
 * @returns {Object} The normalised preview: kind, status, title, description, image, favicon, site, author, date, meta, stats and tags
 */
export function normalizeLinkPreview(data, { url = data?.url || '', title, screenshotFallback = false, locale = 'en-US' } = {}) {
  const payload = data && typeof data === 'object' ? data : {};
  const parsed = parseLinkUrl(url);
  const kind = detectLinkKind(url, payload);
  const rules = linkPreviewKinds[kind];
  const host = getLinkHost(url);
  const internal = kind === 'internal';
  const failed = Boolean(payload.error);
  const status = failed ? Number(payload.status) || 0 : Number(payload.status) || 200;
  const unavailable = failed && UNAVAILABLE_STATUSES.includes(status);

  let rawTitle = payload.title || '';
  let description = payload.description || payload.summary || '';
  let image = failed || internal ? null : getPreviewImageUrl(url, payload, { screenshotFallback });
  let favicon = normalizeFaviconURL(payload.favicon);
  let author = payload.author || payload.channel || '';
  let label = rules.label;
  const stats = [];

  if (kind === 'repository') {
    const repository = repositoryFromUrl(parsed);

    if (repository && !rawTitle) rawTitle = `${repository.owner}/${repository.repo}`;
    if (repository && description === `${repository.owner}/${repository.repo} on GitHub`) description = '';
    author = author || repository?.owner || '';
    stats.push(
      metaItem('language', payload.language, 'Code'),
      metaItem('stars', payload.stars !== undefined ? formatLinkCount(payload.stars) : '', 'Star', payload.stars !== undefined ? `${formatLinkCount(payload.stars)} stars` : ''),
      metaItem('forks', payload.forks !== undefined ? formatLinkCount(payload.forks) : '', 'GitFork', payload.forks !== undefined ? `${formatLinkCount(payload.forks)} forks` : '')
    );
  }

  if (kind === 'social') {
    author = payload.author || socialHandleFromUrl(parsed);
    stats.push(
      metaItem('replies', payload.replies !== undefined ? formatLinkCount(payload.replies) : '', 'MessageCircle', payload.replies !== undefined ? `${formatLinkCount(payload.replies)} replies` : ''),
      metaItem('likes', payload.likes !== undefined ? formatLinkCount(payload.likes) : '', 'Heart', payload.likes !== undefined ? `${formatLinkCount(payload.likes)} likes` : '')
    );
  }

  if (kind === 'video') stats.push(metaItem('views', payload.views !== undefined ? `${formatLinkCount(payload.views)} views` : '', 'Eye'));

  if (kind === 'package') {
    const packageName = parsed?.pathname.match(/\/package\/(?<name>(?:@[^/]+\/)?[^/]+)/)?.groups?.name;

    rawTitle = rawTitle || packageName || 'npm package';
    favicon = favicon || NPM_FAVICON_URL;
    stats.push(metaItem('version', payload.version ? `v${payload.version}` : '', 'Tag'));
  }

  if (kind === 'image') image = payload.image || (url.startsWith('/') ? url : parsed?.href) || null;
  if (kind === 'file') label = fileLabelFromUrl(parsed);
  if (internal && payload.category) label = payload.category;

  const date = payload.publishedTime || payload.date || '';
  const formattedDate = date ? formatDate(date, locale) : '';
  const duration = formatLinkDuration(payload.duration);
  const siteName = payload.siteName || '';
  const site = internal ? siteName || 'Internal' : siteName || siteFromHost(host);
  const fullTitle = formatLinkTitle(rawTitle || title, url);
  const linkTitle = formatLinkTitle(title || rawTitle, url);
  const meta = [
    kind === 'video' ? metaItem('channel', author, 'User') : null,
    kind === 'article' ? metaItem('author', author, 'User') : null,
    metaItem('date', formattedDate, 'Calendar'),
    metaItem('readingTime', payload.readingTime, 'Clock'),
    metaItem('duration', duration, 'Play', duration ? `Duration ${duration}` : '')
  ].filter(Boolean);

  return {
    author,
    'date': date || null,
    description,
    duration,
    'embeddable': typeof payload.embeddable === 'boolean' ? payload.embeddable : typeof payload.frameable === 'boolean' ? payload.frameable : null,
    'errorMessage': failed ? payload.errorMessage || (typeof payload.error === 'string' ? payload.error : 'Preview unavailable') : '',
    'excerpt': payload.excerpt || '',
    favicon,
    'formattedDate': formattedDate,
    host,
    // Medium favicons render poorly at 16px, so its brand glyph wins.
    'icon': matchesHost(host, 'medium.com') ? 'Medium' : rules.icon,
    image,
    'imageAlt': payload.imageAlt || '',
    internal,
    kind,
    label,
    linkTitle,
    meta,
    'preferIcon': matchesHost(host, 'medium.com'),
    'readingTime': payload.readingTime || '',
    site,
    siteName,
    'stats': stats.filter(Boolean),
    'status': failed ? 'error' : 'ready',
    'summary': payload.summary || '',
    'tags': Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : [],
    'title': kind === 'wikipedia' && payload.articleName ? payload.articleName : fullTitle,
    unavailable,
    url,
    'videoId': kind === 'video' ? payload.videoId || getYouTubeVideoId(url) : ''
  };
}

/** True when a preview has anything worth a hover card beyond the link itself. */
export const hasLinkPreviewDetails = (preview) => Boolean(
  preview && preview.status === 'ready' && (
    preview.image ||
    preview.description ||
    preview.excerpt ||
    preview.date ||
    preview.readingTime ||
    preview.stats.length ||
    // External links always earn a card: the title, site and destination are the details.
    !preview.internal
  )
);
