// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  // Next.js + React + Core Web Vitals の推奨設定
  ...nextVitals,

  // 必要に応じて ignore 設定（とりあえず Next 公式のデフォルトでOK）
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
