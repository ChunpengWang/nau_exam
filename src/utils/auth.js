import Cookies from 'js-cookie';
// 前端缓存
const TokenKey = 'token';

/**
 * 获取token
 */
export function getToken() {
  const token = Cookies.get(TokenKey);
  return token || null;
}

/**
 * 设置token
 * @param {String} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

/**
 * 移除token
 */
export function removeToken() {
  return Cookies.remove(TokenKey);
}

/**
 * 从localStorage获取user
 */
export function getLocalStorageUser() {
  const user = window.localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * 保存user信息到localStorage里面
 * @param {Object} userInfo
 */
export function setLocalStorageUser(userInfo) {
  window.localStorage.setItem('user', JSON.stringify(userInfo));
}

/**
 * 从localStorage里面删除user信息
 */
export function removeLocalStorageUser() {
  window.localStorage.removeItem('user');
}

/**
 * 清空缓存数据
 */
export function clearAllData() {
  removeToken();
  removeLocalStorageUser();
}
