export default {
  "Layout/LayoutWrapper": {
    "description": "Client-safe page shell composed from navigation, one main landmark, and Footer.",
    "accessibility": "Provides a single main landmark. Do not nest this shell inside another main element or use it alongside LayoutContainer.",
    "props": [["children", "ReactNode", "—", "Page content placed in main."], ["footerProps", "Footer props", "—", "Host-owned footer content and newsletter configuration."]],
    "usage": "import LayoutWrapper from '@gaudi/design-system/layout/LayoutWrapper';\n\n<LayoutWrapper footerProps={footerProps}>\n  <h1>Latest articles</h1>\n  {postList}\n</LayoutWrapper>"
  }
};
