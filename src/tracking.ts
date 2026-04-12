import type { CookieConsentState } from './cookieConsent'

const GA_MEASUREMENT_ID = 'G-R6KWGC5Y5M'
const GOOGLE_ADS_ID = 'AW-939032288'
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
  ads: false,
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
  // Use arguments object (not array) to match Google's official snippet format
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(arguments)
    }

  const existingScript = document.getElementById('ga-script')

  // Call gtag('js') and gtag('config') - these will be queued
  if (!existingScript) {
    window.gtag('js', new Date())
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })

  // Inject the script tag (skip if Google Ads or another tag already loaded gtag.js)
  const scriptInjected = injectScriptOnce(
    'ga-script',
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  )

  if (scriptInjected) {
    loaded.ga = true

    const scriptElement = document.getElementById('ga-script') as HTMLScriptElement
    if (scriptElement) {
      scriptElement.onload = () => {
        if (window.gtag) {
          window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: window.location.pathname,
          })
          if (loaded.ads) {
            window.gtag('config', GOOGLE_ADS_ID)
          }
        }
      }
    }
  } else if (existingScript != null) {
    loaded.ga = true
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

/** Google Ads gtag (AW-); uses the same gtag.js queue as GA4 when analytics already ran. */
function initGoogleAdsTag() {
  if (loaded.ads || typeof window === 'undefined') {
    return
  }

  if (window.gtag && loaded.ga) {
    window.gtag('config', GOOGLE_ADS_ID)
    loaded.ads = true
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(arguments)
    }

  window.gtag('js', new Date())
  window.gtag('config', GOOGLE_ADS_ID)

  const scriptInjected = injectScriptOnce(
    'ga-script',
    `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`,
  )

  if (scriptInjected) {
    loaded.ads = true
    const scriptElement = document.getElementById('ga-script') as HTMLScriptElement
    if (scriptElement) {
      scriptElement.onload = () => {
        if (window.gtag) {
          window.gtag('config', GOOGLE_ADS_ID)
          if (loaded.ga) {
            window.gtag('config', GA_MEASUREMENT_ID, {
              page_path: window.location.pathname,
            })
          }
        }
      }
    }
  } else if (document.getElementById('ga-script') != null) {
    loaded.ads = true
  }
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
    initGoogleAdsTag()
    initFacebookPixel()
    initLinkedInInsight()
  }
}

export function trackPageView(path: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  if (loaded.ga) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    })
  }

  if (loaded.ads) {
    window.gtag('config', GOOGLE_ADS_ID, {
      page_path: path,
    })
  }

  if (!loaded.ga && !loaded.ads) {
    return
  }
}

export type TrainingWorkshopCtaPlacement = 'hero' | 'middle' | 'bottom' | 'sticky'

export type TrainingWorkshopCtaNextStep = 'email_popup' | 'stripe_checkout'

export function trackTrainingWorkshopCtaClick(args: {
  placement: TrainingWorkshopCtaPlacement
  nextStep: TrainingWorkshopCtaNextStep
}) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'training_workshop_cta_click', {
      placement: args.placement,
      next_step: args.nextStep,
    })
  }

  if (loaded.fb && window.fbq) {
    window.fbq('trackCustom', 'TrainingWorkshopCtaClick', {
      placement: args.placement,
      next_step: args.nextStep,
    })
  }
}

export function trackTrainingWorkshopEmailPopupOpen(args: {
  placement: TrainingWorkshopCtaPlacement
}) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'training_workshop_email_popup_open', {
      placement: args.placement,
    })
  }

  if (loaded.fb && window.fbq) {
    window.fbq('trackCustom', 'TrainingWorkshopEmailPopupOpen', {
      placement: args.placement,
    })
  }
}

export type TrainingWorkshopStripeSource = 'cta_direct' | 'email_popup'

export function trackTrainingWorkshopStripeRedirect(args: {
  source: TrainingWorkshopStripeSource
}) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'training_workshop_stripe_redirect', {
      source: args.source,
    })
  }

  if (loaded.fb && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'training_workshop',
      source: args.source,
    })
  }
}
