export default {
  "Blocks/Page Header": {
    "description": "Page or section introduction: optional eyebrow, a title (h1 by default), description and actions, with optional sticky and divider modes.",
    "accessibility": "Renders a header element with one heading at the level you choose; keep a single h1 per page and use titleAs='h2' for section headers. Give a sticky header a titleId and point the region it labels at it with aria-labelledby. Actions keep their own accessible names.",
    "props": [
      ["title", "ReactNode", "—", "The heading text."],
      ["titleAs", "ElementType", "h1", "Heading element; use h2 for sections within a page."],
      ["titleVariant", "Typography variant", "title-md", "Typography style of the title, such as display-lg or heading-lg."],
      ["titleId", "string", "—", "ID for the heading, so a section or list can reference it with aria-labelledby."],
      ["eyebrow", "ReactNode", "—", "Short label above the title."],
      ["description", "ReactNode", "—", "Supporting text below the title."],
      ["actions", "ReactNode", "—", "Controls or meta beside the title, such as a count, filter or button; wraps below on narrow screens."],
      ["sticky", "boolean", "false", "Pin to the top on the page background with a bottom border while the content below scrolls."],
      ["divider", "boolean", "false", "Bottom border separating the header from the content below, without pinning."],
      ["children", "ReactNode", "—", "Extra content below the description, such as filters."],
      ["className", "string", "—", "Additional classes on the header element."],
      ["classNames", "{ root, eyebrow, title, description, actions }", "{}", "Slot class overrides."]
    ],
    "usage": "import PageHeader from '@gaudi/design-system/layout/PageHeader';\n\n<PageHeader eyebrow='Archive' title='Projects' description='Things I have built and maintain.' divider />"
  }
};
