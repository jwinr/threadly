import globals from 'globals'
import typescriptParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import typescript from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import eslintComments from 'eslint-plugin-eslint-comments'
import promise from 'eslint-plugin-promise'
import unicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'amplify/',
      'dist/',
      'build/',
      'public/',
      'src/',
      '*.config.js',
      '*.d.ts',
      '*.env',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'jsx-a11y': jsxA11y,
      'eslint-comments': eslintComments,
      promise: promise,
      unicorn: unicorn,
      sonarjs: sonarjs,
      prettier: prettier,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'prettier/prettier': 'error',
      'accessor-pairs': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': 'error',
      'arrow-spacing': 'error',
      complexity: 'error',
      'dot-notation': 'error',
      'eol-last': 'error',
      'jsx-quotes': 'error',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'space-before-blocks': 'error',
      'space-in-parens': ['error', 'never'],
      'no-multiple-empty-lines': 'error',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/better-regex': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-invalid-fetch-options': 'error',
      'unicorn/no-unused-properties': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-top-level-await': 'error',
      'unicorn/no-useless-undefined': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'no-param-reassign': [2, { props: false }],
      'no-unused-expressions': [2, { allowShortCircuit: true }],
      'no-useless-call': 'error',
      curly: 'error',
      eqeqeq: 'error',
      'default-case': 'error',
      'no-else-return': 'off',
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.jsx', '.tsx'] },
      ],
      'jsx-a11y/anchor-is-valid': 'off', // Next.js-specific adjustment
      'spaced-comment': ['error', 'always'],
      yoda: ['error', 'never'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
