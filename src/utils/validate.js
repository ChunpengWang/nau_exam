/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

/* 合法uri*/
export function validURL(url) {
  const reg = /^((http:\/\/|https:\/\/|ftp:\/\/)?)([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

  return reg.test(url);
}

export const rules = {
  /* eslint-disable callback-return */
  validPwd: (rule, value, callback) => {
    if (!value) {
      callback(new Error('密码不能为空'));
    } else if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
      callback(new Error('密码格式必须是字母和数字组合'));
    } else {
      callback();
    }
  },
  validDep: (rule, value, callback) => {
    if (!value) {
      callback(new Error('必填'));
    } else {
      callback();
    }
  },
  validURL: (rule, value, callback) => {
    if (value && !validURL(value)) {
      callback(new Error('非法的URL格式'));
    } else {
      callback();
    }
  },
  email: (rule, value, callback) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    if (value && !reg.test(value)) {
      callback(new Error('非法的邮箱格式'));
    } else {
      callback();
    }
  },
  moblie: (rule, value, callback) => {
    if (value && !/^1[0-9]\d{9}$/.test(value)) {
      callback(new Error('不合格的手机号码'));
    } else {
      callback();
    }
  },
  phone: (rule, value, callback) => {
    if (value && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
      callback(new Error('固定电话有误，请重填'));
    } else {
      callback();
    }
  },
  checkTel(rule, value, callback) {
    if (
      value &&
      (/^1[34578]\d{9}$/.test(value) ||
        /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value))
    ) {
      callback();
    } else {
      callback(new Error('请填写合法的手机号码或者固话号码'));
    }
  },
  number: (rule, value, callback) => {
    const reg = /^[0-9]*$/;

    if (value && !reg.test(value)) {
      callback(new Error('请填纯数字'));
    } else {
      callback();
    }
  },
  discrib: (rule, value, callback) => {
    if (value && value.length <= 200) {
      callback();
    } else {
      callback(new Error('限定100个字，200个字节'));
    }
  },
  score: (rule, value, callback) => {
    // const reg = /^[0-9]*$/
    const reg = /^(?:[1-9]|1[0-9]|20)$/;
    if (value && reg.test(value)) {
      callback();
    } else {
      callback(new Error('请设置1-20的整数'));
    }
  },
  fax: (rule, value, callback) => {
    const reg = /^(\d{3,4}-)?\d{7,8}$/;

    if (value && !reg.test(value)) {
      callback(new Error('不合格的传真格式'));
    } else {
      callback();
    }
  },
  none: (rule, value, callback) => {
    callback();
  },
  username: (rule, value, callback) => {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9.·]+$/;

    if (!reg.test(value)) {
      callback(new Error('登录名只能包含字母数字下划线'));
    } else if (value.length > 50) {
      callback(new Error('长度不能大于50'));
    } else {
      callback();
    }
  },
  qq: (rule, value, callback) => {
    const reg = /^\d{5,10}$/;

    if (value && !reg.test(value)) {
      callback(new Error('不合要求的qq号'));
    } else {
      callback();
    }
  },
  mark: (rule, value, callback) => {
    const reg = /^[-\\+]?\d+(\.\d+)\\,[-\\+]?\d+(\.\d+)$/;

    if (!value) {
      callback(new Error('不能为空'));
    } else if (value && !reg.test(value)) {
      callback(new Error('坐标不合法'));
    } else {
      callback();
    }
  },
  time: (rule, value, callback) => {
    const nowTime = new Date().getTime();
    const currentTime = new Date(value).getTime();

    if (!value) {
      callback(new Error('时间不能为空'));
    }
    if (value && currentTime < nowTime) {
      callback(new Error('不能选择过去时间'));
    } else {
      callback();
    }
  },
  timerange: (rule, value, callback) => {
    const nowTime = new Date().getTime();
    const startTime = value && new Date(value[0]).getTime();
    const endTime = value && new Date(value[1]).getTime();

    if (!value) {
      callback(new Error('时间不能为空'));
    }
    if (value && (startTime < nowTime || endTime < nowTime)) {
      callback(new Error('不能选择过去时间'));
    } else {
      callback();
    }
  },
  combotree: (rule, value, callback) => {
    if (value && !value['name']) {
      callback(new Error('不能为空'));
    } else {
      callback();
    }
  },
  year: (rule, value, callback) => {
    const nowTime = new Date().getFullYear();

    if (!value) {
      callback(new Error('年份不能为空'));
    }
    if (value && Number(value) < nowTime) {
      callback(new Error('不能选择过去年份'));
    } else {
      callback();
    }
  },
  name: (rule, value, callback) => {
    const reg = /^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/;

    if (value && !reg.test(value)) {
      callback(new Error('含有非法字符'));
    } else {
      callback();
    }
  },
  isIP(rule, value, callback) {
    const reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;

    if (value && reSpaceCheck.test(value)) {
      value.match(reSpaceCheck);
      if (
        RegExp.$1 <= 255 &&
        RegExp.$1 >= 0 &&
        RegExp.$2 <= 255 &&
        RegExp.$2 >= 0 &&
        RegExp.$3 <= 255 &&
        RegExp.$3 >= 0 &&
        RegExp.$4 <= 255 &&
        RegExp.$4 >= 0
      ) {
        callback();
      } else {
        callback(new Error('非法IP地址'));
      }
    } else {
      callback(new Error('非法IP地址'));
    }
  },
  checkChar(rule, value, callback) {
    const reg = new RegExp(
      '[` ~!#$^&*()=|{}\':;\',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]'
    );

    if (value && reg.test(value)) {
      callback(new Error('含有非法字符'));
    } else {
      callback();
    }
  },
  letterNum(rule, value, callback) {
    const reg = new RegExp(/^[A-Za-z0-9]+$/);

    if (value && !reg.test(value)) {
      callback('只允许输入英文与数字');
    } else {
      callback();
    }
  },
  idCard(rule, value, callback) {
    const reg = new RegExp(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/);

    if (value && !reg.test(value)) {
      callback(new Error('请输入正确身份证'));
    } else {
      callback();
    }
  },
  normalName(rule, value, callback) {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9.·+\\(\\)-]+$/;

    if (value && !reg.test(value)) {
      callback(new Error('请填写合法名称，名称包含中英文数字下划线小数点'));
    } else {
      callback();
    }
  },
  buildingName(rule, value, callback) {
    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9+-\\#]+$/;

    if (value && !reg.test(value)) {
      callback(new Error('名称不能含有特殊字符'));
    } else {
      callback();
    }
  }
};
