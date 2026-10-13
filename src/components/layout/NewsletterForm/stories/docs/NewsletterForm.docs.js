export default {
  "Blocks/Marketing/Newsletter": {
    "description": "Newsletter sections built from one email subscription form, with an explicit host endpoint and local pending, success, and error feedback.",
    "accessibility": "Uses EmailInput with single-address pattern validation and the default smooth caret. Names the email input, preserves the submitted address on failure, disables duplicate submissions, and announces feedback beside the field.",
    "props": [["endpoint", "string", "—", "Host endpoint that receives a POST; absent endpoints disable signup."], ["title", "ReactNode", "Subscribe to the newsletter", "Visible form heading. Pass null to omit it."], ["description", "ReactNode", "Get new articles and resources in your inbox.", "Supporting copy. Pass null to omit it."], ["headingAs", "string", "h3", "Heading level in the host page."], ["titleVariant", "string", "—", "Shared Typography variant; omitted preserves the compact form heading."], ["children", "ReactNode", "—", "Supporting content below the form and feedback, such as a privacy note."], ["className", "string", "—", "Root layout classes."], ["classNames", "{ root?, header?, body?, title?, description?, form?, input?, action?, button?, message? }", "{}", "Part-specific classes."]],
    "usage": "import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';\n\n<NewsletterForm title='Monthly field notes' endpoint='/api/newsletter' />"
  }
};
