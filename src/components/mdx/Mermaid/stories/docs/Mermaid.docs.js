export default {
  "MDX/Mermaid": {
    'accessibility': 'Mermaid exposes the rendered diagram as one labelled figure. Provide a concise description that communicates the diagram meaning without relying on shape, position, or color.',
    'props': [['chart', 'string', '-', 'Mermaid chart definition.'], ['description', 'string', 'Diagram', 'Accessible text alternative for the rendered diagram.'], ['id', 'string', 'generated', 'Stable Mermaid render identifier.'], ['className', 'string', '-', 'Root figure class override.']],
    'recovery': ['Render a readable diagram error next to the source context when Mermaid cannot parse the chart.', 'Keep the page usable after a rendering failure and let authors correct the chart without losing surrounding article content.'],
    usage: "<Mermaid\n  id='architecture-flow'\n  description='Draft moves to review before publication.'\n  chart={`flowchart TD\n  A[Draft] --> B[Review]`}\n/>",
    description: "Renders host-supplied Mermaid source as a labelled diagram with a local loading and error state. Diagram colors and typography use Gaudi tokens and update when the root theme changes. Wide diagrams keep readable labels and scroll within a keyboard-focusable figure."
  }
};
