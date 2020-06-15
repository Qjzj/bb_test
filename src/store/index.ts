import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/user'
import {getCookie, filterRoutes} from "@/utils/index.js";
import {constantRoutes, asyncRoutes} from "@/router";


Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    user: {},
    userType: '',  // 0 普通用户 2 测试人员 3 管理员  9 超集管理员
    addRoutes: [],
    routes: [],
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    updateUserType(state, type) {
      state.userType = type || '';
    },
    SET_ROUTES(state, routes) {
      state.addRoutes = routes;
      // @ts-ignore
      state.routes = constantRoutes.concat(routes);
    }
  },
  actions: {
    async updateUser({commit}) {

      const id: string = getCookie('x-token');
      if(!id) return {};

      const {data} = await getUserInfo(id);
      commit('updateUser', data);
      commit('updateUserType', data.type);
      console.log('updateUser', data);
      return {userType: data.type, data};
    },
    generateRoutes({commit}, role) {
      return new Promise((resolve) => {
        let accessRoutes;
        if(role === 'super') {
          accessRoutes = asyncRoutes || [];
        }else {
          console.log('asyncRoutes', asyncRoutes);
          accessRoutes = filterRoutes(asyncRoutes, role);
        }
        commit('SET_ROUTES', accessRoutes);
        resolve(accessRoutes);
      })
    }
  },
  getters: {

  },
  modules: {

  }
})
