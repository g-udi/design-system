export default {
  "Layout/Footer": {
    "description": "Site footer with host-supplied navigation, social links, copyright, and optional newsletter form.",
    "accessibility": "Retains the footer landmark and uniquely named navigation regions. Supply descriptive link labels and a configured newsletter endpoint before allowing subscription.",
    "props": [["variant", "standard | editorial", "standard", "Newsletter layout or brand-led layout."], ["sections", "Array<{ title, links: Array<{ href, label }> }>", "[]", "Navigation groups from the host."], ["socialLinks", "Array<{ kind, href }>", "[]", "Social destinations; missing URLs are omitted."], ["copyrightName", "string | { name?, author? }", "—", "Host-owned attribution."], ["brandTitle / brandDescription", "string", "—", "Editorial brand heading and description."], ["newsletterProps", "NewsletterForm props", "—", "Explicit endpoint and subscription copy."]],
    "usage": "import Footer from '@gaudi/design-system/layout/Footer';\n\n<Footer sections={footerLinks} copyrightName='Example Studio' newsletterProps={{ endpoint: '/api/subscribe' }} />"
  }
};
