<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    url: string
    minWidth?: number
    height?: number
  }>(),
  {
    minWidth: 320,
    height: 700,
  },
)

const widgetHost = ref<HTMLElement | null>(null)
const calendlyScriptSrc = 'https://assets.calendly.com/assets/external/widget.js'

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void
    }
  }
}

let mounted = false

function initWidget() {
  if (!mounted || !widgetHost.value || !window.Calendly) {
    return
  }

  widgetHost.value.innerHTML = ''
  window.Calendly.initInlineWidget({
    url: props.url,
    parentElement: widgetHost.value,
  })
}

function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${calendlyScriptSrc}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Calendly script')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = calendlyScriptSrc
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Calendly script'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  mounted = true
  try {
    await loadCalendlyScript()
    initWidget()
  } catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  mounted = false
})
</script>

<template>
  <div
    ref="widgetHost"
    class="calendly-host"
    :style="{ minWidth: `${minWidth}px`, height: `${height}px` }"
  />
</template>

<style scoped>
.calendly-host {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-surface);
}
</style>
