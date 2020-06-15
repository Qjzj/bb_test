/**
 * @Author QJ
 * @date 2020--11 11:28
 * @desc index.js
 */

export const fileToDataURL = file => {
  if(!file) return Promise.reject('file is required');
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    fileReader.onerror = (e) => {
      reject(e)
    }
  })
};

/**
 * 校验密码
 * @param {string} pwd
 * @returns {boolean}
 */
export const validatePwd = function(pwd) {
  // 以字母开头
  // 必须包含数字、字母
  const regx = /^[a-zA-Z](?=.*\d)[0-9a-zA-Z]{7,16}$/
  return regx.test(pwd)
};
/**
 * 校验手机号
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = function(phone) {
  const regx = /^1[3456789]\d{9}/;
  return regx.test(phone);
};

/**
 * 设置cookies
 * @param name
 * @param value
 * @param time 过期时间秒
 */
export const setCookie = (name, value, time = 0.5 * 60 * 60) => {
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString();
};


/**
 * 获取cookie
 * @param name
 * @returns {*}
 */
export const getCookie = (name) => {
  const reg = new RegExp('(^| )' + name + '=([^;]+)(;|$)');
  const cookie = document.cookie;
  if (reg.test(cookie)) {
    return unescape(RegExp.$2)
  } else {
    // console.log('没有获取到cookie');
    return null;
  }
};

/**
 * 删除cookie
 * @param name
 */
export const removeCookie = (name) => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1000);
  const value = getCookie(name);
  if (value) {
    document.cookie = name + '=' + value + ';expires=' + exp.toUTCString();
  }
};

/**
 * 是否有权限
 * @param route
 * @param permission
 * @returns {boolean}
 */
const hasPermission = function(route, permission) {
  const isArray = Array.isArray(permission);
  const isString = typeof permission === 'string';

  if(isArray && permission.some(per => route.meta.permission.includes(per))) {
    return true
  }
  return isString && route.meta.permission.includes(permission);
};

/**
 * 过滤路由
 * @param routes
 * @param permission
 * @returns {Array}
 */
export const filterRoutes = (routes, permission) => {
  const dynamicRoutes = [];

  routes.forEach(route => {
    if(route.meta && route.meta.permission && route.meta.permission.length) {
      if(hasPermission(route, permission)) {

        if(route.children && route.children.length) {
          route.children = filterRoutes(route.children, permission);
        }
        dynamicRoutes.push(route);
      }
    }

    if(route.path === '*') {
      dynamicRoutes.push(route);
    }

  });

  return dynamicRoutes;
};
