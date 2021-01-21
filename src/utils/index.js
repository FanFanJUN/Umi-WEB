import * as constants from './constants';
import * as userAuth from './user';
import * as commonProps from './commonProps';
import * as commonUrl from './commonUrl';
import { mainTabAction } from 'sei-utils';
import { utils } from 'suid';
import { onLineTarget } from '../../config/proxy.config';
import request from './request';
import moment from "moment";
const { getUUID, storage } = utils;
const { localStorage } = storage;

export function getUserInfo() {
  return localStorage.get('Authorization') || {};
}
export function closeCurrent() {
  const userInfo = getUserInfo();
  request.get('/srm-baf-web/srmCommon/refreshGt', { username: userInfo?.account }).finally(() => {
    if (window.self.frameElement) {
      let currentId = window.self.frameElement.id;
      if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
        window.top.homeView.getTabPanel().close(currentId);
      } else {
        mainTabAction.tabClose(currentId);
      }
    } else {
      window.close()
    }
  })
}

const defaultAppCode = [
  'SRM_RFQ_WEB',
  'SRM_PO_WEB',
  'SRM_WA_WEB',
  'SRM_BAF_WEB',
  'SRM_BIDDING_WEB',
  'SRM_PURCHASE_WEB',
  'SRM_PA_WEB',
  'SRM_SM_WEB',
  'SRM_SE_WEB',
];

export const WAIT = (timeout = 1000) => new Promise((resolve) => { setTimeout(resolve, timeout); })

export const checkToken = async (params, cb) => {
  !!cb && cb(false)
  const { data, success } = await request({
    url: '/api-gateway/auth-service/checkToken',
    method: 'get',
    params: {
      _s: params?._s,
      AppCode: defaultAppCode.toString(),
    },
  });
  if (success) {
    sessionStorage.setItem('Authorization', JSON.stringify(data[0]));
    sessionStorage.setItem('Right', data[1]);
    sessionStorage.setItem('_s', params?._s);
  }
  await WAIT()
  !!cb && cb(true)
};

/**
 * 打开新的页签
 * @param {srm项目的 uri 或者其他带 http的全路径地址} uri
 * @param { 页签名称 } title
 * @param {是否关闭当前页签} closeCurrent
 * @param { 指定打开页签的 id，关闭页签时已该 id 为准 } id
 */
export function openNewTab(uri, title, closeCurrent = false, id = undefined) {
  if (!id) {
    id = getUUID();
  }
  if (closeCurrent) {
    if (window.self.frameElement) {
      let currentId = window.self.frameElement.id;
      if (window.top.homeView && typeof window.top.homeView.getTabPanel === 'function') {
        window.top.homeView.getTabPanel().close(currentId);
      } else {
        mainTabAction.tabClose(currentId);
      }
    }
  }
  const { protocol, host } = window.location;
  let url = uri.indexOf(protocol) === 0 ? uri : '//' + host + '/react-srm-sm-web/#/' + uri;
  let tab = {
    title: title,
    url: url,
    id: id,
  };
  if (window.top.homeView && typeof window.top.homeView.addTab === 'function') {
    window.top.homeView.addTab(tab);
  } else {
    let newTabData = {
      name: tab.title,
      featureUrl: tab.url,
      id: tab.id,
    };
    if (!window.top.homeView) {
      window.open(url);
      return;
    }
    mainTabAction.tabOpen(newTabData);
  }
  return id;
}

export function getFrameElement() {
  const f = window.self.frameElement;
  return !!f ? f : {};
}

export function openNewTabOther(uri, title, closeCurrent = false, id = undefined, proxy) {
  if (!id) {
    id = getUUID();
  }
  if (closeCurrent) {
    if (window.self.frameElement) {
      let currentId = window.self.frameElement.id;
      if (window.top.homeView && typeof window.top.homeView.getTabPanel === 'function') {
        window.top.homeView.getTabPanel().close(currentId);
      } else {
        mainTabAction.tabClose(currentId);
      }
    }
  }
  let url = uri.indexOf('http://') === 0 ? uri : 'http://' + window.location.host + proxy + uri;
  let tab = {
    title: title,
    url: url,
    id: id,
  };
  if (window.top.homeView && typeof window.top.homeView.addTab === 'function') {
    window.top.homeView.addTab(tab);
  } else {
    let newTabData = {
      name: tab.title,
      featureUrl: tab.url,
      id: tab.id,
    };
    mainTabAction.tabOpen(newTabData);
  }
  return id;
}

/**
 *  当前页面展示时回调，主要用于更新
 * @param {页签获取焦点时的回调方法} callBack
 */
export function tabForceCallBack(callBack) {
  let con = window.top.homeView;
  if (con) {
    let currentId = con.currentTabId;
    if (!window.top.homeView.tabListener[currentId]) {
      currentId &&
        con.addTabListener(currentId, function (id, win) {
          callBack();
        });
    }
  }
}

export const leftPad = (str, len, ch) => {
  const cache = [
    '',
    ' ',
    '  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
    '         ',
  ];
  str = str + '';
  len = len - str.length;
  if (len <= 0) return str;
  if (!ch && ch !== 0) ch = ' ';
  ch = ch + '';
  if (ch === ' ' && len < 10) return cache[len] + str;
  let pad = '';
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;
    else break;
  }
  return pad + str;
};

export const getLocationHost = () => {
  const host = window.location.host;
  const isDev = /^localhost/.test(host) || /^192/.test(host);
  if (isDev) {
    return onLineTarget;
  }
  return host;
};

export const getUserAccount = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  const { account = '' } = info;
  return account;
};

export const getUserName = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.userName
}
export const getUserTenantCode = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.tenantCode
}
export const getUserId = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.userId
}
export const getUserEmail = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.email
}

export const getUserAuthorityPolicy = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.authorityPolicy
}

export const getMobile = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.mobile
}

export const getAccount = () => {
  const info = storage.sessionStorage.get('Authorization') || {};
  return info?.account
}

export const downloadBlobFile = (data, name) => {
  // console.log(typeof data)
  // return
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
  const fileName = name;
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
};

export function isEmpty(val) {
  return val === undefined || val === null || val === '' || val === "" || (typeof val === 'string' && val.trim() === '')
}
export const convertDataToFormData = (data) => {
  let formData = new FormData();
  if (isEmpty(data)) {
    return formData;
  }
  //如果传进对象为数组  返回数组
  if (data instanceof Array) {
    return data;
  }
  Object.keys(data).forEach((item) => {
    if (data[item] instanceof Array) {
      for (let value of data[item].values()) {
        formData.append(item, value);
      }
    } else if (data[item] instanceof Object) {
      for (let key of Object.keys(data[item])) {
        formData.append(item + '.' + key, data[item][key]);
      }
    } else if (data[item]) {
      formData.append(item, data[item]);
    }
  });
  return formData;
}
// 附件转换
export const getEntityId = (editData) => {
  if (!editData || !editData.genCertVos || editData.genCertVos.length <= 0) {
    return false;
  }

  let obj = {};
  editData.genCertVos.forEach((item, index) => {
    obj[item.qualificationType] = item.id;
    obj[item.qualificationType + "attachments"] = item.attachments;
  });

  return obj;
};
//身份证校验
export const checkCardNo = (rule, value, callback) => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  let reg = /^\d{17}(\d|X|x)$/;
  if (value && !reg.test(value)) {
    callback('请输入正确格式的身份证号');
    return false;
  }
  callback();
};
//数字校验
export const onlyNumber = (event) => {
  let value = event.target.value;
  event.target.value = value.replace(/[^\d]/g, '');
};
//验证邮箱（不输入中文）
export function onMailCheck(rule, value, callback) {
  let exp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if (!value || value === "") {
    callback();
  }
  else if (!value.match(exp)) {

    callback("邮箱格式错误！");
  } else {
    callback();
  }
}
//小写转大写
export function toUpperCase(event) {
  let value = event.target.value;
  event.target.value = value.toUpperCase();
}
export function getLineCode(lineNum) {
  return (Array(4).join(0) + (lineNum)).slice(-4) + '0';
}
export function getMaxLineNum(data) {
  let maxLineNum = 0;
  data.forEach(item => {
    if (item.lineCode) {
      let str = item.lineCode.substring(0, item.lineCode.length - 1);
      let lineCodeNum = Number(str);
      if (lineCodeNum > maxLineNum) {
        maxLineNum = lineCodeNum;
      }
    }

  });
  return maxLineNum;
}
//比较是否三十天内过期
export const compareData = (date) => {
  let pass = true;
  let endDate = new Date(date);
  let myDate = new Date();
  let time = 1000 * 3600 * 24 * 30;
  if (endDate.getTime() - myDate.getTime() < time) {
    pass = false;
  }
  return pass;
};
//时间自动加一年
export const checkDateWithYearAdd = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {
      callback('请选择开始日期');
      return false;
    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      value.endDate = moment(now, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
};
export const checkDateWithHalfYear = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {
      callback('请选择开始日期');
      return false;
    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      let endDate = moment((parseInt(now.toString().substring(11, 15)) + 1) + '-06-01');
      value.endDate = moment(endDate, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
};
export const checkDateWithYearAdd3 = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {

    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      value.endDate = moment(now, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
}
export const phoneOrTel = (rule, value, callback) => {
  if (value) {
    if (value.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/) || value.match(/^(13|15|18|17|16|19|14)\d{9}$/)) {
      callback();
    }
    else {
      callback('请输入电话或手机');
    }
  }
  else {
    callback();
  }
};
// 模拟触发resize事件
export const sendResize = () => {
  if (document.createEvent) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, true);
    window.dispatchEvent(event);
  } else if (document.createEventObject) {
    window.fireEvent("onresize");
  }
}

// 转换时间
export function formatYMDHmsToYMD(time) {
  return moment(time).format('YYYY-MM-DD')
}

export const DELAY = timeout => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

const trueConditions = [
  '是',
  '有'
]

export const formatTemplateBooleanParma = (item, paramKey) => {
  const r = trueConditions.includes(item[paramKey]);
  return {
    ...item,
    [paramKey]: r
  }
}

export const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()

export const downloadPDFFile = (data, name) => {
  const blob = new Blob([data], { type: 'application/pdf' });
  const fileName = name;
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    // URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
};

export function formatFieldsOptions(fields) {
  const formatFields = fields.map(item => {
    return {
      ...item,
      options: {
        ...item.options,
        rules: item?.options?.rules ? item.options.concat(
          [
            {
              required: true,
              message: `${item.label}不能为空`
            }
          ]
        ) : [
            {
              required: true,
              message: `${item.label}不能为空`
            }
          ]
      }
    }
  })
  return formatFields
}

export { default as request } from './request';
export { constants, userAuth as userUtils, commonProps, commonUrl };
