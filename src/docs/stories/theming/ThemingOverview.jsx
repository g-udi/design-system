import { Children, Fragment } from 'react';
import { Markdown } from '@storybook/addon-docs/blocks';
import Button from '../../../components/core/Button';
import Pill from '../../../components/core/Pill';
import { CodeBlock, Page, QuickLink, Section, Table, Td, Th } from '../../components/StoryDocs';
import { COLOR_GROUPS, FONT_TOKENS, SHADOW_TOKENS } from '../../../themes/contract.js';
import { checkContrast } from '../../../themes/contrast.js';
import { themePresets } from '../../../themes/presets.js';
// The prose is THEMING.md itself, so this page cannot drift from the written contract.
import theming from '../../../tokens/THEMING.md?raw';

export const THEME_STUDIO_ID = 'theming-theme-studio--studio';

/** Splits THEMING.md into its title, intro and `##` sections (each with its `###` subsections). */
function parseTheming(markdown) {
  const [ head, ...chunks ] = markdown.split(/^## /m);
  const title = /^# (.+)$/m.exec(head)?.[1] || 'Theming';
  const sections = chunks.map((chunk) => {
    const newline = chunk.indexOf('\n');
    const [ body, ...subsections ] = chunk.slice(newline + 1).split(/^(?=### )/m);
    return { title: chunk.slice(0, newline).trim(), body, subsections };
  });
  return { title, intro: head.replace(/^# .+$/m, '').trim(), sections };
}

const CodeFence = ({ children }) => {
  const code = Children.only(children);
  const language = /lang-(\w+)/.exec(code.props.className || '')?.[1] || 'text';
  return <CodeBlock code={ String(code.props.children).trimEnd() } language={ language } />;
};

const markdownOptions = {
  forceBlock: true,
  wrapper: Fragment,
  overrides: {
    pre: CodeFence,
    table: ({ children }) => <Table label='THEMING.md table'>{children}</Table>,
    th: ({ children }) => <Th>{children}</Th>,
    td: ({ children }) => <Td>{children}</Td>
  }
};

const Prose = ({ children }) => (children.trim() ? <Markdown options={ markdownOptions }>{children}</Markdown> : null);

const firstFamily = (stack) => stack.replace(/var\([^,]+,\s*/, '').split(',')[0].replace(/["')]/g, '').trim();

const Swatch = ({ label, light, dark }) => (
  <span role='img' aria-label={ `${label}: light ${light}, dark ${dark}` } title={ `light ${light}\ndark ${dark}` } className='flex h-6 w-14 overflow-hidden rounded-sm border border-border-muted'>
    <span className='grow' style={ { background: light } } />
    <span className='grow' style={ { background: dark } } />
  </span>
);

const GroupRow = ({ label }) => (
  <tr>
    <th colSpan={ themePresets.length + 1 } scope='colgroup' className='bg-surface-muted px-3 py-2 text-start text-xs font-semibold text-text'>{label}</th>
  </tr>
);

/** Every themeable contract value, with each preset's light/dark values side by side. */
export function ContractSwatches() {
  return (
    <Table label='Theme contract values for every preset'>
      <thead>
        <tr><Th>Token</Th>{themePresets.map((theme) => <Th key={ theme.id }>{theme.name}</Th>)}</tr>
      </thead>
      <tbody>
        {COLOR_GROUPS.map((group) => (
          <Fragment key={ group.id }>
            <GroupRow label={ group.label } />
            {group.tokens.map((token) => (
              <tr key={ token }>
                <Td mono>{token}</Td>
                {themePresets.map((theme) => <Td key={ theme.id }><Swatch label={ `${token} in ${theme.name}` } light={ theme.light[token] } dark={ theme.dark[token] } /></Td>)}
              </tr>
            ))}
          </Fragment>
        ))}
        <GroupRow label='Shadows (light / dark)' />
        {SHADOW_TOKENS.map((token) => (
          <tr key={ token }>
            <Td mono>{`shadow-${token}`}</Td>
            {themePresets.map((theme) => (
              <Td key={ theme.id }>
                <span className='flex gap-2' role='img' aria-label={ `shadow-${token} in ${theme.name}` } title={ `light ${theme.shadows.light[token]}\ndark ${theme.shadows.dark[token]}` }>
                  {[ 'light', 'dark' ].map((mode) => <span key={ mode } className='size-5 rounded-sm' style={ { background: theme[mode]['surface-raised'], boxShadow: theme.shadows[mode][token] } } />)}
                </span>
              </Td>
            ))}
          </tr>
        ))}
        <GroupRow label='Fonts' />
        {FONT_TOKENS.map((token) => (
          <tr key={ token }>
            <Td mono>{`font-${token}`}</Td>
            {themePresets.map((theme) => <Td key={ theme.id }><span title={ theme.fonts[token] } style={ { fontFamily: theme.fonts[token] } }>{firstFamily(theme.fonts[token])}</span></Td>)}
          </tr>
        ))}
        <GroupRow label='Radius and density' />
        <tr>
          <Td mono>radius</Td>
          {themePresets.map((theme) => (
            <Td key={ theme.id }><span className='inline-flex items-center gap-2'><span aria-hidden='true' className='size-5 border-2 border-accent' style={ { borderRadius: theme.radius } } />{theme.radius}</span></Td>
          ))}
        </tr>
        <tr>
          <Td mono>space-scale</Td>
          {themePresets.map((theme) => <Td key={ theme.id }>{`${theme.spacing ?? 1}×`}</Td>)}
        </tr>
      </tbody>
    </Table>
  );
}

const stripTokens = [ 'surface-muted', 'accent', 'accent-muted', 'chart-2', 'chart-3', 'success', 'warning', 'danger' ];

/** Live preset cards: each is a `data-theme` scope, so it follows the light/dark toolbar. */
export function PresetGallery() {
  return (
    <ul aria-label='Theme presets gallery' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {themePresets.map((theme) => (
        <li key={ theme.id } className='flex'>
          <article data-theme={ theme.id } aria-labelledby={ `theming-preset-${theme.id}` } className='flex grow flex-col gap-3 rounded-lg border border-border bg-surface p-4 text-text shadow-card'>
            <div className='flex items-baseline justify-between gap-2'>
              <h3 id={ `theming-preset-${theme.id}` } className='text-lg font-semibold text-text'>{theme.name}</h3>
              <code className='text-xs text-text-subtle'>{theme.id}</code>
            </div>
            <p className='text-sm text-text-muted'>{theme.description}</p>
            <div className='flex gap-1' aria-hidden='true'>
              {stripTokens.map((token) => <span key={ token } className='h-5 grow rounded-sm border border-border-muted' style={ { background: `var(--ds-color-${token})` } } />)}
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button size='sm' variant='solid' tone='accent'>Primary</Button>
              <Button size='sm' variant='outline'>Secondary</Button>
            </div>
            <div className='flex flex-wrap gap-1'>
              <Pill size='sm' tone='green'>Live</Pill>
              <Pill size='sm' tone='amber'>Review</Pill>
              <Pill size='sm' tone='red'>Blocked</Pill>
            </div>
            <a className='mt-auto text-sm text-accent underline underline-offset-4' href={ `./?path=/story/${THEME_STUDIO_ID}` } target='_top'>
              Customise {theme.name} in Theme Studio
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** checkContrast for every preset: pairs passed and the weakest text pair per mode. */
export function ContrastSummary() {
  const weakest = (report, mode) => Math.min(...report.results.filter((result) => result.mode === mode && result.kind === 'text').map((result) => result.ratio));
  return (
    <Table label='Contrast report for every preset'>
      <thead><tr><Th>Preset</Th><Th>WCAG AA pairs</Th><Th>Weakest text pair (light)</Th><Th>Weakest text pair (dark)</Th></tr></thead>
      <tbody>
        {themePresets.map((theme) => {
          const report = checkContrast(theme);
          return (
            <tr key={ theme.id }>
              <Td>{theme.name}</Td>
              <Td>{`${report.pass ? 'Pass' : 'Fail'} · ${report.checked - report.failures.length}/${report.checked}`}</Td>
              <Td>{`${weakest(report, 'light').toFixed(2)}:1`}</Td>
              <Td>{`${weakest(report, 'dark').toFixed(2)}:1`}</Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

const studioLink = <QuickLink storyId={ THEME_STUDIO_ID } title='Open Theme Studio' description='Browse presets, edit tokens in OKLCH, generate from a brand colour, check contrast and import or export themes.' />;

// Page order; live blocks follow the matching THEMING.md section. Unlisted sections render last.
const ORDER = [
  { title: 'Contract', after: <ContractSwatches /> },
  { title: 'Presets', after: <><PresetGallery />{studioLink}</> },
  { title: 'Applying a theme' },
  { title: 'Generating', after: studioLink },
  { title: 'Import and export' }
];

// "Contract (134 values)" matches "Contract": headings may carry a parenthetical count.
const matches = (section, title) => section.title === title || section.title.startsWith(`${title} (`);

/** Theming / Overview: THEMING.md rendered with live swatches, previews and contrast results. */
export function ThemingOverview() {
  const { title, intro, sections } = parseTheming(theming);
  const contrast = [];
  const render = (section, after) => {
    const subsections = section.subsections.filter((part) => {
      if (!part.startsWith('### Contrast')) return true;
      contrast.push(part.replace(/^### .+\n/, ''));
      return false;
    });
    return (
      <Section key={ section.title } title={ section.title }>
        <Prose>{section.body}</Prose>
        {after}
        {subsections.map((part) => <Prose key={ part.slice(0, 40) }>{part}</Prose>)}
      </Section>
    );
  };
  const ordered = ORDER.map(({ title: name, after }) => {
    const section = sections.find((entry) => matches(entry, name));
    return section ? render(section, after) : null;
  });
  const rest = sections.filter((section) => !ORDER.some((entry) => matches(section, entry.title))).map((section) => render(section));

  return (
    <Page title={ title }>
      <Section title='What a theme is'><Prose>{intro}</Prose></Section>
      {ordered}
      <Section title='Accessibility'>
        {contrast.map((part) => <Prose key={ part.slice(0, 40) }>{part}</Prose>)}
        <ContrastSummary />
      </Section>
      {rest}
    </Page>
  );
}
