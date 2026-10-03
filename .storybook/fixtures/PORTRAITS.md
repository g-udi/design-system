# Sample portraits

Person avatars use real photos stored locally in `.storybook/public/avatars` and served from `/avatars/<men|women>/<n>.jpg` (for example `/avatars/women/44.jpg`). They were downloaded once from Random User's portrait set; see `.storybook/public/avatars/README.md`. Storybook never loads them from the network.

Names, roles, account handles and presence in these examples are fictional demo data; they do not identify the people in the photographs.

| Demo identity | Portrait path |
| --- | --- |
| Maya Chen | `women/44.jpg` |
| Alex Johnson | `men/32.jpg` |
| Sam Rivera | `men/11.jpg` |
| Jo Morgan | `women/68.jpg` |
| Lina Ahmed | `women/12.jpg` |
| Jules Martin | `men/75.jpg` |

The Avatar gallery, member directories and shared person fixtures use direct image URLs so copied examples remain self-contained. Other existing photographic fixtures remain available for richer scenarios. Workspace icons, brand logos, fallback colors, initials and deliberate image failures retain their intended examples.

Portraits are local static assets. Avatar shows its accessible initials or other supplied fallback while a photo loads or if it is unavailable. The component package does not select a provider or fetch a person's identity; applications own their image URLs.
