export default {
  "Core/Direction": {
    "description": "Scopes text direction for Gaudi controls that need directional keyboard and placement behavior.",
    "accessibility": "Set the same direction on the surrounding DOM so text flow and control behavior agree. Nested providers may override the inherited direction.",
    "props": [["dir / direction", "ltr | rtl", "inherited", "Direction for descendant controls; direction takes precedence when both are provided."], ["children", "ReactNode", "—", "Controls that consume the direction context."], ["useDirection(localDirection?)", "(ltr | rtl) => ltr | rtl", "inherited", "Read the local override or nearest provider direction."]],
    "usage": "import { DirectionProvider } from '@gaudi/design-system/core/Direction';\n\n<DirectionProvider dir='rtl'><div dir='rtl'>{controls}</div></DirectionProvider>"
  }
};
