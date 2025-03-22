import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      enabled: true,
      exclude: [
        '**/*.d.ts',
        'src/http/error-handler.ts',
        'drizzle.config.ts',
        'vitest.config.ts',
        'deploy/**/*',
        'src/main.ts',
        'src/@types/**',
        'src/utils/**',
        'src/test/factories/**',
        'src/shared/errors/**',
        'src/http/routes/**',
        'src/http/server.ts',
        'src/http/transform-schema.ts',
        'src/db/**',
        'src/adapters/**',
        'src/http/middlewares/**/*',
        'src/factories/**/*',
        'src/utils/cache.ts',
      ],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
