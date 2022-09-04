import type { RouteRecordRaw } from 'vue-router'

export const layoutRoute: RouteRecordRaw[] = [
  {
    path: '/layout',
    name: 'layout',
    component: () => import('~/pages/layout/index.vue'),
    redirect: '/layout/second',
    children: [
      {
        path: 'first/:id',
        props: true,
        meta: {
          forbidden: true,
        },
        component: () => import('~/pages/layout/modules/1.vue'),
      },
      {
        path: 'second/:id?',
        props: true,
        component: () => import('~/pages/layout/modules/2.vue'),
      },
      {
        path: 'third/:id',
        props: true,
        component: () => import('~/pages/layout/modules/3.vue'),
      },
    ],
  },
]
