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
        'shiki',
        'shiki/core',
        'shiki/engine/javascript',
        '@shikijs/langs/javascript',
        '@shikijs/langs/python',
        '@shikijs/langs/sql',
        '@shikijs/langs/awk',
        '@shikijs/langs/shell',
        '@shikijs/langs/nushell',
        '@shikijs/themes/catppuccin-latte',
        '@shikijs/themes/catppuccin-mocha',
        '@shikijs/themes/tokyo-night'
      ],
      output: {
        globals: {
          'markdown-it': 'MarkdownIt'
        }
      }
    }
  }
})
