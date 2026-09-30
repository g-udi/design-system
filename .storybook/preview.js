import React from 'react';
import 'storybook/internal/components';

import './preview.css';

import { SiteConfigProvider } from '../src/utilities/SiteConfig';
import ThemeProvider from '../src/utilities/ThemeProvider';
import tokenData from '../src/tokens/tokens.json';
import siteMetadata from './fixtures/site/metadata';
import navigationMetadata from './fixtures/site/navigationMetadata.mjs';
import { ApplicationDocsPage } from './stories/ApplicationStoryHelpers';
import { DocsMarkdown } from './stories/DocsMarkdown';

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

const STORYBOOK_THEME_CLASSES = [ 'dark' ];
const STORYBOOK_BACKGROUNDS = {
  'dark': tokenData.dsVariables.root['--ds-color-surface-dark'],
  'light': tokenData.dsVariables.root['--ds-color-surface']
};

function applyStorybookTheme(theme) {
  const isDark = theme === 'dark';
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

  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  document.body.style.backgroundColor = isDark ? STORYBOOK_BACKGROUNDS.dark : STORYBOOK_BACKGROUNDS.light;
}

function syncStorybookTheme(theme) {
  applyStorybookTheme(theme);
  window.requestAnimationFrame(() => applyStorybookTheme(theme));
  window.setTimeout(() => applyStorybookTheme(theme), 0);
}

const preview = {
  afterEach: async (context) => {
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('./storyAudit.js');
      await auditStoryLayout(context);
    } else if (import.meta.env.VITE_GAUDI_RESPONSIVE === '1' && (context.id.includes('--reui-') || context.id === 'overview-component-catalogue--browse')) {
      const { verifyResponsiveCatalogue } = await import('./responsive.js');
      await verifyResponsiveCatalogue(context);
    }
  },
  decorators: [
    (Story, context) => {
      syncStorybookTheme(context.globals.theme);
      return React.createElement(
        ThemeProvider,
        { attribute: 'class', defaultTheme: context.globals.theme, enableSystem: false },
        React.createElement(
          SiteConfigProvider,
          { metadata: siteMetadata, navigation: navigationMetadata },
          Story()
        )
      );
    }
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Switch the preview between light and dark themes.',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    theme: import.meta.env.VITE_GAUDI_THEME || 'light'
  },
  loaders: [ makeFocusAccessorPrototypeSafe ],
  parameters: {
    docs: {
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
        const sectionOrder = [ 'Getting Started', 'Accessibility', 'Colors & Tokens', 'Icons', 'Indicators', 'States & Recovery', 'Typography', 'Core', 'Blocks', 'Navigation', 'MDX', 'Post', 'Layout' ];
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
          const pageDelta = pageRank(pageA) - pageRank(pageB);
          return pageDelta || a.title.localeCompare(b.title, undefined, { numeric: true });
        }

        // Same component: Docs first, then stories alphabetically
        if (a.type !== b.type && (a.type === 'docs' || b.type === 'docs')) return a.type === 'docs' ? -1 : 1;

        return a.name.localeCompare(b.name, undefined, { numeric: true });
      }
    }
  }
};

export default preview;
