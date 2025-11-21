import type MarkdownIt from 'markdown-it'

import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
// lang
import { allLangs } from './all-langs'
// theme
import latte from '@shikijs/themes/catppuccin-latte'
import mocha from '@shikijs/themes/catppuccin-mocha'
import tokyo_night from '@shikijs/themes/tokyo-night'

const themes = [latte, mocha, tokyo_night]

const SHIKI_KEY = Symbol.for('mdit-inline-code-shiki')

function getShiki() {
    const g = globalThis as any
    if (g[SHIKI_KEY]) return g[SHIKI_KEY]

    // Handle potential default export wrapping when bundled/externalized
    const themeList = themes.map(t => (t as any).default || t)

    const shiki = createHighlighterCoreSync({
        langs: allLangs,
        themes: themeList,
        engine: createJavaScriptRegexEngine()
    })
    g[SHIKI_KEY] = shiki
    return shiki
}

function inlineCodeHighlightPlugin(
    md: MarkdownIt,
    _options: null
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
        tokyo: 'tokyo-night'
    }

    md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        if (!token) return ''

        const content = token.content.trim()
        // 于`{lang} code`中捕获lang和code
        const match = content.match(/^\{(\w+)\}\s+(.+)$/)

        if (match === null) {
            return defaultRender(tokens, idx, options, env, self)
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
            return defaultRender(tokens, idx, options, env, self)
        }
    }
}

export default inlineCodeHighlightPlugin
