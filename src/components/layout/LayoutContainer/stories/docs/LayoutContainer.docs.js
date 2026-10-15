export default {
  "Layout/LayoutContainer": {
    "description": "Async server layout that composes theme context, navigation, a skip link, article content, footer, and host-provided structured data.",
    "accessibility": "Keep the skip target and the single main landmark. Supply accessible navigation and footer content; analytics and JSON-LD must come from the host.",
    "props": [["children", "ReactNode", "—", "Page content inside the main landmark."], ["background", "ReactNode", "Borealis", "Decorative full-width layer at the top of the page that scrolls with it and sets its own height (for example 100dvh for the whole window), such as an animated band; replaces the default Borealis."], ["metadata / navigation / preview", "SiteConfigProvider values", "{} / — / —", "Host site, theme, navigation, and link-preview configuration."], ["menuProps / footerProps", "object", "—", "Navigation and footer presentation props."], ["jsonLd", "object | (() => object | Promise<object>)", "—", "Prepared JSON-LD or an async resolver; invalid values are omitted."], ["analytics", "ReactNode", "null", "Explicit app-owned analytics element."]],
    "notes": ["Import the async component directly from @gaudi/design-system/layout/LayoutContainer in a server component. Resolve request cookies in the host and pass metadata.theme; Gaudi does not read request cookies."],
    "usage": "import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';\n\nexport default function RootLayout({ children }) {\n  return <LayoutContainer metadata={metadata} navigation={navigation} jsonLd={loadJsonLd}>\n    {children}\n  </LayoutContainer>;\n}"
  }
};
