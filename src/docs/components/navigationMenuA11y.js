// Radix's empty focus proxy forwards Tab into the open panel. Leave other hidden controls subject to axe.
export const navigationMenuA11y = {
  config: {
    rules: [
      {
        id: 'aria-hidden-focus',
        selector:
          '[aria-hidden="true"]:not([data-slot="navigation-menu-trigger"][aria-expanded="true"] + span:empty[tabindex="0"][style*="clip"])'
      }
    ]
  }
};
