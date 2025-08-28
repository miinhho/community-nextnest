// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [...compat.extends(
  'next/core-web-vitals',
  'next/typescript',
  'plugin:@lexical/recommended',
  'plugin:@tanstack/query/recommended',
  'prettier',
), ...compat.config({
  extends: ['next'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}), ...storybook.configs["flat/recommended"]]

export default eslintConfig
