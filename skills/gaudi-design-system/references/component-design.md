# Component design

Use this workflow for component requests, including components in a larger build.

First check whether the user or project requires offline or local-only work. If so, use only installed component APIs, local files and examples. Skip every publisher tool, command, network request and catalog fallback URL. End with the local result.

**Start with Gaudi.** Search the component’s job with the Gaudi MCP. Use `get_component` for the owner’s imports, props and variants, `get_examples` for its stories and patterns, and `get_block` for a named example. To browse the entire registry, use `list_blocks({type: "all"})`. When the MCP is unavailable, read the installed package’s `llms.txt`, `llms-full.txt` and `ai/blocks.json`. For a requested web lookup, hosted registry items with source are available at `https://design.gaudi.site/r/<name>.json`.
Use the matching local owner and compose existing primitives to fill gaps. A request to find an existing Gaudi component ends with the local catalog unless the user requests a broader search.

### When the user requests external inspiration

Consult a publisher skill, catalog or external MCP only when the user asks for that publisher’s guidance or explicitly requests external inspiration.

1. **Choose a publisher for the request.** Any library in **Useful resources** on the current Credits page, plus orb-ui under **Orbs**, can supply an example. Look for the component’s purpose, interaction or state. Search a directory such as Shoogle if the right publisher is unclear. Keep external queries to generic component terms. [Credits and publisher catalogs](https://design.gaudi.site/md/credits.md)
2. **Read the publisher’s guidance and example.** Use a matching installed consumer skill or the publisher’s published entry. Search the active client’s connected MCP tools, including deferred tools, for that publisher. For a shadcn registry, use `search_items_in_registries` and `view_items_in_registries` when available. Use the project’s existing access for account or subscription features.
3. **Follow the result to an individual item.** For a missing tool or empty search, continue with the publisher’s component page, Markdown or live preview. Respect access denials. If the network is unavailable, use the local Gaudi examples. Apply a specific behavior, layout choice or state that fits the brief using Gaudi’s public imports, tokens and accessibility conventions. Cite an external example when it informs a decision.
