const HU_HEAD_ALIASES: Record<string, string> = {
  kepzes: 'training',
  tanacsadas: 'consulting',
  rolam: 'about',
  kapcsolat: 'contact',
  esettanulmanyok: 'case-studies',
  cikkek: 'blog',
}

/**
 * Returns the canonical pathname for SEO (one preferred URL per logical page).
 * Hungarian vanity paths map to primary segments; HU privacy is always `/hu/adatkezeles`.
 */
export function canonicalPathname(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === '/') return '/'

  const parts = normalized.split('/').filter(Boolean)
  if (parts.length === 0) return '/'

  const lang = parts[0]
  if (lang !== 'en' && lang !== 'hu') return normalized

  if (parts.length === 1) return `/${lang}`

  let rest = parts.slice(1)

  if (lang === 'hu' && rest[0] === 'privacy') {
    rest = ['adatkezeles', ...rest.slice(1)]
  }

  if (lang === 'hu' && rest[0] === 'kepzes' && rest[1] === 'architect-gondolkodas') {
    rest = ['training', 'workshop-budapest', ...rest.slice(2)]
  } else if (lang === 'hu' && rest[0] === 'kepzes' && rest[1] === 'workshop-adr') {
    rest = ['training', 'workshop-adr', ...rest.slice(2)]
  } else if (lang === 'hu' && rest[0] === 'kepzes') {
    rest = ['training', ...rest.slice(1)]
  }

  const head = rest[0]
  if (lang === 'hu' && head != null && HU_HEAD_ALIASES[head] != null) {
    rest = [HU_HEAD_ALIASES[head], ...rest.slice(1)]
  }

  if (rest[0] === 'training' && rest[1] === 'architect-mindset') {
    rest = ['training', 'workshop-budapest', ...rest.slice(2)]
  }

  return `/${lang}/${rest.join('/')}`
}

/**
 * Same logical page in another language (for hreflang), using canonical segments per locale.
 */
export function alternateLangPathname(pathname: string, targetLang: 'en' | 'hu'): string {
  const canon = canonicalPathname(pathname)
  const parts = canon.split('/').filter(Boolean)
  if (parts.length === 0) return `/${targetLang}`

  const rest = parts.slice(1)
  if (rest.length === 0) return `/${targetLang}`

  if (targetLang === 'en') {
    if (rest[0] === 'adatkezeles') {
      return '/en/privacy'
    }
    return `/en/${rest.join('/')}`
  }

  if (rest[0] === 'privacy') {
    return '/hu/adatkezeles'
  }
  return `/hu/${rest.join('/')}`
}
