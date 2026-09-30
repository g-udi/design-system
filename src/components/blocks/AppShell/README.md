# AppShell

Responsive workspace with desktop navigation, a mobile navigation sheet, header, content landmark and skip link. Pass brand, navigation, header and footer as slots. It stays in document flow.

## Usage

```jsx
<AppShell brand='Gaudi' navigation={navigation} header={<h1>Articles</h1>}>
  <DataTable columns={columns} rows={articles} searchable sortable pagination />
</AppShell>
```

## API

| Prop / export                             | Type      | Contract                                                           |
| ----------------------------------------- | --------- | ------------------------------------------------------------------ |
| `brand / navigation / header / footer`    | ReactNode | Supplied slot content; the host owns route state and active links. |
| `children`                                | ReactNode | Page content inside the shell main landmark.                       |
| `navigationLabel / menuLabel / skipLabel` | string    | Localized accessible labels.                                       |
| `className`                               | string    | Root composition; default desktop rail begins at 1024px.           |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
