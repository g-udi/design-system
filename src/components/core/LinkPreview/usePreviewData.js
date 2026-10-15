'use client';

/**
 * usePreviewData
 *
 * @description Client data layer for LinkPreview. It calls the consuming app's
 * preview endpoint (Gaudi never fetches third-party pages itself) with an
 * LRU + TTL cache, in-flight request deduplication, a timeout, and a
 * stale-response guard. The endpoint comes from the `endpoint` option, then
 * `SiteConfigProvider preview={{ endpoint }}`. There is no default: with no
 * endpoint configured nothing is fetched and links render from `previewData`
 * or as plain links.
 */

import { useEffect, useState } from 'react';

import { useSiteConfig } from '../../../context/SiteConfig.jsx';
import { NPM_HOSTNAME } from './linkPreviewData.js';
import { getCached, pendingRequests, resolvePreviewRequest, setCached } from './previewCache.js';

const getHostnameFallback = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

/** Fetches preview metadata; returns data or an error-shaped object, throws on network failure. */
const fetchPreviewData = async(requestUrl, url, timeout) => {
  const controller = new AbortController();
  const safeTimeout = Number.isFinite(timeout) && timeout > 0 ? timeout : 20000;
  const timeoutId = setTimeout(() => controller.abort(), safeTimeout);

  try {
    const response = await fetch(requestUrl, {
      'cache': url.startsWith('/') ? 'no-store' : 'force-cache',
      'signal': controller.signal
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        const parsed = typeof errorData === 'string' ? JSON.parse(errorData) : errorData;

        errorMessage = parsed.error || errorMessage;
      } catch {

        // Keep the default message if the error body isn't parseable
      }

      return { 'error': true, errorMessage, 'status': response.status };
    }

    const parsedData = await response.json();

    if (!parsedData || typeof parsedData !== 'object') return { 'error': true, 'errorMessage': 'Preview response was empty', 'status': 502 };

    if (parsedData.error) return {
      'error': true,
      'errorMessage': parsedData.errorMessage || 'Failed to fetch preview',
      'status': parsedData.status || 404
    };

    return parsedData;
  } finally {
    clearTimeout(timeoutId);
  }
};

const withTitle = (data, customTitle) => (customTitle ? { ...data, 'title': customTitle } : data);

/** The endpoint a component should call: explicit option, then SiteConfig; null (no fetching) otherwise. */
export function usePreviewEndpoint(endpoint) {
  const config = useSiteConfig();

  if (endpoint !== undefined) return endpoint;

  return config?.preview?.endpoint ?? null;
}

/**
 * The app's image setting for links without an image (a resolver function or a
 * template map): explicit option, then SiteConfig; null (no derived images) otherwise.
 */
export function usePreviewImageResolver(resolveImage) {
  const config = useSiteConfig();

  if (resolveImage !== undefined) return resolveImage ?? null;

  return config?.preview?.resolveImage ?? null;
}

/**
 * Fetches preview metadata for a URL.
 *
 * @param {string} url - The link destination
 * @param {string} [customTitle] - Link text that overrides the fetched title
 * @param {Object} [options]
 * @param {Object} [options.previewData] - Static metadata; skips fetching
 * @param {boolean} [options.skip] - Resolve a local placeholder without fetching
 * @param {number} [options.timeout=20000] - Request timeout in milliseconds
 * @param {string|Function|null} [options.endpoint] - Preview endpoint; defaults to SiteConfig preview.endpoint, and nothing is fetched without one
 * @returns {{ data: Object|null, error: Error|null, loading: boolean }}
 */
export function usePreviewData(url, customTitle, options = {}) {
  const { previewData = null, skip = false, timeout = 20000 } = options;
  const endpoint = usePreviewEndpoint(options.endpoint);
  // Resolved during render so an inline endpoint function never retriggers the effect.
  const requestUrl = resolvePreviewRequest(endpoint, url);
  const [ state, setState ] = useState(() => (previewData
    ? { 'data': withTitle(previewData, customTitle), 'error': null, 'loading': false }
    : { 'data': null, 'error': null, 'loading': Boolean(requestUrl && !skip) }));

  useEffect(() => {

    // Synchronous resolutions: no fetch needed
    if (previewData) {
      setState({ 'data': withTitle(previewData, customTitle), 'error': null, 'loading': false });

      return undefined;
    }

    if (skip) {
      setState({ 'data': { 'siteName': 'Internal', 'title': customTitle || url, 'type': 'internal' }, 'error': null, 'loading': false });

      return undefined;
    }

    if (!url) {
      setState({ 'data': null, 'error': null, 'loading': false });

      return undefined;
    }

    // Synthesize npm package previews instead of fetching (npmjs.com rejects metadata requests)
    if (url.includes(NPM_HOSTNAME)) {
      const packageMatch = url.match(/npmjs\.com\/package\/(?<packageName>[^/?#]+)/);

      setState({
        'data': { 'siteName': 'npm', 'title': customTitle || packageMatch?.groups?.packageName || 'npm package', 'type': 'package' },
        'error': null,
        'loading': false
      });

      return undefined;
    }

    // No endpoint: the link renders as a plain link without enrichment.
    if (!requestUrl) {
      setState({ 'data': null, 'error': null, 'loading': false });

      return undefined;
    }

    const cached = getCached(requestUrl);

    if (cached) {
      setState({ 'data': withTitle(cached, customTitle), 'error': null, 'loading': false });

      return undefined;
    }

    // Stale-response guard: a slow response for a previous url can't overwrite the current one
    let active = true;

    setState({ 'data': null, 'error': null, 'loading': true });

    const run = async() => {
      let request = pendingRequests.get(requestUrl);

      if (!request) {
        request = fetchPreviewData(requestUrl, url, timeout);
        pendingRequests.set(requestUrl, request);
        request.finally(() => pendingRequests.delete(requestUrl)).catch(() => {});
      }

      try {
        const result = await request;

        if (!active) return;

        setCached(requestUrl, result);

        const resolvedTitle = result.error ? { 'title': customTitle || getHostnameFallback(url) } : {};

        setState({ 'data': { ...withTitle(result, customTitle), ...resolvedTitle }, 'error': null, 'loading': false });
      } catch (err) {
        if (!active) return;

        const errorData = {
          'error': true,
          'errorMessage': err?.message || 'Failed to fetch preview',
          'status': err?.status || 404,
          'title': customTitle || getHostnameFallback(url)
        };

        // Cache error responses (short TTL) to prevent retry loops
        setCached(requestUrl, errorData);

        setState({
          'data': errorData,
          'error': err?.name !== 'AbortError' && !String(err?.message || '').includes('HTTP') ? err : null,
          'loading': false
        });
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [ url, customTitle, previewData, skip, timeout, requestUrl ]);

  return state;
}

export default usePreviewData;
