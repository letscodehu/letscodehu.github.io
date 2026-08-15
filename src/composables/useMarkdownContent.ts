import { computed, type Ref } from 'vue'
import { marked } from 'marked'
import { renderHighlightedCode } from './useCodeHighlight'
import { renderMermaidPlaceholder } from './useMermaidDiagrams'

const HUNGARIAN_CHAR_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ö: 'o',
  ő: 'o',
  ú: 'u',
  ü: 'u',
  ű: 'u',
  Á: 'a',
  É: 'e',
  Í: 'i',
  Ó: 'o',
  Ö: 'o',
  Ő: 'o',
  Ú: 'u',
  Ü: 'u',
  Ű: 'u',
}

function slugify(text: string): string {
  let s = text
  for (const [from, to] of Object.entries(HUNGARIAN_CHAR_MAP)) {
    s = s.split(from).join(to)
  }
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export interface TocEntry {
  slug: string
  text: string
}

function getMarkedOptions(h2Slugs: string[]) {
  let h2Index = 0
  const renderer = new marked.Renderer()
  const originalHeading = renderer.heading.bind(renderer)
  renderer.heading = (token) => {
    const html = originalHeading(token as Parameters<typeof originalHeading>[0])
    if (token.depth === 2) {
      const id = h2Slugs[h2Index]
      h2Index += 1
      if (id) return html.replace(/^<h2>/, `<h2 id="${id}">`)
    }
    return html
  }
  renderer.code = (token) => {
    const lang = (token.lang ?? '').trim().split(/\s+/)[0] ?? ''
    if (lang === 'mermaid') return renderMermaidPlaceholder(token.text)
    return renderHighlightedCode(token.text, token.lang)
  }
  return { gfm: true, renderer }
}

/** Renders markdown to HTML and extracts an `##`-heading table of contents with matching anchor ids. */
export function useMarkdownContent(content: Ref<string>) {
  const tocEntries = computed((): TocEntry[] => {
    const value = content.value
    if (!value) return []
    const matches = value.matchAll(/^## (.+)$/gm)
    const entries: TocEntry[] = []
    for (const m of matches) {
      const raw = m[1]
      if (raw != null) {
        const text = raw.trim()
        entries.push({ slug: slugify(text), text })
      }
    }
    return entries
  })

  const contentHtml = computed(() => {
    const value = content.value
    if (!value) return ''
    const h2Slugs = tocEntries.value.map((e) => e.slug)
    return marked.parse(value, getMarkedOptions(h2Slugs)) as string
  })

  return { tocEntries, contentHtml }
}
