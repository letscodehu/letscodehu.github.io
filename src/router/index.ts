import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import HomePage from '../pages/HomePage.vue'
import TrainingPage from '../pages/TrainingPage.vue'
import TrainingB2CPage from '../pages/TrainingB2CPage.vue'
import WorkshopPage from '../pages/WorkshopPage.vue'
import ConsultingPage from '../pages/ConsultingPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import CaseStudiesPage from '../pages/CaseStudiesPage.vue'
import CaseStudyDetailPage from '../pages/CaseStudyDetailPage.vue'
import BlogPage from '../pages/BlogPage.vue'
import BlogPostDetailPage from '../pages/BlogPostDetailPage.vue'
import PrivacyPage from '../pages/PrivacyPage.vue'

const childRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: HomePage, meta: { titleKey: 'nav.home' } },
  {
    path: 'training',
    name: 'training-en',
    component: TrainingPage,
    alias: 'kepzes',
    meta: { titleKey: 'training.pageTitle' },
  },
  {
    path: 'training/architect-mindset',
    name: 'training-b2c-en',
    component: TrainingB2CPage,
    alias: 'kepzes/architect-gondolkodas',
    meta: { titleKey: 'trainingB2c.pageTitle' },
  },
  {
    path: 'training/workshop-adr',
    name: 'workshop-en',
    component: WorkshopPage,
    alias: 'kepzes/workshop-adr',
    meta: { titleKey: 'workshop.pageTitle' },
  },
  {
    path: 'consulting',
    name: 'consulting-en',
    component: ConsultingPage,
    alias: 'tanacsadas',
    meta: { titleKey: 'consulting.pageTitle' },
  },
  {
    path: 'about',
    name: 'about-en',
    component: AboutPage,
    alias: 'rolam',
    meta: { titleKey: 'about.pageTitle' },
  },
  {
    path: 'contact',
    name: 'contact-en',
    component: ContactPage,
    alias: 'kapcsolat',
    meta: { titleKey: 'contact.pageTitle' },
  },
  {
    path: 'case-studies',
    name: 'case-studies-en',
    component: CaseStudiesPage,
    alias: 'esettanulmanyok',
    meta: { titleKey: 'caseStudies.pageTitle' },
  },
  {
    path: 'case-studies/:slug',
    name: 'case-study-detail-en',
    component: CaseStudyDetailPage,
    meta: { titleKey: 'caseStudies.pageTitle' },
  },
  {
    path: 'blog',
    name: 'blog-list-en',
    component: BlogPage,
    alias: 'cikkek',
    meta: { titleKey: 'blog.pageTitle' },
  },
  {
    path: 'blog/p/:slug',
    name: 'blog-post-detail-en',
    component: BlogPostDetailPage,
    meta: { titleKey: 'blog.pageTitle' },
  },
  {
    path: 'privacy',
    name: 'privacy-en',
    component: PrivacyPage,
    alias: 'adatkezeles',
    meta: { titleKey: 'privacy.pageTitle' },
  },
]

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
]
