/**
 * Syntax highlighting for markdown code fences. Runs inside the `marked`
 * renderer, so the highlighted markup is baked into the prerendered HTML and
 * reproduced identically on hydration.
 *
 * Only the languages actually used in `content/` are registered - the full
 * highlight.js bundle is an order of magnitude larger and most of it would be
 * dead weight. Add a language below when a post starts using it.
 */
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import shell from 'highlight.js/lib/languages/shell'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('php', php)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('python', python)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('typescript', typescript)
// Registers the `html` alias too.
hljs.registerLanguage('xml', xml)

/**
 * Renders one fenced code block. `info` is the raw fence info string
 * (`python`, `md`, `js title=x`, or empty); anything unrecognised falls back to
 * plaintext so an unknown tag never throws.
 */
export function renderHighlightedCode(code: string, info: string | undefined): string {
  const requested = (info ?? '').trim().split(/\s+/)[0] ?? ''
  const language = hljs.getLanguage(requested) ? requested : 'plaintext'
  const html = hljs.highlight(code, { language }).value
  return `<pre><code class="hljs language-${language}">${html}</code></pre>\n`
}
