import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MarkdownItInlineCode',
      formats: ['es', 'cjs'],
      fileName: (format: string) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'markdown-it',
        /^shiki/,
        /^@shikijs\//,
      ],
      output: {
        globals: {
          'markdown-it': 'MarkdownIt'
        }
      }
    }
  }
})
