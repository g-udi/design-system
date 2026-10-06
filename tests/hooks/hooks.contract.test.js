import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createElement as h, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as hooks from '../../src/hooks/index.js';
import { hookCatalogue, hookGroups, hookStoryId, hookTitle } from '../../src/docs/hooks/catalogue.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const hookRoot = new URL('../../src/hooks/', import.meta.url);
const storyRoot = new URL('../../src/docs/hooks/stories/', import.meta.url);

test('the catalogue documents every exported hook exactly once, in a known group', () => {
  const exported = Object.keys(hooks).filter((name) => /^use[A-Z]/.test(name)).sort();
  const documented = hookCatalogue.map((hook) => hook.name).sort();
  assert.deepEqual(documented, exported);
  assert.equal(new Set(documented).size, documented.length);
  for (const hook of hookCatalogue) {
    assert.ok(hookGroups.includes(hook.group), `${hook.name}: unknown group ${hook.group}`);
    assert.equal(typeof hooks[hook.name], 'function', hook.name);
    assert.ok(hook.summary && hook.description && hook.accessibility && hook.usage, `${hook.name}: missing docs`);
    assert.match(hook.usage, /@gaudi\/design-system\/hooks/, `${hook.name}: usage needs a copyable public import`);
    for (const row of hook.params) assert.ok(row.length === 4 && row.every((value) => typeof value === 'string' && value), `${hook.name}: param row`);
    for (const row of hook.returns) assert.ok(row.length === 3 && row.every((value) => typeof value === 'string' && value), `${hook.name}: return row`);
  }
  assert.ok(hookCatalogue.length >= 36, 'the original hook inventory remains covered');
});

test('each hook lives in its group folder and owns one Storybook page under Hooks/<Group>', () => {
  for (const hook of hookCatalogue) {
    const folder = hook.group.toLowerCase();
    assert.ok(hook.file.startsWith(`${folder}/`), `${hook.name}: file outside its group folder`);
    const hookFile = new URL(hook.file, hookRoot);
    assert.ok(existsSync(hookFile), `${hook.name}: ${hook.file} missing`);
    assert.match(readFileSync(hookFile, 'utf8'), new RegExp(`export (function|const) ${hook.name}\\b`), `${hook.name}: not defined in ${hook.file}`);
    const story = hook.file.replace(/\.js$/, '.stories.jsx');
    const storyFile = new URL(story, storyRoot);
    assert.ok(existsSync(storyFile), `${hook.name}: ${story} missing`);
    const source = readFileSync(storyFile, 'utf8');
    assert.ok(source.includes(`title: '${hookTitle(hook)}'`), `${hook.name}: story title`);
    assert.ok(source.includes(`id: '${hookStoryId(hook)}'`), `${hook.name}: story id`);
    assert.ok(source.includes("tags: ['autodocs']"), `${hook.name}: autodocs`);
    assert.ok(source.includes(`hookMeta('${hook.name}')`), `${hook.name}: shared docs meta`);
    const fixture = `./fixtures/${hook.file.split('/').at(-1).replace(/\.js$/, '.jsx')}`;
    assert.ok(source.includes(`${fixture}?raw`), `${hook.name}: copied examples must read their rendered fixture`);
    assert.match(source, /hookExampleSource\(exampleCode, readoutCode,/, `${hook.name}: shared public-source conversion`);
  }
});

test('hooks are public from the hooks entry and the package root', () => {
  const pkg = JSON.parse(read('../../package.json'));
  assert.equal(pkg.exports['./hooks'].import ?? pkg.exports['./hooks'], './src/hooks/index.js');
  assert.equal(pkg.exports['./hooks/*'], undefined);
  for (const hook of hookCatalogue) {
    const entry = pkg.exports[`./hooks/${hook.file.replace(/\.js$/, '')}`];
    assert.equal(entry?.import ?? entry, `./src/hooks/${hook.file}`, hook.name);
  }
  assert.equal(pkg.exports['./hooks/shared/use-now'], undefined);
  assert.match(read('../../src/index.js'), /export \* from '\.\/hooks';/);
  // No package-internal alias imports.
  for (const hook of hookCatalogue) assert.doesNotMatch(readFileSync(new URL(hook.file, hookRoot), 'utf8'), /from '@\//, hook.name);
});

test('the Storybook sidebar places Hooks right after Charts and keeps the hook pages visible', async () => {
  assert.match(read('../../.storybook/preview.js'), /'Charts', 'Hooks', 'Animations', 'MDX'/);
  const { isSidebarEntry } = await import('../../.storybook/navigation.js');
  assert.ok(isSidebarEntry({ id: 'hooks-overview--default', title: 'Hooks/Overview' }));
  const catalogue = JSON.parse(read('../../src/docs/catalogue/catalogue.json'));
  assert.equal(catalogue.entries['hooks-overview--default']?.title, 'Hooks/Overview');
  for (const hook of hookCatalogue) assert.equal(catalogue.entries[`${hookStoryId(hook)}--docs`]?.title, hookTitle(hook), `${hook.name}: run pnpm catalogue:sync`);
});

// MARK: SSR

const ssrCalls = {
  useBoolean: () => hooks.useBoolean(true).value,
  useCounter: () => hooks.useCounter(2).count,
  useCountdown: () => hooks.useCountdown({ countStart: 5 }).count,
  useMap: () => hooks.useMap([['draft', 'ready']])[0].get('draft'),
  useReadLocalStorage: () => hooks.useReadLocalStorage('ssr:key', 'fallback'),
  useIsMounted: () => hooks.useIsMounted()(),
  useUnmount: () => hooks.useUnmount(() => {}) ?? 'ok',
  useDocumentTitle: () => hooks.useDocumentTitle('Server title') ?? 'ok',
  useWindowSize: () => hooks.useWindowSize({ initialWidth: 640 }).width,
  useScreen: () => String(hooks.useScreen()),
  useMousePosition: () => String(hooks.useMousePosition().x),
  useScript: () => hooks.useScript('/local.js'),
  useArrowKeyNav: () => hooks.useArrowKeyNav(3).activeIndex,
  useFocusTrap: () => typeof hooks.useFocusTrap({ active: true }),
  useLiveAnnouncer: () => typeof hooks.useLiveAnnouncer().announce,
  usePrefersReducedMotion: () => hooks.usePrefersReducedMotion(),
  useLocalStorage: () => hooks.useLocalStorage('ssr:key', 'initial')[0],
  useSessionStorage: () => hooks.useSessionStorage('ssr:key', 'initial')[0],
  useSelection: () => hooks.useSelection({ initialSelectedIds: new Set([ 1 ]) }).count,
  useIsClient: () => hooks.useIsClient(),
  useMediaQuery: () => hooks.useMediaQuery('(min-width: 1px)', true),
  useIsMobile: () => hooks.useIsMobile(),
  useOnlineStatus: () => hooks.useOnlineStatus(),
  usePageVisibility: () => hooks.usePageVisibility(),
  usePrefersColorScheme: () => hooks.usePrefersColorScheme('dark'),
  useCopyToClipboard: () => hooks.useCopyToClipboard().isCopied,
  useEventListener: () => hooks.useEventListener('resize', () => {}) ?? 'ok',
  useHotkey: () => hooks.useHotkey('mod+k', () => {}).kbdKeys,
  useHover: () => hooks.useHover().isHovered,
  useOnClickOutside: () => hooks.useOnClickOutside(useRef(null), () => {}) ?? 'ok',
  useScrollLock: () => hooks.useScrollLock(true) ?? 'ok',
  useCollapsibleSections: () => hooks.useCollapsibleSections({ sections: [ 'a', 'b' ], initialExpanded: [ 'a' ] }).expandedCount,
  useElementSize: () => hooks.useElementSize({ initialSize: { width: 320, height: 10 } })[1].width,
  useInView: () => hooks.useInView({ initialInView: true })[1],
  useScrollPosition: () => hooks.useScrollPosition(),
  useControllableState: () => hooks.useControllableState({ defaultValue: 'uncontrolled' })[0],
  useDebounceCallback: () => typeof hooks.useDebounceCallback(() => {}).flush,
  useDebounceValue: () => hooks.useDebounceValue('value'),
  useDisclosure: () => hooks.useDisclosure({ defaultOpen: true }).open,
  useEventCallback: () => typeof hooks.useEventCallback(() => {}),
  useInterval: () => hooks.useInterval(() => {}, 1000) ?? 'ok',
  useIsomorphicLayoutEffect: () => hooks.useIsomorphicLayoutEffect(() => {}, []) ?? 'ok',
  useMergedRefs: () => typeof hooks.useMergedRefs(useRef(null), () => {}),
  usePrevious: () => String(hooks.usePrevious(1)),
  useSliderInput: () => hooks.useSliderInput({ minValue: 0, maxValue: 10, initialValue: [ 2, 8 ] }).sliderValues.join('-'),
  useStep: () => hooks.useStep({ count: 3, defaultStep: 9 }).step,
  useThrottleCallback: () => typeof hooks.useThrottleCallback(() => {}).cancel,
  useTimeout: () => typeof hooks.useTimeout(() => {}, 1000).reset
};

const expectedOnServer = {
  useBoolean: 'true', useCounter: '2', useCountdown: '5', useMap: 'ready', useReadLocalStorage: 'fallback',
  useIsMounted: 'false', useWindowSize: '640', useScreen: 'undefined', useMousePosition: 'null', useScript: 'loading',
  useArrowKeyNav: '0', usePrefersReducedMotion: 'false', useLocalStorage: 'initial', useSessionStorage: 'initial', useSelection: '1',
  useIsClient: 'false', useMediaQuery: 'true', useIsMobile: 'false', useOnlineStatus: 'true', usePageVisibility: 'true',
  usePrefersColorScheme: 'dark', useCopyToClipboard: 'false', useHotkey: 'ctrl,k', useHover: 'false', useCollapsibleSections: '1',
  useElementSize: '320', useInView: 'true', useScrollPosition: '0', useControllableState: 'uncontrolled', useDebounceValue: 'value',
  useDisclosure: 'true', usePrevious: 'undefined', useSliderInput: '2-8', useStep: '2'
};

test('every hook renders on the server without touching browser globals', () => {
  assert.equal(typeof window, 'undefined');
  assert.deepEqual(Object.keys(ssrCalls).sort(), hookCatalogue.map((hook) => hook.name).sort());
  for (const [ name, call ] of Object.entries(ssrCalls)) {
    const Probe = () => h('output', null, String(call()));
    const html = renderToStaticMarkup(h(Probe));
    if (name in expectedOnServer) assert.equal(html, `<output>${expectedOnServer[name]}</output>`, name);
    else assert.match(html, /^<output>/, name);
  }
});
