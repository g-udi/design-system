export default {
  "Layout/NewsletterForm": {
    "description": "Email subscription form with an explicit host endpoint and local pending, success, and error feedback.",
    "accessibility": "Uses EmailInput with single-address pattern validation and the default smooth caret. Names the email input, preserves the submitted address on failure, disables duplicate submissions, and announces feedback beside the field.",
    "props": [["endpoint", "string", "—", "Host endpoint that receives a POST; absent endpoints disable signup."], ["title", "string", "Subscribe to the newsletter", "Visible form heading."], ["className", "string", "—", "Root layout classes."], ["classNames", "{ root?, title?, description?, form?, input?, action?, button?, message? }", "{}", "Part-specific classes."]],
    "usage": "import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';\n\n<NewsletterForm title='Monthly field notes' endpoint='/api/newsletter' />"
  }
};
