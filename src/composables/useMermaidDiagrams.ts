/**
 * Renders ```mermaid fenced code blocks as hand-drawn ("excalidraw"-style)
 * diagrams. Mermaid itself needs a real DOM, so the `marked` renderer only
 * emits an inert placeholder (SSG-safe); useMermaidRender hydrates it into an
 * SVG in the browser, lazy-loading mermaid so it never lands in the SSR bundle
 * or the initial page weight of posts that don't use it.
 */
import { nextTick, watch, type Ref } from 'vue'
import { useDarkMode } from './useDarkMode'

export function renderMermaidPlaceholder(source: string): string {
  const escaped = source
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<div class="mermaid-diagram" data-mermaid-source="${escaped}"></div>\n`
}

let renderCounter = 0
let initializedTheme: 'default' | 'dark' | null = null

const LIGHTBOX_STYLE_ID = 'mermaid-lightbox-styles'
const LIGHTBOX_ROOT_ID = 'mermaid-lightbox-root'

function ensureLightboxStyles() {
  if (document.getElementById(LIGHTBOX_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = LIGHTBOX_STYLE_ID
  style.textContent = `
    .mermaid-lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: rgba(15, 23, 42, 0.72);
      cursor: zoom-out;
    }
    .mermaid-lightbox-content {
      width: min(90vw, 1000px);
      max-width: 92vw;
      max-height: 88vh;
      overflow: auto;
      padding: 1.5rem;
      background: var(--color-surface, #fff);
      border: 1px solid var(--color-border, #dde5f0);
      border-radius: var(--radius-md, 1rem);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      cursor: default;
    }
    .mermaid-lightbox-content svg {
      display: block;
      width: 100% !important;
      height: auto !important;
      max-width: none !important;
    }
    .mermaid-lightbox-close {
      position: fixed;
      top: 1.25rem;
      right: 1.5rem;
      z-index: 1001;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: 999px;
      background: var(--color-surface, #fff);
      color: var(--color-text, #0f172a);
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    }
  `
  document.head.appendChild(style)
}

function ensureLightboxRoot(): HTMLElement {
  let root = document.getElementById(LIGHTBOX_ROOT_ID)
  if (!root) {
    root = document.createElement('div')
    root.id = LIGHTBOX_ROOT_ID
    document.body.appendChild(root)
  }
  return root
}

function openMermaidLightbox(svgHtml: string) {
  ensureLightboxStyles()
  const root = ensureLightboxRoot()

  const close = () => {
    root.innerHTML = ''
    document.removeEventListener('keydown', onKeydown)
  }
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  const backdrop = document.createElement('div')
  backdrop.className = 'mermaid-lightbox-backdrop'
  backdrop.setAttribute('role', 'dialog')
  backdrop.setAttribute('aria-modal', 'true')
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close()
  })

  const content = document.createElement('div')
  content.className = 'mermaid-lightbox-content'
  content.innerHTML = svgHtml
  backdrop.appendChild(content)

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.className = 'mermaid-lightbox-close'
  closeButton.setAttribute('aria-label', 'Close')
  closeButton.textContent = '×'
  closeButton.addEventListener('click', close)
  backdrop.appendChild(closeButton)

  root.innerHTML = ''
  root.appendChild(backdrop)
  document.addEventListener('keydown', onKeydown)
}

async function renderDiagramsIn(container: HTMLElement, isDark: boolean) {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>('.mermaid-diagram[data-mermaid-source]')
  )
  if (nodes.length === 0) return

  const { default: mermaid } = await import('mermaid')
  const theme = isDark ? 'dark' : 'default'
  if (initializedTheme !== theme) {
    mermaid.initialize({ startOnLoad: false, look: 'handDrawn', theme, securityLevel: 'strict' })
    initializedTheme = theme
  }

  for (const node of nodes) {
    const source = node.dataset.mermaidSource
    if (!source) continue
    renderCounter += 1
    try {
      const { svg } = await mermaid.render(`mermaid-diagram-${renderCounter}`, source)
      node.innerHTML = svg
      node.classList.add('mermaid-diagram--zoomable')
      if (!node.dataset.mermaidClickBound) {
        node.dataset.mermaidClickBound = 'true'
        node.addEventListener('click', () => openMermaidLightbox(node.innerHTML))
      }
    } catch (err) {
      node.textContent = source
      console.error('Failed to render mermaid diagram', err)
    }
  }
}

/** Hydrates `.mermaid-diagram` placeholders under `root` whenever `content` or the color theme changes. */
export function useMermaidRender(root: Ref<HTMLElement | null>, content: Ref<unknown>) {
  const { isDark } = useDarkMode()

  watch(
    [root, content, isDark],
    async () => {
      const el = root.value
      if (!el || typeof window === 'undefined') return
      await nextTick()
      await renderDiagramsIn(el, isDark.value)
    },
    { immediate: true }
  )
}
