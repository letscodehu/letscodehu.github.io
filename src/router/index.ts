import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import HomePage from '../pages/HomePage.vue'
import TrainingPage from '../pages/TrainingPage.vue'
import ConsultingPage from '../pages/ConsultingPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import CaseStudiesPage from '../pages/CaseStudiesPage.vue'
import CaseStudyDetailPage from '../pages/CaseStudyDetailPage.vue'

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
