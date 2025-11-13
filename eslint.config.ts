import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.stylistic,
  {
    ignores: [ '**/node_modules/**', 'build/**' ]
  },
  {
    plugins: {
      '@stylistic': stylistic
    }
  },
  {
    rules: {
      'semi': [ 'warn', 'never' ],
      'quotes': [ 'error', 'single' ],
      'comma-dangle': [ 'error', 'never' ],
      '@stylistic/array-bracket-spacing': [ 1, 'always' ],
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/object-curly-spacing': [ 1, 'always' ],
      '@stylistic/quotes': [ 1, 'single' ],
      '@stylistic/quote-props': [ 1, 'consistent-as-needed' ],
      '@stylistic/no-trailing-spaces': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)