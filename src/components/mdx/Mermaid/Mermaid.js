'use client';

/**
 * Mermaid Diagram Component
 *
 * @description Renders Mermaid diagrams in MDX content with proper styling and error handling.
 * Supports client-side rendering with proper hydration handling.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useId, useState } from 'react';

import Icon from '../../core/Icon';
import { Alert, AlertTitle, AlertDescription } from '../../core/Banner';
import { CodeBlock } from '../../core/CodeBlock';
import Skeleton from '../../core/Skeleton';
import { cn } from '../../../utilities/cn';
import sanitizeHtml from '../../../utilities/sanitizeHtml';
import { observeTheme } from '../../../themes/observeTheme';

// Lazy load mermaid only when component is used
const loadMermaid = async() => {
  const { 'default': mermaid } = await import('mermaid/dist/mermaid.core.mjs');

  return mermaid;
};

const readDiagramTheme = (element) => {
  const styles = element.ownerDocument.defaultView.getComputedStyle(element);
  const getThemeColor = (name) => styles.getPropertyValue(name).trim() || 'currentColor';
  return {
    fontFamily: getThemeColor('--ds-font-sans'),
    background: getThemeColor('--ds-color-surface'),
    primaryColor: getThemeColor('--ds-color-mermaid-primary'),
    primaryTextColor: getThemeColor('--ds-color-mermaid-primary-text'),
    primaryBorderColor: getThemeColor('--ds-color-mermaid-primary-border'),
    secondaryColor: getThemeColor('--ds-color-mermaid-secondary'),
    secondaryTextColor: getThemeColor('--ds-color-text'),
    tertiaryColor: getThemeColor('--ds-color-mermaid-tertiary'),
    tertiaryTextColor: getThemeColor('--ds-color-text'),
    lineColor: getThemeColor('--ds-color-mermaid-line'),
    gridColor: getThemeColor('--ds-color-mermaid-grid'),
    sectionBkgColor: getThemeColor('--ds-color-mermaid-section-bg'),
    altSectionBkgColor: getThemeColor('--ds-color-mermaid-alt-section-bg')
  };
};

/**
 * Renders a Mermaid diagram from provided chart definition
 *
 * @param {Object} props - Component props
 * @param {string} props.chart - The mermaid chart definition
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.description] - Accessible text alternative
 * @param {string} [props.id] - Custom ID for the diagram
 * @returns {JSX.Element} Rendered Mermaid diagram
 *
 * @example
 * <Mermaid chart="graph TD; A-->B; B-->C;" description="A flows to B, then B flows to C." />
 */
const Mermaid = ({ chart, className, description = 'Diagram', id }) => {
  const generatedDescriptionId = useId();
  const descriptionId = id ? `${id}-description` : generatedDescriptionId;
  const [ svg, setSvg ] = useState('');
  const [ error, setError ] = useState('');
  const [ theme, setTheme ] = useState(null);
  const [ host, setHost ] = useState(null);

  useEffect(() => {
    if (!host) return undefined;
    // Mermaid bakes colors into SVG styles, so CSS theme changes need a fresh render.
    const updateTheme = () => {
      const next = readDiagramTheme(host);
      setTheme((current) => Object.keys(next).every((key) => current?.[key] === next[key]) ? current : next);
    };
    updateTheme();
    return observeTheme(host, updateTheme);
  }, [host]);

  // Effects only run in the browser, so the server render keeps the placeholder.
  useEffect(() => {
    setSvg('');
    setError('');
    if (!chart || !theme) return undefined;

    // Cancellation flag so a stale render never wins over a newer chart
    // and no setState happens after unmount.
    let cancelled = false;

    const renderDiagram = async() => {
      try {

        // Lazy load mermaid
        const mermaid = await loadMermaid();

        if (cancelled) return;

        // Initialize mermaid with configuration
        mermaid.initialize({
          'flowchart': {
            'curve': 'basis',
            'defaultRenderer': 'elk',
            'htmlLabels': true
          },
          'layout': 'elk',
          'securityLevel': 'loose',
          'suppressErrorRendering': true,
          'startOnLoad': false,
          'theme': 'base',
          'themeVariables': theme
        });

        const diagramId = id || `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const renderContainer = document.createElement('div');
        renderContainer.setAttribute('aria-hidden', 'true');
        renderContainer.style.left = '-9999px';
        renderContainer.style.position = 'absolute';
        renderContainer.style.top = '0';
        document.body.append(renderContainer);

        try {
          // Validate and render the diagram without letting Mermaid append fallback UI to <body>.
          const { 'svg': renderedSvg } = await mermaid.render(diagramId, chart, renderContainer);

          if (cancelled) return;

          const template = document.createElement('template');
          template.innerHTML = sanitizeHtml(renderedSvg, { 'allowStyleTags': true });
          const diagram = template.content.querySelector('svg');
          const width = diagram?.viewBox.baseVal.width;
          // Preserve the diagram's type size; narrow readers pan within this figure.
          if (Number.isFinite(width) && width > 0) diagram.style.minWidth = `${width}px`;
          setSvg(template.innerHTML);
          setError('');
        } finally {
          renderContainer.remove();
        }
      } catch {
        if (cancelled) return;

        setError('Failed to render diagram');
        setSvg('');
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [ chart, id, theme ]);

  if (!chart) return null;

  if (error)
    return (
      <Alert ref={setHost} variant='destructive' className={ cn('mermaid-error my-4', className) }>
        <Icon name='CircleAlert' decorative size='sm' />
        <AlertTitle>Mermaid Diagram Error: {error}</AlertTitle>
        <AlertDescription className='min-w-0 w-full'>
          <CodeBlock code={ chart } language='text' label='Diagram source' className='w-full' />
        </AlertDescription>
      </Alert>
    );

  // Placeholder for the server render and while Mermaid loads.
  if (!svg)
    return (
      <div ref={setHost} className={ cn('mermaid-loading my-4 space-y-2 rounded-lg bg-surface-muted p-6', className) }>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4' />
        <Skeleton className='h-4 w-5/6' />
      </div>
    );

  return (
    <figure
      ref={setHost}
      aria-labelledby={ descriptionId }
      className={ cn('mermaid-diagram my-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', className) }
      role='img'
      tabIndex={ 0 }
    >
      <div aria-hidden='true' dangerouslySetInnerHTML={{ '__html': svg }} />
      <figcaption id={ descriptionId } className='sr-only'>{description}</figcaption>
    </figure>
  );
};

export default Mermaid;
