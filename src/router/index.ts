import Vue from 'vue'
import VueRouter from 'vue-router'
import {Message} from 'element-ui'
import {filterRoutes, getCookie} from "@/utils/index.js";
import {AUTH_MAP} from "@/config";
import store from '@/store'
import Home from '../views/Home.vue'
import Layout from '../Layout/Dashboard.vue'
import NotFound from '../views/NotFound/index.vue';
const Login = () => import('../views/Login/index.vue');

Vue.use(VueRouter);

const allowList = ['/login', '/404'];

export const asyncRoutes = [
  {
    path: '/news',
    component: Layout,
    meta: {
      permission: ['admin', 'super']
    },
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
    meta: {
      permission: ['admin', 'super']
    },
    children: [
      {
        path: ':id?',
        component: () => import('../views/Template.vue'),
        meta: {hideNav: true, permission: ['admin', 'super']}
      }
    ]
  },
  {
    path: '*',
    component: NotFound
  }
];

export const constantRoutes = [
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
  routes: constantRoutes
});

router.beforeEach(async (to, from , next) => {

  const token = getCookie('x-token');
  if(token) {
    console.log('存在token', token);

    // 已经登录
    if(to.path === '/login') {
      next('/');
      return
    }
    // 查看是否已经有权限
    const type = store.state.userType;

    if(type === '') {
      console.log('type 为 空')
      try {
        // 没有设置权限
        const {userType} = await store.dispatch('updateUser');
        if(!userType) throw new Error('没有获取到用户角色');
        console.log('userType', userType);
        const role = AUTH_MAP[userType];
        console.log('role', role);
        // 过滤路由
        const dynamicRouter = await store.dispatch('generateRoutes', role);

        console.log('过滤后的路由', dynamicRouter);
        router.addRoutes(dynamicRouter);


        // @ts-ignore
        next({...to, replace: true})
      }catch (e) {
        Message.error(e || 'Router Error');
        next('/login?redirect=' + encodeURI(to.path));
      }

    }else {
      console.log('存在Type', type);
      next();
    }


  }else {
    console.log('不存在token');
    if(allowList.includes(to.path)) {
      console.log('进入白名单');
      next();
    }else {
      console.log('不是白名单, 滚去登陆');
      next('/login?redirect=' + encodeURI(to.path));
    }

  }
});

export default router
