import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import HomePage from '../pages/HomePage.vue'
import TrainingPage from '../pages/TrainingPage.vue'
import TrainingB2CAdsLandingPage from '../pages/TrainingB2CAdsLandingPage.vue'
import TrainingB2CTermsPage from '../pages/TrainingB2CTermsPage.vue'
import WorkshopPage from '../pages/WorkshopPage.vue'
import ConsultingPage from '../pages/ConsultingPage.vue'
import AiConsultingPage from '../pages/AiConsultingPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import CaseStudyDetailPage from '../pages/CaseStudyDetailPage.vue'
import BlogPage from '../pages/BlogPage.vue'
import BlogPostDetailPage from '../pages/BlogPostDetailPage.vue'
import ArchivePage from '../pages/ArchivePage.vue'
import ArchivePostDetailPage from '../pages/ArchivePostDetailPage.vue'
import ArchiveRedirectPage from '../pages/ArchiveRedirectPage.vue'
import PrivacyPage from '../pages/PrivacyPage.vue'
import ReportPage from '../pages/ReportPage.vue'
import SlackPage from '../pages/SlackPage.vue'
import { archiveRedirects } from '../data/archive-redirects'

const childRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: HomePage,
    meta: { titleKey: 'nav.home', descriptionKey: 'seo.descriptions.home' },
  },
  {
    path: 'training',
    name: 'training-en',
    component: TrainingPage,
    alias: 'kepzes',
    meta: { titleKey: 'training.pageTitle', descriptionKey: 'seo.descriptions.training' },
  },
  {
    path: 'training/architect-mindset',
    alias: 'kepzes/architect-gondolkodas',
    redirect: (to) => ({
      name: 'training-b2c-ads-en',
      params: { lang: to.params.lang },
      hash: '#workshop-detailed-program',
    }),
  },
  {
    path: 'training/workshop-budapest',
    name: 'training-b2c-ads-en',
    component: TrainingB2CAdsLandingPage,
    alias: 'kepzes/workshop-budapest',
    meta: { titleKey: 'trainingB2cAds.pageTitle', descriptionKey: 'seo.descriptions.trainingB2cAds' },
  },
  {
    path: 'training/workshop-terms',
    name: 'training-b2c-terms-en',
    component: TrainingB2CTermsPage,
    alias: 'kepzes/workshop-terms',
    meta: { titleKey: 'trainingB2cTerms.pageTitle', descriptionKey: 'seo.descriptions.trainingB2cTerms' },
  },
  {
    path: 'training/workshop-adr',
    name: 'workshop-en',
    component: WorkshopPage,
    alias: 'kepzes/workshop-adr',
    meta: { titleKey: 'workshop.pageTitle', descriptionKey: 'seo.descriptions.workshop' },
  },
  {
    path: 'consulting',
    name: 'consulting-en',
    component: ConsultingPage,
    alias: 'tanacsadas',
    meta: { titleKey: 'consulting.pageTitle', descriptionKey: 'seo.descriptions.consulting' },
  },
  {
    path: 'ai-consulting',
    name: 'ai-consulting-en',
    component: AiConsultingPage,
    alias: 'ai-tanacsadas',
    meta: { titleKey: 'aiConsulting.pageTitle', descriptionKey: 'seo.descriptions.aiConsulting' },
  },
  {
    path: 'about',
    name: 'about-en',
    component: AboutPage,
    alias: 'rolam',
    meta: { titleKey: 'about.pageTitle', descriptionKey: 'seo.descriptions.about' },
  },
  {
    path: 'contact',
    name: 'contact-en',
    component: ContactPage,
    alias: 'kapcsolat',
    meta: { titleKey: 'contact.pageTitle', descriptionKey: 'seo.descriptions.contact' },
  },
  {
    // Same page as `contact`, AI-specific copy and its own Google Calendar booking widget.
    // Own route (not a query param) so the AI framing is prerendered rather than swapped
    // in after hydration.
    path: 'contact/ai',
    name: 'contact-ai-en',
    component: ContactPage,
    alias: 'kapcsolat/ai',
    meta: { titleKey: 'contact.aiPageTitle', descriptionKey: 'seo.descriptions.aiContact' },
  },
  {
    path: 'case-studies',
    alias: 'esettanulmanyok',
    redirect: (to) => ({
      name: 'blog-list-en',
      params: { lang: to.params.lang },
    }),
  },
  {
    path: 'case-studies/:slug',
    name: 'case-study-detail-en',
    component: CaseStudyDetailPage,
    meta: { titleKey: 'caseStudies.pageTitle', useChildTitle: true },
  },
  {
    path: 'blog',
    name: 'blog-list-en',
    component: BlogPage,
    alias: 'cikkek',
    meta: { titleKey: 'blog.pageTitle', descriptionKey: 'seo.descriptions.blog' },
  },
  {
    path: 'blog/p/:slug',
    name: 'blog-post-detail-en',
    component: BlogPostDetailPage,
    meta: { titleKey: 'blog.pageTitle', useChildTitle: true },
  },
  {
    path: 'blog/archiv',
    name: 'archive-list',
    component: ArchivePage,
    meta: { useChildTitle: true },
    beforeEnter: (to, _from, next) => {
      // `to.path` (not window.location, which only updates once navigation commits) avoids
      // re-triggering this guard's own redirect target on the next pass.
      if (!to.path.startsWith('/hu/')) {
        next({ path: '/hu/blog/archiv' })
      } else {
        next()
      }
    },
  },
  {
    path: 'blog/archiv/:slug',
    name: 'archive-detail',
    component: ArchivePostDetailPage,
    meta: { useChildTitle: true },
    beforeEnter: (to, _from, next) => {
      if (!to.path.startsWith('/hu/')) {
        next({ path: `/hu/blog/archiv/${to.params.slug}` })
      } else {
        next()
      }
    },
  },
  {
    path: 'slack',
    name: 'slack',
    component: SlackPage,
    meta: { titleKey: 'slack.pageTitle', descriptionKey: 'seo.descriptions.slack' },
    beforeEnter: (_to, _from, next) => {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/hu/')) {
        next({ path: '/hu/slack' })
      } else {
        next()
      }
    },
  },
  {
    path: 'privacy',
    name: 'privacy-en',
    component: PrivacyPage,
    alias: 'adatkezeles',
    meta: { titleKey: 'privacy.pageTitle', descriptionKey: 'seo.descriptions.privacy' },
  },
  {
    // A 2026-os AI-felmérés eredményriportja. A `quiz` alias a megszűnt
    // kérdőívtől örökölt: a régi hivatkozások és a Google-találatok oda
    // mutatnak, ezért az útvonal élve marad — de a kanonikus URL az
    // `ai-survey` (lásd seo/canonical-path.ts).
    path: 'ai-survey',
    alias: 'quiz',
    name: 'ai-report',
    component: ReportPage,
    // A riport a teljes szélességet használja: nem a site tartalomsávjában,
    // hanem közvetlenül a <main>-ben renderel (lásd AppLayout.vue).
    meta: { useChildTitle: true, fullBleed: true },
    // A riport magyar nyelvű, ezért /en/ai-survey átirányít. `to.path`-ból, nem
    // window.location-ből: az utóbbi csak a navigáció véglegesítésekor
    // frissül, így a guard a saját célpontján újra lefutna — végtelen
    // átirányítás. (Ugyanez a minta a blog/archiv route-oknál is.)
    beforeEnter: (to, _from, next) => {
      if (!to.path.startsWith('/hu/')) {
        next({ path: '/hu/ai-survey' })
      } else {
        next()
      }
    },
  },
]

/**
 * Old Jekyll blog permalinks (already indexed by Google), each rendering a static
 * meta-refresh + canonical redirect to its post's new archive URL. Bare top-level paths
 * (no /en|hu prefix) because that's where the old site put them.
 */
const legacyArchiveRedirectRoutes: RouteRecordRaw[] = archiveRedirects.map((redirect) => ({
  path: `/${redirect.path}`,
  component: ArchiveRedirectPage,
  meta: { archiveSlug: redirect.slug },
}))

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
  },
  {
    path: '/:lang(en|hu)',
    component: AppLayout,
    children: childRoutes,
  },
  ...legacyArchiveRedirectRoutes,
]
