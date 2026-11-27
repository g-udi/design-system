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

const useIconTile = {
  meta: { type: 'problem', schema: [], messages: { framed: 'Use the public Gaudi IconTile for a framed icon in an example.' } },
  create(context) {
    return {
      'JSXElement > JSXOpeningElement[name.name=/^(span|div)$/]'(element) {
        const children = element.parent.children.filter(child =>
          child.type !== 'JSXText' ? child.expression?.type !== 'JSXEmptyExpression' : child.value.trim()
        );
        if (children.length !== 1) return;
        const child = children[0];
        const glyph = child.openingElement?.name;
        const isIcon = glyph?.type === 'JSXIdentifier' && glyph.name.endsWith('Icon');
        if (!isIcon && child.expression?.property?.name !== 'icon') return;
        const attribute = element.attributes.find(attr => attr.name?.name === 'className');
        if (!attribute?.value) return;
        // Frames also use arbitrary sizes, padding, and tones supplied through cn() or interpolation.
        const classes = context.sourceCode.getText(attribute.value);
        if (/\brounded\b/.test(classes) && /\b(?:size-|p-)/.test(classes) &&
            /\b(?:bg-|border|items-center|place-items-center)/.test(classes)) {
          context.report({ node: element, messageId: 'framed' });
        }
      }
    };
  }
};

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
    plugins: { gaudi: { rules: { 'use-icon-tile': useIconTile } } },
    rules: {
      'gaudi/use-icon-tile': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='RegistryIcon']:has(JSXAttribute[name.name='lucide'] > Literal[value=/^Loader(2|Circle)?(Icon)?$/]) > JSXAttribute[name.name='className'] Literal[value=/animate-spin/]",
          message: 'Use the public Gaudi Loader for a spinning loading indicator.'
        },
        {
          selector: "JSXOpeningElement[selfClosing=true][name.name=/^(span|div)$/] > JSXAttribute[name.name='className'] > Literal[value=/^(?=.*(?:w|h)-px)(?=.*bg-(?:ui-)?border)(?!.*(?:absolute|fixed))/]",
          message: 'Use the public Gaudi Separator for a divider between content or controls.'
        },
        {
          selector: "JSXOpeningElement[name.name='progress']",
          message: 'Use the public Gaudi Progress component in examples.'
        },
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/] > JSXAttribute[name.name='role'] > Literal[value=/^(progressbar|meter|switch|tablist)$/]",
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
