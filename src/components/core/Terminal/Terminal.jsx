'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';

/*
 * The dark and translucent terminals scope the dark theme (`dark`), so every token inside, from the text to the
 * output tones, resolves to its dark value on the code surface whatever the page theme is.
 */
export const terminalVariants = createVariants({
  'base': 'overflow-hidden border border-border text-text shadow-sm',
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md',
    'variant': 'dark'
  },
  'variants': {
    'radius': {
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'none': 'rounded-none',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'max-w-4xl text-sm',
      'md': 'max-w-3xl text-sm',
      'sm': 'max-w-2xl text-xs'
    },
    'variant': {
      'dark': 'dark bg-(--ds-color-code-block-bg)',
      'light': 'bg-surface',
      'translucent': 'dark bg-(--ds-color-code-block-bg)/90 backdrop-blur'
    }
  }
});

export const terminalBodyVariants = createVariants({
  'base': 'overflow-auto p-4 font-mono leading-6 [tab-size:2]',
  'defaultVariants': {
    'size': 'md'
  },
  'variants': {
    'size': {
      'lg': 'min-h-[22rem] max-h-[32rem] text-sm',
      'md': 'min-h-[18rem] max-h-[28rem] text-sm',
      'sm': 'min-h-[14rem] max-h-[22rem] text-xs'
    }
  }
});

export const terminalLineVariants = createVariants({
  'base': 'flex min-w-0 items-start gap-2 leading-6',
  'defaultVariants': {
    'tone': 'default'
  },
  'variants': {
    'tone': {
      'default': 'text-text',
      'error': 'text-danger',
      'muted': 'text-text-muted',
      'success': 'text-success',
      'warning': 'text-warning'
    }
  }
});

const defaultCommands = [
  {
    'command': 'pnpm add github:ahmadassaf/design-system',
    'output': [
      { 'text': 'Packages resolved and linked.', 'tone': 'success' },
      { 'text': 'Design system ready.' }
    ]
  },
  {
    'command': 'pnpm test',
    'output': [{ 'text': 'All checks passed.', 'tone': 'success' }]
  }
];

const isCommandObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

const normalizeCommands = (commands, outputs = {}) => commands.map((item, index) => {
  if (isCommandObject(item))
    return {
      'command': item.command || '',
      'output': item.output || outputs[index] || [],
      'tone': item.tone
    };

  return {
    'command': item,
    'output': outputs[index] || []
  };
});

const normalizeOutput = (output) => {
  if (!Array.isArray(output)) return [];

  return output.map((line) => {
    if (isCommandObject(line)) return line;

    return { 'text': line };
  });
};

const HighlightedCommand = ({ command }) => {
  const parts = command.match(/\s+|\S+/gu) || [];

  return parts.map((part, index) => {
    if (!part.trim()) return <span key={ `${part}-${index}` }>{part}</span>;

    const className = cn(
      index === 0 && 'text-success',
      part.startsWith('-') && 'text-warning',
      (part.startsWith('.') || part.startsWith('/') || part.includes('/')) && 'text-accent',
      (part.startsWith('"') || part.startsWith("'")) && 'text-info',
      part.includes('=') && 'text-discovery'
    );

    return <span key={ `${part}-${index}` } className={ className || undefined }>{part}</span>;
  });
};

const Cursor = ({ visible }) => (
  <span
    aria-hidden='true'
    className={ cn('ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-current motion-safe:animate-pulse', !visible && 'hidden') }
  />
);

const WindowControls = ({ className }) => (
  <div className={ cn('flex items-center gap-2', className) } aria-hidden='true'>
    <span className='size-3 rounded-full bg-danger' />
    <span className='size-3 rounded-full bg-warning' />
    <span className='size-3 rounded-full bg-success' />
  </div>
);

const Terminal = ({
  ariaLabel = 'Terminal',
  className,
  classNames = {},
  commands = defaultCommands,
  delayBetweenCommands = 700,
  initialDelay = 400,
  promptSymbol = '$',
  radius,
  showHeader = true,
  size,
  title = 'terminal',
  typingSpeed = 35,
  username = 'ahmad',
  variant,
  animate = true,
  outputs = {}
}) => {
  const normalizedCommands = useMemo(() => normalizeCommands(commands, outputs), [ commands, outputs ]);
  const [ commandIndex, setCommandIndex ] = useState(0);
  const [ typedLength, setTypedLength ] = useState(0);
  const [ completedCount, setCompletedCount ] = useState(animate ? 0 : normalizedCommands.length);
  const reduceMotion = usePrefersReducedMotion();
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!animate || reduceMotion) {
      setCommandIndex(normalizedCommands.length - 1);
      setTypedLength(normalizedCommands.at(-1)?.command.length || 0);
      setCompletedCount(normalizedCommands.length);

      return undefined;
    }

    if (!normalizedCommands.length) return undefined;

    const currentCommand = normalizedCommands[commandIndex]?.command || '';
    const isTyping = typedLength < currentCommand.length;
    let delay = delayBetweenCommands;

    if (isTyping) delay = typingSpeed;
    if (commandIndex === 0 && typedLength === 0) delay = initialDelay;

    const timer = window.setTimeout(() => {
      if (isTyping) {
        setTypedLength((value) => value + 1);

        return;
      }

      setCompletedCount((value) => Math.max(value, commandIndex + 1));

      if (commandIndex < normalizedCommands.length - 1) {
        setCommandIndex((value) => value + 1);
        setTypedLength(0);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [ animate, commandIndex, delayBetweenCommands, initialDelay, normalizedCommands, reduceMotion, typedLength, typingSpeed ]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ 'behavior': reduceMotion ? 'auto' : 'smooth', 'top': bodyRef.current.scrollHeight });
  }, [ completedCount, reduceMotion, typedLength ]);

  const visibleCommands = normalizedCommands.slice(0, Math.max(completedCount, commandIndex + 1));

  if (!normalizedCommands.length) return null;

  return (
    <section
      aria-label={ ariaLabel }
      className={ terminalVariants({ 'className': cn(className, classNames.root), radius, size, variant }) }
    >
      {showHeader ? (
        <div className={ cn('flex items-center gap-3 border-b border-border px-4 py-3', classNames.header) }>
          <WindowControls className={ classNames.controls } />
          <p className={ cn('min-w-0 truncate text-xs font-medium text-text-muted', classNames.title) }>
            {title}
          </p>
        </div>
      ) : null}

      <pre
        ref={ bodyRef }
        className={ terminalBodyVariants({ 'className': classNames.body, size }) }
      >
        <code>
          {visibleCommands.map((item, index) => {
            const isActive = index === commandIndex && completedCount <= index;
            const command = isActive && animate && !reduceMotion ? item.command.slice(0, typedLength) : item.command;
            const showOutput = completedCount > index || !animate || reduceMotion;

            return (
              <span key={ `${item.command}-${index}` } className='block'>
                <span className={ terminalLineVariants({ 'className': classNames.line, 'tone': item.tone }) }>
                  <span className={ cn('shrink-0 text-accent', classNames.prompt) }>{username}</span>
                  <span className='shrink-0 text-text-muted'>{promptSymbol}</span>
                  <span className={ cn('min-w-0 whitespace-pre-wrap break-words', classNames.command) }>
                    <HighlightedCommand command={ command } />
                    <Cursor visible={ isActive } />
                  </span>
                </span>

                {showOutput ? normalizeOutput(item.output).map((line, outputIndex) => (
                  <span
                    key={ `${item.command}-output-${outputIndex}` }
                    className={ terminalLineVariants({ 'className': classNames.output, 'tone': line.tone }) }
                  >
                    <span className='whitespace-pre-wrap break-words'>{line.text}</span>
                  </span>
                )) : null}
              </span>
            );
          })}
        </code>
      </pre>
    </section>
  );
};

export default Terminal;
