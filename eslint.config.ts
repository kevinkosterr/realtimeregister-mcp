import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.stylistic,
  {
    rules: {
      semi: ['warn', 'never'],
      quotes: ['error', 'single'],
    }
  }
)