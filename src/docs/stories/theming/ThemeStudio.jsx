import { useMemo, useState } from 'react';
import Banner from '../../../components/core/Banner';
import Button from '../../../components/core/Button';
import Input from '../../../components/core/Input';
import Link from '../../../components/core/Link';
import { NativeSelect, NativeSelectOption } from '../../../components/core/Select';
import { Slider } from '../../../components/core/Slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/core/Tabs';
import Textarea from '../../../components/core/Textarea';
import ToggleGroup from '../../../components/core/ToggleGroup';
import { CopyButton } from '../../components/CopyButton';
import { parseColor } from '../../../themes/color.js';
import { COLOR_GROUPS, TOKEN_DESCRIPTIONS } from '../../../themes/contract.js';
import { checkContrast } from '../../../themes/contrast.js';
import { exportTheme } from '../../../themes/exporter.js';
import { FONT_PAIRS, generateShadows, generateTheme, randomTheme } from '../../../themes/generate.js';
import { importTheme, slugify } from '../../../themes/importer.js';
import { themePresets } from '../../../themes/presets.js';
import { ContrastReport } from './ContrastReport';
import { OklchField } from './OklchField';
import { ThemePreview, usePreviewTheme } from './ThemePreview';

const DRAFT_ID = 'studio-draft';
const modeOptions = [ { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' } ];
const exportFormats = [ { value: 'css', label: 'Gaudi CSS' }, { value: 'shadcn', label: 'shadcn CSS' }, { value: 'json', label: 'JSON' }, { value: 'registry', label: 'Registry' } ];
const asDraft = (theme) => ({ ...structuredClone(theme), id: DRAFT_ID });
const fontPairFor = (fonts) => FONT_PAIRS.find((pair) => pair.sans === fonts.sans && pair.heading === fonts.heading)?.id || 'custom';
const radiusPx = (radius) => (radius.endsWith('rem') ? parseFloat(radius) * 16 : parseFloat(radius) || 0);

function PresetCard({ theme, mode, onEdit }) {
  usePreviewTheme(theme);
  const colors = theme[mode];
  return (
    <li className='flex flex-col overflow-hidden rounded-lg border border-border'>
      <div data-theme={ theme.id } className={ `${mode} flex grow flex-col gap-3 bg-surface p-4 text-text` } style={ { colorScheme: mode } }>
        <div className='flex items-baseline justify-between gap-2'>
          <h3 className='text-lg font-semibold'>{theme.name}</h3>
          <span className='text-xs text-text-subtle'>{theme.radius}</span>
        </div>
        <p className='text-sm text-text-muted'>{theme.description}</p>
        <div className='flex gap-1' aria-hidden='true'>
          {[ 'surface-muted', 'accent', 'accent-muted', 'chart-2', 'chart-3', 'success', 'warning', 'danger' ].map((key) => (
            <span key={ key } className='h-6 grow rounded-sm border border-border-muted' style={ { background: colors[key] } } />
          ))}
        </div>
        <div className='mt-auto flex flex-wrap gap-2'>
          <Button size='sm' variant='solid' tone='accent' onClick={ () => onEdit(theme) } aria-label={ `Customise ${theme.name}` }>Customise</Button>
          <CopyButton label={ `${theme.name} CSS` } value={ exportTheme(theme, 'css') }>Copy CSS</CopyButton>
        </div>
      </div>
    </li>
  );
}

/** Theme studio inspired by StyleGlide, tweakcn and the shadcn/ui theme editor: presets, an OKLCH editor, generation, contrast and import/export. */
export function ThemeStudio() {
  const [ tab, setTab ] = useState('gallery');
  const [ mode, setMode ] = useState('light');
  const [ draft, setDraft ] = useState(() => asDraft(themePresets[0]));
  const [ name, setName ] = useState(themePresets[0].name);
  const [ token, setToken ] = useState('accent');
  const [ brand, setBrand ] = useState('#2563eb');
  const [ secondary, setSecondary ] = useState('');
  const [ seed, setSeed ] = useState(1);
  const [ shadowStrength, setShadowStrength ] = useState(0.5);
  const [ format, setFormat ] = useState('css');
  const [ source, setSource ] = useState('');
  const [ importState, setImportState ] = useState(null);
  const report = useMemo(() => checkContrast(draft), [ draft ]);
  const exported = useMemo(() => ({ ...draft, id: slugify(name, 'custom'), name: name || 'Custom' }), [ draft, name ]);

  const load = (theme, label = theme.name) => { setDraft(asDraft({ ...theme, name: label })); setName(label); setTab('editor'); };
  const setFonts = (id) => {
    const pair = FONT_PAIRS.find((entry) => entry.id === id);
    if (pair) setDraft((current) => ({ ...current, fonts: { sans: pair.sans, serif: pair.serif, mono: pair.mono, heading: pair.heading } }));
  };
  const setColor = (value) => setDraft((current) => ({ ...current, [mode]: { ...current[mode], [token]: value } }));
  const generate = () => {
    if (!parseColor(brand)) return;
    load(generateTheme({ brand, secondary: parseColor(secondary) ? secondary : undefined, seed, fonts: fontPairFor(draft.fonts) === 'custom' ? undefined : fontPairFor(draft.fonts), radius: draft.radius, shadow: shadowStrength }), `Brand ${brand}`);
  };
  const randomise = () => { const next = seed + 1; setSeed(next); load(randomTheme(next), `Random ${next}`); };
  const runImport = () => {
    try {
      const result = importTheme(source);
      setImportState({ ok: true, warnings: result.warnings, pass: result.report.pass, failures: result.report.failures.length, format: result.format });
      load(result.theme, result.theme.name);
      setTab('transfer');
    } catch (error) {
      setImportState({ ok: false, message: error.message });
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([ exportTheme(exported, 'json') ], { type: 'application/json' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: `${exported.id}.json` });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-2xl font-semibold text-text'>Theme Studio</h2>
          <p className='text-sm text-text-muted'>Pick a preset, tune the OKLCH contract, check contrast and export Gaudi or shadcn themes.</p>
          <p className='text-sm text-text-muted'>Inspired by <Link href='https://www.styleglide.ai/themes'>StyleGlide</Link>, <Link href='https://tweakcn.com'>tweakcn</Link> and <Link href='https://ui.shadcn.com/themes'>shadcn/ui themes</Link>. Bring any StyleGlide, tweakcn or shadcn theme: themes made there import as-is, because Gaudi follows the shadcn CSS-variable convention.</p>
        </div>
        <ToggleGroup type='single' label='Preview mode' value={ mode } onValueChange={ (value) => value && setMode(value) } options={ modeOptions } />
      </div>
      <Tabs value={ tab } onValueChange={ setTab }>
        <TabsList aria-label='Theme Studio'>
          <TabsTrigger value='gallery'>Gallery</TabsTrigger>
          <TabsTrigger value='editor'>Editor</TabsTrigger>
          <TabsTrigger value='transfer'>Import &amp; export</TabsTrigger>
        </TabsList>

        <TabsContent value='gallery'>
          <ul className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4' aria-label='Theme presets'>
            {themePresets.map((theme) => <PresetCard key={ theme.id } theme={ theme } mode={ mode } onEdit={ (preset) => load(preset) } />)}
          </ul>
        </TabsContent>

        <TabsContent value='editor'>
          <div className='grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]'>
            <div className='flex flex-col gap-5'>
              <div>
                <label htmlFor='studio-name' className='block text-sm font-medium text-text'>Theme name</label>
                <Input id='studio-name' className='mt-1' value={ name } onChange={ (event) => setName(event.target.value) } />
              </div>
              <fieldset className='flex flex-col gap-2'>
                <legend className='text-sm font-medium text-text'>Generate</legend>
                <div className='grid grid-cols-2 gap-2'>
                  <Input aria-label='Brand colour' value={ brand } invalid={ !parseColor(brand) } onChange={ (event) => setBrand(event.target.value) } />
                  <Input aria-label='Second colour (optional)' placeholder='Second colour' value={ secondary } onChange={ (event) => setSecondary(event.target.value) } />
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button size='sm' variant='solid' tone='accent' onClick={ generate } disabled={ !parseColor(brand) }>Generate from brand</Button>
                  <Button size='sm' variant='outline' onClick={ randomise }>Randomise</Button>
                </div>
                <p className='text-xs text-text-subtle'>Deterministic and offline: seed {seed}. Every generated pair passes WCAG AA.</p>
              </fieldset>
              <fieldset className='flex flex-col gap-3'>
                <legend className='text-sm font-medium text-text'>Colours ({mode})</legend>
                {COLOR_GROUPS.map((group) => (
                  <div key={ group.id }>
                    <p className='mb-1 text-xs font-medium uppercase tracking-wide text-text-subtle'>{group.label}</p>
                    <div className='flex flex-wrap gap-1.5'>
                      {group.tokens.map((key) => (
                        <button
                          key={ key }
                          type='button'
                          aria-pressed={ token === key }
                          aria-label={ `${key}: ${draft[mode][key]}` }
                          title={ TOKEN_DESCRIPTIONS[key] }
                          onClick={ () => setToken(key) }
                          className={ `size-7 rounded border ${token === key ? 'border-text ring-2 ring-accent ring-offset-1 ring-offset-surface' : 'border-border'}` }
                          style={ { background: draft[mode][key] } }
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <OklchField key={ `${mode}-${token}` } label={ `${token} (${mode})` } value={ draft[mode][token] } onChange={ setColor } />
                <p className='text-xs text-text-subtle'>{TOKEN_DESCRIPTIONS[token]}</p>
              </fieldset>
              <fieldset className='flex flex-col gap-3'>
                <legend className='text-sm font-medium text-text'>Typography and shape</legend>
                <label htmlFor='studio-fonts' className='text-sm text-text-muted'>Font pairing</label>
                <NativeSelect id='studio-fonts' className='w-full' value={ fontPairFor(draft.fonts) } onChange={ (event) => setFonts(event.target.value) }>
                  {fontPairFor(draft.fonts) === 'custom' ? <NativeSelectOption value='custom'>Theme fonts</NativeSelectOption> : null}
                  {FONT_PAIRS.map((pair) => <NativeSelectOption key={ pair.id } value={ pair.id }>{pair.label}</NativeSelectOption>)}
                </NativeSelect>
                <p className='text-xs text-text-subtle'>Stacks fall back to system fonts. Load webfonts in the app with next/font or @fontsource; Gaudi never downloads fonts.</p>
                <div className='grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 text-sm'>
                  <span id='studio-radius' className='text-text-muted'>Radius</span>
                  <Slider aria-labelledby='studio-radius' min={ 0 } max={ 20 } step={ 1 } value={ [ radiusPx(draft.radius) ] } getValueText={ (value) => `${value}px` } onValueChange={ ([ value ]) => setDraft((current) => ({ ...current, radius: `${value}px` })) } />
                  <span className='text-end font-mono text-xs text-text-muted'>{draft.radius}</span>
                  <span id='studio-shadow' className='text-text-muted'>Shadows</span>
                  <Slider aria-labelledby='studio-shadow' min={ 0 } max={ 1 } step={ 0.05 } value={ [ shadowStrength ] } getValueText={ (value) => `${Math.round(value * 100)}%` } onValueChange={ ([ value ]) => { setShadowStrength(value); setDraft((current) => ({ ...current, shadows: generateShadows(value) })); } } />
                  <span className='text-end font-mono text-xs text-text-muted'>{Math.round(shadowStrength * 100)}%</span>
                  <span id='studio-density' className='text-text-muted'>Density</span>
                  <Slider aria-labelledby='studio-density' min={ 0.75 } max={ 1.5 } step={ 0.125 } value={ [ draft.spacing ?? 1 ] } getValueText={ (value) => `${value}×` } onValueChange={ ([ value ]) => setDraft((current) => ({ ...current, spacing: value })) } />
                  <span className='text-end font-mono text-xs text-text-muted'>{draft.spacing ?? 1}×</span>
                </div>
              </fieldset>
            </div>
            <div className='flex min-w-0 flex-col gap-4'>
              <ThemePreview theme={ draft } mode={ mode } />
              <ContrastReport report={ report } />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='transfer'>
          <div className='grid gap-6 lg:grid-cols-2'>
            <section aria-labelledby='studio-export' className='flex flex-col gap-3'>
              <h3 id='studio-export' className='text-base font-semibold text-text'>Export “{exported.name}”</h3>
              <ToggleGroup type='single' label='Export format' value={ format } onValueChange={ (value) => value && setFormat(value) } options={ exportFormats } />
              <Textarea aria-label='Exported theme' readOnly rows={ 14 } className='font-mono text-xs' value={ exportTheme(exported, format) } />
              <div className='flex flex-wrap gap-2'>
                <CopyButton label='Gaudi CSS' value={ exportTheme(exported, 'css') }>Copy CSS</CopyButton>
                <CopyButton label='shadcn CSS' value={ exportTheme(exported, 'shadcn') }>Copy shadcn CSS</CopyButton>
                <Button size='xs' variant='outline' onClick={ download }>Download JSON</Button>
              </div>
            </section>
            <section aria-labelledby='studio-import' className='flex flex-col gap-3'>
              <h3 id='studio-import' className='text-base font-semibold text-text'>Import</h3>
              <p className='text-sm text-text-muted'>Paste shadcn, tweakcn or StyleGlide theme CSS (:root and .dark variables in OKLCH, HSL or hex), a registry item or Gaudi theme JSON.</p>
              <Textarea aria-label='Theme to import' rows={ 10 } className='font-mono text-xs' value={ source } placeholder={ ':root {\n  --background: oklch(1 0 0);\n  --primary: oklch(0.55 0.2 260);\n}' } onChange={ (event) => setSource(event.target.value) } />
              <div><Button size='sm' variant='solid' tone='accent' onClick={ runImport } disabled={ !source.trim() }>Import theme</Button></div>
              {importState && (importState.ok
                ? <Banner tone={ importState.pass ? 'success' : 'warning' } size='sm' title='Imported'>{`Read ${importState.format}; ${importState.pass ? 'every contrast pair passes' : `${importState.failures} contrast pairs fail (see the Editor report)`}.${importState.warnings.length ? ` ${importState.warnings.join(' ')}` : ''}`}</Banner>
                : <Banner tone='danger' size='sm' title='Could not import'>{importState.message}</Banner>)}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
