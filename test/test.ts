import MarkdownIt from 'markdown-it'
import inlineCodeHighlightPlugin from '../src/index'
import { writeFileSync, mkdirSync, copyFileSync } from 'fs'
import { join } from 'path'

async function main() {
  const md = new MarkdownIt()
  md.use(inlineCodeHighlightPlugin, {
    themes: {
      light: 'catppuccin-latte',
      dark: 'nord',
      tokyo: 'tokyo-night'
    }
  })

  // Test markdown examples
  const examples = [
    'Basic: `{js} console.log("hello")`',
    'Variable: `{js} const name = "world"`',
    'Math: `{js} Math.random()`',
    'Conditional: `{js} if (x > 5)`',
    'Return: `{js} return value`',
    'Python: `{python} print("hello")`',
  ]

  // Generate HTML content
  const htmlContent = generateHTML(md, examples)

  // Ensure output directory exists
  const outputDir = join(process.cwd(), 'output')
  mkdirSync(outputDir, { recursive: true })

  // Write HTML file
  const outputPath = join(outputDir, 'test.html')
  writeFileSync(outputPath, htmlContent, 'utf-8')
  // Copy /test/demo.css to output directory
  const cssSourcePath = join(process.cwd(), 'test', 'demo.css')
  const cssDestPath = join(outputDir, 'demo.css')
  copyFileSync(cssSourcePath, cssDestPath)
  console.log(`✓ HTML file generated: ${outputPath}`)
}

function generateHTML(md: MarkdownIt, examples: string[]): string {
  const themes = [
    { name: 'Light Theme', id: 'light', class: 'theme-light', bg: '#eff1f5', color: '#5c5f77' },
    { name: 'Dark Theme', id: 'dark', class: 'theme-dark', bg: '#1e1e2e', color: '#a6adc8' },
    { name: 'Tokyo Theme', id: 'tokyo', class: 'theme-tokyo', bg: '#16161e', color: '#9ca3af' },
  ]

  const themeSections = themes.map(theme => {
    const examplesHTML = examples.map((example, idx) => {
      const result = md.render(example)
      return `
      <div class="example">
        <div class="example-label">Example ${idx + 1}</div>
        <p>${result}</p>
      </div>`
    }).join('')

    return `
    <div class="theme-section ${theme.class}" data-theme="${theme.id}">
      <div class="theme-header">${theme.name}</div>
      <div class="content">
        ${examplesHTML}
      </div>
    </div>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inline Code Highlight Test</title>
    <link rel="stylesheet" href="demo.css">
</head>
<body>
    <div class="container">
        <h1>Inline Code Highlight Test</h1>
        <div class="themes-grid">
            ${themeSections}
        </div>
    </div>
</body>
</html>`
}

main()