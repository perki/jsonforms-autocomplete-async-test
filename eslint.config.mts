import eslint from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import nPlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

export default [
  // Ignores
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'build/',
      'dist/'
    ]
  },

  // Base language options and plugins
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha
      }
    },
    settings: {
      react: { version: 'detect' }
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    }
  },

  // Recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // SemiStandard rules configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '*.mts'],
    rules: {
      // Standard/SemiStandard base rules
      'no-var': 'error',
      'prefer-const': 'error',
      // "no-console": "warn",
      'no-debugger': 'error',
      'no-unused-vars': 'off', // handled by TypeScript
      'no-undef': 'off', // handled by TypeScript

      // Semicolons (SemiStandard requires semicolons)
      'semi': ['error', 'always'],
      'semi-spacing': ['error', { 'before': false, 'after': true }],
      'semi-style': ['error', 'last'],

      // Quotes (single quotes)
      'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],

      // Trailing commas
      'comma-dangle': ['error', {
        'arrays': 'never',
        'objects': 'never',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never'
      }],

      // Space before function parentheses
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],

      // No trailing spaces
      'no-trailing-spaces': 'error',

      // Import plugin rules (disabled for TypeScript projects with path mapping)
      'import/no-unresolved': 'off', // Disabled due to TypeScript path mapping
      'import/named': 'off', // Disabled due to TypeScript path mapping
      'import/default': 'off', // Disabled due to TypeScript path mapping
      'import/namespace': 'off', // Disabled due to TypeScript path mapping
      'import/export': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'off', // Disabled due to i18next compatibility issues
      'import/no-duplicates': 'error',
      'import/order': 'off', // Disabled due to TypeScript path mapping complexity

      // Promise plugin rules
      'promise/param-names': 'error',
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',

      // Node plugin rules
      'n/no-unpublished-require': 'off', // Not applicable for browser code
      'n/no-missing-require': 'off', // Not applicable for browser code
      'n/no-missing-import': 'off' // Handled by TypeScript
    }
  },

  // TypeScript-specific rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.d.ts', '*.mts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // types are hoisted; avoid false positives in TS
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      // Disable base rules that are covered by TypeScript
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },

  // Enable JSX parsing for React files
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
      // React-specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/no-unknown-property': 'error'
    }
  }

];