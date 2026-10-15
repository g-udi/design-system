export default {
  "Blocks/Page Chrome": {
    "description": "Per-page switches for LayoutContainer's site chrome: render it in a page to hide the layout background or the page scroll edges while that page is shown.",
    "accessibility": "Renders only a hidden, aria-hidden marker and affects decorative layers only: the background and scroll edges are aria-hidden, so no content, landmark or focus order changes.",
    "props": [
      ["background", "boolean", "true", "Show LayoutContainer's background on this page: the background slot, or the default Borealis. false hides it."],
      ["scrollEdges", "boolean", "true", "Show the page-level ScrollEdges (those without a targetRef). false hides them; scroll areas keep theirs."]
    ],
    "usage": "import PageChrome from '@gaudi/design-system/layout/PageChrome';\n\n// app/about/page.js: the page draws its own header background.\nexport default function AboutPage() {\n  return (\n    <>\n      <PageChrome background={ false } />\n      <AboutHeader />\n    </>\n  );\n}"
  }
};
