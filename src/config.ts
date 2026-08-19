import type { Language } from './composables/useI18n'

export const WAITLIST_SIGNUP_API_URL =
  'https://hlzqq43xoyvmvxfojrgjrdin4m0pzskp.lambda-url.eu-central-1.on.aws/'

export const WAITLIST_SIGNUP_TIMEOUT_MS = 10000

export const CHECKOUT_EMAIL_CAPTURE_API_URL =
  'https://7srd66pnm3knkgivg4txze74zi0vtfol.lambda-url.eu-central-1.on.aws/'

export const CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS = 10000

/** Which appointment schedule a visitor books into. */
export type BookingTopic = 'general' | 'ai'

export interface BookingSchedule {
  /**
   * The `?gv=true` form, which is the only one Google allows in a frame.
   * The `calendar.app.google` short link answers with `X-Frame-Options: SAMEORIGIN`,
   * so embedding that one renders an empty box.
   */
  embedUrl: string
  /**
   * The short link, used for the button we show instead of the frame on phones.
   * It lands on Google's own mobile-friendly booking page.
   */
  bookingUrl: string
}

/**
 * Booking calendars per topic and language. Each calendar is authored in its own
 * language, so a Hungarian visitor never lands on an English booking step.
 *
 * `en` is optional: drop it and that topic falls back to the Hungarian calendar.
 */
export const BOOKING_SCHEDULES: Record<
  BookingTopic,
  { hu: BookingSchedule; en?: BookingSchedule }
> = {
  general: {
    // "Első Konzultáció"
    hu: {
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2q_OwHo4VX4ESoGuO6OrF95TqCqf9JkbEU3K7yZfCtpIqo77MYnxSNZHXXRR8CE2lukOaQLMhX?gv=true',
      bookingUrl: 'https://calendar.app.google/iuUPuf6qWrHNVZ2u9',
    },
    // "Discovery call"
    en: {
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ03-t81iPmPspexuxBBDk4HsrTwnX9x1GF2ir6R_L_Wkl7Dd_uFgkqvyObtTwctz-BErU77gEA5?gv=true',
      bookingUrl: 'https://calendar.app.google/93GKtF3LHsRuN4jW6',
    },
  },
  ai: {
    // "Első konzultáció (AI)"
    hu: {
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0EslzHDztIPtBvv1wOLhyuB9_Er95qrLEzAcMDTq5i5C3k08iXtYY132GTqPaAqAI-p9gXCDgl?gv=true',
      bookingUrl: 'https://calendar.app.google/oCYTdUVxeW2Nkryd7',
    },
    // "Discovery Call (AI)"
    en: {
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Ym-mlnG5X7cR-bPhegooBkEFZgObwqxPnhzk9pQQtq-HsDdlRmnIVNPcLd7UjJaw6fQ0jNjT4?gv=true',
      bookingUrl: 'https://calendar.app.google/7qg5iZiyZBoeHXWr9',
    },
  },
}

export function resolveBookingSchedule(topic: BookingTopic, lang: Language): BookingSchedule {
  const schedules = BOOKING_SCHEDULES[topic]
  return (lang === 'en' ? schedules.en : schedules.hu) ?? schedules.hu
}
