# ReUI component reconciliation

ReUI is one source in Gaudi's growing curated design system for the blog and applications. This document tracks that collection; new patterns from other sources follow the same rule: extend a matching Gaudi owner and add a component only for a distinct gap.

Gaudi now owns the implementation and examples for every component family in the ReUI Radix Nova catalogue captured on 29 September 2026: **81 families and 1,149 examples**. Existing convenience APIs remain available; matching compositions extend their current Gaudi owner.

[Browse the component catalogue](http://localhost:6007/?path=/story/overview-component-catalogue--browse). Each example has copyable JSX with public Gaudi imports, its original use case, and automatic accessibility checks.

## Public API

Import from the owner subpath to keep dependencies focused:

```jsx
import '@gaudi/design-system/global.css';
import { Button } from '@gaudi/design-system';
import { CardRoot, CardHeader, CardTitle, CardContent } from '@gaudi/design-system/core/Card';
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@gaudi/design-system/core/NumberField';
```

Existing names keep their meaning. Where a convenience component already occupies a name, the compound root uses a `Root` suffix, or an existing part uses a `Primitive` suffix. Storybook source applies these aliases. For example, `Card` remains the existing card API and `CardRoot` exposes the compound card. `Select` remains the existing option-based select while `SelectRoot`, `Combobox`, and `Autocomplete` expose richer compositions.

Charts, tables, and code blocks remain in `@gaudi/design-system/mdx` and their MDX owner subpaths. Navigation appears under **Blocks / Navigation** in Storybook. Icons resolve through the central Gaudi registry. New parts use Gaudi semantic tokens, light and dark surfaces, reduced-motion preferences, and RTL primitives.

## Implementation and usage boundaries

- Form controls support controlled and uncontrolled composition through their underlying Radix or Base UI APIs. Labels, validation messages, disabled states, keyboard access, and focus behavior belong to the component layer.
- Data Grid adds sorting, selection, grouping, virtualization, resizing, spreadsheet editing, clipboard operations, and server-data examples. The existing TanStack v8 table API is preserved; the advanced grid uses an explicitly aliased v9 dependency.
- Event Calendar and Gantt include scheduling, resources, dependencies, time zones, drag interactions, and range navigation. Kanban, Sortable, and Tree add structured drag and keyboard workflows.
- Messaging adds attachments, bubbles, transcript scrolling, and questionnaires. File-upload and message examples use local simulated data; applications supply persistence, authentication, real uploads, and remote services.
- Code blocks include token highlighting, diffs, folding, search, line selection, diagnostics, actions, and terminal output. Color output is mixed toward the theme text color to keep small code legible.
- ReUI application blocks are a separate catalogue. This reconciliation covers **all component families**, including the component-level sidebar and Kanban examples; it does not claim to import the Pro application-block collection.

## Coverage by owner

| ReUI family | Gaudi owner | Examples |
| --- | --- | ---: |
| [accordion](https://reui.io/components/accordion) | [core/Accordion](src/components/core/Accordion/index.js) | 11 |
| [alert](https://reui.io/components/alert) | [core/Banner](src/components/core/Banner/index.js) | 20 |
| [alert-dialog](https://reui.io/components/alert-dialog) | [core/Dialog](src/components/core/Dialog/index.js) | 14 |
| [aspect-ratio](https://reui.io/components/aspect-ratio) | [core/AspectRatio](src/components/core/AspectRatio/index.js) | 8 |
| [attachment](https://reui.io/components/attachment) | [core/Attachment](src/components/core/Attachment/index.js) | 6 |
| [autocomplete](https://reui.io/components/autocomplete) | [core/Select](src/components/core/Select/index.js) | 12 |
| [avatar](https://reui.io/components/avatar) | [core/Avatar](src/components/core/Avatar/index.js) | 35 |
| [badge](https://reui.io/components/badge) | [core/Pill](src/components/core/Pill/index.js) | 25 |
| [breadcrumb](https://reui.io/components/breadcrumb) | [core/Breadcrumb](src/components/core/Breadcrumb/index.js) | 15 |
| [bubble](https://reui.io/components/bubble) | [core/Message](src/components/core/Message/index.js) | 7 |
| [button](https://reui.io/components/button) | [core/Button](src/components/core/Button/index.js) | 61 |
| [button-group](https://reui.io/components/button-group) | [core/ButtonGroup](src/components/core/ButtonGroup/index.js) | 57 |
| [calendar](https://reui.io/components/calendar) | [core/Calendar](src/components/core/Calendar/index.js) | 30 |
| [card](https://reui.io/components/card) | [core/Card](src/components/core/Card/index.js) | 18 |
| [carousel](https://reui.io/components/carousel) | [core/Carousel](src/components/core/Carousel/index.js) | 11 |
| [cascader](https://reui.io/components/cascader) | [core/Cascader](src/components/core/Cascader/index.js) | 20 |
| [chart](https://reui.io/components/chart) | [mdx/Chart](src/components/mdx/Chart/index.js) | 25 |
| [checkbox](https://reui.io/components/checkbox) | [core/Checkbox](src/components/core/Checkbox/index.js) | 22 |
| [code-block](https://reui.io/components/code-block) | [mdx/CodeGroupTabs](src/components/mdx/CodeGroupTabs/index.js) | 27 |
| [collapsible](https://reui.io/components/collapsible) | [core/Accordion](src/components/core/Accordion/index.js) | 10 |
| [combobox](https://reui.io/components/combobox) | [core/Select](src/components/core/Select/index.js) | 28 |
| [command](https://reui.io/components/command) | [core/Commander](src/components/core/Commander/index.js) | 8 |
| [context-menu](https://reui.io/components/context-menu) | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 10 |
| [data-grid](https://reui.io/components/data-grid) | [core/DataTable](src/components/core/DataTable/index.js) | 12 |
| [date-selector](https://reui.io/components/date-selector) | [core/Calendar](src/components/core/Calendar/index.js) | 4 |
| [dialog](https://reui.io/components/dialog) | [core/Dialog](src/components/core/Dialog/index.js) | 10 |
| [drawer](https://reui.io/components/drawer) | [core/Dialog](src/components/core/Dialog/index.js) | 5 |
| [dropdown-menu](https://reui.io/components/dropdown-menu) | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 18 |
| [empty](https://reui.io/components/empty) | [core/EmptyState](src/components/core/EmptyState/index.js) | 20 |
| [event-calendar](https://reui.io/components/event-calendar) | [core/EventCalendar](src/components/core/EventCalendar/index.js) | 5 |
| [field](https://reui.io/components/field) | [core/Field](src/components/core/Field/index.js) | 11 |
| [file-upload](https://reui.io/components/file-upload) | [core/FileUpload](src/components/core/FileUpload/index.js) | 10 |
| [filters](https://reui.io/components/filters) | [core/FilterBar](src/components/core/FilterBar/index.js) | 12 |
| [frame](https://reui.io/components/frame) | [core/Card](src/components/core/Card/index.js) | 19 |
| [gantt](https://reui.io/components/gantt) | [core/Gantt](src/components/core/Gantt/index.js) | 7 |
| [hover-card](https://reui.io/components/hover-card) | [core/Popover](src/components/core/Popover/index.js) | 8 |
| [icon-stack](https://reui.io/components/icon-stack) | [core/Icon](src/components/core/Icon/index.js) | 6 |
| [icon-tile](https://reui.io/components/icon-tile) | [core/Icon](src/components/core/Icon/index.js) | 17 |
| [input](https://reui.io/components/input) | [core/Input](src/components/core/Input/index.js) | 31 |
| [input-group](https://reui.io/components/input-group) | [core/Input](src/components/core/Input/index.js) | 40 |
| [input-otp](https://reui.io/components/input-otp) | [core/InputOtp](src/components/core/InputOtp/index.js) | 6 |
| [item](https://reui.io/components/item) | [blocks/ResourceList](src/components/blocks/ResourceList/index.js) | 12 |
| [kanban](https://reui.io/components/kanban) | [blocks/KanbanBoard](src/components/blocks/KanbanBoard/index.js) | 6 |
| [kbd](https://reui.io/components/kbd) | [core/Kbd](src/components/core/Kbd/index.js) | 6 |
| [label](https://reui.io/components/label) | [core/Field](src/components/core/Field/index.js) | 13 |
| [marker](https://reui.io/components/marker) | [core/Marker](src/components/core/Marker/index.js) | 6 |
| [menubar](https://reui.io/components/menubar) | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 5 |
| [message](https://reui.io/components/message) | [core/Message](src/components/core/Message/index.js) | 7 |
| [message-scroller](https://reui.io/components/message-scroller) | [core/Message](src/components/core/Message/index.js) | 6 |
| [native-select](https://reui.io/components/native-select) | [core/Select](src/components/core/Select/index.js) | 6 |
| [navigation-menu](https://reui.io/components/navigation-menu) | [core/NavigationMenu](src/components/core/NavigationMenu/index.js) | 4 |
| [number-field](https://reui.io/components/number-field) | [core/NumberField](src/components/core/NumberField/index.js) | 6 |
| [pagination](https://reui.io/components/pagination) | [core/Pagination](src/components/core/Pagination/index.js) | 15 |
| [phone-input](https://reui.io/components/phone-input) | [core/PhoneInput](src/components/core/PhoneInput/index.js) | 8 |
| [popover](https://reui.io/components/popover) | [core/Popover](src/components/core/Popover/index.js) | 11 |
| [progress](https://reui.io/components/progress) | [core/Progress](src/components/core/Progress/index.js) | 8 |
| [questionnaire](https://reui.io/components/questionnaire) | [core/Questionnaire](src/components/core/Questionnaire/index.js) | 7 |
| [radio-group](https://reui.io/components/radio-group) | [core/RadioGroup](src/components/core/RadioGroup/index.js) | 17 |
| [rating](https://reui.io/components/rating) | [core/Rating](src/components/core/Rating/index.js) | 9 |
| [resizable](https://reui.io/components/resizable) | [core/Resizable](src/components/core/Resizable/index.js) | 10 |
| [scroll-area](https://reui.io/components/scroll-area) | [core/ScrollArea](src/components/core/ScrollArea/index.js) | 5 |
| [scrollspy](https://reui.io/components/scrollspy) | [core/Scrollspy](src/components/core/Scrollspy/index.js) | 2 |
| [select](https://reui.io/components/select) | [core/Select](src/components/core/Select/index.js) | 33 |
| [separator](https://reui.io/components/separator) | [core/Separator](src/components/core/Separator/index.js) | 6 |
| [sheet](https://reui.io/components/sheet) | [core/Dialog](src/components/core/Dialog/index.js) | 4 |
| [sidebar](https://reui.io/components/sidebar) | [blocks/AppShell](src/components/blocks/AppShell/index.js) | 5 |
| [skeleton](https://reui.io/components/skeleton) | [core/Skeleton](src/components/core/Skeleton/index.js) | 10 |
| [slider](https://reui.io/components/slider) | [core/Slider](src/components/core/Slider/index.js) | 12 |
| [sonner](https://reui.io/components/sonner) | [core/Toast](src/components/core/Toast/index.js) | 21 |
| [sortable](https://reui.io/components/sortable) | [core/Sortable](src/components/core/Sortable/index.js) | 8 |
| [spinner](https://reui.io/components/spinner) | [core/Spinner](src/components/core/Spinner/index.js) | 12 |
| [stepper](https://reui.io/components/stepper) | [core/Stepper](src/components/core/Stepper/index.js) | 15 |
| [switch](https://reui.io/components/switch) | [core/Switch](src/components/core/Switch/index.js) | 14 |
| [table](https://reui.io/components/table) | [mdx/Table](src/components/mdx/Table/index.js) | 17 |
| [tabs](https://reui.io/components/tabs) | [core/Tabs](src/components/core/Tabs/index.js) | 9 |
| [textarea](https://reui.io/components/textarea) | [core/Textarea](src/components/core/Textarea/index.js) | 6 |
| [timeline](https://reui.io/components/timeline) | [core/Timeline](src/components/core/Timeline/index.js) | 12 |
| [toggle](https://reui.io/components/toggle) | [core/ToggleGroup](src/components/core/ToggleGroup/index.js) | 14 |
| [toggle-group](https://reui.io/components/toggle-group) | [core/ToggleGroup](src/components/core/ToggleGroup/index.js) | 16 |
| [tooltip](https://reui.io/components/tooltip) | [core/Tooltip](src/components/core/Tooltip/index.js) | 16 |
| [tree](https://reui.io/components/tree) | [core/Tree](src/components/core/Tree/index.js) | 7 |

## Source and maintenance

Adapted from the MIT-licensed [Keenthemes ReUI repository](https://github.com/keenthemes/reui), pinned at `6e433ddaba3a4be38182c8c8883b6cc335183c42`, and the live Radix Nova registry for newly published families. Full notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The checked-in [coverage manifest](.storybook/fixtures/reui/coverage.json) records each example’s source path, original hash, owner, and Storybook ID. [Public name mappings](.storybook/fixtures/reui/public-names.json) record compatibility aliases. These files are provenance; the adapted implementations are now maintained in their Gaudi owners. Do not overwrite them with unreviewed upstream regeneration.

## Verification

See [REUI-VERIFICATION.md](REUI-VERIFICATION.md) for the final checks and viewport coverage.
