'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { CodeBlockHeaderContext, useInternalConfig } from '../CodeBlockContext.jsx';
function CodeBlockHeader({ className, ...props }) {
  return (
    <CodeBlockHeaderContext.Provider value={true}>
      <div
        data-slot='code-block-header'
        className={cn(
          'border-ui-border flex min-h-9 shrink-0 flex-wrap items-center gap-2 border-b px-3 py-0 text-sm',
          className
        )}
        {...props}
      />
    </CodeBlockHeaderContext.Provider>
  );
}
function CodeBlockTitle({ className, ...props }) {
  return (
    <div
      data-slot='code-block-title'
      className={cn(
        'text-ui-muted-foreground min-w-0 truncate font-mono text-xs',
        className
      )}
      {...props}
    />
  );
}
function CodeBlockLanguage({ className, children, ...props }) {
  const { language, resolvedLanguage } = useInternalConfig('CodeBlockLanguage');
  const label = children ?? resolvedLanguage ?? language;
  if (!label) return null;
  return (
    <span
      data-slot='code-block-language'
      data-unsupported={!resolvedLanguage || void 0}
      className={cn(
        'border-ui-border bg-ui-muted/60 text-ui-muted-foreground inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-xs leading-none',
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
}
export { CodeBlockHeader, CodeBlockTitle, CodeBlockLanguage };
