# Application interfaces in Gaudi

Application interfaces are a first-class part of Gaudi's curated design system, alongside the blog and editorial experiences. Shared foundations support controls, data views, navigation, feedback, and complete workflows that can be reused across products.

The local Mav9 design system informed component ownership, controlled state, recovery, and example depth. ReUI's public [components](https://reui.io/components) and [application blocks](https://reui.io/blocks/application/) informed the category audit and use cases. The component collection adapts MIT-licensed ReUI source into Gaudi owners; see [REUI-COVERAGE.md](REUI-COVERAGE.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Application blocks are authored for Gaudi. No Mav9 implementation or Pro application-block source was copied.

## Explore the system

- **Landing:** the system introduction and entry points.
- **Getting Started:** installation, styles, and component imports.
- **Essentials:** tokens, typography, icons, states, and accessibility.
- **Component Catalogue:** search components and examples across Core, Blocks, Navigation, MDX, Post, and Layout. Choose the Blocks area for application compositions, or search a use case directly.


The content workspace is one application example: article search, sorting, selection, pagination, draft creation, bulk review, a board, activity, and settings. Its editorial data illustrates how the reusable controls fit together; consuming applications supply their own records and actions.

## Component families

| Area | Examples in Gaudi |
| --- | --- |
| Identity and navigation | Avatar, Breadcrumb, NavigationMenu, Commander, Tree |
| Forms and selection | Input, Field, Select, Checkbox, RadioGroup, InputOtp, PhoneInput, Rating, Cascader |
| Overlays and feedback | Dialog, DropdownMenu, Popover, Tooltip, Toast, Progress, EmptyState |
| Data and collections | DataTable and composable data-grid parts, FilterBar, Pagination, ResourceList |
| Time and activity | Calendar, EventCalendar, Gantt, Timeline, Stepper |
| Files and communication | FileUpload, Attachment, Message |
| Composition and workflows | Tabs, Resizable, Sortable, AppShell, SettingsPanel, Wizard, KanbanBoard |

This is a navigation guide, not a feature guarantee for every component. Use the owner documentation and working examples to check the specific API, states, and interactions you need. The ReUI coverage manifest is the source for that collection's family and example inventory.

## Integration boundaries

- DataTable's convenience API handles client collections. Richer data-grid compositions live under the same owner. Use the documented API for the selected composition and provide stable row IDs, application records, and host callbacks.
- KanbanBoard exposes keyboard and touch move menus. Sortable provides drag-and-drop compositions; applications define their workflow rules.
- Calendar, EventCalendar, and Gantt provide time-based interfaces. Applications own scheduling rules, persistence, and external calendar integrations.
- Authentication, uploads, messages, and saves use host integrations. Storybook examples use illustrative data and local state; they do not establish working services or persistence.
- Blocks own reusable layout and interaction. Product fixtures stay in Storybook and are never imported by runtime components. MDX components remain in the MDX entrypoint.

## Verification

Run `pnpm lint`, `pnpm test:contracts`, and the changed Storybook interaction/axe suite. Verify affected layouts across phones, tablets, laptops, wide desktops, and nearby breakpoints. [APPLICATION-VERIFICATION.md](APPLICATION-VERIFICATION.md) records the initial application pass; [REUI-VERIFICATION.md](REUI-VERIFICATION.md) records the later catalogue expansion and component follow-ups. Read their scope and dates when assessing coverage.
