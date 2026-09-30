# Animated icon artwork

`AnimatedIcon` extends Gaudi's existing icon owner with opt-in motion. Import it from
`@gaudi/design-system/icons`, the package root, or `@gaudi/design-system/core/Icon`.

```jsx
import { AnimatedIcon } from '@gaudi/design-system/icons';

<AnimatedIcon name="Bell" active={hovered || focused} size="md" color="primary" decorative />
<AnimatedIcon name="RefreshCw" active={isSyncing} size="sm" label="Syncing" />
```

The button, link, or application status owns activation. Artwork is still by default.
One-shot sequences replay on false-to-true activation; Rocket and RefreshCw retain
the Mav9 continuous status treatments. Offscreen icons, hidden documents, and reduced
motion stop animation and restore resting artwork. Instances share one visibility
observer and motion subscription per document, released after the last unmount.
The server and initial client render are still; loading uses the static registry glyph.

Size tokens, semantic colors, label/decorative behavior, SVG props, and refs follow
Gaudi conventions. Numeric sizes are also supported. Brand and other non-Lucide
entries fall back to their existing static artwork. Unknown names render nothing.

## Reconciliation

All Gaudi Lucide names and aliases have animated counterparts. Existing names keep
their actual glyph, even where Mav9 used that name for different artwork. For example,
Gaudi Calendar remains CalendarDays and Link remains Link. CalendarOutline, Link2,
MailOutline, ExternalLinkOutline, and SquareUser expose additional Mav9 artwork
without replacing legacy meanings. The original filled Mail remains static.

The Icons guide includes the searchable, paginated, copyable gallery. Core/Icon
includes the same gallery, working action/status examples, and controlled replay.

## Sources and maintenance

Adapted from the current `fix/ds-audit-cleanup` branch of Mav9's design system at
`564f56bbc69404dce2513c5b81c320ff0100a533`. Mav9's 98 distinct animations use
[lucide-animated](https://github.com/pqoqubbw/icons), pinned to
`072c38b1b04ea738d90a084485ccaad4b890ddca` (MIT; see LICENSE). Artwork lacking an
upstream counterpart uses the exact installed Lucide geometry with a draw treatment
(ISC; see LUCIDE-LICENSE). `sources.json` records the mapping; `animatedIconMetadata`
exposes the canonical glyph and source for every public name.

The catalog JSX preserves Mav9's adapted and cancellable motion sequences. It uses
the existing Framer Motion dependency. React loads imported artwork on demand.

After changing the static registry or source mapping, regenerate and verify:

```sh
node scripts/sync-animated-icons.mjs
node scripts/sync-animated-icons.mjs --check
pnpm test:contracts
```

Review upstream source and licensing when updating artwork. Do not substitute a
similar-looking icon for a missing exact match. Shared animation lifecycle lives in
useArtworkAnimation; specialized multi-controller sequences remain with their glyph.
