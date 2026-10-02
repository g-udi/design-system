# Pattern coverage

Gaudi's pattern catalogue documents every component family with working examples. New patterns follow one rule: extend a matching Gaudi owner and add a component only for a distinct gap.

The catalogue covers **110 families and 464 examples**. Existing convenience APIs remain available; matching compositions extend their current Gaudi owner.

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
- Chat (`@gaudi/design-system/chat`) adds messages, bubbles, transcript scrolling, the composer and assistant reply parts; Core adds attachments and questionnaires. File-upload and message examples use local simulated data; applications supply persistence, authentication, real uploads, and remote services.
- Code blocks include token highlighting, diffs, folding, search, line selection, diagnostics, actions, and terminal output. Color output is mixed toward the theme text color to keep small code legible.

## Coverage by owner

| Family | Gaudi owner | Examples |
| --- | --- | ---: |
| accordion | [core/Accordion](src/components/core/Accordion/index.js) | 7 |
| alert | [core/Banner](src/components/core/Banner/index.js) | 5 |
| alert-dialog | [core/Dialog](src/components/core/Dialog/index.js) | 6 |
| area-chart | [charts/AreaChart](src/components/charts/AreaChart/index.js) | 2 |
| aspect-ratio | [core/AspectRatio](src/components/core/AspectRatio/index.js) | 1 |
| attachment | [core/Attachment](src/components/core/Attachment/index.js) | 4 |
| autocomplete | [core/Select](src/components/core/Select/index.js) | 4 |
| avatar | [core/Avatar](src/components/core/Avatar/index.js) | 10 |
| badge | [core/Pill](src/components/core/Pill/index.js) | 4 |
| bar-chart | [charts/BarChart](src/components/charts/BarChart/index.js) | 2 |
| box-plot-chart | [charts/BoxPlotChart](src/components/charts/BoxPlotChart/index.js) | 1 |
| breadcrumb | [core/Breadcrumb](src/components/core/Breadcrumb/index.js) | 5 |
| bubble | [chat/Bubble](src/components/chat/Bubble/index.js) | 4 |
| button | [core/Button](src/components/core/Button/index.js) | 7 |
| button-group | [core/ButtonGroup](src/components/core/ButtonGroup/index.js) | 9 |
| calendar | [core/Calendar](src/components/core/Calendar/index.js) | 8 |
| card | [core/Card](src/components/core/Card/index.js) | 8 |
| carousel | [core/Carousel](src/components/core/Carousel/index.js) | 4 |
| cascader | [core/Cascader](src/components/core/Cascader/index.js) | 12 |
| chart-frame | [charts/ChartFrame](src/components/charts/ChartFrame/index.js) | 1 |
| chat | [blocks/Chat](src/components/blocks/Chat/index.js) | 4 |
| chat-delegation | [chat/ChatDelegation](src/components/chat/ChatDelegation/index.js) | 1 |
| chat-error | [chat/ChatError](src/components/chat/ChatError/index.js) | 1 |
| chat-file | [chat/ChatFile](src/components/chat/ChatFile/index.js) | 1 |
| chat-sources | [chat/ChatSources](src/components/chat/ChatSources/index.js) | 1 |
| chat-tool | [chat/ChatTool](src/components/chat/ChatTool/index.js) | 1 |
| checkbox | [core/Checkbox](src/components/core/Checkbox/index.js) | 6 |
| code-block | [core/CodeBlock](src/components/core/CodeBlock/index.js) | 10 |
| collapsible | [core/Accordion](src/components/core/Accordion/index.js) | 5 |
| combobox | [core/Select](src/components/core/Select/index.js) | 8 |
| command | [core/Commander](src/components/core/Commander/index.js) | 3 |
| context-menu | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 2 |
| data-grid | [core/DataTable](src/components/core/DataTable/index.js) | 13 |
| date-selector | [core/Calendar](src/components/core/Calendar/index.js) | 3 |
| dialog | [core/Dialog](src/components/core/Dialog/index.js) | 5 |
| donut-chart | [charts/DonutChart](src/components/charts/DonutChart/index.js) | 2 |
| drawer | [core/Dialog](src/components/core/Dialog/index.js) | 1 |
| dropdown-menu | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 5 |
| empty | [core/EmptyState](src/components/core/EmptyState/index.js) | 4 |
| event-calendar | [core/EventCalendar](src/components/core/EventCalendar/index.js) | 5 |
| field | [core/Field](src/components/core/Field/index.js) | 5 |
| file-upload | [core/FileUpload](src/components/core/FileUpload/index.js) | 5 |
| filters | [core/FilterBar](src/components/core/FilterBar/index.js) | 6 |
| flow | [core/Flow](src/components/core/Flow/index.js) | 4 |
| forms | [blocks/Forms](src/components/blocks/Forms/index.js) | 17 |
| funnel-chart | [charts/FunnelChart](src/components/charts/FunnelChart/index.js) | 1 |
| gantt | [core/Gantt](src/components/core/Gantt/index.js) | 8 |
| gauge-chart | [charts/GaugeChart](src/components/charts/GaugeChart/index.js) | 1 |
| heatmap-chart | [charts/HeatmapChart](src/components/charts/HeatmapChart/index.js) | 1 |
| histogram-chart | [charts/HistogramChart](src/components/charts/HistogramChart/index.js) | 1 |
| hover-card | [core/Popover](src/components/core/Popover/index.js) | 3 |
| icon-stack | [core/Icon](src/components/core/Icon/index.js) | 2 |
| icon-tile | [core/Icon](src/components/core/Icon/index.js) | 3 |
| input | [core/Input](src/components/core/Input/index.js) | 4 |
| input-group | [core/Input](src/components/core/Input/index.js) | 7 |
| input-otp | [core/InputOtp](src/components/core/InputOtp/index.js) | 1 |
| item | [blocks/ResourceList](src/components/blocks/ResourceList/index.js) | 7 |
| kanban | [core/KanbanBoard](src/components/core/KanbanBoard/index.js) | 10 |
| kbd | [core/Kbd](src/components/core/Kbd/index.js) | 2 |
| label | [core/Field](src/components/core/Field/index.js) | 2 |
| line-chart | [charts/LineChart](src/components/charts/LineChart/index.js) | 1 |
| marker | [core/Marker](src/components/core/Marker/index.js) | 4 |
| menubar | [core/DropdownMenu](src/components/core/DropdownMenu/index.js) | 1 |
| message | [chat/Message](src/components/chat/Message/index.js) | 2 |
| message-scroller | [chat/MessageList](src/components/chat/MessageList/index.js) | 6 |
| native-select | [core/Select](src/components/core/Select/index.js) | 1 |
| navigation-menu | [core/NavigationMenu](src/components/core/NavigationMenu/index.js) | 1 |
| number-field | [core/NumberField](src/components/core/NumberField/index.js) | 2 |
| pagination | [core/Pagination](src/components/core/Pagination/index.js) | 4 |
| phone-input | [core/PhoneInput](src/components/core/PhoneInput/index.js) | 1 |
| popover | [core/Popover](src/components/core/Popover/index.js) | 5 |
| progress | [core/Progress](src/components/core/Progress/index.js) | 4 |
| prompt-composer | [chat/ChatInput](src/components/chat/ChatInput/index.js) | 3 |
| questionnaire | [core/Questionnaire](src/components/core/Questionnaire/index.js) | 4 |
| radar-chart | [charts/RadarChart](src/components/charts/RadarChart/index.js) | 1 |
| radial-chart | [charts/RadialChart](src/components/charts/RadialChart/index.js) | 1 |
| radio-group | [core/RadioGroup](src/components/core/RadioGroup/index.js) | 5 |
| range-chart | [charts/RangeChart](src/components/charts/RangeChart/index.js) | 1 |
| rating | [core/Rating](src/components/core/Rating/index.js) | 4 |
| resizable | [core/Resizable](src/components/core/Resizable/index.js) | 2 |
| sankey-chart | [charts/SankeyChart](src/components/charts/SankeyChart/index.js) | 1 |
| scatter-chart | [charts/ScatterChart](src/components/charts/ScatterChart/index.js) | 1 |
| scheduling | [blocks/Scheduling](src/components/blocks/Scheduling/index.js) | 7 |
| screens | [blocks/Screens](src/components/blocks/Screens/index.js) | 25 |
| scroll-area | [core/ScrollArea](src/components/core/ScrollArea/index.js) | 2 |
| scrollspy | [core/Scrollspy](src/components/core/Scrollspy/index.js) | 1 |
| select | [core/Select](src/components/core/Select/index.js) | 7 |
| separator | [core/Separator](src/components/core/Separator/index.js) | 3 |
| sheet | [core/Sheet](src/components/core/Sheet/index.js) | 8 |
| sidebar | [blocks/AppShell](src/components/blocks/AppShell/index.js) | 5 |
| skeleton | [core/Skeleton](src/components/core/Skeleton/index.js) | 6 |
| slider | [core/Slider](src/components/core/Slider/index.js) | 4 |
| sonner | [core/Toast](src/components/core/Toast/index.js) | 4 |
| sortable | [core/Sortable](src/components/core/Sortable/index.js) | 4 |
| sparkline | [charts/Sparkline](src/components/charts/Sparkline/index.js) | 1 |
| spinner | [core/Spinner](src/components/core/Spinner/index.js) | 3 |
| stacked-bar-list | [charts/StackedBarList](src/components/charts/StackedBarList/index.js) | 1 |
| dashboard | [blocks/Dashboard](src/components/blocks/Dashboard/index.js) | 8 |
| stat-cards | [blocks/StatCard](src/components/blocks/StatCard/index.js) | 9 |
| stepper | [core/Stepper](src/components/core/Stepper/index.js) | 6 |
| switch | [core/Switch](src/components/core/Switch/index.js) | 4 |
| table | [mdx/Table](src/components/mdx/Table/index.js) | 7 |
| tabs | [core/Tabs](src/components/core/Tabs/index.js) | 3 |
| textarea | [core/Textarea](src/components/core/Textarea/index.js) | 2 |
| timeline | [core/Timeline](src/components/core/Timeline/index.js) | 6 |
| toggle | [core/ToggleGroup](src/components/core/ToggleGroup/index.js) | 3 |
| toggle-group | [core/ToggleGroup](src/components/core/ToggleGroup/index.js) | 3 |
| tooltip | [core/Tooltip](src/components/core/Tooltip/index.js) | 5 |
| tree | [core/Tree](src/components/core/Tree/index.js) | 3 |
| treemap-chart | [charts/TreemapChart](src/components/charts/TreemapChart/index.js) | 1 |
| waterfall-chart | [charts/WaterfallChart](src/components/charts/WaterfallChart/index.js) | 1 |

## Source and maintenance

Licenses for adapted code are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The checked-in [coverage manifest](.storybook/fixtures/patterns/coverage.json) records each example’s source path, original hash, owner, and Storybook ID. [Public name mappings](.storybook/fixtures/patterns/public-names.json) record compatibility aliases. The implementations are maintained in their Gaudi owners.

## Verification

See [PATTERN-VERIFICATION.md](PATTERN-VERIFICATION.md) for the final checks and viewport coverage.
