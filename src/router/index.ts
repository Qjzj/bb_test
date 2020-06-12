import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {getCookie} from "@/utils/index.js";
import {AUTH_MAP} from "@/config";
import store from '@/store'
import Home from '../views/Home.vue'
import Layout from '../Layout/Dashboard.vue'
const Login = () => import('../views/Login/index.vue');

Vue.use(VueRouter);

const dynamicRoutes: Array<RouteConfig> = [
  {
    path: '/news',
    component: Layout,
    children: [
      {
        path: 'detail/:id',
        component: () => import('../views/NewDetail.vue'),
        meta: {hideNav: true, permission: ['super']}
      },
      {
        path: '',
        component: () => import('../views/News.vue'),
        meta: {
          permission: ['admin', 'super']
        },
      }
    ]
  },
  {
    path: '/template',
    component: Layout,
    children: [
      {
        path: ':id?',
        component: () => import('../views/Template.vue'),
        meta: {hideNav: true, permission: ['admin', 'super']}
      }
    ]
  },
];

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {path: '', component: Home}
    ]
  },
  {
    path: '/about',
    component: Layout,
    children: [
      {path: '', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}
    ]
  },
  {
    path: '/login',
    component: Login,
  }

];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from , next) => {
  // 不需要权限的页面
  if(!to.meta || !to.meta.permission || !to.meta.permission.length) {
    next();
    return
  }
  // 进入需要权限的页面

  const token = getCookie('x-token');
  console.log(to, from, next);
  if(token) {
    // 已经登录
    // 查看是否已经有权限
    const type = store.state.userType;

    if(type ==='') {
      // 没有设置权限
      const {userType} = await store.dispatch('updateUser');

      const auth = AUTH_MAP[userType];
      // 过滤路由
      // const dynamicRouter =


      if(to.meta.permission.includes(auth)) {
        next();
      }else {
        next('/404')
      }


    }else {

    }


  }else {
    next('/login')
  }
});

export default router
