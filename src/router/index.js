import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../components/layout/DefaultLayout.vue'
import IdentitySubmissionView from '../views/IdentitySubmissionView.vue'
import GeneratedView from '../views/GeneratedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      redirect: '/identity-submission',
      children: [
        {
          path: '/identity-submission',
          name: 'identity-submission',
          component: IdentitySubmissionView,
          meta: { title: '身份信息报送' }
        },
        {
          path: '/generated-view',
          name: 'generated-view',
          component: GeneratedView,
          meta: { title: 'Generated View' } // Placeholder
        }
        // Add other routes here as needed for sidebar items
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 运营平台` : '运营平台';
  next();
});

export default router
