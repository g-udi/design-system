# Footer

One footer owner for blog and marketing pages. Import from `@gaudi/design-system/layout/Footer`.

- `standard` places navigation beside the shared `NewsletterForm`.
- `editorial` places a brand and social links beside grouped navigation.
- `centered` centers the brand, a flat list of links, social links, and copyright.
- `compact` puts the brand, flat navigation, and social links in a row when the container permits.

Supply `sections` as `{ title, links: [{ href, label }] }[]`, `socialLinks` as `{ kind, href }[]`, and `copyrightName` as a name or author object. Content and destinations belong to the host. Empty navigation and social groups are omitted. The simple variants flatten the supplied navigation groups.

`brandTitle` accepts a React node, including `GaudiBrand`; `brandDescription` supplies the supporting text. `className` and native footer attributes pass through to the landmark. Each instance generates a unique accessible heading.

`newsletterProps` goes to `NewsletterForm`. An endpoint is required to enable subscriptions; the examples use local sample responses and never subscribe an address. Custom form classes merge with the footer defaults.

The footer responds to its container, so it can be used in page layouts and inset regions. The host owns the outer width and horizontal gutters. Keep each page's footer outside its main landmark.
