'use client';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { stripNotationComments } from '../CodeBlockHighlight.jsx';
import { useCopyToClipboard } from '../../../../hooks/interaction/use-copy-to-clipboard.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  CodeBlockConfigContext,
  CodeBlockDocumentContext,
  CodeBlockHeaderContext,
  CodeBlockActionsContext,
  useInternalConfig
} from '../CodeBlockContext.jsx';
function CodeBlockCopyButton({
  value,
  timeout = 2e3,
  onCopy,
  onClick,
  onCopyError,
  labels,
  position = 'auto',
  alwaysVisible = false,
  className,
  variant = 'ghost',
  size,
  children,
  ...props
}) {
  const inHeader = useContext(CodeBlockHeaderContext);
  const [copyFailed, setCopyFailed] = useState(false);
  const resolvedPosition =
    position === 'auto' ? (inHeader ? 'inline' : 'pinned') : position;
  const resolvedSize =
    size ?? (resolvedPosition === 'inline' ? 'icon-sm' : 'icon');
  const { copy, isCopied: copied } = useCopyToClipboard({
    timeout,
    onCopy: (payload) => {
      setCopyFailed(false);
      onCopy?.(payload);
    },
    onError: () => {
      setCopyFailed(true);
      onCopyError?.(new Error('The clipboard is unavailable.'));
    }
  });
  const document_ = useContext(CodeBlockDocumentContext);
  const handleClick = useCallback((event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join('\n');
    const payload = stripNotationComments(value ?? fallback ?? '');
    void copy(payload);
  }, [value, document_, copy, onClick]);
  const copyLabel = copied ? (labels?.copied ?? 'Copied') : copyFailed ? (labels?.retry ?? 'Retry copy') : (labels?.copy ?? 'Copy code');
  const feedback = copied ? (labels?.copied ?? 'Code copied.') : copyFailed ? (labels?.error ?? 'Copy failed. Try again.') : '';
  return (
    <>
      <Button
        type='button'
        data-slot='code-block-copy'
        data-copied={copied || void 0}
        data-copy-failed={copyFailed || void 0}
        data-position={resolvedPosition}
        aria-label={copyLabel}
        title={copyLabel}
        variant={variant}
        size={resolvedSize}
        onClick={handleClick}
        className={cn(
          'shrink-0 [&_svg]:size-3.5',
          resolvedPosition ===
            'pinned' /* Physical `right`, not logical `end`: the code surface is forced
           dir="ltr", so in an RTL app the logical inset landed the button
           over the first characters instead of the trailing edge. */ &&
            'absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20',
          resolvedPosition === 'pinned' &&
            !alwaysVisible &&
            'opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100',
          className
        )}
        {...props}
      >
        {children ?? <RegistryIcon lucide={copied ? 'Check' : copyFailed ? 'CircleAlert' : 'Copy'} />}
      </Button>
      <span data-slot='code-block-copy-status' role='status' aria-live='polite' aria-atomic='true' className='sr-only'>{feedback}</span>
    </>
  );
}
function CodeBlockWrapToggle({
  className,
  children,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}) {
  const { wrap, setWrap } = useInternalConfig('CodeBlockWrapToggle');
  return (
    <Button
      type='button'
      data-slot='code-block-wrap-toggle'
      data-state={wrap ? 'on' : 'off'}
      aria-pressed={wrap}
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setWrap(!wrap);
      }}
      className={cn('shrink-0', className)}
      {...props}
    >
      {children ?? (wrap ? 'No wrap' : 'Wrap')}
    </Button>
  );
}
function CodeBlockExpandButton({
  className,
  children,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}) {
  const { expanded, setExpanded, collapsible, contentId } = useInternalConfig(
    'CodeBlockExpandButton'
  );
  if (!collapsible) return null;
  return (
    <div
      data-slot='code-block-expand'
      data-state={expanded ? 'expanded' : 'collapsed'}
      className={cn(
        // The surface reserves a row for this floating control in both states.
        'absolute inset-x-0 bottom-0 z-10 order-last flex items-end justify-center pt-10 pb-3',
        // Only hidden lines need a fade; expanded code remains fully readable.
        !expanded &&
          'from-ui-card via-ui-card/85 bg-gradient-to-t to-transparent',
        expanded && 'pointer-events-none',
        className
      )}
    >
      <Button
        type='button'
        className='pointer-events-auto'
        aria-expanded={expanded}
        aria-controls={contentId}
        variant={variant}
        size={size}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setExpanded(!expanded);
        }}
        {...props}
      >
        {children ?? (expanded ? 'Show less' : 'Show more')}
      </Button>
    </div>
  );
}
const LANGUAGE_EXTENSIONS = {
  bash: 'sh',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  css: 'css',
  diff: 'patch',
  docker: 'dockerfile',
  go: 'go',
  graphql: 'graphql',
  html: 'html',
  java: 'java',
  javascript: 'js',
  json: 'json',
  jsx: 'jsx',
  kotlin: 'kt',
  markdown: 'md',
  php: 'php',
  python: 'py',
  ruby: 'rb',
  rust: 'rs',
  sql: 'sql',
  swift: 'swift',
  toml: 'toml',
  tsx: 'tsx',
  typescript: 'ts',
  xml: 'xml',
  yaml: 'yaml'
};
function CodeBlockDownloadButton({
  value,
  filename,
  onDownload,
  onClick,
  position = 'auto',
  alwaysVisible = false,
  label,
  className,
  variant = 'ghost',
  size,
  children,
  ...props
}) {
  const context = useContext(CodeBlockConfigContext);
  const document_ = useContext(CodeBlockDocumentContext);
  const inHeader = useContext(CodeBlockHeaderContext);
  const resolvedPosition =
    position === 'auto' ? (inHeader ? 'inline' : 'pinned') : position;
  const resolvedSize =
    size ?? (resolvedPosition === 'inline' ? 'icon-sm' : 'icon');
  const handleClick = useCallback((event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join('\n');
    const payload = stripNotationComments(value ?? fallback ?? '');
    if (!payload || typeof window === 'undefined') return;
    const extension =
      LANGUAGE_EXTENSIONS[context?.resolvedLanguage ?? ''] ?? 'txt';
    const name = filename ?? `code.${extension}`;
    const url = URL.createObjectURL(
      new Blob([payload], { type: 'text/plain;charset=utf-8' })
    );
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
    onDownload?.(name);
  }, [value, filename, context, document_, onDownload, onClick]);
  return (
    <Button
      type='button'
      data-slot='code-block-download'
      data-position={resolvedPosition}
      aria-label={label ?? 'Download code'}
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
      className={cn(
        'shrink-0 [&_svg]:size-3.5',
        resolvedPosition === 'pinned' &&
          'absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20',
        resolvedPosition === 'pinned' &&
          !alwaysVisible &&
          'opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100',
        className
      )}
      {...props}
    >
      {children ?? (
        <RegistryIcon lucide='Download' />
      )}
    </Button>
  );
}
function CodeBlockLineActions({ children, side = 'end' }) {
  const registry = useContext(CodeBlockActionsContext);
  const owner = useRef({}).current;
  useEffect(() => {
    registry?.register(owner, children, side);
    return () => registry?.register(owner, null);
  }, [registry, owner, children, side]);
  return null;
}
export { CodeBlockCopyButton, CodeBlockWrapToggle, CodeBlockExpandButton, CodeBlockDownloadButton, CodeBlockLineActions };
