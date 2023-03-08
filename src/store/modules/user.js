import {
  getToken, setToken, removeToken, setLocalStorageUser,
  getLocalStorageUser, removeLocalStorageUser,
} from '@/utils/auth';
import router, { constantRoutes, adminRoutes, teacherRoutes, studentRoutes } from '@/router';
import { userLogin } from '@/api/user';
import { Message } from 'element-ui';
const state = {
  token: getToken(),
  user: getLocalStorageUser(), // 用户信息
  routes: constantRoutes, // 根据用户权限可看到的页面路由
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    user ? setLocalStorageUser(user) : removeLocalStorageUser();
    state.user = user;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  // user login
  login({ dispatch,commit }, userInfo) {
    return userLogin({
      username: userInfo.username.trim(),
      password: userInfo.password.trim(),
      type: userInfo.type,
    }).then(response => {
      if (response.state != 200) {
        return Message({
          message: response.msg || '账号密码不正确',
          type: 'error',
          duration: 2 * 1000
        });
      }
      commit('SET_TOKEN', response.data.token);
      commit('SET_USER', response.data);
      setToken(response.data.token);
      dispatch('setRoutes')
      return response;
    });
  },

  // 根据权限配置路由菜单
  setRoutes({ commit, rootState }) {
    let accessedRoutes = [adminRoutes, teacherRoutes ,studentRoutes][rootState.user.user.type - 1];
    accessedRoutes.push({ path: '*', redirect: '/404', hidden: true }); // 将404页面动态添到到路由末尾  防止刷新报404   同时输入不存在的路由可跳转404
    commit('SET_ROUTES', accessedRoutes);
    router.addRoutes(accessedRoutes);
    router.options.routes = rootState.user.routes;
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      commit('SET_ROUTES', []);
      removeToken()
      resolve();
    });
  },


};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
