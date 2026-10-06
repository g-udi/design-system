import config from './src/tailwind/config.js';

export default {
  ...config,
  content: [
    '.storybook/**/*.{js,jsx,mdx}',
    './src/**/*.{js,jsx,mdx}'
  ]
};
