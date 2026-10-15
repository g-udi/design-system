/*
 * Server-safe preview request model: the shared LRU + TTL cache, in-flight request map and request
 * URL builder. Kept out of the client hook so these helpers stay callable outside client components.
 */

const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 3600000; // 1 hour
const ERROR_CACHE_TTL = 60000; // Retry failed URLs after 1 minute

const previewCache = new Map();
export const pendingRequests = new Map();

export const getCached = (key) => {
  const entry = previewCache.get(key);

  if (!entry) return null;

  if (Date.now() - entry.timestamp > (entry.data.error ? ERROR_CACHE_TTL : CACHE_TTL)) {
    previewCache.delete(key);

    return null;
  }

  // Refresh recency (LRU)
  previewCache.delete(key);
  previewCache.set(key, entry);

  return entry.data;
};

export const setCached = (key, data) => {
  if (previewCache.size >= CACHE_MAX_SIZE) previewCache.delete(previewCache.keys().next().value);

  previewCache.set(key, { data, 'timestamp': Date.now() });
};

/** Clears cached previews, for tests and for apps that change endpoints at runtime. */
export const clearPreviewCache = () => {
  previewCache.clear();
  pendingRequests.clear();
};

/**
 * Builds the request URL for a link. A string endpoint receives `?url=`; a
 * function endpoint returns the full request URL itself.
 */
export const resolvePreviewRequest = (endpoint, url) => {
  if (!endpoint || !url) return null;
  if (typeof endpoint === 'function') return endpoint(url) || null;

  return `${endpoint}${endpoint.includes('?') ? '&' : '?'}url=${encodeURIComponent(url)}`;
};
