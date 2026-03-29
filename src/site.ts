/** Production site origin for canonical URLs, Open Graph, and sitemap. */
export const SITE_ORIGIN = 'https://letscode.hu'

/** Default social preview image path (served from site root). */
export const DEFAULT_OG_IMAGE_PATH = '/architect-from-dev.png'

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_ORIGIN}${path}`
}
