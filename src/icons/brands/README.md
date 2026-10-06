# Brand logos

Brand logos are small React SVG components (`Slack`, `Stripe`, `Openai`, `GithubDark`, …), available through explicit `@gaudi/design-system/icons/brands/*` entries. Story fixtures use them to identify integrations, connected apps and model providers.

## Official Gaudi artwork

The four original SVGs in `artwork/` are the official Gaudi symbol and wordmark supplied by the owner. `light` means white artwork, and `dark` means black artwork. Their paths and proportions are preserved.

Use `GaudiBrand` for all demo and content headers: the official G tile followed by ordinary “Gaudi” text. The default tile is dark with a white mark in both themes. `GaudiLogo` renders the tile alone; pass `tone="light"` for a white tile with a black mark, or `tile={false}` for the bare original symbol. The Getting Started heading uses a 32px tile beside ordinary “Gaudi Design System” text. The graphic `GaudiWordmark` remains available as artwork but is not used in demos or combined with the symbol. Keep Storybook's sidebar unbranded.

Import from `@gaudi/design-system/icons/brands/gaudi`. All components accept `className` and native element props. `GaudiBrand` hides its decorative tile from screen readers and exposes its visible text. `GaudiLogo` and `GaudiWordmark` have the accessible name “Gaudi”; use `aria-hidden` when a nearby name or labelled link already identifies the brand. `GaudiLogo` is also available as the `Gaudi` icon registry entry. Other agent motifs and third-party logos remain separate identities.

```jsx
import { GaudiBrand, GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';

<GaudiBrand className="text-sm" />
<GaudiLogo className="size-8" />
<GaudiLogo tone="light" className="size-8" />
```

`GaudiBrand` uses a 24px tile by default. Use `logoClassName` to set its size independently of the label.

Run `pnpm brand:build` to regenerate the components, Storybook artwork copies, dark SVG favicon, 16/32/48px PNGs, multi-size ICO, 180px Apple touch icon, and 192/512px app icons. Downloadable tiles are generated under `.storybook/public/brand/` as `gaudi-icon-light.svg` and `gaudi-icon-dark.svg`, with matching 512px PNGs. These names describe the background, unlike the original artwork filenames. Root `favicon.svg` and `favicon.ico` copies cover browser fallback requests. Generated files should not be edited independently.

## Trademark notice

These logos are trademarks of their respective owners. They are used for identification only, and no endorsement is implied. Follow each owner's brand guidelines if you reuse a logo.

## Provenance

The source was not recorded when the files were added; they are kept by owner decision. A path-data comparison on 5 October 2026 found:

- 17 of 18 files match logos in [svgl](https://svgl.app) ([pheralb/svgl](https://github.com/pheralb/svgl), [MIT](https://github.com/pheralb/svgl/blob/main/LICENSE)), the likely source: `anthropicBlack`, `anthropicWhite`, `claudeAiIcon`, `cursorLight`, `discord`, `dropbox`, `gemini`, `githubDark`, `githubLight`, `loom`, `openai`, `openaiDark` (svgl's OpenAI logo before September 2026), `redis`, `slack`, `stripe`, `supabase` and `zoom`.
- `googleDrive` matches no logo in svgl, [Simple Icons](https://simpleicons.org) ([CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md)) or [SVG Logos](https://github.com/gilbarbara/logos); its source is unknown.
- None of the files match Simple Icons path data.

The svgl MIT notice is kept in [THIRD_PARTY_LICENSES](../../../THIRD_PARTY_LICENSES). It covers svgl's collection; the marks themselves remain their owners' trademarks.
