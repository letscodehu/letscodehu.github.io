import { nextTick } from 'vue'
import type { CookieConsentState } from './cookieConsent'
import type { BookingTopic } from './config'

const GA_MEASUREMENT_ID = 'G-R6KWGC5Y5M'
const FB_PIXEL_ID = '2095258311315842'
const LINKEDIN_PARTNER_ID = '11104257'
const LINKEDIN_PLACEHOLDER_PARTNER_ID = '0000000'
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

/**
 * Sets up dataLayer and the gtag queue. The first call also sets Consent Mode v2 defaults to denied.
 * There is no Google Ads tag on the site: conversions and remarketing audiences reach Ads through the
 * GA4 → Google Ads link, which relies on the ad_* consent signals, so all four are still sent.
 */
function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || []

  if (window.gtag) {
    return window.gtag
  }

  // Use arguments object (not array) to match Google's official snippet format
  window.gtag = function gtag() {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(arguments)
  }

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  return window.gtag
}

function updateGoogleConsent(consent: CookieConsentState) {
  const gtag = ensureGtag()

  const analytics = consent.analytics ? 'granted' : 'denied'
  const marketing = consent.marketing ? 'granted' : 'denied'
  gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  })
}

// href of the last page_view sent, so the router hook and a late consent never report the same page twice
let lastPageViewHref: string | null = null

function sendPageView() {
  if (!loaded.ga || !window.gtag) {
    return
  }

  const href = window.location.href
  if (href === lastPageViewHref) {
    return
  }

  lastPageViewHref = href
  window.gtag('event', 'page_view', {
    page_location: href,
    page_title: document.title,
  })
}

/** Waits for the new route to render and unhead to flush the title (it renders in a setTimeout). */
function schedulePageView() {
  void nextTick(() => {
    setTimeout(sendPageView, 0)
  })
}

function initGoogleAnalytics() {
  if (loaded.ga || typeof window === 'undefined') {
    return
  }

  const gtag = ensureGtag()

  // Queued before gtag.js loads; the library processes the dataLayer on its own, so no onload re-config.
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  })

  injectScriptOnce('ga-script', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`)
  loaded.ga = true

  // Consent usually arrives after the first navigation, so report the current page once.
  schedulePageView()
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

  // Never load the Insight tag with an empty or placeholder partner ID.
  if (!LINKEDIN_PARTNER_ID || LINKEDIN_PARTNER_ID === LINKEDIN_PLACEHOLDER_PARTNER_ID) {
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
  if (!consent.decided || typeof window === 'undefined') {
    return
  }

  // Send consent before any config call. If gtag already exists, this also handles a later revocation.
  if (consent.analytics || consent.marketing || window.gtag) {
    updateGoogleConsent(consent)
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

/** Called from router.afterEach; sends exactly one GA4 page_view per navigation once GA4 is loaded. */
export function trackPageView() {
  if (typeof window === 'undefined' || !loaded.ga) {
    return
  }

  schedulePageView()
}

export type TrainingWorkshopCtaPlacement = 'hero' | 'middle' | 'bottom'

export function trackTrainingWorkshopCtaClick(args: { placement: TrainingWorkshopCtaPlacement }) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'training_workshop_cta_click', {
      placement: args.placement,
    })
  }

  if (loaded.fb && window.fbq) {
    window.fbq('trackCustom', 'TrainingWorkshopCtaClick', {
      placement: args.placement,
    })
  }
}

export function trackSlackJoinClick() {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'slack_join_click')
  }

  if (loaded.fb && window.fbq) {
    window.fbq('trackCustom', 'SlackJoinClick')
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

export type AiBenchmarkDownloadPlacement = 'gate' | 'pdf_cta'

export function trackAiBenchmarkDownload(args: { placement: AiBenchmarkDownloadPlacement }) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'ai_benchmark_download', {
      placement: args.placement,
    })
  }
}

export function trackBookingIntent(args: { topic: BookingTopic }) {
  if (typeof window === 'undefined') {
    return
  }

  if (loaded.ga && window.gtag) {
    window.gtag('event', 'booking_intent', {
      topic: args.topic,
    })
  }
}
