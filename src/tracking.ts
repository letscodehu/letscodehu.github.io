import type { CookieConsentState } from './cookieConsent'

const GA_MEASUREMENT_ID = 'G-R6KWGC5Y5M'
const FB_PIXEL_ID = '2095258311315842'
const LINKEDIN_PARTNER_ID = '0000000'
const HOTJAR_SITE_ID = 6649868
const HOTJAR_SNIPPET_VERSION = 6

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    _linkedin_data_partner_ids?: string[]
    hj?: (...args: unknown[]) => void
    _hjSettings?: {
      hjid: number
      hjsv: number
    }
  }
}

const loaded = {
  ga: false,
  fb: false,
  linkedin: false,
  hotjar: false,
}

function injectScriptOnce(id: string, src: string, async = true): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  if (document.getElementById(id)) {
    return false
  }

  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = async
  document.head.appendChild(script)
  return true
}

function initGoogleAnalytics() {
  if (loaded.ga || typeof window === 'undefined') {
    return
  }

  // Initialize dataLayer first
  window.dataLayer = window.dataLayer || []
  
  // Define gtag function that queues calls until script loads
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  // Call gtag('js') and gtag('config') - these will be queued
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })

  // Inject the script tag
  const scriptInjected = injectScriptOnce('ga-script', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`)
  
  if (scriptInjected) {
    loaded.ga = true
    
    // Once script loads, it will process the queued gtag calls automatically
    // The script will replace our gtag function with the real one
  }
}

function initFacebookPixel() {
  if (loaded.fb || typeof window === 'undefined') {
    return
  }

  if (!window.fbq) {
    const fbq = function fbq(...args: unknown[]) {
      ;(fbq as unknown as { queue?: unknown[]; callMethod?: (...items: unknown[]) => void }).callMethod
        ? (fbq as unknown as { callMethod: (...items: unknown[]) => void }).callMethod(...args)
        : (fbq as unknown as { queue?: unknown[] }).queue?.push(args)
    } as unknown as {
      (...args: unknown[]): void
      queue?: unknown[]
      loaded?: boolean
      version?: string
    }

    fbq.queue = []
    fbq.loaded = true
    fbq.version = '2.0'
    window.fbq = fbq
  }

  injectScriptOnce('fb-pixel-script', 'https://connect.facebook.net/en_US/fbevents.js')
  window.fbq?.('init', FB_PIXEL_ID)
  window.fbq?.('track', 'PageView')
  loaded.fb = true
}

function initLinkedInInsight() {
  if (loaded.linkedin || typeof window === 'undefined') {
    return
  }

  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID)
  injectScriptOnce('linkedin-insight-script', 'https://snap.licdn.com/li.lms-analytics/insight.min.js')
  loaded.linkedin = true
}

function initHotjar() {
  if (loaded.hotjar || typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  window.hj =
    window.hj ||
    function hj(...args: unknown[]) {
      ;(window.hj as unknown as { q?: unknown[] }).q = (window.hj as unknown as { q?: unknown[] }).q || []
      ;(window.hj as unknown as { q?: unknown[] }).q?.push(args)
    }
  window._hjSettings = { hjid: HOTJAR_SITE_ID, hjsv: HOTJAR_SNIPPET_VERSION }

  if (!document.getElementById('hotjar-script')) {
    const script = document.createElement('script')
    script.id = 'hotjar-script'
    script.async = true
    script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_SITE_ID}.js?sv=${HOTJAR_SNIPPET_VERSION}`
    document.head.appendChild(script)
  }

  loaded.hotjar = true
}

export function applyTrackingConsent(consent: CookieConsentState) {
  if (!consent.decided) {
    return
  }

  if (consent.analytics) {
    initGoogleAnalytics()
    initHotjar()
  }

  if (consent.marketing) {
    initFacebookPixel()
    initLinkedInInsight()
  }
}

export function trackPageView(path: string) {
  if (typeof window === 'undefined' || !window.gtag || !loaded.ga) {
    return
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
