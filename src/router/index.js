import { createRouter, createWebHistory } from 'vue-router'
import IdentitySubmissionView from '../views/IdentitySubmissionView.vue'
import GeneratedView from '../views/GeneratedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/identity-submission'
    },
    {
      path: '/identity-submission',
      name: 'identity-submission',
      component: IdentitySubmissionView
    },
    {
      path: '/generated',
      name: 'generated',
      component: GeneratedView
    }
    // Additional routes can be added here as per sidebar navigation
  ]
})

export default router
