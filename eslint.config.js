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
    files: [ '**/*.cjs' ],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
