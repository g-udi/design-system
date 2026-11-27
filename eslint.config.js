/**
 * ESLint Flat Config
 *
 * @description Correctness-focused linting for the design system. Stylistic
 * conventions are intentionally not enforced; the priority is catching real
 * defects (Rules of Hooks violations, unused/undefined variables, stale
 * effect dependencies) in source, stories, and config files.
 */

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'storybook-static/**',
      // The docs site has its own TypeScript lint setup (site/eslint.config.mjs).
      'site/**'
    ]
  },
  js.configs.recommended,
  {
    files: [ '**/*.{js,jsx,mjs,cjs}' ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      sourceType: 'module'
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      'no-unused-vars': [ 'error', { argsIgnorePattern: '^_', ignoreRestSiblings: true, varsIgnorePattern: '^_' } ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-danger-with-children': 'error',
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: { version: '19.1' }
    }
  },
  {
    files: [ 'src/**/stories/fixtures/**/*.{js,jsx}' ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXElement:has(> JSXOpeningElement[name.name=/^(span|div)$/] > JSXAttribute[name.name='className'] > Literal[value=/(?=.*size-[0-9])(?=.*rounded)(?=.*(?:bg-|border))(?=.*(?:items-center|place-items-center))/]):has(> JSXElement > JSXOpeningElement[name.name=/^(Icon|RegistryIcon)$/])",
          message: 'Use the public Gaudi IconTile for a framed icon in an example.'
        },
        {
          selector: "JSXOpeningElement[name.name='progress']",
          message: 'Use the public Gaudi Progress component in examples.'
        },
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/] > JSXAttribute[name.name='role'] > Literal[value=/^(progressbar|switch|tablist)$/]",
          message: 'Compose this example with Gaudi Progress, Switch or TabsList so its behavior matches the shared owner.'
        }
      ]
    }
  },
  {
    files: [ '**/*.cjs' ],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
