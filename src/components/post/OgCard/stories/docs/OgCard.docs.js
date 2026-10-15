export default {
  "Blocks/Blog/OgCard": {
    "description": "Open Graph image template for next/og ImageResponse: category, title, subtitle, site name and an optional logo on a neutral light or dark card, built only from inline styles.",
    "accessibility": "The card becomes an image, so the page's og:image:alt (or the alt of an img that shows it) must repeat the title. Both palettes keep AA contrast for every text role.",
    "props": [
      ["title", "string", "—", "The page or post title; long titles step down in size."],
      ["subtitle", "string", "—", "Supporting line below the title."],
      ["category", "string", "—", "Short uppercase label above the title."],
      ["siteName", "string", "—", "Site name or URL along the bottom edge."],
      ["logo", "ReactNode", "—", "Mark in the top corner, 120px square: an inline svg (fill='currentColor' follows the theme) or an img with a data URL. No remote URLs."],
      ["theme", "light | dark", "light", "Neutral palette."],
      ["width / height", "number", "1200 / 630", "Image size; ogImageSize exports the defaults for ImageResponse."]
    ],
    "usage": "// app/api/og/route.js\nimport { ImageResponse } from 'next/og';\nimport { OgCard, ogImageSize } from '@gaudi/design-system/post/OgCard';\n\nexport function GET() {\n  return new ImageResponse(\n    <OgCard title='Notes on local-first software' subtitle='What syncing taught me.' category='Engineering' siteName='example.com' />,\n    ogImageSize\n  );\n}"
  }
};
