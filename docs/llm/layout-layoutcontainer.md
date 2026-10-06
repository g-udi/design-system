# LayoutContainer

> Layout/LayoutContainer · layout · `@gaudi/design-system/layout/LayoutContainer`

Async server layout that composes theme context, navigation, a skip link, article content, footer, and host-provided structured data.

## Import

```js
import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Page content inside the main landmark. |
| `metadata / navigation / preview` | `SiteConfigProvider values` | `{} / — / —` | no | Host site, theme, navigation, and link-preview configuration. |
| `menuProps / footerProps` | `object` | — | no | Navigation and footer presentation props. |
| `jsonLd` | `object \| (() => object \| Promise<object>)` | — | no | Prepared JSON-LD or an async resolver; invalid values are omitted. |
| `analytics` | `ReactNode` | `null` | no | Explicit app-owned analytics element. |

## Usage

```jsx
import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';

export default function RootLayout({ children }) {
  return <LayoutContainer metadata={metadata} navigation={navigation} jsonLd={loadJsonLd}>
    {children}
  </LayoutContainer>;
}
```

## Accessibility

Keep the skip target and the single main landmark. Supply accessible navigation and footer content; analytics and JSON-LD must come from the host.

## Notes

- Import the async component directly from @gaudi/design-system/layout/LayoutContainer in a server component. Resolve request cookies in the host and pass metadata.theme; Gaudi does not read request cookies.

## Related

`blocks-navigation`
