import { createElement } from 'react';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';

import './manager.css';
import { isSidebarEntry } from './navigation';

// The Storybook chrome follows the toolbar theme switch, using Gaudi's surface, text and border tokens.
const managerThemes = {
  light: create({ base: 'light', appBorderRadius: 0, inputBorderRadius: 0 }),
  dark: create({
    base: 'dark',
    appBorderRadius: 0,
    inputBorderRadius: 0,
    appBg: '#1a1a1a',
    appContentBg: '#1a1a1a',
    appPreviewBg: '#1a1a1a',
    barBg: '#1a1a1a',
    appBorderColor: '#303030',
    inputBg: '#262626',
    inputBorder: '#303030',
    textColor: '#d4d4d4',
    textMutedColor: '#a3a3a3',
    barTextColor: '#a3a3a3'
  })
};

const panelConfig = {
  theme: managerThemes.light,
  layout: {
    initialActive: 'canvas',
    showPanel: false
  },
  // The toolbar carries the theme and corner switches, so it always shows, even if a
  // browser remembered "hide toolbar".
  showToolbar: true,
  layoutCustomisations: {
    showPanel: () => false,
    showToolbar: () => true
  },
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
    renderLabel: ({ name }) => createElement('span', {
      className: 'gaudi-sidebar-label',
      title: name
    }, name),
    filters: {
      'gaudi-pages': isSidebarEntry
    }
  }
};

addons.setConfig(panelConfig);

addons.register('gaudi/theme-sync', (api) => {
  const apply = ({ globals }) => {
    const theme = globals?.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    api.setOptions({ theme: managerThemes[theme] });
  };
  const channel = api.getChannel();
  channel.on(SET_GLOBALS, apply);
  channel.on(GLOBALS_UPDATED, apply);
});

const MOBILE_QUERY = '(max-width: 768px)';
const RESPONSIVE_VIEWPORT = '100pct-100pct';
const VIEWPORTS = [
  { label: 'Responsive', value: RESPONSIVE_VIEWPORT },
  { label: 'Mobile', value: 'mobile1' },
  { label: 'Tablet', value: 'tablet' }
];

const createManagerButton = ({ className, icon, label, onClick }) => {
  const button = document.createElement('button');
  const iconElement = document.createElement('span');

  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.addEventListener('click', onClick);

  iconElement.className = 'gaudi-manager-icon';
  iconElement.setAttribute('aria-hidden', 'true');
  iconElement.textContent = icon;
  button.append(iconElement);

  return button;
};

const closeMobileMenu = (restoreFocus = true) => {
  const trigger = document.querySelector("button[aria-label='Open navigation menu'][aria-expanded='true']");

  trigger?.click();
  if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus());
};

const enhanceMobileMenu = () => {
  const dialog = document.querySelector("[role='dialog'][aria-label='Menu']");
  const menu = dialog?.querySelector('#storybook-mobile-menu');

  if (!dialog || !menu) return;

  dialog.setAttribute('aria-modal', 'true');

  if (menu.querySelector('.gaudi-mobile-menu-close')) return;

  const closeButton = createManagerButton({
    className: 'gaudi-mobile-menu-close',
    icon: '\u00d7',
    label: 'Close navigation menu',
    onClick: closeMobileMenu
  });

  menu.prepend(closeButton);
  window.requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
};

const enhanceMobileToolbar = (api) => {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;

  const bar = document.querySelector("header[role='banner'].sb-bar");

  if (!bar || bar.querySelector('.gaudi-mobile-preview-tools')) return;

  const tools = document.createElement('div');
  const theme = api.getGlobals().theme === 'dark' ? 'dark' : 'light';
  const viewport = api.getGlobals().viewport?.value || RESPONSIVE_VIEWPORT;
  const viewportIndex = Math.max(VIEWPORTS.findIndex(({ value }) => value === viewport), 0);
  const currentViewport = VIEWPORTS[viewportIndex];

  tools.className = 'gaudi-mobile-preview-tools';
  tools.setAttribute('aria-label', 'Preview tools');
  tools.setAttribute('role', 'group');

  const viewportButton = createManagerButton({
    className: 'gaudi-mobile-preview-tool gaudi-mobile-preview-tool--viewport',
    icon: '',
    label: `Preview viewport: ${currentViewport.label}`,
    onClick: () => {
      const current = api.getGlobals().viewport?.value || RESPONSIVE_VIEWPORT;
      const currentIndex = Math.max(VIEWPORTS.findIndex(({ value }) => value === current), 0);
      const next = VIEWPORTS[(currentIndex + 1) % VIEWPORTS.length];

      api.updateGlobals({ viewport: { isRotated: false, value: next.value } });
      viewportButton.setAttribute('aria-label', `Preview viewport: ${next.label}`);
      viewportButton.title = `Preview viewport: ${next.label}`;
    }
  });
  const themeButton = createManagerButton({
    className: 'gaudi-mobile-preview-tool',
    icon: theme === 'dark' ? '\u2600' : '\u25d0',
    label: `Preview theme: ${theme === 'dark' ? 'Dark' : 'Light'}`,
    onClick: () => {
      const next = api.getGlobals().theme === 'dark' ? 'light' : 'dark';

      api.updateGlobals({ theme: next });
      themeButton.firstElementChild.textContent = next === 'dark' ? '\u2600' : '\u25d0';
      themeButton.setAttribute('aria-label', `Preview theme: ${next === 'dark' ? 'Dark' : 'Light'}`);
      themeButton.title = `Preview theme: ${next === 'dark' ? 'Dark' : 'Light'}`;
    }
  });

  tools.append(viewportButton, themeButton);
  bar.append(tools);
};

const hardenViewportControls = () => {
  document.querySelectorAll("main[aria-labelledby='main-preview-heading'] :is(input[data-size-input], button[aria-label='Rotate viewport'])")
    .forEach((control) => {
      control.style.setProperty('min-height', '44px', 'important');
      control.style.setProperty('min-width', '44px', 'important');

      if (control.matches('input[data-size-input]')) {
        control.style.setProperty('height', '44px', 'important');
        control.parentElement?.style.setProperty('height', '44px', 'important');
        control.parentElement?.style.setProperty('min-height', '44px', 'important');
        control.parentElement?.parentElement?.style.setProperty('height', '44px', 'important');
        control.parentElement?.parentElement?.style.setProperty('min-height', '44px', 'important');
      } else {
        control.style.setProperty('height', '44px', 'important');
        control.style.setProperty('width', '44px', 'important');
      }
    });

  document.querySelectorAll("main[aria-labelledby='main-preview-heading'] button[aria-hidden='true'][aria-disabled='true']")
    .forEach((label) => {
      label.disabled = true;
      label.tabIndex = -1;
    });
};

addons.register('gaudi/mobile-manager-accessibility', (api) => {
  let frame = null;
  const updateManager = () => {
    if (frame) return;

    frame = window.requestAnimationFrame(() => {
      frame = null;
      enhanceMobileMenu();
      enhanceMobileToolbar(api);
      hardenViewportControls();
    });
  };

  const observer = new MutationObserver(updateManager);

  observer.observe(document.body, { childList: true, subtree: true });
  window.matchMedia(MOBILE_QUERY).addEventListener('change', updateManager);
  document.addEventListener('click', (event) => {
    const navigationTarget = event.target.closest("#storybook-mobile-menu :is(a[href*='?path='], [role='option'])");

    // Storybook stops bubbling on story links; close after its navigation handler.
    if (navigationTarget) queueMicrotask(() => closeMobileMenu(false));
  }, true);
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !document.querySelector("[role='dialog'][aria-label='Menu']")) return;

    event.preventDefault();
    event.stopPropagation();
    closeMobileMenu();
  }, true);

  updateManager();
});
