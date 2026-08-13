/// <reference types="vite/client" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    descriptionKey?: string
    useChildTitle?: boolean
    /** Render the page directly in <main>, outside the shared content column. */
    fullBleed?: boolean
  }
}

export {}
