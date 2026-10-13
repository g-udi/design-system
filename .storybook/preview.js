import React from 'react';
import { emitTransformCode, useEffect as useStoryEffect } from 'storybook/preview-api';
import 'storybook/internal/components';
import { create } from 'storybook/theming';
import { DecoratorHelpers } from '@storybook/addon-themes';

import './preview.css';
// Every preset, scoped by [data-theme]; the Theme toolbar sets the attribute on <html>.
import '../src/themes/themes.css';

import { SiteConfigProvider, InputConfigProvider } from '../src/context';
import { ThemeProvider, useTheme } from 'next-themes';
import tokenData from '../src/tokens/tokens.json';
import { DEFAULT_THEME_ID, listThemes } from '../src/themes';
import siteMetadata from '../src/docs/fixtures/site/metadata';
import navigationMetadata from '../src/docs/fixtures/site/navigationMetadata.mjs';
import { ApplicationDocsPage } from '../src/docs/components/ApplicationStoryHelpers';
import { DocsMarkdown } from '../src/docs/components/DocsMarkdown';

/*
 * Workaround for a Storybook bug (storybook/test's enhanceContext loader):
 * it replaces HTMLElement.prototype.focus with an accessor whose getter calls
 * `this.ownerDocument`. Reading `HTMLElement.prototype.focus` off the
 * prototype itself (react-aria's focus-visible polyfill, bundled into the
 * preview via storybook/internal/components, does exactly that) then throws
 * "TypeError: Illegal invocation" and the story fails to render.
 *
 * The loader below runs after Storybook's (project annotations compose
 * addons first, this file last) and re-wraps the accessor with a getter that
 * returns the captured native focus for prototype receivers while delegating
 * element reads to Storybook's instrumentation unchanged.
 */
const nativeFocus = typeof HTMLElement !== 'undefined' ? HTMLElement.prototype.focus : undefined;

function makeFocusAccessorPrototypeSafe() {
  if (typeof HTMLElement === 'undefined') return;

  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'focus');

  if (!descriptor?.get || descriptor.get.__prototypeSafe) return;

  const { get, set } = descriptor;
  const safeGet = function () {
    if (this === HTMLElement.prototype) return nativeFocus;

    return get.call(this);
  };

  safeGet.__prototypeSafe = true;
  Object.defineProperty(HTMLElement.prototype, 'focus', { configurable: true, get: safeGet, set });
}

DecoratorHelpers.initializeThemeState(['light', 'dark'], 'light');

const STORYBOOK_THEME_CLASSES = [ 'dark' ];
const CORNER_RADII = [ '0px', '2px', '4px', '8px' ];
const SPACE_SCALES = Object.values(tokenData.spaceScales).map(String);
const STORYBOOK_BACKGROUNDS = {
  'dark': tokenData.dsVariables.root['--ds-color-surface-dark'],
  'light': tokenData.dsVariables.root['--ds-color-surface']
};

const THEME_PRESETS = listThemes();

// Toolbar values equal to the token default defer to the active theme's own radius/density.
function setRootVariable(name, value, allowed) {
  const style = document.documentElement.style;
  if (allowed.includes(value) && value !== tokenData.dsVariables.root[name]) style.setProperty(name, value);
  else style.removeProperty(name);
}

function applyStorybookTheme(theme, cornerRadius, spaceScale, themeId) {
  const isDark = theme === 'dark';
  const preset = THEME_PRESETS.some((entry) => entry.id === themeId) ? themeId : DEFAULT_THEME_ID;
  const roots = [
    document.documentElement,
    document.body,
    document.getElementById('storybook-root'),
    document.getElementById('storybook-docs')
  ].filter(Boolean);

  roots.forEach((root) => {
    STORYBOOK_THEME_CLASSES.forEach((themeClass) => root.classList.remove(themeClass));
    if (isDark) root.classList.add('dark');
  });

  document.documentElement.setAttribute('data-theme', preset);
  setRootVariable('--ds-radius', cornerRadius, CORNER_RADII);
  setRootVariable('--ds-space-scale', spaceScale, SPACE_SCALES);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  document.body.style.backgroundColor = 'var(--ds-color-surface)';
}

function syncStorybookTheme(...args) {
  applyStorybookTheme(...args);
  window.requestAnimationFrame(() => applyStorybookTheme(...args));
  window.setTimeout(() => applyStorybookTheme(...args), 0);
}

// Toolbar changes update the provider; in-demo switches can still change its theme.
function StorybookTheme({ theme, cornerRadius, spaceScale, themeId, children }) {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes recreates setTheme after selection; only a new toolbar value overrides it.
  const appliedToolbarTheme = React.useRef();
  React.useEffect(() => {
    if (appliedToolbarTheme.current === theme) return;
    appliedToolbarTheme.current = theme;
    setTheme(theme);
  }, [theme, setTheme]);
  React.useEffect(() => {
    syncStorybookTheme(resolvedTheme || theme, cornerRadius, spaceScale, themeId);
  }, [resolvedTheme, theme, cornerRadius, spaceScale, themeId]);
  return children;
}

const preview = {
  afterEach: async (context) => {
    // Interaction tests end wherever they last focused; clear it so previews show no stray focus rings.
    if (context.canvasElement?.contains(document.activeElement)) document.activeElement.blur();
    if (import.meta.env.VITE_GAUDI_VISUAL === '1') {
      const { auditVisualLayout } = await import('./visualAudit.js');
      await auditVisualLayout(context);
    } else if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('./storyAudit.js');
      await auditStoryLayout(context);
    } else if (import.meta.env.VITE_GAUDI_RESPONSIVE === '1' && (/-pattern-\d+$/.test(context.id) || context.id === 'overview-component-catalogue--browse')) {
      const { verifyResponsiveCatalogue } = await import('./responsive.js');
      await verifyResponsiveCatalogue(context);
    }
  },
  decorators: [
    (Story, context) => {
      const source = context.parameters.docs?.source;
      useStoryEffect(() => {
        if (source?.type === 'code' && source.transform && source.code === undefined) {
          // Publish args-driven authored snippets without walking mounted React refs.
          // Storybook only invokes the transform when its input is nonempty.
          void emitTransformCode(source.originalSource || ' ', context);
        }
      }, [context.id, context.args, source]);
      return Story();
    },
    (Story, context) => {
      return React.createElement(
        ThemeProvider,
        { attribute: 'class', defaultTheme: context.globals.theme, enableSystem: false },
        React.createElement(
          StorybookTheme,
          { theme: context.globals.theme, cornerRadius: context.globals.cornerRadius, spaceScale: context.globals.spaceScale, themeId: context.globals.gaudiTheme },
          React.createElement(
            SiteConfigProvider,
            { metadata: siteMetadata, navigation: navigationMetadata },
            React.createElement(InputConfigProvider, { caretMode: context.globals.caretMode }, Story())
          )
        )
      );
    }
  ],
  globalTypes: {
    gaudiTheme: {
      name: 'Theme preset',
      description: 'Gaudi theme preset (data-theme on <html>); composes with the light/dark switch. See the Theming guide.',
      toolbar: {
        title: 'Theme preset',
        icon: 'component',
        items: THEME_PRESETS.map(({ id, name }) => ({ value: id, title: name })),
        dynamicTitle: true
      }
    },
    caretMode: {
      name: 'Caret',
      description: 'Text cursor behavior across Gaudi inputs. Individual fields can override it.',
      toolbar: {
        title: 'Caret', icon: 'edit',
        items: [{ value: 'native', title: 'Native caret' }, { value: 'smooth', title: 'Smooth caret' }],
        dynamicTitle: true,
      },
    },
    cornerRadius: {
      name: 'Corners',
      description: 'Global corner radius for elements. Accordion and text highlights stay square. The 4px default follows the theme preset.',
      toolbar: {
        title: 'Corners',
        icon: 'circlehollow',
        items: [
          { value: '0px', title: 'Square · 0px' },
          { value: '2px', title: 'Subtle · 2px' },
          { value: '4px', title: 'Soft · 4px' },
          { value: '8px', title: 'Rounded · 8px' }
        ],
        dynamicTitle: true
      }
    },
    spaceScale: {
      name: 'Density',
      description: 'Global density: padding, gaps and control heights scale together. Margins and layout widths stay fixed. The default follows the theme preset.',
      toolbar: {
        title: 'Density',
        icon: 'expand',
        items: Object.entries(tokenData.spaceScales).map(([ name, value ]) => ({
          value: String(value),
          title: `${name[0].toUpperCase()}${name.slice(1)} · ${value}×`
        })),
        dynamicTitle: true
      }
    },
  },
  initialGlobals: {
    ...(import.meta.env.VITE_GAUDI_AUDIT === '1' && { viewport: { value: 'auditPhone' } }),
    caretMode: import.meta.env.VITE_GAUDI_CARET || 'smooth',
    cornerRadius: tokenData.dsVariables.root['--ds-radius'],
    gaudiTheme: import.meta.env.VITE_GAUDI_THEME_PRESET || DEFAULT_THEME_ID,
    spaceScale: tokenData.dsVariables.root['--ds-space-scale'],
    theme: import.meta.env.VITE_GAUDI_THEME || 'light'
  },
  loaders: [ makeFocusAccessorPrototypeSafe ],
  parameters: {
    ...(import.meta.env.VITE_GAUDI_AUDIT === '1' && {
      viewport: {
        options: { auditPhone: { name: 'Audit phone', styles: { width: '320px', height: '900px' }, type: 'mobile' } }
      }
    }),
    docs: {
      theme: create({ base: 'light', appBorderRadius: 0, inputBorderRadius: 0 }),
      components: { Markdown: DocsMarkdown },
      page: ApplicationDocsPage
    },
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ]
        }
      },
      test: 'error'
    },
    actions: {
      argTypesRegex: '^on.*'
    },
    backgrounds: {
      default: 'light',
      options: {
        dark: { name: 'Dark', value: STORYBOOK_BACKGROUNDS.dark },
        light: { name: 'Light', value: STORYBOOK_BACKGROUNDS.light }
      }
    },
    controls: {
      matchers: {
        color: /(?:background|color)$/i,
        date: /Date$/i
      }
    },
    nextjs: {
      appDirectory: true
    },
    options: {
      /*
       * Custom sort instead of the object form so every component's Docs entry
       * comes before its stories. Storybook serializes this function, so it
       * must stay self-contained (no references to outer variables).
       */
      storySort: (a, b) => {
        const sectionOrder = [ 'Getting Started', 'Accessibility', 'Colors & Tokens', 'Icons', 'Indicators', 'States & Recovery', 'Typography', 'Theming', 'Theme Studio', 'Core', 'Blocks', 'Chat', 'Charts', 'Hooks', 'Animations', 'MDX' ];
        const rank = (list, value) => {
          const index = list.indexOf(value);
          return index === -1 ? list.length : index;
        };
        const [ sectionA, pageA ] = a.title.split('/');
        const [ sectionB, pageB ] = b.title.split('/');

        if (sectionA !== sectionB) {
          const sectionDelta = rank(sectionOrder, sectionA) - rank(sectionOrder, sectionB);
          return sectionDelta || sectionA.localeCompare(sectionB, undefined, { numeric: true });
        }

        if (a.title !== b.title) {
          const pageRank = (page) => page === 'Overview' ? -1 : 0;
          // Primitives sit directly under their section; grouped families follow in folders.
          const depthDelta = a.title.split('/').length - b.title.split('/').length;
          if (depthDelta) return depthDelta;
          const pageDelta = pageRank(pageA) - pageRank(pageB);
          return pageDelta || a.title.localeCompare(b.title, undefined, { numeric: true });
        }

        // Same component: Docs first, then native stories and each pattern catalogue in declaration order.
        if (a.type !== b.type && (a.type === 'docs' || b.type === 'docs')) return a.type === 'docs' ? -1 : 1;
        if (a.importPath === b.importPath) return 0;
        const catalogue = (path) => Number(/Patterns\.stories\.jsx$/.test(path));
        return catalogue(a.importPath) - catalogue(b.importPath) || a.importPath.localeCompare(b.importPath);
      }
    }
  }
};

export default preview;
