export interface BlogTag {
  slug: string
  labelEn: string
  labelHu: string
}

export const blogTags: BlogTag[] = [
  { slug: 'ai', labelEn: 'AI', labelHu: 'AI' },
  { slug: 'architecture', labelEn: 'Architecture', labelHu: 'Architektúra' },
  { slug: 'decision-making', labelEn: 'Decision-Making', labelHu: 'Döntéshozatal' },
  { slug: 'tech-debt', labelEn: 'Tech Debt', labelHu: 'Tech Debt' },
  { slug: 'ci-cd', labelEn: 'CI/CD', labelHu: 'CI/CD' },
  { slug: 'testing', labelEn: 'Testing', labelHu: 'Tesztelés' },
  { slug: 'leadership', labelEn: 'Leadership', labelHu: 'Vezetés' },
  { slug: 'scaling', labelEn: 'Scaling', labelHu: 'Skálázás' },
  { slug: 'compliance', labelEn: 'Compliance', labelHu: 'Compliance' },
]

export function getBlogTagLabel(slug: string, lang: string): string {
  const tag = blogTags.find((t) => t.slug === slug)
  if (!tag) return slug
  return lang === 'en' ? tag.labelEn : tag.labelHu
}
