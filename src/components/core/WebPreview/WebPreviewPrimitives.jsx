'use client';

/**
 * WebPreview parts
 *
 * @description A framed browser for showing a live page inside an interface:
 * back, forward and reload, an editable address bar, open in a new tab,
 * device widths, a sandboxed iframe with a loading state, an optional
 * console, and a link preview card when a site refuses to be framed.
 * Built on Gaudi parts.
 */

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import Button from '../Button';
import Icon from '../Icon';
import Pill from '../Pill';
import Loader from '../Loader';
import Tooltip from '../Tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Accordion/Collapsible.jsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../Input/InputGroup.jsx';
import { ToggleGroup, ToggleGroupItem } from '../ToggleGroup/ToggleGroupPrimitives.jsx';
import LinkPreview from '../LinkPreview/LinkPreview.jsx';
import {
  countWebPreviewLogs,
  createWebPreviewHistory,
  DEFAULT_WEB_PREVIEW_SANDBOX,
  formatWebPreviewUrl,
  normalizeWebPreviewUrl,
  pushWebPreviewHistory,
  stepWebPreviewHistory,
  webPreviewDevices
} from './webPreviewModel.js';

export const defaultWebPreviewLabels = Object.freeze({
  'address': 'Address',
  'back': 'Go back',
  'blocked': 'This page can’t be shown here',
  'body': 'Page preview',
  'blockedHint': 'The site doesn’t allow embedding. Open it in a new tab instead.',
  'console': 'Console',
  'consoleEmpty': 'No console output yet.',
  'devices': 'Preview width',
  'forward': 'Go forward',
  'invalid': 'Enter a web address such as example.com',
  'loading': 'Loading preview',
  'open': 'Open in new tab',
  'reload': 'Reload preview'
});

const WebPreviewContext = createContext(null);

/** Reads the nearest WebPreview; parts throw outside one so misuse fails loudly. */
export function useWebPreview() {
  const context = useContext(WebPreviewContext);

  if (!context) throw new Error('WebPreview parts must be rendered inside <WebPreviewRoot>.');

  return context;
}

/**
 * Owns the address, history, device and loading state.
 *
 * @param {Object} props
 * @param {string} [props.url] / [props.defaultUrl] - Controlled or initial address
 * @param {Function} [props.onUrlChange] - Called with each visited address
 * @param {'desktop'|'tablet'|'phone'} [props.device] / [props.defaultDevice='desktop'] - Controlled or initial width
 * @param {Function} [props.onDeviceChange] - Called with the chosen device
 * @param {Object} [props.labels] - Copy overrides, merged over defaultWebPreviewLabels
 */
function WebPreviewRoot({
  url: urlProp,
  defaultUrl = '',
  onUrlChange,
  device: deviceProp,
  defaultDevice = 'desktop',
  onDeviceChange,
  labels: labelsProp,
  className,
  children,
  ...props
}) {
  const [ url, setUrl ] = useControllableState({ 'defaultValue': defaultUrl, 'onChange': onUrlChange, 'value': urlProp });
  const [ device, setDevice ] = useControllableState({ 'defaultValue': defaultDevice, 'onChange': onDeviceChange, 'value': deviceProp });
  const [ history, setHistory ] = useState(() => createWebPreviewHistory(url));
  const pendingHistory = useRef(null);
  const [ reloadKey, setReloadKey ] = useState(0);
  const [ loading, setLoading ] = useState(Boolean(url));
  const labels = useMemo(() => ({ ...defaultWebPreviewLabels, ...labelsProp }), [ labelsProp ]);

  // Commit navigation only after the URL changes, so a controlled host can refuse it.
  useIsomorphicLayoutEffect(() => {
    const requestedHistory = pendingHistory.current;
    pendingHistory.current = null;
    setHistory((current) => requestedHistory?.entries[requestedHistory.index] === url
      ? requestedHistory
      : pushWebPreviewHistory(current, url));
    setLoading(Boolean(url));
  }, [ url ]);

  const navigate = useCallback((next) => {
    if (!next || next === url) return;
    pendingHistory.current = null;
    setUrl(next);
  }, [ setUrl, url ]);

  const step = useCallback((delta) => {
    const next = stepWebPreviewHistory(history, delta);

    if (next === history) return;
    pendingHistory.current = next;
    setUrl(next.entries[next.index]);
  }, [ history, setUrl ]);

  const value = useMemo(() => ({
    'back': () => step(-1),
    'canGoBack': history.index > 0,
    'canGoForward': history.index < history.entries.length - 1,
    device,
    'forward': () => step(1),
    labels,
    loading,
    navigate,
    'reload': () => {
      setLoading(true);
      setReloadKey((key) => key + 1);
    },
    reloadKey,
    setDevice,
    setLoading,
    url
  }), [ device, history, labels, loading, navigate, reloadKey, setDevice, step, url ]);

  return (
    <WebPreviewContext.Provider value={ value }>
      <div
        data-slot='web-preview'
        data-device={ device }
        className={ cn('ds-part-web-preview flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface text-text shadow-sm', className) }
        { ...props }
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
}

/** The toolbar row above the page. */
function WebPreviewNavigation({ className, children, ...props }) {
  return (
    <div
      role='toolbar'
      aria-label={ props['aria-label'] || 'Browser controls' }
      data-slot='web-preview-navigation'
      className={ cn('flex min-w-0 flex-wrap items-center gap-1 border-b border-border bg-surface-muted p-2 sm:flex-nowrap', className) }
      { ...props }
    >
      {children}
    </div>
  );
}

/** An icon button with a tooltip; the tooltip text is also its accessible name. */
function WebPreviewNavigationButton({ label, icon, className, children, ...props }) {
  return (
    <Tooltip content={ label }>
      <Button variant='ghost' tone='neutral' size='icon-sm' aria-label={ label } className={ cn('shrink-0', className) } { ...props }>
        {children || <Icon name={ icon } size='sm' decorative />}
      </Button>
    </Tooltip>
  );
}

/** Back, forward and reload, wired to the preview history. */
function WebPreviewHistoryButtons() {
  const { back, canGoBack, canGoForward, forward, labels, reload } = useWebPreview();

  return (
    <>
      <WebPreviewNavigationButton label={ labels.back } icon='ArrowLeft' onClick={ back } disabled={ !canGoBack } />
      <WebPreviewNavigationButton label={ labels.forward } icon='ArrowRight' onClick={ forward } disabled={ !canGoForward } />
      <WebPreviewNavigationButton label={ labels.reload } icon='RotateCw' onClick={ reload } />
    </>
  );
}

/**
 * The editable address bar. Enter visits the address (bare hosts get https://),
 * Escape restores the current one, and unusable input is flagged, not visited.
 */
function WebPreviewUrl({ className, readOnly = false, ...props }) {
  const { labels, navigate, url } = useWebPreview();
  const [ draft, setDraft ] = useState(formatWebPreviewUrl(url));
  const [ invalid, setInvalid ] = useState(false);
  const errorId = useId();

  useEffect(() => {
    setDraft(formatWebPreviewUrl(url));
    setInvalid(false);
  }, [ url ]);

  const secure = typeof url === 'string' && url.startsWith('https://');

  return (
    <form
      aria-label={ labels.address }
      data-slot='web-preview-url'
      className={ cn('relative min-w-0 flex-1 basis-full max-sm:order-last sm:basis-auto', className) }
      onSubmit={ (event) => {
        event.preventDefault();
        const next = normalizeWebPreviewUrl(draft);

        if (!next) {
          setInvalid(true);

          return;
        }
        setInvalid(false);
        navigate(next);
      } }
    >
      <InputGroup className='h-8 bg-surface'>
        <InputGroupAddon>
          <Icon name={ secure ? 'Lock' : 'Globe' } size='xs' decorative className='text-text-muted' />
        </InputGroupAddon>
        <InputGroupInput
          type='text'
          inputMode='url'
          autoComplete='off'
          autoCapitalize='off'
          spellCheck={ false }
          aria-label={ labels.address }
          aria-invalid={ invalid || undefined }
          aria-describedby={ invalid ? errorId : undefined }
          readOnly={ readOnly }
          value={ draft }
          onChange={ (event) => {
            setDraft(event.target.value);
            if (invalid) setInvalid(false);
          } }
          onKeyDown={ (event) => {
            if (event.key !== 'Escape') return;
            setDraft(formatWebPreviewUrl(url));
            setInvalid(false);
          } }
          onFocus={ (event) => event.target.select() }
          className='font-mono text-xs'
          { ...props }
        />
      </InputGroup>
      {invalid ? <p id={ errorId } role='alert' className='absolute top-full left-0 z-10 mt-1 rounded-sm bg-surface px-2 py-1 text-xs text-danger shadow-sm ring-1 ring-border'>{labels.invalid}</p> : null}
    </form>
  );
}

/** Opens the current address in a new tab; hidden for generated pages that have no real address. */
function WebPreviewOpenButton({ href }) {
  const { labels, url } = useWebPreview();
  const target = href ?? url;

  if (!target || !/^https?:\/\//.test(target)) return null;

  return (
    <Tooltip content={ labels.open }>
      <Button href={ target } variant='ghost' tone='neutral' size='icon-sm' aria-label={ labels.open } className='shrink-0'>
        <Icon name='ExternalLinkOutline' size='sm' decorative />
      </Button>
    </Tooltip>
  );
}

/** Desktop, tablet and phone widths as a single-choice toggle group. */
function WebPreviewDevices({ devices = Object.keys(webPreviewDevices), className }) {
  const { device, labels, setDevice } = useWebPreview();

  return (
    <ToggleGroup
      type='single'
      variant='outline'
      size='sm'
      spacing={ 0 }
      value={ device }
      onValueChange={ (next) => {
        if (next) setDevice(next);
      } }
      aria-label={ labels.devices }
      data-slot='web-preview-devices'
      className={ cn('shrink-0 bg-surface', className) }
    >
      {devices.map((name) => {
        const entry = webPreviewDevices[name];
        const label = entry.width ? `${entry.label} (${entry.width}px)` : entry.label;

        return (
          <Tooltip key={ name } content={ label }>
            <ToggleGroupItem value={ name } aria-label={ label }>
              <Icon name={ entry.icon } size='sm' decorative />
            </ToggleGroupItem>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
}

/**
 * The page itself: a sandboxed iframe at the chosen device width with a
 * loading overlay. Narrower viewports scroll inside the frame instead of the
 * page. When `embeddable` is false the frame is replaced by `fallback` or a
 * LinkPreview card for the address.
 *
 * @param {Object} props
 * @param {string} [props.title] - Accessible name of the iframe (defaults to "Preview of <url>")
 * @param {string|Function} [props.srcDoc] - Generated HTML, or (url) => HTML|null for multi-page previews
 * @param {string} [props.sandbox] - iframe sandbox tokens
 * @param {string} [props.allow] - iframe permissions policy
 * @param {boolean} [props.embeddable] - false shows the fallback instead of the frame
 * @param {React.ReactNode} [props.fallback] - Replaces the default LinkPreview fallback
 * @param {Object} [props.previewData] - Metadata for the fallback LinkPreview card
 * @param {string|Function|null} [props.endpoint] - Preview endpoint for the fallback card
 * @param {Function} [props.onLoad] - Called with the url after each load
 */
function WebPreviewBody({
  title,
  srcDoc,
  sandbox = DEFAULT_WEB_PREVIEW_SANDBOX,
  allow,
  embeddable = true,
  fallback,
  previewData,
  endpoint,
  onLoad,
  className,
  frameClassName
}) {
  const { device, labels, loading, reloadKey, setLoading, url } = useWebPreview();
  const width = webPreviewDevices[device]?.width;
  const html = typeof srcDoc === 'function' ? srcDoc(url) : srcDoc;
  const frameTitle = title || `Preview of ${formatWebPreviewUrl(url) || 'page'}`;
  const showFrame = embeddable !== false && (html || (url && url !== 'about:blank'));

  // Nothing to load means nothing to wait for.
  useEffect(() => {
    if (!showFrame) setLoading(false);
  }, [ setLoading, showFrame ]);

  return (
    // Focusable so the frame can be scrolled from the keyboard when a device width overflows it.
    <div
      role='region'
      aria-label={ labels.body }
      tabIndex={ 0 }
      data-slot='web-preview-body'
      aria-busy={ showFrame && loading ? 'true' : undefined }
      className={ cn('relative min-h-0 flex-1 overflow-auto bg-surface-muted focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:outline-none focus-visible:ring-inset', className) }
    >
      {showFrame ? (
        <div
          data-slot='web-preview-frame'
          // A browser canvas is white until the page paints its own background.
          className={ cn('mx-auto h-full min-h-72 bg-white transition-[width] duration-200 motion-reduce:transition-none', width ? 'shadow-md ring-1 ring-border' : 'w-full') }
          style={ width ? { 'width': `${width}px` } : undefined }
        >
          <iframe
            key={ `${reloadKey}:${url}` }
            title={ frameTitle }
            src={ html ? undefined : url }
            srcDoc={ html || undefined }
            sandbox={ sandbox }
            allow={ allow }
            referrerPolicy='no-referrer'
            loading='lazy'
            className={ cn('block size-full min-h-72 border-0', frameClassName) }
            onLoad={ () => {
              setLoading(false);
              onLoad?.(url);
            } }
          />
        </div>
      ) : embeddable === false ? (
        <div data-slot='web-preview-fallback' className='flex h-full min-h-72 flex-col items-center justify-center gap-4 p-6 text-center'>
          <div className='flex flex-col items-center gap-1'>
            <Icon name='AppWindow' size='lg' decorative className='text-text-subtle' />
            <p className='text-sm font-semibold'>{labels.blocked}</p>
            <p className='max-w-sm text-xs text-text-muted'>{labels.blockedHint}</p>
          </div>
          {fallback ?? (url ? <LinkPreview url={ url } variant='card' previewData={ previewData } endpoint={ endpoint } className='w-full max-w-md text-left' /> : null)}
        </div>
      ) : null}
      {showFrame && loading ? (
        <div className='absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]' data-slot='web-preview-loading'>
          <Loader label={ labels.loading } />
        </div>
      ) : null}
    </div>
  );
}

const logTones = {
  'error': { 'className': 'text-danger', 'icon': 'CircleX', 'row': 'bg-danger/5' },
  'info': { 'className': 'text-info', 'icon': 'Info', 'row': '' },
  'log': { 'className': 'text-text-muted', 'icon': 'ChevronRight', 'row': '' },
  'warn': { 'className': 'text-warning', 'icon': 'TriangleAlert', 'row': 'bg-warning/5' }
};

const toLogDate = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatLogTime = (timestamp) => {
  const date = toLogDate(timestamp);

  return date ? date.toLocaleTimeString('en-GB', { 'hour': '2-digit', 'minute': '2-digit', 'second': '2-digit' }) : String(timestamp);
};

/**
 * Console output under the page: a disclosure whose toggle counts errors and
 * warnings, and a `role="log"` list. Logs come from the host (for example from
 * postMessage); the preview never reads the framed page.
 *
 * @param {Object} props
 * @param {Array<{ level?: 'log'|'info'|'warn'|'error', message: string, timestamp?: string|number|Date }>} props.logs
 * @param {boolean} [props.defaultOpen=false] / [props.open] / [props.onOpenChange]
 */
function WebPreviewConsole({ logs = [], defaultOpen = false, open, onOpenChange, className }) {
  const { labels } = useWebPreview();
  const counts = countWebPreviewLogs(logs);

  return (
    <Collapsible defaultOpen={ defaultOpen } open={ open } onOpenChange={ onOpenChange } data-slot='web-preview-console' className={ cn('border-t border-border bg-surface', className) }>
      <CollapsibleTrigger asChild>
        <button
          type='button'
          className='group/console flex w-full flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-left text-xs font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:outline-none focus-visible:ring-inset'
        >
          <Icon name='Terminal' size='xs' decorative />
          <span>{labels.console}</span>
          <span>({counts.total})</span>
          {counts.error ? <Pill tone='red' variant='soft' size='xs' radius='md' className='my-1 mr-1'>{counts.error} {counts.error === 1 ? 'error' : 'errors'}</Pill> : null}
          {counts.warn ? <Pill tone='amber' variant='soft' size='xs' radius='md' className='my-1 mr-1'>{counts.warn} {counts.warn === 1 ? 'warning' : 'warnings'}</Pill> : null}
          <Icon name='ChevronDown' size='xs' decorative className='ml-auto transition-transform group-data-[state=open]/console:rotate-180 motion-reduce:transition-none' />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {logs.length ? (
          <div role='log' aria-label={ `${labels.console} output` } tabIndex={ 0 } className='max-h-32 overflow-auto sm:max-h-48 border-t border-border font-mono text-xs focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:outline-none focus-visible:ring-inset'>
            <ol>
            {logs.map((log, index) => {
              const level = log.level === 'warning' ? 'warn' : log.level || 'log';
              const tone = logTones[level] || logTones.log;

              return (
                <li key={ log.id ?? index } className={ cn('flex items-start gap-2 border-b border-border/60 px-3 py-1.5 last:border-b-0', tone.row) }>
                  <Icon name={ tone.icon } size='xs' decorative className={ cn('mt-0.5', tone.className) } />
                  <span className='sr-only'>{level}:</span>
                  <span className={ cn('min-w-0 flex-1 break-words whitespace-pre-wrap', level === 'error' ? 'text-danger' : 'text-text') }>{log.message}</span>
                  {log.timestamp ? <time className='shrink-0 text-text-muted' dateTime={ toLogDate(log.timestamp)?.toISOString() }>{formatLogTime(log.timestamp)}</time> : null}
                </li>
              );
            })}
            </ol>
          </div>
        ) : (
          <p className='border-t border-border px-3 py-2 text-xs text-text-muted'>{labels.consoleEmpty}</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export {
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewDevices,
  WebPreviewHistoryButtons,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewOpenButton,
  WebPreviewRoot,
  WebPreviewUrl
};
