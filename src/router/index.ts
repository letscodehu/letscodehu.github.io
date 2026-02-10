import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import HomePage from '../pages/HomePage.vue'
import TrainingPage from '../pages/TrainingPage.vue'
import ConsultingPage from '../pages/ConsultingPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import BlogPage from '../pages/BlogPage.vue'

const childRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: HomePage },
  {
    path: 'training',
    name: 'training-en',
    component: TrainingPage,
    alias: 'kepzes',
  },
  {
    path: 'consulting',
    name: 'consulting-en',
    component: ConsultingPage,
    alias: 'tanacsadas',
  },
  {
    path: 'about',
    name: 'about-en',
    component: AboutPage,
    alias: 'rolam',
  },
  {
    path: 'contact',
    name: 'contact-en',
    component: ContactPage,
    alias: 'kapcsolat',
  },
  {
    path: 'blog',
    name: 'blog-en',
    component: BlogPage,
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/en/',
  },
  {
    path: '/:lang(en|hu)',
    component: AppLayout,
    children: childRoutes,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

