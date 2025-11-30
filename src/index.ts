import type MarkdownIt from 'markdown-it'

import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { allLangs } from './all-langs'
import { allThemes } from './all-themes'

const SHIKI_KEY = Symbol.for('mdit-inline-code-shiki')

function getShiki() {
    const g = globalThis as any
    if (g[SHIKI_KEY]) return g[SHIKI_KEY]

    const shiki = createHighlighterCoreSync({
        langs: allLangs,
        themes: allThemes,
        engine: createJavaScriptRegexEngine()
    })
    g[SHIKI_KEY] = shiki
    return shiki
}

export interface InlineCodeHighlightOptions {
    themes?: Record<string, string>
}

function inlineCodeHighlightPlugin(
    md: MarkdownIt,
    options?: InlineCodeHighlightOptions
) {
    const shiki = getShiki()

    const defaultRender =
        md.renderer.rules.code_inline ||
        function (tokens, idx, _options, _env, self) {
            const token = tokens[idx]
            if (!token) return ''
            return (
                '<code' +
                self.renderAttrs(token) +
                '>' +
                md.utils.escapeHtml(token.content) +
                '</code>'
            )
        }

    const themeMap = {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
        ...options?.themes
    }

    md.renderer.rules.code_inline = function (tokens, idx, _options, env, self) {
        const token = tokens[idx]
        if (!token) return ''

        const content = token.content.trim()
        // 于`{lang} code`中捕获lang和code
        const match = content.match(/^\{(\w+)\}\s+(.+)$/)

        if (match === null) {
            return defaultRender(tokens, idx, _options, env, self)
        }

        try {
            const highlighted = shiki.codeToHtml(match[2], {
                lang: match[1],
                themes: themeMap,
                structure: 'inline'
            })

            return '<code' + self.renderAttrs(token) + '>' + highlighted + '</code>'
        } catch (e) {
            console.error('Highlighting failed', e)
            return defaultRender(tokens, idx, _options, env, self)
        }
    }
}

export default inlineCodeHighlightPlugin
