import { rules } from './validate';
import { Message } from 'element-ui';

const genSubmit = function(form, submit, Rules) {
  // form: form 集合   submit:submit 集合  rules :校验规则
  for (const k in form) {
    form[k].forEach(item => {
      if (item.type === 'checkbox') {
        submit[k][item.name] = {
          type: 'checkbox',
          checked: item.checked
        };
      } else if (item.type === 'checkboxGroup') {
        submit[k][item.name] = {
          type: 'checkboxGroup',
          checkList: item.checkList
        };
      } else if (item.type === 'radio') {
        submit[k][item.name] = {
          type: 'radio',
          checked: item.checked
        };
      } else if (item.type === 'title') {
        // console.log(item)
      } else {
        submit[k][item.name] = '';
      }

      if (item.validate) {
        Rules[item.name] = [
          { validator: rules[item.validate], trigger: 'change' }
        ];
        if (item.required) {
          Rules[item.name].push({
            required: true,
            message: '该处为必填项',
            trigger: 'change'
          });
        }
      }
    });
  }
  // const handleForm = { Submit: submit, Rules: Rules };
  return { Submit: submit, Rules: Rules };
};

const fileBaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `${window.location.protocol}//${window.location.host}`;



/*
 * 消息提示
	message	警告信息内容
	type	类型 success / warning
 */
const showMessage = (message, type) => {
  return Message({
    message: message || '警告信息',
    type: type || 'warning'
  });
};



// 阿拉伯数字转中文汉字
export const numberToChinese = (number) => {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  const chnUnitChar = ['', '十', '百', '千'];
  const numToChn = (num) => {
    const index = num.toString().indexOf('.');
    if (index !== -1) {
      const str = num.toString().slice(index);
      let a = '点';
      for (let i = 1; i < str.length; i++) {
        a += chnNumChar[parseInt(str[i])];
      }
      return a;
    } else {
      return '';
    }
  };
  // 定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
  const sectionToChinese = (section) => {
    let str = '';
    let chnstr = '';
    let zero = false;
    let count = 0; // zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    while (section > 0) {
      const v = section % 10; // 对数字取余10，得到的数即为个位数
      if (v === 0) { // 如果数字为零，则对字符串进行补零
        if (zero) {
          zero = false; // 如果遇到连续多次取余都是0，那么只需补一个零即可
          chnstr = chnNumChar[v] + chnstr;
        }
      } else {
        zero = true; // 第一次取余之后，如果再次取余为零，则需要补零
        str = chnNumChar[v];
        str += chnUnitChar[count];
        chnstr = str + chnstr;
      }
      count++;
      section = Math.floor(section / 10);
    }
    return chnstr;
  };
  const a = numToChn(number);
  number = Math.floor(number);
  let unitPos = 0;
  let strIns = '';
  let chnStr = '';
  let needZero = false;
  if (number === 0) {
    return chnNumChar[0];
  }
  while (number > 0) {
    const section = number % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = sectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    number = Math.floor(number / 10000);
    unitPos++;
  }
  return chnStr + a;
};

// 根据身份证号获取出生年月
export const getBirthdayByIdNO = (IdNO) => {
  let birthday = '';
  if (IdNO.length === 18) {
    birthday = IdNO.substr(6, 8);
    return birthday.replace(/(.{4})(.{2})/, '$1-$2-');
  } else if (IdNO.length === 15) {
    birthday = '19' + IdNO.substr(6, 6);
    return birthday.replace(/(.{4})(.{2})/, '$1-$2-');
  } else {
    return '';
  }
};

// 根据身份证号获取性别
export const getSexByIdNO = (IdNO) => {
  if (IdNO.length === 18) {
    return IdNO.charAt(16) % 2 === 0 ? '女' : '男';
  } else if (IdNO.length === 15) {
    return IdNO.charAt(14) % 2 === 0 ? '女' : '男';
  } else {
    return '';
  }
};

// 获取随机ID
const getRandomId = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  const uuid = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};




export default {
  genSubmit,
  fileBaseUrl,
  numberToChinese,
  getBirthdayByIdNO,
  getSexByIdNO,
  showMessage,
  getRandomId
};
