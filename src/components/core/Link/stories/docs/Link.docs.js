export default {
  "Core/Link": {
    'accessibility': 'Link renders Next links for internal URLs, anchors for fragments, and safe external anchors with noopener noreferrer.',
    'description': 'Link centralizes navigation semantics for internal, anchor, and external links.',
    'props': [['children', 'ReactNode', '-', 'Visible link label.'], ['href', 'internal | anchor | external URL', '-', 'Internal routes use Next Link; anchors and external URLs use native anchors.'], ['prefetch', 'boolean', 'true', 'Next.js prefetch behavior for internal links.'], ['variant', 'inline | muted | nav | bare', 'inline', 'Text link style: inline takes tone, muted is secondary gray, nav is strong gray turning blue on hover, bare inherits the parent color.'], ['tone', 'accent | attention | danger | discovery | info | neutral | success | warning', 'neutral', 'Color family of the inline variant. Default is black/gray and turns blue on hover. muted, nav, and bare have fixed colors and ignore tone.'], ['className', 'string', '-', 'Root class override.']],
    usage: "import { Link } from '@gaudi/design-system';\n\n<Link href='/blog' variant='inline' tone='blue'>Read the blog</Link>"
  }
};
