import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/user'
import {getCookie} from '@/utils/index.js'



Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    user: {},
    userType: '',  // 0 普通用户 2 测试人员 3 管理员  9 超集管理员
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    updateUserType(state, type) {
      state.userType = type || '';
    }
  },
  actions: {
    async updateUser({commit}) {

      const id: string = getCookie('x-token');
      if(!id) return {};

      const {data} = await getUserInfo(id);
      commit('updateUser', data);
      commit('updateUserType', data.type);
      return {userType: data.type, data};
    }
  },
  getters: {

  },
  modules: {

  }
})
