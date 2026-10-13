# FAQ

> MDX/FAQ · mdx · `@gaudi/design-system/mdx/Faq`

Article questions and answers with semantic disclosure controls and configurable heading hierarchy.

## Import

```js
import FAQ from '@gaudi/design-system/mdx/Faq';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `questions` | `Array<{ question, answer }>` | — | no | Question and answer disclosures. |
| `heading` | `ReactNode` | `FAQ` | no | Visible section heading. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | no | Semantic level for the section heading. |

## Variants

- `headingLevel`: `2`, `3`, `4`, `5`, `6`

## Usage

```jsx
<Faq questions={[
  {
    question: 'Why use FAQ blocks?',
    answer: 'They structure repeated article answers.'
  }
]} />
```

## Accessibility

Faq uses a semantic definition list and native disclosure buttons. Choose a headingLevel that follows the surrounding article heading without skipping a level.

## Examples

- Playground (Storybook `mdx-faq--playground`)

## Related

`blocks-blog-article`
