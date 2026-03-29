/// <reference types="vite/client" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
    descriptionKey?: string
    useChildTitle?: boolean
  }
}

export {}
