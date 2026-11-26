# Component design

Use this workflow for component requests, including components in a larger build.

First check whether the user or project requires offline or local-only work. If so, use only installed component APIs, local files and examples. Skip every publisher tool, command, network request and catalog fallback URL. End with the local result.

**Start with Gaudi.** Search the component’s job with the Gaudi MCP. Use `get_component` for the owner’s imports, props and variants, `get_examples` for its stories and patterns, and `get_block` for a named example. To browse the entire registry, use `list_blocks({type: "all"})`. When the MCP is unavailable, read the installed package’s `llms.txt`, `llms-full.txt` and `ai/blocks.json`. For a requested web lookup, hosted registry items with source are available at `https://design.gaudi.site/r/<name>.json`.
Use the matching local owner and compose existing primitives to fill gaps. A request to find an existing Gaudi component ends with the local catalog unless the user requests a broader search.

### Find a relevant bookmarked example

For component design or redesign, then automatically consult one relevant bookmark for a concrete interaction, state or layout choice. Use its available skill or MCP and fall back to its public catalog.

1. **Choose a publisher for the request.** Any library in **Useful resources** on the current Credits page, plus orb-ui under **Orbs**, can supply an example. Look for the component’s purpose, interaction or state. Search a directory such as Shoogle if the right publisher is unclear. Keep external queries to generic component terms. [Credits and publisher catalogs](https://design.gaudi.site/md/credits.md)
2. **Read the publisher’s guidance and example.** Use a matching installed consumer skill or the publisher’s published entry. Search the active client’s connected MCP tools, including deferred tools, for that publisher. For a shadcn registry, use `search_items_in_registries` and `view_items_in_registries` when available. Use the project’s existing access for account or subscription features.
3. **Follow the result to an individual item.** For a missing tool or empty search, continue with the publisher’s component page, Markdown or live preview. Respect access denials. If the network is unavailable, use the local Gaudi examples. Apply a specific behavior, layout choice or state that fits the brief using Gaudi’s public imports, tokens and accessibility conventions. Cite an external example when it informs a decision.

## Publisher lookups

Run the package CLI from a project with `@gaudi/design-system` installed. Every Credits bookmark has a provider ID in `componentCatalogs` in the package's `ai/setup.json`. The anonymous MCP clients for affectUI, beUI and Shoogle connect when invoked. Given a `catalog-fallback` result, open its catalog and look for the original term. For Shoogle, follow the matching registry and item to the publisher.

```sh
pnpm exec gaudi-ds inspiration beui search sortable
pnpm exec gaudi-ds inspiration beui item sortable-stack
pnpm exec gaudi-ds inspiration skiper-ui search carousel
```

| Component need | Start here |
| --- | --- |
| Agent timeline or checkpoint | Search affectUI with `affectui search`, then read the result with `affectui item`. The public skill bundle contains the entry at `files[].path == "skills/affectui/SKILL.md"`. [Consumer skill bundle](https://www.affectui.com/r/affectui-skill.json) · [Component index](https://www.affectui.com/llms.txt) |
| Drag, touch or motion | Use the `beui` consumer skill and the search/item commands above. [Consumer skill](https://beui.dev/.well-known/agent-skills/beui/SKILL.md) · [Component registry](https://beui.dev/r) |
| An example across registries | Use `shoogle search` with a generic name. Its `search-registry-items` skill also explains how to narrow a search by registry. [Consumer skill](https://github.com/alibey-10/shoogle/blob/5594bb8dc9f3238857756d23f0ca4eb4c712d238/skills/search-registry-items/SKILL.md) · [Catalog search](https://shoogle.dev/search) |
| A data grid, animated shadcn component or voice orb | For ReUI, read `get_agent_skill` on a connected ReUI MCP or open its public component Markdown. For Cult UI, pass the registry to the shared shadcn MCP or open its component docs. For orb-ui, inspect the Orb API, states or the matching voice adapter. The CLI accepts `reui`, `cult-ui` and `orb-ui` to locate the public catalog. [ReUI index](https://reui.io/llms.txt) · [Cult UI registry](https://www.cult-ui.com/r/registry.json) · [orb-ui docs](https://orb-ui.com/docs) |

## More publisher skills

- For a dense agent interface, read the pinned Atlas design skill and its component or example reference at the same revision. [Atlas skill](https://github.com/pacifio/ui/blob/bac5e272b2da5bb9a391fbc95a0bcbf5fc8cd003/skills/atlas/SKILL.md) · [Components](https://github.com/pacifio/ui/blob/bac5e272b2da5bb9a391fbc95a0bcbf5fc8cd003/skills/atlas/references/components.md) · [Examples](https://github.com/pacifio/ui/blob/bac5e272b2da5bb9a391fbc95a0bcbf5fc8cd003/skills/atlas/references/examples.md)
- For an Arc UI or Shadcn UI Kit block, open the publisher’s consumer skill. A connected Arc MCP can also supply it through `get_skill`. For shadcn/studio, select its creation or refinement guide for the selected block. [Arc UI](https://uiarc.dev/r/skills/arc/SKILL.md) · [Shadcn UI Kit](https://shadcnuikit.com/ai/claude/SKILL.md) · [shadcn/studio create](https://cdn.shadcnstudio.com/ss-assets/mcp/instructions/codex-skill-cui.md) · [shadcn/studio refine](https://cdn.shadcnstudio.com/ss-assets/mcp/instructions/codex-skill-rui.md)
- If the project uses a publisher kit, use its matching installed or entitled skill for that part of the brief, such as React Bits effects, a shadcndesign or shadcncraft Figma frame, or AI SDK Agents patterns. Public component previews remain available where the publisher provides them. [React Bits Pro](https://pro.reactbits.dev/docs/installation) · [shadcndesign skills](https://www.shadcndesign.com/docs/agent-skills) · [shadcncraft skills](https://shadcncraft.com/agent-skills) · [AI SDK Agents skills](https://www.aisdkagents.com/docs/skills)

When the separate Gaudi **Design** skill is installed, its direction and critique playbooks can help with broader interface work. If that skill already selected a publisher or example for this component, reuse the result here and continue with Gaudi’s API.

## Bookmarked component libraries

<!-- BEGIN bookmarks from Credits -->
- [Aceternity UI](https://ui.aceternity.com): 200+ copy-paste components, blocks and landing templates built with Tailwind CSS and Motion.
- [AffectUI](https://www.affectui.com/): React components, screens and interaction patterns for AI products; design inspiration for Gaudi’s chat, agent and context examples, implemented independently with Gaudi primitives.
- [Arc UI](https://uiarc.dev): animated components and blocks for shadcn and Next.js, with an MCP server for agents.
- [Atlas](https://ui.pacifio.dev/) provides design tokens and CSS classes for agent dashboards and mobile interfaces.
- [beUI](https://beui.dev): free, open-source animated components for React and Next.js.
- [RapidNative](https://www.rapidnative.com/) turns prompts into mobile apps built with React Native and Expo.
- [React Bits](https://reactbits.dev): animated React components, text effects and backgrounds.
- [reui](https://reui.io): components, blocks and agent tooling for shadcn/ui.
- [Shoogle](https://shoogle.dev): a search engine for shadcn components, blocks and templates across registries.
- [shadcn.io](https://www.shadcn.io): community components, blocks and tools for shadcn/ui.
- [shadcndesign](https://www.shadcndesign.com/) offers a theme editor, Figma kit and layout blocks for shadcn/ui.
- [registry.directory](https://registry.directory): a directory of shadcn/ui registries.
- [Shadcnblocks](https://www.shadcnblocks.com): ready-made blocks for shadcn/ui.
- [shadcncraft](https://shadcncraft.com): shadcn/ui components and blocks.
- [Shadcn UI Kit](https://shadcnuikit.com): dashboards, templates and components.
- [shadcn/studio](https://shadcnstudio.com): components, blocks and a theme generator.
- [Skiper UI](https://skiper-ui.com): animated components for shadcn/ui.
- [cult/ui](https://www.cult-ui.com): animated components and blocks for shadcn/ui.
- [AI SDK Agents](https://www.aisdkagents.com): agent building blocks for the [AI SDK](https://ai-sdk.dev).
- [orb-ui](https://orb-ui.com) ([source](https://github.com/exprmntl/orb-ui)): the circle, bars, cloud and radial variants.
<!-- END bookmarks from Credits -->
