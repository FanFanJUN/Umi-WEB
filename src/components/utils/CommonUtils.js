import moment from 'moment';
import {mainTabAction} from 'sei-utils';

/**
 * 列表本地搜索,返回数据源，数据源每个子项上加搜索结果的 tag
 * @param {源数据} data
 * @param {搜索条件，对象，如；{key:'123'} } searchParam
 * @param {自定义搜索字段，如未填会全字段搜索，排除 id和租户代码字段} keys
 */
export async function searchListByKeyWithTag(data, searchParam, keys = []) {
    let list
    if (data.rows) {
        list = data.rows
    } else {
        list = data;
    }
    let excludeKey = [];
    if (keys.length === 0) {
        excludeKey = ['id', 'tenantCode']
    }
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        item.tag = false
        if (keys.length === 0) {
            keys = Object.keys(item)
        }
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j]
            if (excludeKey.indexOf(key) !== -1) {
                continue;
            }
            let value;
            if (key.includes('.')) {
                let subKey = key.split('.')
                value = item;
                for (let i = 0; i < subKey.length; i++) {
                    value = getSubValue(value, subKey[i])
                }
            } else {
                value = item[key]
            }
            if (isEmpty(searchParam.keyword)) {
                item.tag = true
            }
            if (value && !isEmpty(searchParam.keyword)) {
                if (typeof value === 'string' && typeof searchParam.keyword === 'string'
                    && value.toLowerCase().includes(searchParam.keyword.toLowerCase())) {
                    item.tag = true;
                    break;
                }
                if (typeof value === 'string' && typeof searchParam.keyword === "object"
                    && value.toLowerCase().includes(searchParam.keyword.key.toLowerCase())) {
                    item.tag = true;
                    break;
                }
            }
        }
    }
    return list;
}

function getSubValue(item, nextKey) {
    return item ? item[nextKey] : null
}

/**
 * 列表本地搜索,返回过滤结果
 * @param {源数据} data
 * @param {搜索条件，对象，如；{key:'123'} } searchParam
 * @param {自定义搜索字段，如未填会全字段搜索，排除 id和租户代码字段} keys
 */
export async function searchListByKey(data, searchParam, keys = []) {
    let result = []
    let list
    let flag = true
    if (data.rows) {
        list = data.rows
    } else {
        list = data;
    }
    let excludeKey = [];
    if (keys.length === 0) {
        excludeKey = ['id', 'tenantCode']
    }
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        if (keys.length === 0) {
            keys = Object.keys(item)
        }
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j]
            if (excludeKey.indexOf(key) !== -1) {
                continue;
            }
            let value = item[key];
            if (value && searchParam.keyword && !isEmpty(searchParam.keyword)) {
                flag = false
                if (typeof value === 'string' && Array.isArray(searchParam.keyword)) {
                    searchParam.keyword.map(param => {
                        if (value.toLowerCase().includes(param.toLowerCase())) {
                            result.push(item)
                        }
                    })
                }
                else if (typeof value === 'string' && typeof searchParam.keyword === 'string'
                    && value.toLowerCase().includes(searchParam.keyword.toLowerCase())) {
                    result.push(item)
                    break;
                }
                else if (typeof value === 'string' && typeof searchParam.keyword === "object"
                    && value.toLowerCase().includes(searchParam.keyword.key.toLowerCase())) {
                    result.push(item)
                    break;
                }
            }
        }
    }
    return flag ? list : result;
}

export function isEmpty(val) {
    return val === undefined || val === null || val === '' || val === "" || (typeof val === 'string' && val.trim() === '')
}

export function checkRight(rightName) {

    if (!rightName) {
        return true;
    }
    let rights = cache.get('Right');
    if (rights == null) {
        return false;
    }
    return rights.indexOf(rightName) !== -1;
}

export function getUserInfo() {
    return cacheSession.get('Authorization') || {};
}

export function queryAll() {
    if (cache.get("Right").includes("SRM_SM_QUERY_ALL")) {
        return {};
    } else {
        return {Q_EQ_creatorId: getUserId()};
    }
}

export function getUserId() {
    let userInfo = cacheSession.get('Authorization');
    if (userInfo) {
        return userInfo.userId
    } else {
        return null;
    }
}

export function getUserAccount() {
  const { account=null } = getUserInfo();
  return account;
}

export function closeCurrent() {
    if (window.self.frameElement) {
        let currentId = window.self.frameElement.id;
        if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
            window.top.homeView.getTabPanel().close(currentId);
        } else {
            mainTabAction.tabClose(currentId);
        }
    }
}

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
            if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
                window.top.homeView.getTabPanel().close(currentId);
            } else {
                mainTabAction.tabClose(currentId);
            }
        }
    }
  const HTTP = window._srmHost.substring(0, window._srmHost.indexOf('://') + 3);
  let url = uri.indexOf('http') === 0 ? uri : HTTP + window.location.host + '/srm-se-web/' + uri;
  let tab = {
        title: title,
        url: url,
        id: id
    };
    if (window.top.homeView && (typeof window.top.homeView.addTab) === 'function') {
        window.top.homeView.addTab(tab);
    } else {
        let newTabData = {
            name: tab.title,
            featureUrl: tab.url,
            id: tab.id
        }
        if (!window.top.homeView) {
            window.open(url);
            return;
        }
        mainTabAction.tabOpen(newTabData)
    }
    return id;
}

/*export function openNewTabOther(uri, title, closeCurrent = false, id = undefined, proxy) {
    if (!id) {
        id = getUUID();
    }
    if (closeCurrent) {
        if (window.self.frameElement) {
            let currentId = window.self.frameElement.id;
            if (window.top.homeView && (typeof window.top.homeView.getTabPanel) === 'function') {
                window.top.homeView.getTabPanel().close(currentId);
            } else {
                mainTabAction.tabClose(currentId);
            }
        }
    }
    let url = uri.indexOf('http://') === 0 ? uri : "http://" + window.location.host + proxy + uri;
    let tab = {
        title: title,
        url: url,
        id: id
    };
    if (window.top.homeView && (typeof window.top.homeView.addTab) === 'function') {
        window.top.homeView.addTab(tab);
    } else {
        let newTabData = {
            name: tab.title,
            featureUrl: tab.url,
            id: tab.id
        }
        mainTabAction.tabOpen(newTabData)
    }
    return id;
}*/

/**
 *  当前页面展示时回调，主要用于更新
 * @param {页签获取焦点时的回调方法} callBack
 */
export function tabForceCallBack(callBack) {
    let con = window.top.homeView;
    if (con) {
        let currentId = con.currentTabId
        if (!window.top.homeView.tabListener[currentId]) {
            currentId && con.addTabListener(currentId, function (id, win) {
                callBack()
            });
        }
    }
}

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

/**
 * 获取已打开的页签id
 * @param {需要查找的uri地址} uri
 */
export function getIframesId(uri){
    const frames = window.top.document.getElementsByTagName("iframe");
    let id = getUUID();
    for(let i=1;i<frames.length;i++){
        const frame = frames[i];
        if(frame.src.includes(uri)){
            id = frame.id;
        }
    }
    return id;
}

export function getUUID() {
    return Math.random().toString(36).substr(2);
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** xuanfeng 2014-08-28
*/

export function randomWord(randomFlag, min, max) {
    let str = "", range = min;
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
        'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

export function convertDataToFormData(data) {
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

moment.prototype.toJSON = function () {
    return moment(this).format("YYYY-MM-DD HH:mm:ss")
}

// 数据存储
export const cache = {
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data))
    },
    get(key) {

        let rights = localStorage.getItem(key);
        //判断权限为空特殊情况
        if (rights !== 'undefined') {
            return JSON.parse(localStorage.getItem(key))
        }
        return '';
    },
    clear(key) {
        localStorage.removeItem(key)
    }
}
// 数据存储sessionstorage
export const cacheSession = {
    set(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data))
    },
    get(key) {

        let rights = sessionStorage.getItem(key);
        //判断权限为空特殊情况
        if (rights !== 'undefined') {
            return JSON.parse(sessionStorage.getItem(key))
        }
        return '';
    },
    clear(key) {
        sessionStorage.removeItem(key)
    }
}
//非负小数
export const checkNumber = (rule, value, callback) => {
    let reg = /^\d+(\.\d+)?$/;
    if (!reg.test(value) || value === 0) {
        callback({message: "请输入大于0的数字"});
        return false;
    }
    callback();
}

export function isInclude(array, obj) {
    if (array.size < 1 || array.length < 1) {
        return false;
    }
    let res = [];
    for (let e of array) {
        if (this.objectIsEqual(e, obj)) {
            res.push(true)
        }
    }
    if (res.includes(true)) {
        return true
    } else {
        return false
    }
};

export function transToChiness(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

export function loadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content], {
        type: 'text/plain'
    });
    var evt = new Event('click');
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
    URL.revokeObjectURL(blob);
}

export function objectIsEqual(obj1, obj2) {
    let map1 = this.objToStrMap(obj1);
    let map2 = this.objToStrMap(obj2);
    if (map1.length !== map2.length) {
        return false
    }
    let validateMap1Result = [];
    map1.forEach((value, key) => {
        if ([...map2.keys()].includes(key)) {
            if (map2.get(key) === value) {
                validateMap1Result.push(true)
            } else {
                validateMap1Result.push(false)
            }
        } else {
            validateMap1Result.push(false)
        }
    });
    let validateMap2Result = [];
    map2.forEach((value, key) => {
        if ([...map1.keys()].includes(key)) {
            if (map1.get(key) === value) {
                validateMap2Result.push(true)
            } else {
                validateMap2Result.push(false)
            }
        } else {
            validateMap2Result.push(false)
        }
    });
    if (validateMap1Result.includes(false)) {
        return false
    }
    if (validateMap2Result.includes(false)) {
        return false
    }
    return true
};

export function addParamsToUrl(url, params) {
    let num = url.indexOf('?');
    if (!params || params.length === 0) {
        return url;
    }
    if(num > 0){
        Object.keys(params).forEach(function (key) {
            url = url + "&" + key + "=" + params[key];
        });
    }else{
        let i = 0;
        Object.keys(params).forEach(function (key) {
            if (i === 0) {
                url = url + "?" + key + "=" + params[key];
                i++;
            } else {
                url = url + "&" + key + "=" + params[key];
            }
        });
    }
    return url;
}

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
export function toUpperCase( event) {
  let value = event.target.value;
  event.target.value = value.toUpperCase();
}

//数字校验
export const onlyNumber = (event) => {
  let value = event.target.value;
  event.target.value = value.replace(/[^\d]/g, '');
};

//验证SEO编码校验
export function onAEOCheck(rule, value, callback) {
  let exp = /^[A-Z0-9<>\x22]+$/;
  if (!value || value === "") {
    callback();
  }
  else if (!value.match(exp)) {

    callback("SEO编码格式错误！");
  } else {
    callback();
  }
}
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

export function formatSeconds(second_time) {

    var time = parseInt(second_time) + "秒";
    if (parseInt(second_time) > 60) {

        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        time = min + "分" + second + "秒";

        if (min > 60) {
            min = parseInt(second_time / 60) % 60;
            var hour = parseInt(parseInt(second_time / 60) / 60);
            time = hour + "小时" + min + "分" + second + "秒";

            if (hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                time = day + "天" + hour + "小时" + min + "分" + second + "秒";
            }
        }


    }
    return time;
}
