import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import { useEffect, useRef, useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import Typography from '../../src/foundations/Typography';
import { colors, motion, radii, shadows, tokens, typography } from '../../src/tokens';

import { HighlightedCode } from './HighlightedCode';
import { InlineText, Page, QuickLink } from './StoryDocs';

const scaleOrder = [ '50', '100', '200', '300', '500', '600', '700', '900' ];
const paletteFamilies = [ 'gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo' ];
const semanticGroups = [ 'accent', 'info', 'success', 'warning', 'danger', 'discovery', 'attention', 'text', 'surface', 'border' ];
const intentKeywords = {
  'accent': 'link primary action interactive selected',
  'attention': 'attention highlight important',
  'border': 'border divider outline stroke',
  'danger': 'danger error destructive failure',
  'discovery': 'discovery new beta feature',
  'info': 'info notice guidance',
  'success': 'success positive confirmation complete',
  'surface': 'surface background canvas card panel',
  'text': 'text body heading label muted',
  'warning': 'warning caution pending'
};
const relatedPaletteFamilies = {
  'accent': [ 'blue' ],
  'attention': [ 'amber', 'yellow' ],
  'border': [ 'gray', 'neutral' ],
  'danger': [ 'red', 'rose' ],
  'discovery': [ 'indigo' ],
  'info': [ 'blue' ],
  'success': [ 'green', 'teal' ],
  'surface': [ 'gray', 'neutral' ],
  'text': [ 'gray', 'neutral' ],
  'warning': [ 'amber', 'yellow' ]
};
const intentGuidance = {
  'accent': 'Use accent.DEFAULT for links and primary actions; use foreground on an accent surface and subtle or muted for low-emphasis backgrounds.',
  'attention': 'Use attention for content that needs emphasis without implying an error or warning.',
  'border': 'Use border roles for dividers and outlines; choose the variant that matches the surrounding surface contrast.',
  'danger': 'Use danger for destructive actions and errors; pair foreground with a danger surface and border with outlined states.',
  'discovery': 'Use discovery for new, beta, or exploratory features that are neither informational nor status feedback.',
  'info': 'Use info for neutral notices and guidance; reserve accent for interactive emphasis.',
  'success': 'Use success for completed or positive outcomes; use foreground on a success surface and border for outlined feedback.',
  'surface': 'Use surface roles for application backgrounds and raised panels; use raw neutrals only while defining the semantic role.',
  'text': 'Use text roles for copy and labels; select muted variants for supporting content rather than choosing a raw gray step.',
  'warning': 'Use warning for caution and pending risk; do not use it as a general highlight color.'
};
const searchableTokens = [
  ...semanticGroups.flatMap((group) => Object.entries(colors[group] || {}).map(([ name, value ]) => ({
    group,
    kind: 'Semantic',
    keywords: intentKeywords[group],
    name: `${group}.${name}`,
    value
  }))),
  ...paletteFamilies.flatMap((family) => scaleOrder.filter((step) => colors[family]?.[step]).map((step) => ({
    group: family,
    kind: 'Palette',
    keywords: 'raw chart graph visualization external data reference',
    name: `${family}.${step}`,
    value: colors[family][step]
  })))
];

const copyWithTextArea = (value) => {
  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
};

const CopyableToken = ({ children, className = '', label, value, ...rest }) => {
  const [ copyStatus, setCopyStatus ] = useState('idle');
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async() => {
    let didCopy = false;

    if (navigator.clipboard?.writeText)
      try {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      } catch {
        didCopy = false;
      }

    if (!didCopy)
      try {
        didCopy = copyWithTextArea(value);
      } catch {
        didCopy = false;
      }

    setCopyStatus(didCopy ? 'copied' : 'error');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyStatus('idle'), 1600);
  };

  const feedback = copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Retry copy' : 'Copy';

  return (
    <button
      type='button'
      className={ `group relative cursor-copy rounded-md text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${className}` }
      aria-label={ `${copyStatus === 'error' ? 'Retry copy' : 'Copy'} ${label || value}` }
      title={ `${copyStatus === 'error' ? 'Retry copy' : 'Copy'} ${label || value}` }
      onClick={ handleCopy }
      { ...rest }
    >
      {children}
      <span
        role='status'
        aria-live='polite'
        className={ `pointer-events-none absolute right-1.5 top-1.5 inline-flex min-h-6 min-w-6 items-center justify-center rounded border bg-white px-1.5 py-0.5 text-xs font-semibold shadow-sm dark:bg-gray-900 ${copyStatus === 'error' ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'}` }
      >
        {copyStatus === 'idle' ? <Copy aria-hidden='true' size={ 14 } /> : feedback}
      </span>
    </button>
  );
};

const Swatch = ({ name, value }) => (
  <CopyableToken value={ value } label={ name } className='block h-36 w-full overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
    <div className='h-16 border-b border-gray-100 dark:border-gray-800' style={{ 'backgroundColor': value }} />
    <div className='grid h-20 content-start gap-1 p-2'>
      <div className='truncate font-mono text-xs font-semibold leading-4 text-gray-900 dark:text-gray-100'>{name}</div>
      <div className='break-words font-mono text-xs leading-4 text-gray-500 dark:text-gray-400'>{value}</div>
    </div>
  </CopyableToken>
);

const RecommendedToken = ({ name, value }) => (
  <CopyableToken value={ value } label={ name } className='grid min-h-28 w-full overflow-hidden border-2 border-blue-500 bg-white dark:border-blue-400 dark:bg-gray-900 sm:grid-cols-[8rem_minmax(0,1fr)]'>
    <div className='min-h-20 border-b border-blue-200 dark:border-blue-800 sm:border-b-0 sm:border-r' style={{ 'backgroundColor': value }} />
    <div className='grid content-center gap-1 p-4 pr-12'>
      <div className='font-mono text-sm font-bold text-gray-950 dark:text-white'>{name}</div>
      <div className='break-words font-mono text-xs text-gray-600 dark:text-gray-300'>{value}</div>
      <div className='mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300'>Recommended starting point</div>
    </div>
  </CopyableToken>
);

const CompactToken = ({ name, value }) => (
  <CopyableToken value={ value } label={ name } className='flex min-h-14 min-w-0 w-full items-center gap-3 border-b border-gray-200 px-2 pr-12 dark:border-gray-800'>
    <span className='h-8 w-8 shrink-0 rounded-sm border border-black/10' style={{ 'backgroundColor': value }} />
    <span className='min-w-0'>
      <span className='block truncate font-mono text-xs font-semibold text-gray-900 dark:text-gray-100'>{name}</span>
      <span className='block truncate font-mono text-xs text-gray-500 dark:text-gray-400'>{value}</span>
    </span>
  </CopyableToken>
);

const TokenValue = ({ children, name, value }) => (
  <CopyableToken value={ value } label={ name } className='w-full rounded-md border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800'>
    {children}
  </CopyableToken>
);

const TokenFinder = () => {
  const [ query, setQuery ] = useState('');
  const [ showAll, setShowAll ] = useState(false);
  const [ showRawReferences, setShowRawReferences ] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/);
  const directMatches = normalizedQuery
    ? searchableTokens.filter(({ kind, keywords, name, value }) => {
      const searchableText = `${kind} ${keywords} ${name} ${value}`.toLowerCase();

      return queryTerms.every((term) => searchableText.includes(term));
    })
    : [];
  const semanticMatches = directMatches.filter(({ kind }) => kind === 'Semantic');
  const relatedFamilies = [ ...new Set(semanticMatches.flatMap(({ group }) => relatedPaletteFamilies[group] || [])) ];
  const paletteMatches = directMatches.filter(({ kind }) => kind === 'Palette');
  const relatedPaletteMatches = searchableTokens.filter(({ group, kind }) => kind === 'Palette' && relatedFamilies.includes(group));
  const rawMatches = [ ...new Map([ ...paletteMatches, ...relatedPaletteMatches ].map((token) => [ token.name, token ])).values() ];
  const rawReferencesHidden = semanticMatches.length > 0 && rawMatches.length > 0 && !showRawReferences;
  const availableRawMatches = rawReferencesHidden ? [] : rawMatches;
  const visibleSemanticMatches = showAll ? semanticMatches : semanticMatches.slice(0, 12);
  const visibleRawMatches = showAll ? availableRawMatches : availableRawMatches.slice(0, 12);
  const resultCount = semanticMatches.length + rawMatches.length;
  const availableResultCount = semanticMatches.length + availableRawMatches.length;
  const displayedResultCount = visibleSemanticMatches.length + visibleRawMatches.length;
  const hiddenResultCount = availableResultCount - displayedResultCount;
  const primaryGroup = semanticMatches[0]?.group;
  const primarySemanticMatch = semanticMatches.find(({ name }) => name === `${primaryGroup}.DEFAULT`) || semanticMatches[0];
  const contextualSemanticMatches = visibleSemanticMatches.filter(({ name }) => name !== primarySemanticMatch?.name);
  const resultMessage = normalizedQuery
    ? resultCount
      ? rawReferencesHidden
        ? `Showing 1 default choice and ${Math.max(semanticMatches.length - 1, 0)} contextual semantic variants. ${rawMatches.length} related palette values are hidden until requested.`
        : `${hiddenResultCount ? `Showing ${displayedResultCount} of ${availableResultCount}` : `Showing all ${availableResultCount}`} results: ${semanticMatches.length} recommended semantic tokens and ${rawMatches.length} related palette values.`
      : 'No tokens found. Try link, background, body text, success, or chart.'
    : 'Search by outcome: use link for clickable text, or chart for external data color.';

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label htmlFor='token-search' className='block text-sm font-semibold text-gray-900 dark:text-gray-100'>UI job, token name, or value</label>
        <div className='relative'>
          <input
            id='token-search'
            type='text'
            role='searchbox'
            inputMode='search'
            autoComplete='off'
            value={ query }
              onChange={ (event) => {
                setQuery(event.target.value);
                setShowAll(false);
                setShowRawReferences(false);
              } }
            placeholder='Try link, background, body text, success, or chart'
            className='min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 pr-12 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400'
          />
          {query ? (
            <button
              type='button'
              aria-label='Clear token search'
              title='Clear token search'
                onClick={ () => {
                  setQuery('');
                  setShowAll(false);
                  setShowRawReferences(false);
                } }
              className='absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-gray-800 dark:hover:text-white'
            >
              <X aria-hidden='true' size={ 18 } />
            </button>
          ) : null}
        </div>
        <p role='status' aria-label='Token search status' className='text-xs leading-6 text-gray-500 dark:text-gray-400'>{resultMessage}</p>
        {!normalizedQuery ? (
          <div aria-label='Popular token jobs' className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs'>
            <span className='font-semibold text-gray-500 dark:text-gray-400'>Popular</span>
            {[
              [ 'Backgrounds & panels', 'background' ],
              [ 'Body text & labels', 'body text' ],
              [ 'Interactive links', 'link' ],
              [ 'Status feedback', 'success' ]
            ].map(([ label, value ]) => (
              <button key={ value } type='button' onClick={ () => setQuery(value) } className='inline-flex min-h-11 items-center font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-300'>{label}</button>
            ))}
          </div>
        ) : null}
      </div>

      {normalizedQuery ? (
        resultCount ? (
          <div aria-label='Token search results' className='space-y-6'>
            {visibleSemanticMatches.length ? (
              <section aria-labelledby='recommended-token-results' className='space-y-3'>
                <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-200 pb-2 dark:border-gray-800'>
                  <h3 id='recommended-token-results' className='text-sm font-bold text-gray-950 dark:text-white'>Recommended semantic tokens</h3>
                  <span className='text-xs font-semibold text-green-700 dark:text-green-300'>Preferred contract</span>
                </div>
                {primaryGroup ? <p className='border-l-2 border-blue-500 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-950 dark:bg-blue-950 dark:text-blue-100'>{intentGuidance[primaryGroup]}</p> : null}
                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <h4 className='text-xs font-bold uppercase text-blue-700 dark:text-blue-300'>Default choice</h4>
                    {primarySemanticMatch ? <RecommendedToken name={ primarySemanticMatch.name } value={ primarySemanticMatch.value } /> : null}
                  </div>
                  {contextualSemanticMatches.length ? (
                    <div className='space-y-2'>
                      <h4 className='text-xs font-bold uppercase text-gray-500 dark:text-gray-400'>Contextual variants</h4>
                      <div className='grid gap-x-5 sm:grid-cols-2'>
                        {contextualSemanticMatches.map(({ name, value }) => <CompactToken key={ `Semantic-${name}` } name={ name } value={ value } />)}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            {rawReferencesHidden ? (
              <button
                type='button'
                onClick={ () => setShowRawReferences(true) }
                className='inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:border-blue-400 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-600 dark:hover:text-blue-300'
              >
                <ChevronDown aria-hidden='true' size={ 16 } />
                Show {rawMatches.length} related palette values
              </button>
            ) : null}
            {visibleRawMatches.length ? (
              <section aria-labelledby='related-palette-results' className='space-y-3'>
                <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-200 pb-2 dark:border-gray-800'>
                  <h3 id='related-palette-results' className='text-sm font-bold text-gray-950 dark:text-white'>Related palette values</h3>
                  <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Reference only</span>
                </div>
                <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                  {visibleRawMatches.map(({ name, value }) => <Swatch key={ `Palette-${name}` } name={ name } value={ value } />)}
                </div>
              </section>
            ) : null}
            {!visibleSemanticMatches.length && visibleRawMatches.length ? (
              <p className='text-sm leading-6 text-gray-600 dark:text-gray-300'>Raw values are shown for external visualization data and semantic-token definitions. Product UI should use a semantic role whenever one exists.</p>
            ) : null}
            {hiddenResultCount ? (
              <button
                type='button'
                onClick={ () => setShowAll(true) }
                className='inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:border-blue-400 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-600 dark:hover:text-blue-300'
              >
                <ChevronDown aria-hidden='true' size={ 16 } />
                Show all {availableResultCount} results
              </button>
            ) : null}
          </div>
        ) : (
          <div className='space-y-3 border-l-2 border-red-500 bg-red-50 p-4 text-sm text-red-950 dark:bg-red-950 dark:text-red-100'>
            <p><strong>No token matches “{query.trim()}”.</strong> Search by the UI job instead.</p>
            <div className='flex flex-wrap gap-2' aria-label='Token search recovery'>
              {[
                [ 'Search links', 'link' ],
                [ 'Search backgrounds', 'background' ],
                [ 'Search charts', 'chart' ]
              ].map(([ label, value ]) => (
                <button
                  key={ value }
                  type='button'
                  onClick={ () => setQuery(value) }
                  className='inline-flex min-h-11 items-center rounded-md border border-red-200 bg-white px-3 font-semibold text-red-800 hover:border-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 dark:border-red-800 dark:bg-gray-950 dark:text-red-200'
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

const Section = ({ children, collapsible = false, description, id, title, defaultOpen = false }) => {
  if (collapsible) return (
    <details id={ id } open={ defaultOpen } className='ds-guide-disclosure group scroll-mt-28 border-t border-gray-200 dark:border-gray-800'>
      <summary className='flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600'>
        <div className='space-y-2'>
          <Typography variant='heading-lg'>{title}</Typography>
          {description && <Typography variant='paragraph-md'><InlineText>{description}</InlineText></Typography>}
        </div>
        <span className='ds-guide-disclosure-action' aria-hidden='true'>
          <span className='ds-guide-disclosure-show'>Show</span>
          <span className='ds-guide-disclosure-hide'>Hide</span>
          <ChevronDown size={ 16 } />
        </span>
      </summary>
      <div className='pt-2'>{children}</div>
    </details>
  );

  return (
    <section id={ id } className='ds-guide-section scroll-mt-28 space-y-4'>
      <div className='space-y-2'>
        <Typography variant='heading-lg'>{title}</Typography>
        {description && <Typography variant='paragraph-md'><InlineText>{description}</InlineText></Typography>}
      </div>
      {children}
    </section>
  );
};

export default {
  parameters: { layout: 'fullscreen' },
  id: 'overview-colors-tokens',
  tags: [ '!autodocs' ],
  title: 'Colors & Tokens'
};

export const Default = {
  name: 'Colors & Tokens',
  play: async ({ canvasElement }) => {
    // Finder interactions belong in the test runner, not on guide navigation.
    if (import.meta.env.MODE !== 'test') return;

    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'UI job, token name, or value' });
    const grayFamily = canvasElement.querySelector('#palette-gray');
    const semanticReference = canvasElement.querySelector('#semantic-tokens');

    await expect(grayFamily).not.toHaveAttribute('open');
    await expect(semanticReference).toHaveAttribute('open');
    await expect(canvas.getByRole('button', { name: 'Copy accent.DEFAULT', exact: true })).toBeVisible();
    await userEvent.click(semanticReference.querySelector('summary'));
    await expect(semanticReference).not.toHaveAttribute('open');
    await userEvent.click(semanticReference.querySelector('summary'));
    await expect(semanticReference).toHaveAttribute('open');
    await userEvent.click(canvas.getByRole('button', { name: 'Body text & labels' }));
    await expect(search).toHaveValue('body text');
    const textResults = within(canvasElement.querySelector('[aria-label="Token search results"]'));
    await expect(textResults.getByRole('button', { name: 'Copy text.DEFAULT', exact: true })).toBeVisible();
    await expect(textResults.getByRole('button', { name: 'Copy text.muted', exact: true })).toBeVisible();
    await expect(textResults.queryByRole('heading', { name: 'Related palette values' })).not.toBeInTheDocument();
    for (const [ value, tokenName ] of [
      [ '  TEXT   BODY  ', 'text.DEFAULT' ],
      [ 'text.muted', 'text.muted' ],
      [ 'var(--ds-color-text)', 'text.DEFAULT' ]
    ]) {
      fireEvent.change(search, { target: { value } });
      await waitFor(() => {
        const results = within(canvasElement.querySelector('[aria-label="Token search results"]'));

        expect(results.getByRole('button', { name: `Copy ${tokenName}`, exact: true })).toBeVisible();
      });
    }
    fireEvent.change(search, { target: { value: 'body chart' } });
    await expect(canvas.getByText('No token matches “body chart”.')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear token search' }));
    fireEvent.change(search, { target: { value: 'link' } });
    await waitFor(() => expect(canvas.getByRole('status', { name: 'Token search status' })).toHaveTextContent(/default choice/));
    await expect(canvas.getByRole('heading', { name: 'Recommended semantic tokens' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Default choice' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Contextual variants' })).toBeInTheDocument();
    await expect(canvas.queryByRole('heading', { name: 'Related palette values' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show 8 related palette values' }));
    await expect(canvas.getByRole('heading', { name: 'Related palette values' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /Copy accent\./ }).length).toBeGreaterThan(0);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear token search' }));
    fireEvent.change(search, { target: { value: 'chart' } });
    await userEvent.click(canvas.getByRole('button', { name: 'Show all 80 results' }));
    await expect(canvas.getByRole('status', { name: 'Token search status' })).toHaveTextContent('Showing all 80 results');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear token search' }));
    fireEvent.change(search, { target: { value: 'not-a-token' } });
    await expect(canvas.getByText('No token matches “not-a-token”.')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Search links' }));
    await waitFor(() => expect(canvas.getByRole('status', { name: 'Token search status' })).toHaveTextContent('default choice'));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear token search' }));
    await expect(search).toHaveValue('');
    window.scrollTo(0, 0);
  },
  'render': () => (
    <Page
      title='Colors & Tokens'
      intro='The Gaudi token system keeps product color, typography, radius, shadow, and motion decisions bounded, semantic, and portable across the package, Storybook, and consuming applications.'
    >
      <Section
        id='find-a-token'
        title='Find a token'
        description='Describe the UI job or paste an implementation value. Results recommend semantic roles first and separate related raw references so the preferred choice stays clear.'
      >
        <TokenFinder />
      </Section>
      <Section
        collapsible
        defaultOpen
        id='semantic-tokens'
        title='Semantic tokens'
        description='Semantic names are the stable contract for product UI. Components should consume these instead of hard-coding palette names when the intent is surface, text, border, accent, status, or attention.'
      >
        <div className='grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4'>
          {semanticGroups.map((group) => (
            <section key={ group } id={ `semantic-${group}` } className='scroll-mt-28 border-t border-gray-200 pt-3 dark:border-gray-800'>
              <h3 className='mb-3 font-mono text-sm font-semibold'>{group}</h3>
              <div className='grid gap-2'>
                {Object.entries(colors[group]).map(([ name, value ]) => (
                  <CompactToken key={ `${group}-${name}` } name={ `${group}.${name}` } value={ value } />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section
        collapsible
        id='color-system'
        title='Palette reference'
        description='Raw palette values support semantic token definitions and external visualization data. Open only the family you need, then select a token to copy its complete value.'
      >
        <nav aria-label='Palette families' className='flex flex-wrap gap-x-4 gap-y-2 border-y border-gray-200 py-3 text-sm dark:border-gray-800'>
          {paletteFamilies.map((family) => (
            <a key={ family } href={ `#palette-${family}` } onClick={ () => { document.getElementById(`palette-${family}`).open = true; } } className='inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-blue-300'>
              {family}
            </a>
          ))}
        </nav>
        <div className='grid gap-2'>
          {paletteFamilies.map((family) => (
            <details key={ family } id={ `palette-${family}` } className='group scroll-mt-28 rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
              <summary className='flex min-h-11 cursor-pointer list-none items-center gap-3 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
                <span className='w-16 font-mono text-xs font-semibold uppercase text-gray-700 dark:text-gray-300'>{family}</span>
                <span className='flex flex-1 gap-1' aria-hidden='true'>
                  {scaleOrder.filter((step) => colors[family]?.[step]).map((step) => <span key={ step } className='h-4 flex-1 rounded-sm border border-black/5' style={{ 'backgroundColor': colors[family][step] }} />)}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>8 shades</span>
                <ChevronDown aria-hidden='true' size={ 16 } className='shrink-0 transition-transform group-open:rotate-180' />
              </summary>
              <div className='grid grid-cols-2 gap-2 border-t border-gray-200 p-3 sm:grid-cols-4 xl:grid-cols-8 dark:border-gray-800'>
                {scaleOrder.filter((step) => colors[family]?.[step]).map((step) => (
                  <Swatch key={ `${family}-${step}` } name={ `${family}.${step}` } value={ colors[family][step] } />
                ))}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section
        collapsible
        id='supporting-tokens'
        title='Supporting tokens'
        description='Non-color values are kept small and deliberate. They describe reusable product elements rather than one-off page decoration.'
      >
        <div className='grid gap-4 lg:grid-cols-4'>
          <div className='border-t border-gray-200 pt-4 dark:border-gray-800'>
            <div className='mb-3 font-semibold'>Radius</div>
            <div className='space-y-3'>
              {Object.entries(radii).map(([ name, value ]) => (
                <CopyableToken key={ name } value={ value } label={ `radii.${name}` } className='flex w-full items-center justify-between gap-4 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <div className='font-mono text-xs'>{name}</div>
                  <div className='h-10 w-24 border border-blue-500 bg-blue-50 dark:bg-blue-950' style={{ 'borderRadius': value }} />
                </CopyableToken>
              ))}
            </div>
          </div>
          <div className='border-t border-gray-200 pt-4 dark:border-gray-800'>
            <div className='mb-3 font-semibold'>Shadow</div>
            <div className='grid gap-3'>
              {Object.entries(shadows).map(([ name, value ]) => (
                <CopyableToken key={ name } value={ value } label={ `shadows.${name}` } className='block rounded-md border border-gray-100 bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-800' style={{ 'boxShadow': value }}>
                  <div className='font-mono text-xs'>{name}</div>
                </CopyableToken>
              ))}
            </div>
          </div>
          <div className='border-t border-gray-200 pt-4 dark:border-gray-800'>
            <div className='mb-3 font-semibold'>Motion</div>
            <div className='grid gap-3'>
              {Object.entries(motion.duration).map(([ name, value ]) => (
                <TokenValue key={ `motion-duration-${name}` } name={ `motion.duration.${name}` } value={ value }>
                  <div className='font-mono text-xs text-gray-900 dark:text-gray-100'>duration.{name}</div>
                  <div className='mt-1 font-mono text-xs text-gray-500 dark:text-gray-400'>{value}</div>
                </TokenValue>
              ))}
              {Object.entries(motion.ease).map(([ name, value ]) => (
                <TokenValue key={ `motion-ease-${name}` } name={ `motion.ease.${name}` } value={ value }>
                  <div className='font-mono text-xs text-gray-900 dark:text-gray-100'>ease.{name}</div>
                  <div className='mt-1 break-words font-mono text-xs text-gray-500 dark:text-gray-400'>{value}</div>
                </TokenValue>
              ))}
            </div>
          </div>
          <div className='border-t border-gray-200 pt-4 dark:border-gray-800'>
            <div className='mb-3 font-semibold'>Typography Tokens</div>
            <div className='grid gap-3'>
              {Object.entries(typography.fontFamily).map(([ name, value ]) => (
                <TokenValue key={ `font-${name}` } name={ `typography.fontFamily.${name}` } value={ value.join(', ') }>
                  <div className='font-mono text-xs text-gray-900 dark:text-gray-100'>fontFamily.{name}</div>
                  <div className='mt-1 break-words font-mono text-xs text-gray-500 dark:text-gray-400'>{value.join(', ')}</div>
                </TokenValue>
              ))}
              {Object.entries(typography.lineHeight).map(([ name, value ]) => (
                <TokenValue key={ `line-${name}` } name={ `typography.lineHeight.${name}` } value={ value }>
                  <div className='font-mono text-xs text-gray-900 dark:text-gray-100'>lineHeight.{name}</div>
                  <div className='mt-1 font-mono text-xs text-gray-500 dark:text-gray-400'>{value}</div>
                </TokenValue>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id='package-contract'
        title='Use in code'
        description='Consumers import tokens directly from the package. The same contract is used by the blog, Storybook, and consuming applications.'
      >
        <CopyableToken
          value={ `import { colors, motion, radii, shadows, tokens, typography } from '@gaudi/design-system/tokens';\n\nconst accent = colors.accent.DEFAULT;\nconst cardRadius = radii.card;\nconst stateDuration = motion.duration.state;\nconst tokenSnapshot = ${JSON.stringify(Object.keys(tokens), null, 2)};` }
          label='package token import example'
          className='block w-full'
        >
          <HighlightedCode
            copyable={ false }
            code={ `import { colors, motion, radii, shadows, tokens, typography } from '@gaudi/design-system/tokens';\n\nconst accent = colors.accent.DEFAULT;\nconst cardRadius = radii.card;\nconst stateDuration = motion.duration.state;\nconst tokenSnapshot = ${JSON.stringify(Object.keys(tokens), null, 2)};` }
            language='js'
          />
        </CopyableToken>
      </Section>

      <Section
        collapsible
        id='implementation-alignment'
        title='Use tokens across products'
        description='These docs are generated from the Gaudi token exports. The blog and applications consume the same package through Tailwind, CSS variables, and package imports.'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-md border border-gray-200 bg-white p-4 text-sm leading-7 dark:border-gray-700 dark:bg-gray-900'>
            <div className='mb-2 font-semibold'>What applications use</div>
            <ul className='list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300'>
              <li><code>tailwind.config.js</code> extends the Gaudi Tailwind preset.</li>
              <li><code>app/layout.js</code> imports <code>@gaudi/design-system/global.css</code> once.</li>
              <li><code>global.css</code> imports <code>styles.css</code>, so CSS variables and base rules come from the package.</li>
              <li>The dynamic Tailwind safelist is limited to these ten palette families and eight shades.</li>
            </ul>
          </div>
          <div className='rounded-md border border-gray-200 bg-white p-4 text-sm leading-7 dark:border-gray-700 dark:bg-gray-900'>
            <div className='mb-2 font-semibold'>What stays out</div>
            <ul className='list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-300'>
              <li>No app-root <code>css/overrides.css</code>.</li>
              <li>No copied Gaudi components or duplicate token system.</li>
              <li>No palette families outside the approved token list.</li>
              <li>Raw color values are reserved for token definitions and external data visualization values.</li>
            </ul>
          </div>
        </div>
      </Section>

      <nav aria-label='Continue from colors and tokens' className='space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800'>
        <div>
          <Typography variant='heading-lg'>Continue</Typography>
          <p className='mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>Apply the token contract to component states, or return to package setup.</p>
        </div>
        <div className='grid gap-3 sm:grid-cols-2'>
          <QuickLink title='States & Recovery' description='Apply semantic roles to loading, empty, error, success, and disabled states.' storyId='overview-states-recovery--default' />
          <QuickLink title='Getting Started' description='Review installation, package boundaries, imports, and troubleshooting.' storyId='overview-getting-started--default' />
        </div>
      </nav>
    </Page>
  )
};
