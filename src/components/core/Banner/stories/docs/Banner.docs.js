export default {
  "Core/Banner": {
    'accessibility': 'Static banners use status semantics. Linked banners derive their accessible name from the rendered title and body, including rich content; ariaLabel provides an explicit override.',
    'description': 'Banner renders a compact announcement strip.',
    'props': [['title', 'ReactNode', '-', 'Optional bold leading text.'], ['children', 'ReactNode', '-', 'Announcement body copy.'], ['href', 'string', '-', 'Turns the banner copy into a navigation link.'], ['ariaLabel', 'string', 'Rendered content', 'Optional accessible-name override for linked banners.'], ['size', 'xs | sm | md | lg', 'md', 'Controls vertical and horizontal padding.'], ['tone', 'neutral | accent | info | success | warning | danger | attention | discovery', 'neutral', 'Semantic tone. Hue names (blue, green, amber…) still resolve to these.'], ['variant', 'solid | soft | outline', 'soft', 'Visual treatment.'], ['className', 'string', '-', 'Root class override.'], ['classNames', '{ root, body, action }', '-', 'Slot-level class overrides.']],
    usage: "import { Banner } from '@gaudi/design-system';\n\n<Banner title='Now published' href='/blog'>\n  New essays and project notes are available.\n</Banner>"
  }
};
