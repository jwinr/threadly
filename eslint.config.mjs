import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules/',
      '.husky/',
      '.next/',
      'amplify/',
      'dist/',
      'build/',
      'public/',
      '*.config.js',
      '*.d.ts',
      '*.env',
      'src/',
    ],
  },
  {
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: prettier,
    },
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      ...react.configs['recommended'].rules,
      ...jsxA11y.flatConfigs['recommended'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': [0],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      'prettier/prettier': 'error',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      curly: 'error',
      eqeqeq: 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslintConfigPrettier,
]
