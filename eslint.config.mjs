import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import eslintComments from 'eslint-plugin-eslint-comments'
import promise from 'eslint-plugin-promise'
import unicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react: react,
      'react-hooks': reactHooks,
      prettier: prettier,
      'eslint-comments': eslintComments,
      promise: promise,
      unicorn: unicorn,
      sonarjs: sonarjs,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['classProperty'],
          modifiers: ['static'],
          format: ['UPPER_CASE'],
        },
      ],
      complexity: 'error',
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': 'error',
      'no-trailing-spaces': 'error',
      'prefer-const': 'error',
      'arrow-parens': 'error',
      'arrow-spacing': 'error',
      'space-infix-ops': 'error',
      'no-unused-vars': 'error',
      curly: 'error',
      // Too restrictive: https://eslint.org/docs/rules/no-prototype-builtins
      'no-prototype-builtins': 'off',
      // https://basarat.gitbook.io/typescript/main-1/defaultisbad
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
      'react/destructuring-assignment': 'off',
      'prettier/prettier': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
      // Next.js's <Link> component usage
      'jsx-a11y/anchor-is-valid': 'off',
      // Too strict, common abbreviations are known and readable
      'unicorn/prevent-abbreviations': 'off',
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Disabled for TypeScript since @typescript-eslint/no-unused-vars is used instead
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {},
  },
  // Adding the recommended unicorn rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: unicorn.configs.recommended.rules,
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: sonarjs.configs.recommended.rules,
  },
]
